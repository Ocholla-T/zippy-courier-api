import express from 'express'
import { createUser, authenticateUser } from '@controller/user_controller'

const Router: express.Router = express.Router()

Router.post('/users/register', createUser)
Router.post('/users/auth', authenticateUser)
export default Router
