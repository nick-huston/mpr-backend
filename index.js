/* start using `nodemon index.js` */

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

const SELECT_ALL_USERS_Q = 'SELECT * FROM users';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'toor',
  database: 'MakePapaRich'
});

connection.connect(err => {
  if(err) {
    return err;
  }
});

app.use(cors());

app.get('/', (req, res) => {
  res.send('go to /users to get users')
});

app.get('/users/add', (req, res) => {
  const { email, password, age, location, gender, profile_picture } = req.query;
  const INSERT_PRODUCTS_Q = `INSERT INTO users 
  (email, password, age, location, gender, profile_picture) values (
    '${email}', '${password}', ${age},
    '${location}', '${gender}', '${profile_picture}'
  )`
  connection.query(INSERT_PRODUCTS_Q, (err, results) => {
    if(err) {
      return res.send(err);
    } else {
      return res.send('successfully added user');
    }
  })
});

app.get('/users', (req, res) => {
  connection.query(SELECT_ALL_USERS_Q, (err, results) => {
    if(err) {
      return res.send(err)
    }
    else {
      return res.json({
        data: results
      })
    }
  });
});

app.listen(4000, () => {
  console.log('MPR server listening on port 4000');
});

