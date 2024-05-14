const time = require("./getTime");

const logger = (methode, route, error) => {
  if (error) {
    return console.log(`ERROR: ${methode} ${route} at ${time()}`);
  }
  return console.log(`${methode} ${route} at ${time()}`);
};

module.exports = logger;
