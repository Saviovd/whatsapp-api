const { getUser, createUser, updateUser } = require('./users');
const questionFlow = require('./questions');

async function startQuestionnaire(phoneNumber, sendMessage) {
    let user = getUser(phoneNumber);
    console.log('user: ', user)

    if (!user) {
        console.log('Criando novo usuário para o número:', phoneNumber);
        user = createUser(phoneNumber);
    }

    console.log(`Iniciando questionário para o usuário: ${phoneNumber}`);

    if (user.finished) {
        console.log(`Usuário ${phoneNumber} já finalizou o questionário.`);
        return;
    }

    if (user.index === undefined) {
        user.index = 0;
    }

    console.log(`Enviando pergunta ${user.index + 1} para ${phoneNumber}: ${questionFlow[user.index].question}`);
    sendMessage(phoneNumber, questionFlow[user.index].question);
}

async function processAnswer(phoneNumber, answer, sendMessage) {
    console.log('processAnswer phoneNumber: ', phoneNumber)
    let user = getUser(phoneNumber);
    if (!user) {
        console.error(`Erro: Usuário ${phoneNumber} não encontrado ao processar resposta.`);
        return;
    }

    if (user.index === undefined || user.finished) {
        console.error(`Usuário ${phoneNumber} já finalizou o questionário.`);
        return;
    }

    const currentQuestion = questionFlow[user.index];

    if (!currentQuestion) {
        console.error(`Erro: Pergunta não encontrada para o índice ${user.index}`);
        return;
    }

    user.responses.push({ question: currentQuestion.question, answer: answer });
    console.log(`Respostas até agora para ${phoneNumber}: ${JSON.stringify(user.responses)}`);

    if (currentQuestion.isFinal) {
        console.log(`Finalizando questionário para ${phoneNumber}.`);
        sendMessage(phoneNumber, "Obrigado por participar da pesquisa!");
        updateUser(phoneNumber, { finished: true });
        return;
    }

    const nextIndex = user.index + 1;
    if (questionFlow[nextIndex]) {
        console.log('enviando: ', phoneNumber, questionFlow[nextIndex].question)
        updateUser(phoneNumber, { index: nextIndex, responses: [...user.responses] });
        sendMessage(phoneNumber, questionFlow[nextIndex].question);
    } else {
        console.error("Próxima pergunta não encontrada.");
    }
}

module.exports = { startQuestionnaire, processAnswer };
