import { prisma } from '@/external/repositories/prisma/helper'
import { PrismaUserRepository } from '@/external/repositories/prisma/prisma-user.repository'
import { Login } from '@/usecases/user/login'
import { InMemoryUserRepository } from '@/usecases/user/repository'
import { LoginController } from '@/web-controllers'
import jwt from 'jsonwebtoken'
import { database } from '@/main/database'

export const makeLoginController = (): LoginController => {
  const userRepository = process.env.NODE_ENV === 'test' ? new InMemoryUserRepository(database) : new PrismaUserRepository(prisma)
  const createUserUseCase = new Login(userRepository, jwt)
  const createUserController = new LoginController(createUserUseCase)

  return createUserController
}
