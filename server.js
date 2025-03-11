require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(cors({
  origin: '*',  // すべてのオリジンを許可
  methods: ['POST'],  // POSTメソッドのみ許可
}));
app.use(express.json());

// メール送信の設定
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
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

// お問い合わせフォームのエンドポイント
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    console.log('受信したデータ:', { name, email, message });  // デバッグ用ログ

    // 入力値の検証
    if (!name || !email || !message) {
      return res.status(400).json({ message: '全ての項目を入力してください。' });
    }

    // メールの内容
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `ポートフォリオサイトからのお問い合わせ - ${name}様`,
      text: `
名前: ${name}
メールアドレス: ${email}

メッセージ:
${message}
      `,
      replyTo: email  // 返信先を設定
    };

    // メール送信
    await transporter.sendMail(mailOptions);
    console.log('メール送信成功');  // デバッグ用ログ

    res.status(200).json({ message: 'お問い合わせを受け付けました。' });
  } catch (error) {
    console.error('メール送信エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
});

// サーバーの起動
app.listen(port, () => {
  console.log(`サーバーが起動しました: http://localhost:${port}`);
}); 