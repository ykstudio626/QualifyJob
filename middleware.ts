import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // 認証を無効にする場合の環境変数チェック
  // DISABLE_AUTH=true を設定すると認証をスキップできます
  if (process.env.DISABLE_AUTH === 'true' || process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // BASIC認証が必要なパスかどうかをチェック
  const pathname = request.nextUrl.pathname;
  
  // APIルートや静的ファイルは認証をスキップ
  if (pathname.startsWith('/api/basic-auth')) {
    return NextResponse.next();
  }

  // BASIC認証の検証
  const basicAuth = request.headers.get('authorization');

  if (basicAuth) {
    try {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      // 環境変数から認証情報を取得
      const validUser = process.env.BASIC_AUTH_USER || 'admin';
      const validPassword = process.env.BASIC_AUTH_PASSWORD || 'matching2026';

      if (user === validUser && pwd === validPassword) {
        return NextResponse.next();
      }
    } catch (error) {
      // Base64デコードエラーなどをキャッチ
      console.error('Basic auth parsing error:', error);
    }
  }

  // 認証失敗時は401を返す
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>認証が必要です</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            text-align: center;
            padding: 3rem 2rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            max-width: 400px;
            width: 90%;
          }
          .lock-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          h1 {
            color: #333;
            margin-bottom: 0.5rem;
            font-size: 1.5rem;
          }
          p {
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.5;
          }
          .credentials {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 1rem;
            margin: 1rem 0;
            font-size: 0.9rem;
            color: #495057;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="lock-icon">🔒</div>
          <h1>認証が必要です</h1>
          <p>このサイトにアクセスするには認証が必要です。<br>ブラウザの認証ダイアログで以下の情報を入力してください。</p>
          <div class="credentials">
            <strong>ユーザー名:</strong> admin<br>
            <strong>パスワード:</strong> 管理者にお問い合わせください
          </div>
        </div>
      </body>
    </html>
    `,
    {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="AI Job Matching System"',
        'Content-Type': 'text/html; charset=UTF-8',
      },
    }
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/basic-auth (Basic認証API)  
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api/basic-auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};