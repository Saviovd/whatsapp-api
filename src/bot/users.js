const fs = require('fs');
const path = require('path');

function getUsersFilePath() {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    return path.join(__dirname, 'data', `users-${formattedDate}.json`);
}

function getLatestFile() {
    const dataDir = path.join(__dirname, 'data');
    const files = fs.readdirSync(dataDir).filter(file => file.startsWith('users-') && file.endsWith('.json'));
    files.sort((a, b) => new Date(b.split('-')[1]) - new Date(a.split('-')[1]));
    return files.length ? path.join(dataDir, files[0]) : null;
}

function loadUsers() {
    let usersFilePath = getUsersFilePath();

    // if (!fs.existsSync(usersFilePath)) {
    //     const latestFilePath = getLatestFile();
    //     if (latestFilePath) {
    //         usersFilePath = latestFilePath;
    //         console.log(`Carregando dados do último arquivo: ${latestFilePath}`);
    //     } else {
    //         console.log('Nenhum arquivo de usuários encontrado.');
    //         return [];
    //     }
    // }

    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        return [];
    }
}

function saveUsers(users) {
    const usersFilePath = getUsersFilePath();
    const dataDir = path.dirname(usersFilePath);

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        console.log(`Usuários salvos em: ${usersFilePath}`);
    } catch (error) {
        console.error('Erro ao salvar usuários:', error);
    }
}

function getUser(phoneNumber) {
    const users = loadUsers();
    const normalizedPhone = phoneNumber.trim();
    return users.find(user => user.phoneNumber === normalizedPhone);
}

function createUser(phoneNumber) {
    const users = loadUsers();
    const existingUser = users.find(user => user.phoneNumber === phoneNumber);

    if (existingUser) {
        console.log(`Usuário com o telefone ${phoneNumber} já existe.`);
        return existingUser;
    }

    const user = { phoneNumber, index: 0, finished: false, responses: [] };
    users.push(user);
    saveUsers(users);
    return user;
}

function updateUser(phoneNumber, updates) {
    const users = loadUsers();
    const user = users.find(user => user.phoneNumber === phoneNumber);

    if (user) {
        Object.assign(user, updates);
        saveUsers(users);
    } else {
        console.log(`Usuário não encontrado: ${phoneNumber}`);
    }
}

module.exports = { getUser, createUser, updateUser };
