import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD
    }
})

export const mailToAdmin = async (subject, text) => {
    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: subject,
        text: text,
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(info)
    } catch (err) {
        console.log(err)
    }
}