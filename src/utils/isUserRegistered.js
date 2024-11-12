async function isUserRegistered(client, phoneNumber) {
    try {
        const isRegistered = await client.isRegisteredUser(phoneNumber);
        return isRegistered;
    } catch (error) {
        console.error("Erro ao verificar o número:", error);
        return false;
    }
}

module.exports = isUserRegistered