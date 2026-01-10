# AIJOBMatching
AIでJOBをマッチングするシステムです。

### フロントエンド
Next.js / TypeScript

### API
Dify

一部Langchainに移行検討中

### DB
暫定的にGoogle Worksheet + GASを利用

AWS EC2 + Lambda に移行予定

### VectorDB
Pinecone

## 認証について
本番環境では、BASIC認証が有効になります。

### 環境変数設定
`.env.local`ファイルに以下の設定を追加してください：

```
# Basic認証設定（本番環境用）
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD=your_secure_password
```

### 認証の仕組み
- **開発環境** (`NODE_ENV=development`): 認証をスキップ
- **本番環境** (`NODE_ENV=production`): BASIC認証が必要
- 認証が必要な場合、ブラウザの認証ダイアログが表示されます

## 起動方法
初回起動の場合は以下を実行
```
npm install
```
コードを変更した場合
```
npm run build
```
開発サーバ起動
```
npm run dev
```
