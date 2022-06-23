import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { pool } from '@config/database'
import 'dotenv/config'
import { user } from 'models/user'
import { issueJWT } from '@services/authUtils'

export async function createUser(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { username, password }: { username: string; password: string } = request.body
  const user_id: string = uuidv4()
  /*
   * hash password using bcrypt
   */
  bcrypt
    .hash(password, Number(process.env.BCRYPT_SALT_ROUNDS))
    /*
     *  ------------------------------
     *  CREATE USER
     *  ------------------------------
     *create user using email and hashedPassword and store in the database
     */
    .then((hashedPassword) => {
      pool
        .query(`INSERT INTO users(user_id, username, password) VALUES($1, $2, $3) RETURNING *`, [
          user_id,
          username.toLowerCase(),
          hashedPassword,
        ])
        .then((result) => {
          const user = result.rows[0]

          const jwt = issueJWT(user)

          response.status(201).json({ success: true, token: jwt.token, expiresIn: jwt.expires })
        })
        .catch((error) => {
          console.error(`DB_Error: ${(error as Error).stack}`)
          response.status(500).json({ message: 'error creating user' })
        })
    })
    .catch((error) => {
      console.error(`Hash_Error: ${(error as Error).stack}`)
      response.status(500).json({ hash_error: 'error hashing password' })
    })
}

export async function authenticateUser(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { username, password }: { username: string; password: string } = request.body

  pool
    .query('SELECT * FROM users')
    .then(async (result) => {
      const users = result.rows

      const foundUser: user = users.find((user) => user.username === username.toLowerCase())

      if (!foundUser) {
        response.status(401).json({ success: false, message: 'could not find user' })
      }

      const passwordMatch: boolean = await bcrypt.compare(password, foundUser.password)

      if (passwordMatch) {
        const jwt = issueJWT(foundUser)

        response.status(200).json({ success: true, token: jwt.token, expiresIn: jwt.expires })
      } else {
        response.status(401).json({ success: false, message: `username or password doesn't match` })
      }
    })
    .catch((error) => {
      console.error(`DB_Error: ${(error as Error).stack}`)
      response.status(500).json({ message: 'error creating user' })
    })
}
