const { NlpManager } = require("node-nlp");

var jsonData = require("./answers.json");

const manager = new NlpManager({ languages: ["en"] });
// Looping over json

jsonData.forEach((element, id) => {
  element.triggers.forEach((input) => {
    manager.addDocument("en", input, `greetings.${id}`);
  });
  manager.addAnswer("en", `greetings.${id}`, element.replies[0].reply);
});

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
(async () => {
  await manager.train();
  manager.save("./model.nlp", true);
  const response = await manager.process("en", "cow");
  console.log(response);
})();
