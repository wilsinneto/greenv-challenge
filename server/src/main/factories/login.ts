import { database } from '@/main/database'
import { Login } from '@/usecases/user/login'
import { InMemoryUserRepository } from '@/usecases/user/repository'
import { LoginController } from '@/web-controllers'
import jwt from 'jsonwebtoken'

export const makeLoginController = (): LoginController => {
  const inMemoryUserRepository = new InMemoryUserRepository(database)
  const createUserUseCase = new Login(inMemoryUserRepository, jwt)
  const createUserController = new LoginController(createUserUseCase)

  return createUserController
}
