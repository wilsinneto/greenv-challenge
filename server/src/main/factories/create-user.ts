import { CreateUser } from '@/usecases/user'
import { CreateUserController } from '@/web-controllers/'
import { PrismaUserRepository } from '@/external/repositories/prisma'
import { prisma } from '@/external/repositories/prisma/helper'

export const makeCreateUserController = (): CreateUserController => {
  const inMemoryUserRepository = new PrismaUserRepository(prisma)
  const createUserUseCase = new CreateUser(inMemoryUserRepository)
  const createUserController = new CreateUserController(createUserUseCase)

  return createUserController
}
