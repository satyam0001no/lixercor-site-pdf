require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const adminEmail = "satyam2025kumarjha@gmail.com";
const productFile = "millionaire-method.pdf";

let submissions = [];

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post('/api/submit', async (req, res) => {
  const { name, email, txnId } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and Email required" });

  try {
    submissions.push({ name, email, txnId, date: new Date().toISOString() });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: adminEmail,
        pass: process.env.GMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Lixercor" <${adminEmail}>`,
      to: email,
      subject: "Your Millionaire Method eBook",
      text: `Hi ${name},

Thanks for your payment. Attached is your digital product.`,
      attachments: [{ filename: "Millionaire-Method.pdf", path: path.join(__dirname, productFile) }]
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "E-Book sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email. Try again." });
  }
});

app.get('/api/admin-data', (req, res) => {
  res.json({ submissions });
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));