import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import z from 'zod'

export async function memoriesRoutes(app:FastifyInstance) {
//list memories
app.get('/memories', async () => {
  const memories = await prisma.memory.findMany({
    orderBy:{
      createdAt: 'asc',
    }
  })
  //As we do not need the entire text content for listing, we cut them and add ellipsis
  return memories.map(memory => {
    return {
      id: memory.id,
      converUrl: memory.coverUrl,
      excerpt: memory.content.substring(0, 115).concat('...')
    }
  })
})
//fetch a single memory
app.get('/memories/:id', async (request) => {
  //create a zod validation object
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })
  //parse the request objet with the zod validation object
  const {id} = paramsSchema.parse(request.params)
  
  //fetch memory from database
  const memory = await prisma.memory.findUniqueOrThrow({
    where:{
      //id: id
      id,
    },
  })
  
  return memory
  
})

//post a memory 
app.post('/memories', async (request) => {

  //create a zod validation object for the body
  const bodySchema = z.object({
    content: z.string(),
    coverUrl : z.string(),
    // zod can force defaut values and coerce "falsy" values into booleans
    isPublic: z.coerce.boolean().default(false),
  })
  //extract data from the body
  const { content, coverUrl, isPublic } = bodySchema.parse(request.body)
  
  //create it inside the database
  const memory = await prisma.memory.create({
    data:{
      content,
      coverUrl,
      isPublic,
      userId:'82462c2e-ba65-4ae7-976e-20d5e8681458'
    }
  })
  
  return memory
})
//update a memory 
app.put('/memories/:id', async (request) => {
    //create a zod validation object for the id
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    //parse the request objet with the zod validation object
    const {id} = paramsSchema.parse(request.params)
  //create a zod validation object
  const bodySchema = z.object({
    content: z.string(),
    coverUrl : z.string(),
    // zod can force defaut values and coerce "falsy" values into booleans
    isPublic: z.coerce.boolean().default(false),
  })
  //extract data from the body
  const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

  const memory = await prisma.memory.update({
    where:{
      id,
    },
    data:{
      content,
      coverUrl,
      isPublic,
    },
  })

  return memory
  
})

//delete a single memory
app.delete('/memories/:id', async (request) => {
  //create a zod validation object
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })
  //parse the request objet with the zod validation object
  const {id} = paramsSchema.parse(request.params)
  
  //fetch memory from database
  const memory = await prisma.memory.delete({
    where:{
      //id: id
      id,
    },
  })
})
}

