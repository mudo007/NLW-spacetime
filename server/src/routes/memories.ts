import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import z from 'zod'
import { request } from "http";

export async function memoriesRoutes(app:FastifyInstance) {
  //global stuff for these routes
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify();
  })

//list memories
app.get('/memories', async (request) => {
  const memories = await prisma.memory.findMany({
    where: {
      userId: request.user.sub,
    },
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
app.get('/memories/:id', async (request, reply) => {
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

  //short circuit with unauthorized if the user does not own the memory
  if (!memory.isPublic &&  memory.userId !== request.user.sub){
    return reply.status(401).send()
  }
  
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
      userId: request.user.sub,
    }
  })
  
  return memory
})
//update a memory 
app.put('/memories/:id', async (request, reply) => {
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

  //check if the memory exists
  let memory = await prisma.memory.findUniqueOrThrow({
    where : {
      id,
    }
  })

  //short circuit with unauthorized if the user does not own the memory
  if (memory.userId !== request.user.sub){
    return reply.status(401).send()
  }

  memory = await prisma.memory.update({
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
app.delete('/memories/:id', async (request, reply) => {
  //create a zod validation object
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })
  //parse the request objet with the zod validation object
  const {id} = paramsSchema.parse(request.params)

  //check if the memory exists
  let memory = await prisma.memory.findUniqueOrThrow({
    where : {
      id,
    }
  })

  //short circuit with unauthorized if the user does not own the memory
  if (memory.userId !== request.user.sub){
    return reply.status(401).send()
  }
  
  //fetch memory from database
  memory = await prisma.memory.delete({
    where:{
      //id: id
      id,
    },
  })
})
}

