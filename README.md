# 各種身分驗證與註冊的平台


## 描述
實作一個註冊/登入的頁面與RESTful server，使用者可以直接用email註冊，或是使用其他驗證提供者的服務。
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

## DB設定

- 安裝並跑起`MongoDB`, `PORT`為27017
- 安裝並跑起`redis-server`, `PORT`為6379

## 安裝方式
需安裝`NodeJS 12`

```sh
npm install // install dependencies
node server.js // run the app on the port 8080
```

除了使用`npm`，也可使用`yarn`套件管理員

```sh
yarn // install dependencies
node server.js // run the app on the port 8080
```
