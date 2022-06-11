/* Dependencies */
import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import 'module-alias/register'
import routes from '@routes/index'

const app: Express = express()

const port: number | undefined = Number(process.env.PORT)

/* Middleware */
app.use(cors())
app.use(express.json())

/*Routes */
app.use('/api/v1', routes)

app.listen(port, (): void => {
  console.log(`App is running on port: ${port}`)
})
