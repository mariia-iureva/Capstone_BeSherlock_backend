// these are for logging and working wth files
const fs = require("fs");
const util = require("util");

// these are for express server
const express = require("express");
const cors = require("cors");

// const bodyParser = require("body-parser");

// this one is for env secret config
require("dotenv").config();

// this will also go to secret env
const PORT = process.env.PORT || 3001;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

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

app.get("/getLogs", function (req, res) {
  fs.readFile("./debug.log", function (err, data) {
    if (err) {
      throw err;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
    return;
  });
});

app.post("/postMessage", async function (req, res) {
  let message = req.body.message;
  let step = req.body.step;

  const reply = await getReply(message, step);
  console.log("[INFO](" + timestamp + ") Msg from Bot: " + reply.reply);
  res.send({ bot_message: reply.reply, step: reply.step });
});

app.post("/postMessageFromTelegram", async (req, res) => {
  const previousStep = telegramMapping[req.body.message.chat.id];
  const { reply, step } = await getReply(req.body.message.text, previousStep);
  telegramMapping[req.body.message.chat.id] = step;
  console.log("[INFO](" + timestamp + ") Msg from Bot: " + reply);

  // return the same message back
  bot.sendMessage(req.body.message.chat.id, reply);
  return res.status(200).json();
});

const telegramMapping = {};

// const STEPS = {
//   0: "oldmackdonald.0",
//   1: "oldmackdonald.1",
//   2: "oldmackdonald.2",
//   3: "oldmackdonald.3",
//   4: "oldmackdonald.4",
//   5: "oldmackdonald.5",
//   6: "oldmackdonald.6",
//   7: "oldmackdonald.7",
//   8: "oldmackdonald.8",
//   9: "oldmackdonald.9",
//   10: "oldmackdonald.10",
//   11: "oldmackdonald.11",
// };

const STEPS2 = {
  "oldmackdonald.0": 0,
  "oldmackdonald.1": 1,
  "oldmackdonald.2": 2,
  "oldmackdonald.3": 3,
  "oldmackdonald.4": 4,
  "oldmackdonald.5": 5,
  "oldmackdonald.6": 6,
  "oldmackdonald.7": 7,
  "oldmackdonald.8": 8,
  "oldmackdonald.9": 9,
  "oldmackdonald.10": 10,
  "oldmackdonald.11": 11,
};

const getReply = async (message, previousStep) => {
  const reply = await manager.process("en", message);
  console.log("previousStep: " + previousStep);
  previousStep = Number(previousStep);

  if (previousStep === undefined) {
    previousStep = -1;
  }

  if (reply.intent === "None") {
    const reply = await manager.process("en", "Tell me you don't know");
    return { reply: reply.answer, step: previousStep };
  }

  const currentStep = STEPS2[reply.intent];
  console.log("currentStep: " + currentStep);

  if (currentStep < previousStep) {
    return { reply: "We've already been there", step: previousStep };
  }

  if (currentStep === previousStep) {
    return { reply: "We're there now", step: previousStep };
  }

  if (currentStep - previousStep - 1 > 0) {
    console.log(
      `WTF: ${currentStep} - ${previousStep} - 1 = ${
        currentStep - previousStep - 1
      } > 0?`
    );
    return { reply: "It's too early to go there yet", step: previousStep };
  }

  return { reply: reply.answer, step: currentStep };
};

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
