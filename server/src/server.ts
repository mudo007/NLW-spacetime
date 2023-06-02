import 'dotenv/config'
import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import staticFastify from '@fastify/static'
import multipart from '@fastify/multipart'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'
import { uploadRoutes } from './routes/upload'
import { resolve } from 'node:path'

// imports reference
const app = fastify()
app.register(multipart)
app.register(staticFastify, {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads'
})

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
app.register(uploadRoutes)

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
