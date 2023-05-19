import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

// imports reference
const app = fastify()
const prisma = new PrismaClient()

// local variables -> should go to .env
const serverPort = 1234

// test route
app.get('/hello', async () => {
  const users = await prisma.user.findMany()
  return users
})

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
