import { validationResult } from "express-validator/check";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

export const createUser = (req, res) => {
  const { first_name, last_name, email, phone_no, password } = req.body;
  console.log("----req:", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      client.query(
        "INSERT INTO users (first_name,last_name,email,phone_no,password) VALUES ($1, $2, $3, $4, $5)RETURNING *",
        [first_name, last_name, email, phone_no, hash],
        (error, user) => {
          if (error) {
            res.send({ err: error.detail });
          } else {
            jwt.sign(
              {
                id: user.rows[0].id,
                first_name: user.rows[0].first_name,
                last_name: user.rows[0].last_name,
                email: user.rows[0].email,
                phone_no: user.rows[0].phone_no,
                password: user.rows[0].password
              },
              process.env.SECKRET_KEY,
              { expiresIn: "1h" },
              (err, token) => {
                if (err) {
                  res.send({ msg: "Unable to encode token" });
                } else {
                  res.status(201).send({
                    success: true,
                    msg: "user added successfully",
                    token,
                    expiresIn: "24hours",
                    userId: user.rows[0].id
                  });
                }
              }
            );
          }
        }
      );
    });
  }
};

export const userLogin = (req, res) => {
  const { email, password } = req.body;
  console.log(">>>>>>>>>>>>:", req.body);
  client.query(
    `select * from users WHERE email = $1`,
    [email],
    (error, users) => {
      if (error) {
        res.status(400).send({ success: false, error: error.message });
      }
      console.log(">>>>>>>>>>>>:", users);
      const user = users.rows[0];
      console.log(">>>>>>>>>>>>:", user);
      if (!user) {
        res.send({
          success: false,
          msg: "Incorrect email or password"
        });
      }
      console.log("****", user);
      bcrypt.compare(password, user.password, (err, response) => {
        console.log(response);
        if (err) {
          res.send({ success: false, error: error.message });
        }
        if (response === true) {
          jwt.sign(
            { id: user.id, email: user.email, password: user.password },
            process.env.SECKRET_KEY,
            { expiresIn: "1h" },
            (err, token) => {
              console.log(token);
              if (err) {
                res.status(400).send({ success: false, error: error.message });
              } else {
                res.send({
                  msg: "login successfully",
                  token,
                  expiresIn: "24hours"
                });
              }
            }
          );
        }
      });
    }
  );
};

export const getUser = (req, res) => {
  //const userId = parseInt(req.params.id)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    client.query(
      `SELECT * FROM users WHERE id = ${req.decoded.id}`,
      (err, user) => {
        if (err) {
          res.send(err);
          console.Console(err);
        } else {
          console.log("-------", user.rows[0]);
          res.status(200).send(user.rows[0]);
        }
      }
    );
  }
};

export const getAllUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    client.query(`SELECT * FROM users`, (err, users) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(users.rows);
      }
    });
  }
};
