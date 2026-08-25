import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// nodemailer.createTransport() method is used to create a reusable object,
// known as a "transporter," that knows how to send emails.
export const sendOtpEmail = async (email, otp) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`,
  });

  console.log("info", info);
  try {
    await transporter.sendMail({
      from: `"${process.env.APP_NAME || "App"}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "YOUR LOGIN OTP",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .otp-box {
              background: white;
              border: 2px dashed #667eea;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Login Verification</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Use the OTP below to login:</p>

              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>

              <p><strong>Valid for 10 minutes</strong></p>
              <p>Didn't request this? Ignore this email.</p>

              <div class="footer">
                <p>Do not reply to this automated message</p>
                <p>&copy; ${new Date().getFullYear()} ${
                  process.env.APP_NAME || "App"
                }</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("OTP email sent!");
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Failed to send OTP email");
  }
};
