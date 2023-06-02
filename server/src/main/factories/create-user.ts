import { CreateUser } from '@/usecases/user'
import { CreateUserController } from '@/web-controllers/'
import { PrismaUserRepository } from '@/external/repositories/prisma'
import { prisma } from '@/external/repositories/prisma/helper'
import { InMemoryUserRepository } from '@/usecases/user/repository'
import { database } from '@/main/database'

export const makeCreateUserController = (): CreateUserController => {
  const userRepository = process.env.NODE_ENV === 'test' ? new InMemoryUserRepository(database) : new PrismaUserRepository(prisma)
  const createUserUseCase = new CreateUser(userRepository)
  const createUserController = new CreateUserController(createUserUseCase)

  return createUserController
}
