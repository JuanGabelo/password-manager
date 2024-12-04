const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const PORT = 3000;

const { encrypt, decrypt } = require("./EncryptionHandler");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "root",
  database: "PasswordManager",
});

app.post("/addPassword", (req, res) => {
  const { password, title } = req.body;
  const hashPassword = encrypt(password);
  db.query(
    "INSERT INTO passwords (password, title, iv) VALUES (?,?,?)",
    [hashPassword.password, title, hashPassword.iv],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Sucess");
      }
    }
  );
});

app.get("/showPasswords", (req, res) => {
  db.query("SELECT * FROM passwords;", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/decryptPassword", (req, res) => {
  res.send(decrypt(req.body));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
