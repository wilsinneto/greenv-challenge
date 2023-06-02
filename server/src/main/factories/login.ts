import { prisma } from '@/external/repositories/prisma/helper'
import { PrismaUserRepository } from '@/external/repositories/prisma/prisma-user.repository'
import { Login } from '@/usecases/user/login'
import { LoginController } from '@/web-controllers'
import jwt from 'jsonwebtoken'

export const makeLoginController = (): LoginController => {
  const inMemoryUserRepository = new PrismaUserRepository(prisma)
  const createUserUseCase = new Login(inMemoryUserRepository, jwt)
  const createUserController = new LoginController(createUserUseCase)

  return createUserController
}
