import { UserData } from '@/entities/user'
import { CreateUser } from '@/usecases/user'
import { UserRepository } from '@/usecases/user/ports'
import { InMemoryUserRepository } from '@/usecases/user/repository'

describe('Create user use case', () => {
  test('should add user with complete data', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: CreateUser = new CreateUser(repo)
    const name = 'any_name'
    const email = 'any@email.com'
    const password = 'abc'
    const cpf = '896.987.609-03'
    const phone = '(11)99000-3777'

    const response = await useCase.perform({ name, email, password, cpf, phone })
    const user = repo.findUserByEmail('any@email.com')

    expect((await user).name).toBe('any_name')
    expect(response.value.name).toBe('any_name')
  })

  test('should not add user with invalid email', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: CreateUser = new CreateUser(repo)
    const name = 'any_name'
    const invalidEmail = 'invalid_email'
    const password = 'abc'
    const cpf = '896.987.609-03'
    const phone = '(11)99000-3777'

    const response = (await useCase.perform({ name, email: invalidEmail, password, cpf, phone })).value as Error
    const user = await repo.findUserByEmail(invalidEmail)

    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidEmailError')
  })

  test('should not add user with invalid name', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: CreateUser = new CreateUser(repo)
    const invalidName = ''
    const email = 'any@email.com'
    const password = 'abc'
    const cpf = '896.987.609-03'
    const phone = '(11)99000-3777'

    const response = (await useCase.perform({ name: invalidName, email, password, cpf, phone })).value as Error
    const user = await repo.findUserByEmail(email)

    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidNameError')
  })

  test('should not add user with invalid password', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: CreateUser = new CreateUser(repo)
    const invalidName = 'any name'
    const email = 'any@email.com'
    const password = 'a'
    const cpf = '896.987.609-03'
    const phone = '(11)99000-3777'

    const response = (await useCase.perform({ name: invalidName, email, password, cpf, phone })).value as Error
    const user = await repo.findUserByEmail(email)

    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidPasswordError')
  })

  test('should not add user with invalid cpf', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: CreateUser = new CreateUser(repo)
    const name = 'any name'
    const email = 'any@email.com'
    const password = 'abc'
    const invalidCpf = '896.987.609-00'
    const phone = '(11)99000-3777'

    const response = (await useCase.perform({ name, email, password, cpf: invalidCpf, phone })).value as Error
    const user = await repo.findUserByEmail(email)

    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidCpfError')
  })

  test('should not add user with invalid phone', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: CreateUser = new CreateUser(repo)
    const name = 'any name'
    const email = 'any@email.com'
    const password = 'abc'
    const cpf = '896.987.609-03'
    const invalidPhone = '(11)99000-37779'

    const response = (await useCase.perform({ name, email, password, cpf, phone: invalidPhone })).value as Error
    const user = await repo.findUserByEmail(email)

    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidPhoneError')
  })
})
