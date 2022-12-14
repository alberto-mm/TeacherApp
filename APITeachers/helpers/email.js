require('dotenv').config();

var dayjs = require('dayjs');
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

// Nodemailer
const nodemailer = require("nodemailer");

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

//** Env Variables */
const {
    GMAIL_EMAIL = process.env.GMAIL_EMAIL,
    GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET,
    ADMINISTRADOR_EMAIL = process.env.ADMINISTRADOR_EMAIL,
    DATE = dayjs().tz("Europe/Madrid").format('DD/MM/YYYY HH:mm:ss') 
} = process.env;

//** Email Functions Handlers */
async function sendMailAPiTeachers(dataTeacherMail) {
    
    // Nodemailer TRANSPORT INFORMATION
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: GMAIL_EMAIL,
            pass: GMAIL_CLIENT_SECRET,
        },
    });

    // Body of Message
    let mailBody = `
        <div>
            <p>Hola administrador,</p>
            <p>Un nuevo profesor ha sido dado de alta, vaya a la consola de administración de TeacherApp para validarlo.</p>
        </div>
        <div>
            <p><b>Datos del profesor:</b></p>
            <ul>
                <li>Nombre: ${dataTeacherMail.name} ${dataTeacherMail.surname}</li>
                <li>Correo: ${dataTeacherMail.email}</li>
                <li>Fecha de alta: ${DATE}</li>
            </ul>
        </div>
    `;

    // Body of mail
    let mailOptions = {
        from: `Alertas TeacherAPP <${GMAIL_EMAIL}>`,
        to: ADMINISTRADOR_EMAIL,
        subject: "🚀 Nueva alta de profesor",
        html: mailBody,
    };

    // Send email
    return await transporter.sendMail(mailOptions)
        .then(success => "Email enviado")
        .catch(error => {
            throw error;
        });
}

module.exports = { sendMailAPiTeachers };
