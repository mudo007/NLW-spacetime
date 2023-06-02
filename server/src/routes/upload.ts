import { FastifyInstance} from 'fastify'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { randomUUID } from 'node:crypto'
import { extname, resolve } from 'node:path'

// promisify transforms old functions into promises
const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits:{
        fileSize: 5_242_880, //5mb
      }
    })

    //return bad request if upliad fails
    if (!upload){
      return reply.status(400).send()
    }

    //validate mime type, only image or video
    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat){
      return reply.status(400).send()
    }

    //generate an unique file name
    const fileId = randomUUID()
    const fileExtension = extname(upload.filename)
    const fileName = fileId.concat(fileExtension)

    //streamed async upload
    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads/', fileName)
    )
    await pump(upload.file, writeStream)

    // Build the file url
    const rootUrl = request.protocol.concat('://').concat(request.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, rootUrl).toString()
    
    return {url: fileUrl}
  })
  
}