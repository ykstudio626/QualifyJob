import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userInput } = await request.json();

    if (!userInput) {
      return NextResponse.json({ error: 'User input is required' }, { status: 400 });
    }

    // const apiKey = process.env.DIFY_API_KEY;
    // const apiUrl = process.env.DIFY_URL;

    const apiUrl = process.env.EC2_PUBLIC_IP;

    if (!apiUrl) {
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 });
    }

    // userInputはJSON文字列として渡されるのでパース
    const payload = JSON.parse(userInput);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        // 'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // DIFY APIのレスポンスをそのまま返す
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}