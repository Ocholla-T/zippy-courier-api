import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { pool } from '@config/database'
import 'dotenv/config'
import { user } from 'models/user'
import { issueJWT } from '@services/authUtils'
import { validateRegister, validateLogin } from '@services/validate'

export async function createUser(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  /*
   * create unique user_id
   */
  const user_id: string = uuidv4()

  try {
    /*
     *----------------------------------
     *VALIDATE USER
     *--------------------------------
     */
    const { email, password }: { email: string; password: string } = await validateRegister(
      request.body,
    )

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
            email.toLowerCase(),
            hashedPassword,
          ])
          .then((result) => {
            response.status(201).json({ success: true, message: 'user created successfully' })
          })
          .catch((error) => {
            console.error(`DB_Error: ${(error as Error).stack}`)
            response.status(500).json({ success: false, message: 'error creating user' })
          })
      })
      .catch((error) => {
        console.error(`Hash_Error: ${(error as Error).stack}`)
        response.status(500).json({ success: false, hash_error: 'error hashing password' })
      })
  } catch (error: any) {
    response.status(400).json({ success: false, errors: error.details })
  }
}

export async function authenticateUser(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    /*
     *----------------------------------
     *VALIDATE USER
     *--------------------------------
     */
    const { email, password }: { email: string; password: string } = await validateLogin(
      request.body,
    )

    pool
      .query('SELECT * FROM users')
      .then(async (result) => {
        const users = result.rows

        const foundUser: user = users.find((user) => user.username === email.toLowerCase())

        if (!foundUser) {
          response.status(401).json({ success: false, message: 'could not find user' })
        }

        const passwordMatch: boolean = await bcrypt.compare(password, foundUser.password)

        if (passwordMatch) {
          const jwt = issueJWT(foundUser)

          response.status(200).json({ success: true, token: jwt.token, expiresIn: jwt.expires })
        } else {
          response.status(401).json({ success: false, message: `email or password doesn't match` })
        }
      })
      .catch((error) => {
        console.error(`DB_Error: ${(error as Error).stack}`)
        response.status(500).json({ message: 'error logging user in' })
      })
  } catch (error: any) {
    response.status(400).json({ success: false, errors: error.details })
  }
}
