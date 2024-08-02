import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface MetricData {
  date: string;
  value: number;
}

interface UserProfile {
  age: number;
  gender: string;
  country: string;
}

function analyzeMetric(metric: string, data: MetricData[], profile: UserProfile): { analysis: string, recommendation: string } {
  const latestValue = data[data.length - 1].value;
  const trend = calculateTrend(data);
  
  let analysis = '';
  let recommendation = '';

  switch (metric.toLowerCase()) {
    case 'blood glucose':
      analysis = analyzeBloodGlucose(latestValue, trend, profile);
      recommendation = recommendBloodGlucose(latestValue, profile);
      break;
    case 'cholesterol':
      analysis = analyzeCholesterol(latestValue, trend, profile);
      recommendation = recommendCholesterol(latestValue, profile);
      break;
    case 'uric acid':
      analysis = analyzeUricAcid(latestValue, trend, profile);
      recommendation = recommendUricAcid(latestValue, profile);
      break;
    default:
      throw new Error('Invalid metric');
  }

  const countryAdvice = getCountrySpecificAdvice(profile.country, metric);
  recommendation += ' ' + countryAdvice;

  return { analysis, recommendation };
}

function calculateTrend(data: MetricData[]): 'increasing' | 'decreasing' | 'stable' {
  if (data.length < 2) return 'stable';
  const firstValue = data[0].value;
  const lastValue = data[data.length - 1].value;
  const percentChange = ((lastValue - firstValue) / firstValue) * 100;
  
  if (percentChange > 5) return 'increasing';
  if (percentChange < -5) return 'decreasing';
  return 'stable';
}

function analyzeBloodGlucose(value: number, trend: string, profile: UserProfile): string {
  let analysis = `Your latest blood glucose reading is ${value} mg/dL, which is `;
  if (value < 70) analysis += 'below the normal range (hypoglycemia). ';
  else if (value < 100) analysis += 'within the normal fasting range. ';
  else if (value < 126) analysis += 'in the prediabetic range. ';
  else analysis += 'in the diabetic range. ';

  analysis += `The trend of your blood glucose levels has been ${trend}. `;

  if (profile.age > 60) {
    analysis += 'Given your age, it\'s important to monitor your blood glucose levels closely. ';
  }

  return analysis;
}

function recommendBloodGlucose(value: number, profile: UserProfile): string {
  let recommendation = '';
  if (value < 70) {
    recommendation = 'Consume fast-acting carbohydrates immediately and consult your doctor. ';
  } else if (value > 126) {
    recommendation = 'Consult your healthcare provider for a comprehensive diabetes management plan. ';
  } else {
    recommendation = 'Maintain a balanced diet, regular exercise, and continue monitoring your blood glucose. ';
  }

  return recommendation;
}

function analyzeCholesterol(value: number, trend: string, profile: UserProfile): string {
  let analysis = `Your latest total cholesterol reading is ${value} mg/dL, which is `;
  if (value < 200) analysis += 'within the desirable range. ';
  else if (value < 240) analysis += 'borderline high. ';
  else analysis += 'high. ';

  analysis += `The trend of your cholesterol levels has been ${trend}. `;

  if (profile.gender === 'male' && profile.age > 45) {
    analysis += 'As a male over 45, you\'re in a higher risk group for heart disease. ';
  } else if (profile.gender === 'female' && profile.age > 55) {
    analysis += 'As a female over 55, your risk for heart disease increases. ';
  }

  return analysis;
}

function recommendCholesterol(value: number, profile: UserProfile): string {
  let recommendation = '';
  if (value >= 240) {
    recommendation = 'Consult your doctor about cholesterol-lowering medications. ';
  } else {
    recommendation = 'Focus on a heart-healthy diet low in saturated fats and high in fiber. ';
  }

  recommendation += 'Engage in regular aerobic exercise for at least 150 minutes per week. ';

  return recommendation;
}

function analyzeUricAcid(value: number, trend: string, profile: UserProfile): string {
  let analysis = `Your latest uric acid level is ${value} mg/dL, which is `;
  if (value <= 6) analysis += 'within the normal range. ';
  else if (value <= 8) analysis += 'slightly elevated. ';
  else analysis += 'high, indicating a risk of gout. ';

  analysis += 'The trend of your uric acid levels has been ${trend}. ';

  if (profile.gender === 'male') {
    analysis += 'Men typically have higher uric acid levels and are at greater risk for gout. ';
  }

  return analysis;
}

function recommendUricAcid(value: number, profile: UserProfile): string {
  let recommendation = '';
  if (value > 6) {
    recommendation = 'Limit intake of purine-rich foods such as red meat and shellfish. ';
    recommendation += 'Stay well-hydrated and avoid excessive alcohol consumption. ';
  } else {
    recommendation = 'Maintain a balanced diet and stay hydrated to keep uric acid levels in check. ';
  }

  return recommendation;
}

function getCountrySpecificAdvice(country: string, metric: string): string {
    const regionMap = {
      'North America': ['United States', 'Canada', 'Mexico'],
      'South America': ['Brazil', 'Argentina', 'Colombia', 'Peru', 'Chile'],
      'Western Europe': ['United Kingdom', 'France', 'Germany', 'Italy', 'Spain'],
      'Eastern Europe': ['Russia', 'Ukraine', 'Poland', 'Romania'],
      'Middle East': ['Saudi Arabia', 'UAE', 'Turkey', 'Iran', 'Israel'],
      'South Asia': ['India', 'Pakistan', 'Bangladesh', 'Sri Lanka'],
      'East Asia': ['China', 'Japan', 'South Korea', 'Taiwan'],
      'Southeast Asia': ['Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'Malaysia'],
      'Africa': ['Nigeria', 'South Africa', 'Kenya', 'Egypt', 'Ethiopia'],
      'Oceania': ['Australia', 'New Zealand']
    } as { [key: string]: string[] };
  
    let region = Object.keys(regionMap).find(key => regionMap[key].includes(country)) || 'Other';
    {{ region = regionMap[region] ? region : 'Other'; }}  

  switch (metric.toLowerCase()) {
    case 'blood glucose':
      return getBloodGlucoseAdvice(region);
    case 'cholesterol':
      return getCholesterolAdvice(region);
    case 'uric acid':
      return getUricAcidAdvice(region);
    default:
      return '';
  }
}

function getBloodGlucoseAdvice(region: string): string {
  switch (region) {
    case 'North America':
      return 'In North America, consider following the American Diabetes Association guidelines for diet and exercise. Be mindful of portion sizes in restaurants.';
    case 'South America':
      return 'In South America, incorporate more whole grains and legumes into your diet, which are staples in many South American cuisines and can help regulate blood glucose.';
    case 'Western Europe':
      return 'In Western Europe, adopt aspects of the Mediterranean diet, rich in vegetables, olive oil, and fish, which can help manage blood glucose levels.';
    case 'Eastern Europe':
      return 'In Eastern Europe, limit consumption of high-carb foods like potatoes and bread, which are common in Eastern European diets. Increase intake of non-starchy vegetables.';
    case 'Middle East':
      return 'In the Middle East, consider reducing intake of sugary desserts and beverages, especially during festivities. Incorporate more nuts and seeds into your diet.';
    case 'South Asia':
      return 'In South Asia, be mindful of the high carbohydrate content in rice and bread. Include more protein and vegetables in your meals to balance blood glucose.';
    case 'East Asia':
      return 'In East Asia, maintain the tradition of green tea consumption, which may help regulate blood glucose. Be cautious with white rice intake.';
    case 'Southeast Asia':
      return 'In Southeast Asia, be mindful of hidden sugars in sauces and desserts. Opt for whole grain varieties of rice when possible.';
    case 'Africa':
      return 'In Africa, incorporate more leafy greens into your diet. Be cautious with traditional high-carb staples like fufu or ugali.';
    case 'Oceania':
      return 'In Oceania, take advantage of the abundance of fresh produce available. Be mindful of portion sizes, especially in regards to meat consumption.';
    default:
      return 'Focus on a balanced diet with plenty of vegetables, lean proteins, and whole grains. Regular physical activity is crucial for managing blood glucose levels.';
  }
}

function getCholesterolAdvice(region: string): string {
  switch (region) {
    case 'North America':
      return 'In North America, limit fast food consumption and opt for heart-healthy options when dining out. Consider following the DASH diet.';
    case 'South America':
      return 'In South America, incorporate more fish into your diet, especially those rich in omega-3 fatty acids. Limit red meat consumption.';
    case 'Western Europe':
      return 'In Western Europe, adopt aspects of the Mediterranean diet, which is known for its heart-healthy properties. Increase consumption of olive oil and nuts.';
    case 'Eastern Europe':
      return 'In Eastern Europe, reduce consumption of fatty meats and high-fat dairy products. Increase intake of fruits, vegetables, and whole grains.';
    case 'Middle East':
      return 'In the Middle East, incorporate more legumes and vegetables into your diet. Limit consumption of fried foods and sweets.';
    case 'South Asia':
      return 'In South Asia, choose healthier cooking oils like mustard or olive oil. Increase consumption of fiber-rich foods like lentils and beans.';
    case 'East Asia':
      return 'In East Asia, maintain high consumption of fish and soy products. Be mindful of salt intake, especially in soy sauce and other condiments.';
    case 'Southeast Asia':
      return 'In Southeast Asia, incorporate more fruits and vegetables into your diet. Be cautious with coconut milk and other high-saturated fat ingredients.';
    case 'Africa':
      return 'In Africa, increase consumption of fruits, vegetables, and whole grains. Limit intake of palm oil, which is high in saturated fat.';
    case 'Oceania':
      return 'In Oceania, take advantage of the abundance of seafood. Limit consumption of processed and high-fat meats.';
    default:
      return 'Focus on a diet low in saturated and trans fats. Increase consumption of fruits, vegetables, whole grains, and lean proteins.';
  }
}

function getUricAcidAdvice(region: string): string {
  switch (region) {
    case 'North America':
      return 'Limit consumption of high-fructose corn syrup, which is common in many processed foods and soft drinks in North America.';
    case 'South America':
      return 'Be cautious with beer consumption, especially during festivities. Opt for water or non-alcoholic beverages instead.';
    case 'Western Europe':
      return 'Limit intake of organ meats and game meats, which are high in purines. Moderate wine consumption may have protective effects against gout.';
    case 'Eastern Europe':
      return 'Reduce consumption of fatty meats and high-fat dairy products. Increase intake of cherries, which may have anti-inflammatory properties.';
    case 'Middle East':
      return 'Limit consumption of red meat in traditional dishes. Increase intake of plant-based proteins like lentils and beans.';
    case 'South Asia':
      return 'Be cautious with purine-rich legumes like lentils and beans. Balance your diet with low-purine vegetables and fruits.';
    case 'East Asia':
      return 'Limit intake of seafood high in purines, such as shellfish. Green tea consumption may help lower uric acid levels.';
    case 'Southeast Asia':
      return 'Be mindful of high-purine ingredients in traditional dishes. Increase water intake, especially in hot and humid climates.';
    case 'Africa':
      return 'Limit consumption of organ meats, which are common in some African cuisines. Increase intake of vitamin C-rich fruits.';
    case 'Oceania':
      return 'Be cautious with seafood consumption, especially shellfish. Take advantage of the variety of fruits available to increase vitamin C intake.';
    default:
      return 'Limit intake of purine-rich foods, stay well-hydrated, and maintain a healthy weight through diet and exercise.';
  }
}

export async function POST(request: Request) {
  const { metric, data, unit } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Fetch user profile
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('age, gender, country')
      .eq('id', user?.id)
      .single()

    if (profileError) throw profileError

    const { analysis, recommendation } = analyzeMetric(metric, data, profile)

    return NextResponse.json({ analysis, recommendation })
  } catch (error) {
    console.error('Error generating analysis:', error)
    return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 })
  }
}
