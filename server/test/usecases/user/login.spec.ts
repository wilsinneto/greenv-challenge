import { UserData } from '@/entities'
import { CreateUser } from '@/usecases/user'
import { Login } from '@/usecases/user/login'
import { UserRepository } from '@/usecases/user/ports'
import { InMemoryUserRepository } from '@/usecases/user/repository'

describe('Login use case', () => {
  test('should login with the existing user', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const createUserUseCase: CreateUser = new CreateUser(repo)
    const loginUseCase: Login = new Login(repo)
    const name = 'any_name'
    const email = 'any@email.com'
    const password = 'abc'
    const cpf = '033.371.534-96'
    const phone = '(11)99000-3777'

    await createUserUseCase.perform({ name, email, password, cpf, phone })
    const user = loginUseCase.perform({ email, password })

    expect((await user).value).toEqual({ email, password })
  })

  test('should not login with no-existing user', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: Login = new Login(repo)
    const email = 'any@mail.com'
    const password = 'abc'

    const response = (await useCase.perform({ email, password })).value as Error

    expect(response.name).toEqual('InvalidEmailOrPasswordError')
  })

  test('should not login with invalid password', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const createUserUseCase: CreateUser = new CreateUser(repo)
    const loginUseCase: Login = new Login(repo)
    const name = 'any_name'
    const email = 'any@email.com'
    const password = 'abc'
    const cpf = '033.371.534-96'
    const phone = '(11)99000-3777'

    await createUserUseCase.perform({ name, email, password, cpf, phone })
    const response = (await loginUseCase.perform({ email, password: 'cba' })).value as Error

    expect(response.name).toEqual('InvalidEmailOrPasswordError')
  })
})
