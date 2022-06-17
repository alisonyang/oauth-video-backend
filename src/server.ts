import { connectToDB } from './db';
import app from './app';

connectToDB();

const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem")
};
const httpsServer = https.createServer(options, app);
// app.listen(4000, () => {
//   console.log("Server Starrted");
// })

httpsServer.listen(4000, () => {
  console.log("Server Starrted");
})
