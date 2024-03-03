import { transporter } from './transporter';

export const activateLink = async (to: string, link: string) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Account activation at ' + process.env.APP_URL,
    text: ' ',
    html: `
    <div> 
        <h1>For activation account follow the link !</h1>
        <a href="${link}">Click me for activation</a>
    </div>
     `,
  });
  try {
  } catch (error) {
    console.log(error);
    throw error;
  }
};
