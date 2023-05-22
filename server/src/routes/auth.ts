import { FastifyInstance } from "fastify";
import axios from 'axios'
import {z} from 'zod'
import { prisma } from "../lib/prisma";
import { userInfo } from "os";

export async function authRoutes(app: FastifyInstance){
  app.post('/register', async (request) => {
    const bodySchema = z.object({
      code: z.string(),
    })
    const { code } = bodySchema.parse(request.body)

    const accessTokenResponse = await axios.post(
      //url
      'https://github.com/login/oauth/access_token',
      //request body
      null,
      {
        //queryString parameters
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        //request headers
        headers: {
          Accept: 'application/json',
        },
      }
    )

    const { access_token:accessToken} = accessTokenResponse.data

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })


    //user validation
    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string().nullable().transform(value => value ?? ''),
      avatar_url: z.string().url(),
    })

    const githubUserInfo = userSchema.parse(userResponse.data)


    //create user in our Database in case it does not exist yer
    let user 
    //TODO: this ugly database coupled code block should be refactored with ports and adapters
    {
      user= await prisma.user.findUnique({
        where: {
          githubId: githubUserInfo.id,
        }
      })
      if (!user){
        user = await prisma.user.create({
          data:{
            githubId: githubUserInfo.id,
            avatarUrl: githubUserInfo.avatar_url,
            name: githubUserInfo.name,
            githubLogin: githubUserInfo.login,
          },
        })
      }
    }

    //create a jwt with the public user information
    const userJwt = app.jwt.sign({
      //public section
      name: user.name,
      avatarUrl: user.avatarUrl,  
    }, {
      //jwt specific stuff
      sub: user.id,
      //TODO: make it an env variable to have different values for dev and prod
      expiresIn: '30 days',
    }) 

    return  {
      userJwt,
    }

  })
}