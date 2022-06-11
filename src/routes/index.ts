import express, { Request, Response } from 'express'
import { createUser } from '@controller/user_controller'
import { QueryResult } from 'pg'

const Router: express.Router = express.Router()

Router.post('/users', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body

  const userID: Promise<string> = await createUser(username, password)

  res.json(userID)
})
export default Router
