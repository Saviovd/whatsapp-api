const questionFlow = [
    {
        question: "Bem-vindo! Está gostando do nosso serviço? (0 para Sim, 1 para Não)",
        next: { "0": "recommend", "1": "feedback" }
    },
    {
        question: "Você recomendaria nosso serviço? (0 para Sim, 1 para Não)",
        next: { "0": "thanks", "1": "improve" }
    },

    {
        question: "Por favor, digite seu comentário:",
        isOpenResponse: true,
        isFinal: true,
        next: {}
    },
];
module.exports = questionFlow;
