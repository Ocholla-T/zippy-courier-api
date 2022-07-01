import express from 'express'
import { createUser, authenticateUser } from '@controller/user_controller'
import passport from 'passport'

const Router: express.Router = express.Router()

Router.post('/users/register', createUser)
Router.post('/users/login', authenticateUser)

export default Router
