const express = require('express');
const router = new express.Router();
const { sendMessage, client } = require("../services/WhatsappClient");
const multer = require('multer');
const { startQuestionnaire } = require('../bot/questionnaire');
const { createUser } = require('../bot/users');
const { formatPhoneNumber } = require("../utils/formatPhoneNumber");
const upload = multer();

router.get('/', (req, res) => {
  res.send('Hi!');
});

router.post("/message", upload.single("file"), (req, res) => {
  const file = req.file;
  const { phoneNumber, message } = req.body;
  const formattedNumber = formatPhoneNumber(phoneNumber)

  sendMessage(formattedNumber, message, file);
  res.send();
});

router.post("/register", (req, res) => {
  const { phoneNumber } = req.body;
  const formattedNumber = formatPhoneNumber(phoneNumber)
  createUser(formattedNumber);
  startQuestionnaire(formattedNumber, sendMessage);

  res.send("Questionário iniciado.");
});

router.post("/logout", async (req, res) => {
  try {
    if (client.info && client.info.wid) {
      await client.logout();
      res.send("Usuário deslogado com sucesso.");
    } else {
      res.status(400).send("Cliente não está inicializado ou já está deslogado.");
    }
  } catch (error) {
    console.error("Erro ao deslogar o usuário:", error);
    res.status(500).send("Erro ao deslogar o usuário.");
  }
});

router.get("/login", async (req, res) => {
  client.on("qr", (qr) => {
    res.send({ qr });
  });
  
  client.initialize();
});

module.exports = router;
