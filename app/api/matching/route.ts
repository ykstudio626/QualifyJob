import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userInput } = await request.json();

    if (!userInput) {
      return NextResponse.json({ error: 'User input is required' }, { status: 400 });
    }

    // const apiKey = process.env.DIFY_API_KEY;
    // const apiUrl = process.env.DIFY_URL;

    const apiBaseUrl = process.env.MATCHING_API_IP;
    
    // Vercel本番環境では外部公開されたAPIエンドポイントを使用
    const isProduction = process.env.NODE_ENV === 'production';
    const apiUrl = isProduction 
      ? `https://${apiBaseUrl}/matching_yoin`  // 本番環境ではHTTPS
      : `http://${apiBaseUrl}/matching_yoin`;   // 開発環境ではHTTP

    console.log('Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      MATCHING_API_IP: process.env.MATCHING_API_IP,
      apiBaseUrl,
      apiUrl,
      isProduction
    });

    if (!apiBaseUrl) {
      console.error('MATCHING_API_IP is not set or is empty');
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 });
    }

    // userInputはJSON文字列として渡されるのでパース
    const originalPayload = JSON.parse(userInput);
    
    // FastAPIのMatchingRequestスキーマに合わせて変換
    const payload = {
      query: "要員マッチング",
      anken: originalPayload.inputs?.anken || JSON.stringify(originalPayload)
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}