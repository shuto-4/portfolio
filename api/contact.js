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
  console.log('API called:', req.method); // デバッグログ

  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // プリフライトリクエストへの対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POSTメソッド以外は許可しない
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethods: ['POST']
    });
  }

  try {
    console.log('Request body:', req.body); // デバッグログ

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: '必須項目が入力されていません。',
        missingFields: [
          !name && 'name',
          !email && 'email',
          !message && 'message'
        ].filter(Boolean)
      });
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
    
    return res.status(200).json({
      message: '送信が完了しました。',
      success: true
    });
  } catch (error) {
    console.error('Error details:', error); // デバッグログ
    
    return res.status(500).json({
      error: 'メールの送信に失敗しました。',
      details: error.message
    });
  }
}; 