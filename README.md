# 各種身分驗證與註冊的平台


## 描述
實作一個註冊/登入的頁面與RESTful server，使用者可以直接用email註冊，或是使用其他驗證提供者的服務。

__目前http response暫時為json格式__

Demo page : https://auth-verity.site

## 已經完成的驗證提供者

- Facebook
- Google

## 使用框架與套件

- ExpressJS作為routing及RESTful API server
- Mongoose + MongoDB
- Redis + express-session 處理使用者 session
- PassportJS處理Oauth驗證
- Mailgun寄送email

## 相關環境

- `Node.js: 12.x`
- 安裝並跑起`MongoDB`, `PORT`為27017
- 安裝並跑起`redis-server`, `PORT`為6379

## .env設定
在目錄新增一個`.env`檔，可以參考`.env.example`的範例

```
# APP_URL should be set as the production domain for production environment.
APP_URL=http://localhost:8080


# Facebook pairs and configs
FACEBOOK_APP_ID=YOUR_FACEBOOK_APP_ID
FACEBOOK_APP_CLIENT_SECRET=YOUR_FACEBOOK_APP_CLIENT_SECRET

# Google pairs and configs
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# Mailgun pairs and configs
MAILGUN_API_KEY=YOUR_MAILGUN_API_KEY
MAILGUN_PUBLIC_KEY=YOUR_MAILGUN_PUBLIC_KEY
MAILGUN_DOMAIN=YOUR_MAILGUN_DOMAIN
```

## 安裝方式

```sh
# install dependencies
npm install

# run the app on the port 8080
node server.js
```

除了使用`npm`，也可使用`yarn`套件管理員

```sh
# install dependencies
yarn

# run the app on the port 8080
node server.js
```

## 路徑整理

### Oauth部分

Facebook login 路徑 `GET ${APP_URL}/login/facebook`

Facebook login call back url `GET ${APP_URL}/oauth/facebook/callback`

Google login 路徑 `GET ${APP_URL}/login/google`

Google login call back url `GET ${APP_URL}/oauth/google/callback`

### Email 與 user 相關

`POST  ${APP_URL}/api/login` Email登入

`POST  ${APP_URL}/api/register` Email註冊

`GET  ${APP_URL}/api/users` 取得所有使用者

`DELETE  ${APP_URL}/api/user/:user_id` 刪除特定使用者

`GET  ${APP_URL}/api/logout` 登出目前帳戶。清除session內已登入的使用者。

## Todo list

- 密碼使用bcrypt加密儲存
- 前端Navbar顯示session中的login user的名稱、email、大頭貼
- 前端新增登出按鈕與相關流程
