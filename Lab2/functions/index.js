const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');

const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function validateEmail(email) {
    return re.test(String(email).toLowerCase());
}

const rateLimiter = {
    ipNumberCalls: 7,
    timeSeconds: 45,
    ipData: new Map(),
};

const mailData = functions.config()?.email;

const transporter = nodemailer.createTransport({
    host: mailData?.host,
    port: mailData?.port,
    secure: false,
    auth: {
        user: mailData?.address,
        pass: mailData?.pass,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

exports.api = functions.https.onRequest((req, res) => {
    const errorMessages = [];
    const currentIp = req.headers['fastly-client-ip'];
    const currentTime = new Date();
    const currentIpUser = rateLimiter.ipData.get(currentIp) ?? {
        count: 0,
        time: currentTime,
    };

    if (
        currentTime !== currentIpUser?.time &&
        (currentIpUser?.count >= rateLimiter.ipNumberCalls ||
            currentTime - currentIpUser?.time <= rateLimiter.timeSeconds * 1000)
    ) {
        errorMessages.push({ message: 'Too many requests. Please try later' });
        return res.status(429).json({
            errors: errorMessages,
        });
    }
    currentIpUser.count++;
    currentIpUser.time = new Date();
    rateLimiter.ipData.set(currentIp, currentIpUser);
    if (!mailData) {
        return res.status(500).json({
            errors: errorMessages,
        });
    }
    const sanitizedMessage = sanitizeHtml(req.body.message);
    if (!sanitizedMessage) {
        errorMessages.push('Message is incorrect');
    }
    if (errorMessages.length) {
        return res.status(500).json({
            errorMessages,
        });
    }
    const output = `<p>${sanitizedMessage}</p>`;

    return transporter
        .sendMail({
            from: `${req.body.name} <${mailData?.address}>`,
            to: `${req.body.email}`,
            subject: 'Hi there',
            html: output,
        })
        .then(() => {
            errorMessages.push('Sent successfully');
            return res.json({
                errorMessages,
            });
        })
        .catch(() => {
            errorMessages.push('Sending error');
            return res.status(500).json({
                errorMessages,
            });
        });
});
