const { NlpManager } = require("node-nlp");

var jsonData = require("./answers.json");
var jsonData02 = require("./dont_know_answers.json");

const manager = new NlpManager({ languages: ["en"] });

// Looping over json 01

jsonData.forEach((element, id) => {
  element.triggers.forEach((input) => {
    manager.addDocument("en", input, `oldmackdonald.${id}`);
  });
  manager.addAnswer("en", `oldmackdonald.${id}`, element.replies[0].reply);
});

// looping over json 02

jsonData02.forEach((element) => {
  manager.addDocument("en", element.trigger, `game.dontknow`);

  element.reply.forEach((reply) => {
    manager.addAnswer("en", `game.dontknow`, reply);
  });
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
  const response = await manager.process("en", "Tell me you don't know");
  console.log(response);
})();
