import { CreateUser } from '@/usecases/user'
import { InMemoryUserRepository } from '@/usecases/user/repository'
import { CreateUserController } from '@/web-controllers/'
import { database } from './database'

export const makeCreateUserController = (): CreateUserController => {
  const inMemoryUserRepository = new InMemoryUserRepository(database)
  const createUserUseCase = new CreateUser(inMemoryUserRepository)
  const createUserController = new CreateUserController(createUserUseCase)

  return createUserController
}
