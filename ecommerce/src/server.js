const app = require("./app");
const {
  app: { port },
} = require("./configs/config.mongodb");

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// process.on("SIGINT", () => {
//   server.close(() => {
//     console.log("Server closed");
//   });
// });
