import { Resend } from 'resend';
const RESEND_KEY = import.meta.env.VITE_URL_API;

const resend = new Resend(RESEND_KEY);

// TODO : Falta customizar, config, etc
export default class EmailCalls {
    static async sendEmailChangeEmail(email: string) {
        try {
            const data = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Buzzsnap test',
                html: '<p>Esto es un correo de prueba</p>',
            });
            console.log('✅ Email enviado:', data);
        } catch (error) {
            console.error('❌ Error al enviar email:', error);
        }
    }

    static async sendEmailChangePassword(email: string) {
        try {
            const data = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Buzzsnap test',
                html: '<p>Esto es un correo de prueba</p>',
            });
            console.log('✅ Email enviado:', data);
        } catch (error) {
            console.error('❌ Error al enviar email:', error);
        }
    }
}
