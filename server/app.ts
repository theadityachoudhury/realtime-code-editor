import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { startServer } from './Utils'
import Auth from './Routes/Auth'
import Code from './Routes/Code'
import cookieParser from 'cookie-parser'
import config from './Config'

//Server Initialization
const app = express()

//Server Configurations
app.use(
  cors({
    credentials: true,
    origin: [config.FRONTEND_URL],
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//API routes starts here

//Default routes
app.use((req: Request, res: Response, next: NextFunction) => {
  // res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With, Content-Type, Accept',
  )
  next()
})
app.get('/', (req: Request, res: Response) => {
  res.send({
    data: {
      appName: 'CodeSync | Backend',
      developedBy: 'Aditya Choudhury',
      maintainedBy: 'Aditya Choudhury',
      version: '1.0.0.0',
    },
    success: true,
  })
})

//Health check API
app.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({
    status: 200,
    message: 'Server is up and running',
  })
})

//App Routes
app.use('/api/auth', Auth)
app.use('/api/code', Code);

// Default not-found route
app.use((req: Request, res: Response) => {
  res.send({
    reason: 'invalid-request',
    message:
      'The endpoint you wanna reach is not available! Please check the endpoint again',
    success: false,
  })
})

startServer(app)
