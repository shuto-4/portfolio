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
  const headers = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': 'https://shuto-4.github.io',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  };

  // プリフライトリクエストへの対応
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  // 全てのレスポンスにCORSヘッダーを付与
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: '送信が完了しました。' });
  } catch (error) {
    console.error('メール送信エラー:', error);
    res.status(500).json({ message: 'メールの送信に失敗しました。' });
  }
}; 