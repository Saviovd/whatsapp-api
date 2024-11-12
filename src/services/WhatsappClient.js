const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { MessageMedia } = require("whatsapp-web.js");
const { formatPhoneNumber } = require("../utils/formatPhoneNumber");
const isUserRegistered = require("../utils/isUserRegistered");

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
    try {
        console.log("Message received:", msg.body);
        if (msg.type === 'chat') {
            if (msg.body.trim() === '!ping') {
                await msg.reply('pong');
            }
        }
    } catch (error) {
        console.error(error);
    }
});

async function sendMessage(phoneNumber, message, file) {
    const number = formatPhoneNumber(phoneNumber);
    const isRegistered = await isUserRegistered(client, number);
    if (!isRegistered) {
        console.log(`The number ${phoneNumber} is not registered on WhatsApp.`);
        return;
    }

    const numberId = await client.getNumberId(number);

    try {
        if (file) {
            const messageFile = new MessageMedia(file.mimetype, file.buffer.toString('base64'));
            await client.sendMessage(numberId._serialized, messageFile);
        } else {
            await client.sendMessage(numberId._serialized, message);
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

module.exports = { client, sendMessage };
