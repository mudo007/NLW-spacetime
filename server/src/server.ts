import fastify from 'fastify'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'

// imports reference
const app = fastify()

//configure cors, let's leave it all oppen for now
app.register(cors, {
  origin:true
})

//register routes
app.register(memoriesRoutes)

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
