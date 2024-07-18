// app/api/analysis/route.ts

import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: bloodTests, error: bloodTestsError } = await supabase
      .from('blood_tests')
      .select('*')
      .eq('user_id', userId)
      .order('test_date', { ascending: false })
      .limit(7)

    if (bloodTestsError || !bloodTests || bloodTests.length === 0) {
      return NextResponse.json({ error: 'Failed to fetch blood tests or no data found' }, { status: 404 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('age, gender, country, language')
      .eq('id', userId)
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 })
    }

    const latestTest = bloodTests[0]
    const prompt = `You're a doctor, analyze the following blood test results for a ${profile.age}-year-old ${profile.gender} from ${profile.country} in ${profile.language} language:
    Blood Sugar: ${latestTest.blood_sugar} mg/dL
    Cholesterol: ${latestTest.cholesterol} mg/dL
    Gout: ${latestTest.gout} mg/dL

    Provide an analysis in the following format:

    Blood Sugar:
    [Status]
    [Value]
    [Short recommendation]

    Cholesterol:
    [Status]
    [Value]
    [Short recommendation]

    Gout:
    [Status]
    [Value]
    [Short recommendation]

    Overall Health Assessment:
    [A comprehensive assessment of overall health based on these metrics, considering age, gender, country]

    Lifestyle Recommendations:
    - [Lifestyle Recommendation]

    Ensure the recommendations are tailored to the specific values and the user's age, gender, country.`

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    return NextResponse.json({ analysis: analysisText })
  } catch (error) {
    console.error('Unexpected error in analysis API:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}