const nodemailer = require('nodemailer');

// メール送信の設定
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async (req, res) => {
  // CORSの設定
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // OPTIONSリクエストの処理
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POSTリクエスト以外は拒否
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '許可されていないメソッドです。' });
  }

  try {
    const { name, email, message } = req.body;

    // 入力値の検証
    if (!name || !email || !message) {
      return res.status(400).json({ message: '全ての項目を入力してください。' });
    }

    // メールの内容
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 's.shimizu@vivixy.co.jp',
      subject: `ポートフォリオサイトからのお問い合わせ - ${name}様`,
      text: `
名前: ${name}
メールアドレス: ${email}

メッセージ:
${message}
      `,
      replyTo: email
    };

    // メール送信
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'お問い合わせを受け付けました。' });
  } catch (error) {
    console.error('メール送信エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
}; 