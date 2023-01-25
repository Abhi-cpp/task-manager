const nodemailer = require('nodemailer')

function transport() {
    return nodemailer.createTransport({
        service: 'gmail',
        port:465,
        secure:true,
        host: `smtp.gmail.com`,
        auth: {
            user: "abhishek.kumar986871@gmail.com",
            pass: process.env.PW
        }
    })
}
const transportobj = transport()
const sendwelcomemail = (email, name) => {
    transportobj.sendMail({
        from: 'Task Manager API <abhishek.kumar986871@gmail.com>',
        to: email,
        subject: 'Thanks for joining!',
        text: `Welcome to our service, ${name}!`,
        html: `<b>Welcome to our service, ${name}!</b>`
    })
}
const deleteAck = (email, name) => {
    transportobj.sendMail({
        from: 'Task Manager API <abhishek.kumar986871@gmail.com>',
        to: email,
        subject: 'We\'re sorry to see you leave',
        text: `We hope to see you back again someday, ${name}!`,
        html: `<b>We hope to see you back again someday, ${name}!</b>`
    })
}
module.exports = {
    sendwelcomemail,
    deleteAck
}
