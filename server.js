require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// レート制限の設定
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 5, // IPアドレスごとに5回まで
  message: { message: '送信回数が制限を超えました。しばらく時間をおいて再度お試しください。' }
});

// 環境変数の検証
const requiredEnvVars = ['GMAIL_USER', 'GMAIL_APP_PASSWORD', 'MAIL_TO'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('必要な環境変数が設定されていません:', missingEnvVars.join(', '));
  process.exit(1);
}

// ミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// メール送信の設定
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// トランスポーターの検証
transporter.verify((error, success) => {
  if (error) {
    console.error('メール設定エラー:', error);
    process.exit(1);
  } else {
    console.log('メールサーバーの接続に成功しました');
  }
});

// 入力値の検証関数
function validateInput(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!input.name || typeof input.name !== 'string' || input.name.length > 50) {
    return '名前は50文字以内で入力してください。';
  }
  
  if (!input.email || !emailRegex.test(input.email)) {
    return '有効なメールアドレスを入力してください。';
  }
  
  if (!input.message || typeof input.message !== 'string' || input.message.length > 1000) {
    return 'メッセージは1000文字以内で入力してください。';
  }
  
  return null;
}

// お問い合わせフォームの処理
app.post('/contact', limiter, async (req, res) => {
  const { name, email, message } = req.body;
  console.log('受信したデータ:', { name, email, message });

  // 入力値の検証
  const validationError = validateInput({ name, email, message });
  if (validationError) {
    console.log('バリデーションエラー:', validationError);
    return res.status(400).json({ message: validationError });
  }

  // XSS対策
  const sanitizedMessage = message
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.MAIL_TO,
    subject: `ポートフォリオサイトからのお問い合わせ - ${name}様`,
    text: `
名前: ${name}
メールアドレス: ${email}

メッセージ:
${sanitizedMessage}

送信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
IPアドレス: ${req.ip}
    `,
    replyTo: email
  };

  console.log('メール送信設定:', {
    from: mailOptions.from,
    to: mailOptions.to,
    subject: mailOptions.subject
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('メール送信成功:', info);
    res.status(200).json({ message: 'お問い合わせを送信しました。' });
  } catch (error) {
    console.error('メール送信エラーの詳細:', error);
    res.status(500).json({ message: '送信に失敗しました。時間をおいて再度お試しください。' });
  }
});

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error('サーバーエラー:', err);
  res.status(500).json({ message: 'サーバーエラーが発生しました。' });
});

// サーバーの起動
app.listen(port, () => {
  console.log(`サーバーが起動しました: http://localhost:${port}`);
}); 