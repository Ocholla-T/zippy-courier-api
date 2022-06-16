/* Dependencies */
import 'module-alias/register'
import express, { Express } from 'express'
import cors from 'cors'
import 'dotenv/config'
import routes from '@routes/index'

const app: Express = express()

const port: number | undefined = Number(process.env.PORT)

/*
 *----------------------------------------------------------------
 * GLOBAL MIDDLEWARE
 *----------------------------------------------------------------
 */
app.use(cors())
app.use(express.json())

/*
 *-----------------------------------------------------------------
 * PASSPORT CONFIGURATION
 *-----------------------------------------------------------------
 */
import '@config/passport'

/*
 *------------------------------------------------------------------
 * API ROUTES
 *-------------------------------------------------------------------
 */
app.use('/api/v1', routes)

/*
 * Server listens on configurable PORT
 */
app.listen(port, (): void => {
  console.log(`App is running on port: ${port}`)
})
