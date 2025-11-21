import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendOtpEmail = async (email, otp) => {
    try {
        const msg = {
            to: email,
            from: process.env.FROM_EMAIL,
            subject: "Your OTP Code for Verification",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #7606d8ff;"> Email Verification</h2>
          <p>Hi there ,</p>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="color: #00ff37a1; font-size: 28px;">${otp}</h1>
          <p>This OTP will expire in <strong>5 minutes</strong>.</p>
          <p>If you did not request this, please ignore this email.</p>
          <br/>
          <p style="color: #0d7a98ff;">—- Team Goflow App</p>
        </div>
      `,
        }
        await sgMail.send(msg);
        console.log(` OTP email sent to ${email}`)
    } catch (error) {
        console.error(" SendGrid Error:", error)
        if (error.response) console.error(error.response.body)
        throw new Error("Failed to send OTP email")
    }
}

export default sendOtpEmail