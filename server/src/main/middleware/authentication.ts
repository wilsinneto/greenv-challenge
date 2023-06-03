import { UserData } from '@/entities/user'
import { PrismaUserRepository } from '@/external/repositories/prisma'
import { prisma } from '@/external/repositories/prisma/helper'
import { UserNotAuthorization } from '@/main/routes/errors'
import { serverError } from '@/web-controllers/util/http-helper'
import { NextFunction, Request, Response } from 'express'
import { decode } from 'jsonwebtoken'

export async function authentication (request: Request, response: Response, next: NextFunction) {
  try {
    const [, token] = request.headers?.authorization?.split(' ')

    if (!token) return response.status(404).send(new UserNotAuthorization())

    const user = decode(token) as UserData

    if (!user) return response.status(404).send(new UserNotAuthorization())

    const userRepository = new PrismaUserRepository(prisma)
    const isExists = await userRepository.exists(user)

    if (!isExists) return response.status(404).send(new UserNotAuthorization())
  } catch (error) {
    console.log('Authentication error', error)
    return serverError(error)
  }

  next()
}
