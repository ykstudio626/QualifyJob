import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>認証が必要です</title>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .container {
            text-align: center;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
            margin-bottom: 1rem;
          }
          p {
            color: #666;
            margin-bottom: 1.5rem;
          }
          button {
            background-color: #0070f3;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
          }
          button:hover {
            background-color: #0051cc;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔒 認証が必要です</h1>
          <p>このサイトにアクセスするには認証が必要です。</p>
          <button onclick="promptAuth()">ログイン</button>
        </div>
        <script>
          function promptAuth() {
            // ユーザー名とパスワードの入力を促す
            const username = prompt("ユーザー名を入力してください:");
            if (!username) return;
            
            const password = prompt("パスワードを入力してください:");
            if (!password) return;
            
            // Basic認証のヘッダーを設定してページをリロード
            const credentials = btoa(username + ':' + password);
            
            fetch(window.location.href, {
              headers: {
                'Authorization': 'Basic ' + credentials
              }
            }).then(response => {
              if (response.ok) {
                window.location.reload();
              } else {
                alert('認証に失敗しました。ユーザー名とパスワードを確認してください。');
              }
            }).catch(() => {
              alert('認証中にエラーが発生しました。');
            });
          }
        </script>
      </body>
    </html>
    `,
    {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
        'Content-Type': 'text/html; charset=UTF-8',
      },
    }
  );
}