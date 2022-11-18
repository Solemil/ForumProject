const app = require('./app');
const conn = require('./db');

app.listen(3000, console.log("Server listening on port 3000"));

conn.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Connection to database established");
});
