import { UserData } from '@/entities/user'
import { InMemoryUserRepository } from '@/usecases/user/repository'

describe('In memory User repository', () => {
  test('should return null if user is not found', async () => {
    const users: UserData[] = []
    const sut = new InMemoryUserRepository(users)
    const user = await sut.findUserByEmail('any@mail.com')
    expect(user).toBeNull()
  })

  test('should return user if it is found in the repository', async () => {
    const users: UserData[] = []
    const name = 'any_name'
    const email = 'any@mail.com'
    const password = 'abc'
    const cpf = '896.987.609-03'
    const phone = '(11)99000-3777'
    const sut = new InMemoryUserRepository(users)
    await sut.add({ name, email, password, cpf, phone })
    const user = await sut.findUserByEmail('any@mail.com')
    expect(user.name).toBe('any_name')
  })

  test('should return all users in the repository', async () => {
    const users: UserData[] = [
      { name: 'any_name', email: 'any@mail.com', password: 'abc', cpf: '896.987.609-03', phone: '(11)99000-3777' },
      { name: 'second_name', email: 'second@mail.com', password: 'rty', cpf: '033.371.534-96', phone: '(11)99000-3777' }
    ]

    const sut = new InMemoryUserRepository(users)
    const returnedUsers = sut.findAllUsers()

    expect((await returnedUsers).length).toBe(2)
  })
})
