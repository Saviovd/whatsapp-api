function validateAnswer(currentQuestion, answer) {
    if (currentQuestion.isOpenResponse) {
        return true;
    }

    if (currentQuestion.next && currentQuestion.next.hasOwnProperty(answer)) {
        return true;
    }

    console.log("Resposta inválida");
    return false;
}

module.exports = validateAnswer
