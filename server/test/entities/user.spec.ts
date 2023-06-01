import { User } from '@/entities'
import { InvalidNameError } from '@/entities/errors'
import { left } from '@/shared'

describe('User domain entity', () => {
  test('should not create user with invalid e-mail address', () => {
    const invalidEmail = 'invalid_email'

    const error = User.create({ name: 'any_name', email: invalidEmail, password: 'abc', cpf: '896.987.609-03' }).value as Error

    expect(error.name).toEqual('InvalidEmailError')
    expect(error.message).toEqual('Invalid email: ' + invalidEmail + '.')
  })

  test('should not create user with invalid password', () => {
    const invalidPassword = 'a'

    const error = User.create({ name: 'any_name', email: 'any@mail.com', password: invalidPassword, cpf: '896.987.609-03' }).value as Error

    expect(error.name).toEqual('InvalidPasswordError')
    expect(error.message).toEqual('Invalid password: ' + invalidPassword + '.')
  })

  test('should not create user with invalid name (too few characters)', () => {
    const invalidName = 'O        '

    const error = User.create({ name: invalidName, email: 'any@mail.com', password: 'abc', cpf: '896.987.609-03' }).value as Error

    expect(error.name).toEqual('InvalidNameError')
  })

  test('should not create user with invalid name (too many characters)', () => {
    const invalidName = 'O'.repeat(257)

    const error = User.create({ name: invalidName, email: 'any@mail.com', password: 'abc', cpf: '896.987.609-03' })

    expect(error).toEqual(left(new InvalidNameError(invalidName)))
  })

  test('should not create user with invalid cpf', () => {
    const invalidCpf = '000.000.000-00'

    const error = User.create({ name: 'any_name', email: 'any@mail.com', password: 'abc', cpf: invalidCpf }).value as Error

    expect(error.name).toEqual('InvalidCpfError')
    expect(error.message).toEqual('Invalid cpf: ' + invalidCpf + '.')
  })

  test('should create user with valid data', () => {
    const validName = 'any_name'
    const validEmail = 'any@mail.com'
    const validPassword = 'abc'
    const validCpf = '896.987.609-03'

    const user: User = User.create({ name: validName, email: validEmail, password: validPassword, cpf: validCpf }).value as User

    expect(user.name.value).toEqual(validName)
    expect(user.email.value).toEqual(validEmail)
  })
})
