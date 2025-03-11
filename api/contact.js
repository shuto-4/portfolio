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
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', 'https://shuto-4.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // プリフライトリクエストへの対応
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: '必須項目が入力されていません。' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `ポートフォリオサイトからのお問い合わせ - ${name}様`,
      text: `
名前: ${name}
メールアドレス: ${email}
メッセージ:
${message}
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: '送信が完了しました。' });
  } catch (error) {
    console.error('エラーの詳細:', error);
    res.status(500).json({ message: 'メールの送信に失敗しました。' });
  }
}; 