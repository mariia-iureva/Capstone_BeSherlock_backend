const { enableLogging } = require("./logging");
// import { enableLogging } from "./logging.js";

// var fs = require("fs");
// var util = require("util");

const express = require("express");
const cors = require("cors");
// require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();
const { NlpManager } = require("node-nlp");

manager = new NlpManager();

app.use(cors());
app.use(express.json()); // JSON encoded body

// Loading nlp model for answers:
manager.load("./model.nlp");

enableLogging;

app.get("/", function (req, res) {
  res.send("Hi! I am Masha's game ChatBot.");
});

app.post("/postMessage", async function (req, res) {
  let message = req.body.message.toLowerCase();
  console.log("[INFO](" + timestamp + ") Msg from User: " + message);
  // console.log("message from User:" + message);

  const reply = await manager.process("en", message);

  if (reply.intent === "None") {
    const reply = await manager.process("en", "Tell me you don't know");
    res.send({ bot_message: reply.answer });
    console.log("[INFO](" + timestamp + ") Msg from Bot: " + reply.answer);
    return;
  }

  // console.log(reply);
  console.log("[INFO](" + timestamp + ") Msg from Bot: " + reply.answer);
  res.send({ bot_message: reply.answer });
});

// function getReply(message) {
//   let found = null;

//   fastAnswers.forEach((fastAnswer) => {
//     //For every fast answer
//     fastAnswer.triggers.forEach((trigger) => {
//       //Check among all triggers
//       let regex = new RegExp("\\b" + trigger + "\\b", "gi"); //Search global and case insenstive
//       let regexResult = message.match(regex);

//       //console.log("Regex result: " + regexResult);

//       if (regexResult != null && !found) {
//         //If RegEx matches and wasn't previously found
//         let rnd = Math.floor(Math.random() * fastAnswer.replies.length + 0);
//         found = fastAnswer.replies[rnd];
//         //return fastAnswer.replies[rnd]; //Can't do this with forEach (ahw man, that sucks), see comment above, substitute forEach with for
//       }
//     });
//   });

//   return found;
// }

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
