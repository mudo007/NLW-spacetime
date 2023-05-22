import 'dotenv/config'
import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'

// imports reference
const app = fastify()

//configure cors, let's leave it all oppen for now
app.register(cors, {
  origin:true
})
app.register(jwt,{
  //should be a long random string for production
  secret:'spacetime'
})

//register routes
app.register(memoriesRoutes)
app.register(authRoutes)

// local variables -> should go to .env
const serverPort = 3333

// starts the server on localhost.
// we need to add host: '0.0.0.0' because of docker
app
  .listen({
    port: serverPort,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`HTTP server running on http://localhost:${serverPort}`)
  })
