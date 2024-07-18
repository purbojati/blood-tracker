import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Google Generative AI client
// Check if the environment variable is defined
if (!process.env.GOOGLE_AI_API_KEY) {
  // Handle the case where the environment variable is not defined
  // You can throw an error, log a warning, or return a default response
  throw new Error('GOOGLE_AI_API_KEY environment variable is not defined');
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  const supabase = createRouteHandlerClient({ cookies })

  // Fetch the last 7 data inputs and user profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 })
  }

  // Fetch the last 7 data inputs
  // ... (fetch data from Supabase as before)

   // Fetch the latest blood test
   const { data: latestTest, error: latestTestError } = await supabase
   .from('blood_tests')
   .select('*')
   .eq('user_id', userId)
   .order('created_at', { ascending: false })
   .limit(1)
   .single();

 if (latestTestError) {
   return NextResponse.json({ error: 'Failed to fetch latest blood test data' }, { status: 500 });
 }

  // Prepare the prompt for Gemini
  const prompt = `Analyze the following blood test results for a ${profile.age}-year-old ${profile.gender}:
    Blood Sugar: ${latestTest.blood_sugar} mg/dL
    Cholesterol: ${latestTest.cholesterol} mg/dL
    Gout: ${latestTest.gout} mg/dL
    
    Provide an analysis including:
    1. Status and recommendation for each metric
    2. Overall health assessment
    3. Lifestyle recommendations
  `;

  try {
    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    // Parse the Gemini response and structure it according to your AnalysisResult interface
    // This part would depend on how you structure the Gemini prompt and response
    const analysis = parseGeminiResponse(analysisText);

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 })
  }
}

function parseGeminiResponse(responseText: string) {
  // Implement parsing logic here to convert the Gemini text response
  // into the structured AnalysisResult object
  // This would involve natural language processing or a structured response format from Gemini
}