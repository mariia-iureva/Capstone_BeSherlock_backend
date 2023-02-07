var fs = require("fs");
var util = require("util");

function enableLogging() {
  var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "a" });
  var log_stdout = process.stdout;

  console.log = function (d) {
    //
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
}

// export { enableLogging };
