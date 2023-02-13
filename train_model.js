const { NlpManager } = require("node-nlp");

var oldMacJsonData = require("./answers_data/old_macdonald_game.json");
var dontKnowData = require("./answers_data/dont_know_answers.json");
var gameSelectionData = require("./answers_data/game_selection.json");
var wrongAnswersData = require("./answers_data/game_wrong_answers.json");
var riddleGameData = require("./answers_data/riddle_game.json");
var tipsData = require("./answers_data/tips.json");

const manager = new NlpManager({ languages: ["en"] });

// Looping over json 01

oldMacJsonData.forEach((element, id) => {
  element.triggers.forEach((input) => {
    manager.addDocument("en", input, `oldmackdonald.${id}`);
  });
  manager.addAnswer("en", `oldmackdonald.${id}`, element.replies[0].reply);
});

// looping over json 02 (don't know answers)

dontKnowData.forEach((element) => {
  manager.addDocument("en", element.trigger, `game.dontknow`);

  element.reply.forEach((reply) => {
    manager.addAnswer("en", `game.dontknow`, reply);
  });
});

// looping over json 03 (game selection answers)

gameSelectionData.forEach((element) => {
  element.trigger.forEach((input) => {
    manager.addDocument("en", input, `game.select`);
  });
  manager.addAnswer("en", `game.select`, element.reply);
});

// looping over json 04 (wrong answers)

wrongAnswersData.forEach((element) => {
  element.trigger.forEach((input) => {
    manager.addDocument("en", input, `game.wrong`);
  });
  manager.addAnswer("en", `game.wrong`, element.reply);
});

// looping over riddle game  data

riddleGameData.forEach((element, id) => {
  element.trigger.forEach((input) => {
    manager.addDocument("en", input, `riddlegame.${id}`);
  });
  manager.addAnswer("en", `riddlegame.${id}`, element.reply);
});

tipsData.forEach((element, id) => {
  manager.addDocument("en", element.trigger, `tips.${id}`);
  manager.addAnswer("en", `tips.${id}`, element.reply);
});

// // //Adding don't know lines
// manager.addDocument("en", "Tell me you don't know", "game.dontknow");

// // // Answers for don't know
// manager.addAnswer("en", "game.dontknow", "I don't know, I'm a cactus");
// manager.addAnswer("en", "game.dontknow", "No idea");

// Adds the utterances and intents for the NLP
manager.addDocument("en", "goodbye for now", "greetings.bye");
manager.addDocument("en", "bye bye take care", "greetings.bye");
manager.addDocument("en", "okay see you later", "greetings.bye");
manager.addDocument("en", "bye for now", "greetings.bye");
manager.addDocument("en", "i must go", "greetings.bye");
manager.addDocument("en", "hello", "greetings.hello");
manager.addDocument("en", "hi", "greetings.hello");
manager.addDocument("en", "howdy", "greetings.hello");

// Train also the NLG
manager.addAnswer("en", "greetings.bye", "Till next time");
manager.addAnswer("en", "greetings.bye", "see you soon!");
manager.addAnswer("en", "greetings.hello", "Hey there!");
manager.addAnswer("en", "greetings.hello", "Greetings!");

// Train and save the model.
// use this command to train the model: node train_model.js
(async () => {
  await manager.train();
  manager.save("./model.nlp", true);
  const response = await manager.process("en", "love");
  console.log(response);
})();
