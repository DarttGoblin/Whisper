const mysql = require("mysql");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 7005;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.post("/", (req, res) => {
    const userData = req.body.userData;

    const connection = mysql.createConnection({
        host: 'sql7.freesqldatabase.com',
        user: 'sql7724126',
        password: 'V6PCDXyNdv',
        database: 'sql7724126'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            res.status(500).json({ success: false, error: 'Error connecting to the database, ' + err.stack });
            return;
        }
        console.log('Connected to database with connection id ' + connection.threadId);

        const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
        connection.query(checkEmailQuery, [userData.email], (error, emailResults) => {
            if (error) {
                console.log('Error checking email');
                console.log('Error ' + error.stack);
                res.status(500).json({ success: false, error: 'Error checking email' });
                return;
            }

            if (emailResults.length > 0) {
                console.log('Email already taken');
                res.status(400).json({ success: false, error: 'Email already taken' });
            } 
            else {
                const checkUsernameQuery = 'SELECT * FROM users WHERE username = ?';
                connection.query(checkUsernameQuery, [userData.username], (error, usernameResults) => {
                    if (error) {
                        console.log('Error checking username');
                        console.log('Error ' + error.stack);
                        res.status(500).json({ success: false, error: 'Error checking username' });
                        return;
                    }

                    if (usernameResults.length > 0) {
                        console.log('Username already taken');
                        res.status(400).json({ success: false, error: 'Username already taken' });
                    }
                    else {
                        const insertQuery = 'INSERT INTO users(name, email, gender, username, passw) VALUES(?, ?, ?, ?, ?)';
                        connection.query(insertQuery, [userData.name, userData.email, userData.gender, userData.username, userData.password], (error) => {
                            if (error) {
                                console.log("User data hasn't been saved");
                                console.log('Error ' + error.stack);
                                res.status(500).json({ success: false, error: error.stack });
                            } else {
                                console.log('User data has been saved!');
                                res.status(200).json({ success: true });
                            }
                        });
                    }
                });
            }
        });
    });
});

app.listen(port, () => console.log("Listening on port " + port));
