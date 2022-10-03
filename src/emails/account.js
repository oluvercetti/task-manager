const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeMessage = (email, name) => {
    sgMail.send({
        to: email, //temporary
        from: 'andrew@mead.io',
        subject: 'This is my first creation!',
        text: `Hello ${name} I hope this one actually get to you`
    })
}


const sendCancellationMessage = (email, name) => {
    sgMail.send({
        to: email, //temporary
        from: 'andrew@mead.io',
        subject: 'So sad to let you go',
        text: `Hello ${name} I hope this one actually get to you`
    })
} 

module.exports = {
    sendWelcomeMessage,
    sendCancellationMessage
}