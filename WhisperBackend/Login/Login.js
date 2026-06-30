const mysql = require("mysql");
const express = require("express");
const cors = require("cors");

const app = express();
const server_port = 7003;
const hostname = "sql308.infinityfree.com";
const database = "if0_38323004_whisperdb";
const port = "3306";
const username = "if0_38323004";
const password = "MntCPR8RLl";

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.removeHeader('Permissions-Policy');
    next();
});

app.post("/", (req, res) => {
    console.log('hi')
    const usernameValue = req.body.usernameValue;
    const passwordValue = req.body.passwordValue;
    var userData;

    var connection = mysql.createConnection({
        host: hostname,
        user: username,
        password,
        database,
        port
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).json({ success: false, error: "Error connecting to the database"});
            return;
        }
        console.log('Connected to database with connection id ' + connection.threadId);

        connection.query('SELECT * FROM users WHERE username = ? AND passw = ?', [usernameValue, passwordValue], (error, results) => {
            if (error) {
                console.log('Error ' + error.stack);
                res.status(500).json({ success: false, error: error.stack });
                return;
            }
            if (results.length > 0) {
                userData = results[0];
                res.status(200).json({ success: true, userData });
            }
            else {res.status(200).json({ success: false, error: "No user has been found!" });}
        });
    });
});

app.listen(server_port, () => console.log("Listening on port " + server_port));
