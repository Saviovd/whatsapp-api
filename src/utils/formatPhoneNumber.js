function formatPhoneNumber(phoneNumber) {
    const sanitizedNumber = phoneNumber.replace(/\D/g, '');

    const countryCode = '55';

    const formattedNumber = sanitizedNumber.startsWith(countryCode)
        ? sanitizedNumber
        : countryCode + sanitizedNumber;

    return `${formattedNumber}@c.us`;
}

module.exports = { formatPhoneNumber }