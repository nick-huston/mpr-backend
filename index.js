/* start using `nodemon index.js` */

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

const SELECT_ALL_USERS_Q = 'SELECT user_id, bracket FROM users';

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
  res.send('no data to be fetched')
});

/* Add user */
app.get('/users/add', (req, res) => {
  const { email, password } = req.query;
  const INSERT_PRODUCTS_Q = `INSERT INTO users 
    (email, password, balance) values ('${email}', SHA1('${password}'), 3000)`
  connection.query(INSERT_PRODUCTS_Q, (err, results) => {
    if(err) {
      return res.send('error');
    } else {
      return res.send('successfully added user');
    }
  });
});

/* Add/update info for user */

/* Fetch all users */
app.get('/users', (req, res) => {
  let Q = SELECT_ALL_USERS_Q;
  if (Object.is(req.query, {})) {
    let { exclude } = req.query;
    Q += ` WHERE email != '${exclude}'`
  }
  connection.query(Q, (err, results) => {
    if(err) {
      return res.send(err)
    } else {
      return res.json({
        data: results,
        query: Q
      });
    }
  });
});

/* Fetch balance for user */
app.get('/balance', (req, res) => {
  const { email } = req.query;
  const GET_BALANCE_Q = `SELECT balance FROM users WHERE
    email='${email}'`;
  connection.query(GET_BALANCE_Q, (err, results) => {
    if(err) {
      return res.send(err);
    } else {
      return res.send({
        data: results[0].balance
      });
    }
  });
});

/* Attempt to login */
app.get('/login', (req, res) => {
  const { email, password } = req.query;
  const TRY_LOGIN_Q = `SELECT user_id FROM users WHERE
    email='${email}' AND password=SHA1('${password}')`;
  connection.query(TRY_LOGIN_Q, (err, results) => {
    if(err) {
      return res.send(err);
    } else {
      return res.send({
        data: results
      });
    }
  });
});

/* Transfer funds */
app.get('/donate', (req, res) => {
  let { sender_email, receiver_id, amount, charity } = req.query;
  if (charity === '') charity = `charity${Math.floor(Math.random() * Math.floor(3))+1}`
  const SET_SENDER_BALANCE_Q = `UPDATE users SET 
    balance = balance - ${amount}, bracket = bracket + 1 WHERE email = '${sender_email}'`;
  const SET_RECEIVER_BALANCE_Q = `UPDATE users SET
    balance = balance + ${amount * .99} WHERE user_id = ${receiver_id}`;
  const SET_BUCKET_BALANCE_Q = `UPDATE users SET
    balance = balance + ${amount * .01} WHERE email = 'bucket'`;
  const SET_CHARITY_VOTES_Q = `UPDATE users SET
    balance = balance + ${amount} WHERE email = '${charity}'`;
  const CREATE_TRANSACTION_Q = `INSERT INTO transactions (sender_id, receiver_id, amount, timestamp) VALUES (
    (select user_id from users where email='${sender_email}'),
    ${receiver_id}, ${amount}, NOW())`;
  connection.query(SET_CHARITY_VOTES_Q, (err, results) => {
    if(err) {
      return res.send(err);
    }
  });
  connection.query(SET_SENDER_BALANCE_Q, (err, results) => {
    if(err) {
      return res.send(err);
    }
  });
  connection.query(SET_BUCKET_BALANCE_Q, (err, results) => {
    if(err) {
      return res.send(err);
    }
  });
  connection.query(CREATE_TRANSACTION_Q, (err, results) => {
    if(err) {
      return res.send(err);
    }
  });
  connection.query(SET_RECEIVER_BALANCE_Q, (err, results) => {
    if(err) {
      return res.send(err);
    } else {
      return res.send('funds transferred');
    }
  });
})

/* Update account info */
app.get('/users/update', (req, res) => {
  let UPDATE_USER_Q = `UPDATE users SET `;
  let { user_id, email, password, age, location, gender, profile_picture } = req.query;
  [user_id, email, password, age, location, gender, profile_picture].forEach(item => {
    if (item !== undefined) {
      UPDATE_USER_Q 
    }
  })
})

app.listen(4000, () => {
  console.log('MPR server listening on port 4000');
});

