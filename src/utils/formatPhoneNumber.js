function normalizePhoneNumber(phone) {
    let normalizedPhone = phone.replace(/\D/g, '');

    if (normalizedPhone.startsWith('55')) {
        normalizedPhone = normalizedPhone.slice(2);
    }

    if (normalizedPhone.length === 11 && normalizedPhone[2] === '9') {
        normalizedPhone = normalizedPhone.slice(0, 2) + normalizedPhone.slice(3);
    }

    return normalizedPhone;
}

function formatPhoneNumber(phoneNumber) {
    console.log('chegou: ', phoneNumber)
    phoneNumber = normalizePhoneNumber(phoneNumber);

    const countryCode = '55';
    const formattedNumber = countryCode + phoneNumber;

    return `${formattedNumber}@c.us`;
}


module.exports = { formatPhoneNumber };
