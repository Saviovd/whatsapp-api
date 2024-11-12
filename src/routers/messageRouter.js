
const express = require('express');
const router = new express.Router();
const { sendMessage } = require("../services/WhatsappClient")
const multer = require('multer');
const upload = multer()

router.get('/', (req, res) => {
  res.send('Hi!');
});

router.post("/message", upload.single("file"), (req, res) => {
  const file = req.file
  const { phoneNumber, message } = req.body;
  sendMessage(phoneNumber, message, file);
  res.send();
})

module.exports = router