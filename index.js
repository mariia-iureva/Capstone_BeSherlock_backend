const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json()); // JSON encoded body

// ---------- FAST ANSWERS ----------
const fs = require("fs");
const fastAnswers = JSON.parse(fs.readFileSync("./answers.json", "utf8"));
// ---------- FAST ANSWERS END ----------

app.get("/", function (req, res) {
  res.send("Hi! I am a ChatBot.");
});
app.post("/postMessage", function (req, res) {
  let message = req.body.message.toLowerCase();
  let reply = getReply(message);
  // console.log(reply);

  if (!reply) {
    res.send({ bot_message: "I don't understand, try one more time!" });
    return;
  }
  res.send({ bot_message: reply.reply });
});

function getReply(message) {
  let found = null;

  fastAnswers.forEach((fastAnswer) => {
    //For every fast answer
    fastAnswer.triggers.forEach((trigger) => {
      //Check among all triggers
      let regex = new RegExp("\\b" + trigger + "\\b", "gi"); //Search global and case insenstive
      let regexResult = message.match(regex);

      //console.log("Regex result: " + regexResult);

      if (regexResult != null && !found) {
        //If RegEx matches and wasn't previously found
        let rnd = Math.floor(Math.random() * fastAnswer.replies.length + 0);
        found = fastAnswer.replies[rnd];
        //return fastAnswer.replies[rnd]; //Can't do this with forEach (ahw man, that sucks), see comment above, substitute forEach with for
      }
    });
  });

  return found;
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
