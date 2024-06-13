console.log("Starting server.js");
const app = require("./app");
const {
  app: { port },
} = require("./configs/config.mongodb");

console.log("Port: ", port);
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// process.on("SIGINT", () => {
//   server.close(() => {
//     console.log("Server closed");
//   });
// });
