import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function sendConfirmationEmail(email: string, token: string) {
    const confirmationLink = `http://localhost:3000/confirm-email?token=${token}`;

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Подтверждение адреса электронной почты',
        text: `Пожалуйста, перейдите по ссылке для подтверждения вашего адреса: ${confirmationLink}`,
        html: `<p>Пожалуйста, перейдите по ссылке для подтверждения вашего адреса: <a href="${confirmationLink}">${confirmationLink}</a></p>`,
    };

    await transporter.sendMail(mailOptions);
}
