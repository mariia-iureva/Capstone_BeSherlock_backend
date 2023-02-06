// these are for logging and working wth files
const fs = require("fs");
const util = require("util");

// these are for express server
const express = require("express");
const cors = require("cors");

// const bodyParser = require("body-parser");
// this one is for env secret config
// require("dotenv").config();

// this will also go to secret env
const PORT = process.env.PORT || 3001;
// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_BOT_TOKEN = "***REMOVED***";

const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

const app = express();
const { NlpManager } = require("node-nlp");

manager = new NlpManager();

app.use(cors());
app.use(express.json()); // JSON encoded body

// _______LOGGING________
var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "a" });
var log_stdout = process.stdout;

console.log = function (d) {
  log_file.write(util.format(d) + "\n");
  log_stdout.write(util.format(d) + "\n");
};

let date = new Date();
let timestamp =
  date.getDate() +
  "/" +
  (date.getMonth() + 1) +
  "/" +
  date.getFullYear() +
  "@" +
  date.getHours() +
  ":" +
  date.getMinutes() +
  ":" +
  date.getSeconds();

console.log(`Bot logging on ${timestamp}`);
// ___END OF LOGGING______

// Loading nlp model for answers:
manager.load("./model.nlp");

app.get("/", function (req, res) {
  res.send("Hi! I am Masha's game ChatBot.");
});

app.post("/postMessage", async function (req, res) {
  let message = req.body.message.toLowerCase();
  const reply = await getReply(message);
  console.log("[INFO](" + timestamp + ") Msg from Bot: " + reply);
  res.send({ bot_message: reply });
});

app.post("/postMessageFromTelegram", async (req, res) => {
  const reply = await getReply(req.body.message.text);
  console.log("[INFO](" + timestamp + ") Msg from Bot: " + reply);

  // return the same message back
  bot.sendMessage(req.body.message.chat.id, reply);
  return res.status(200).json();
});

const getReply = async (message) => {
  const reply = await manager.process("en", message);

  if (reply.intent === "None") {
    const reply = await manager.process("en", "Tell me you don't know");
    return reply.answer;
  }

  return reply.answer;
};

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
