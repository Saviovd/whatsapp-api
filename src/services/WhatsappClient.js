const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { MessageMedia } = require("whatsapp-web.js");
const isUserRegistered = require("../utils/isUserRegistered");
const { processAnswer } = require("../bot/questionnaire");

const client = new Client({
    authStrategy: new LocalAuth
});

client.on("qr", (qr) => {
    console.log("QR code received:", qr);
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("WhatsApp client is ready!");
});

client.on("authenticated", () => {
    console.log("Client authenticated!");
});

client.on("auth_failure", (message) => {
    console.log("Authentication failure:", message);
});

client.on("message", async (msg) => {
    if (msg.from === 'status@broadcast') return;
    try {
        if (msg.body.trim() === '!ping') {
            await msg.reply('pong');
        }
        console.log("Message received:", msg.body);
        const answer = msg.body.trim();
        processAnswer(msg.from, answer, sendMessage);
    } catch (error) {
        console.error(error);
    }
});

async function sendMessage(phoneNumber, message, file) {
    const numberId = await client.getNumberId(phoneNumber);
    if (!numberId) {
        console.error(`Failed to retrieve numberId for ${phoneNumber}.`);
        return;
    }

    const isRegistered = await isUserRegistered(client, phoneNumber);
    if (!isRegistered) {
        console.log(`The number ${phoneNumber} is not registered on WhatsApp.`);
        return;
    }

    try {
        if (file) {
            const messageFile = new MessageMedia(file.mimetype, file.buffer.toString('base64'));
            await client.sendMessage(phoneNumber, messageFile);
        } else {
            await client.sendMessage(phoneNumber, message);
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

module.exports = { client, sendMessage };