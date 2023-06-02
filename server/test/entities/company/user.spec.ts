import { Company } from '@/entities/company'
import { InvalidNameError } from '@/entities/errors'
import { left } from '@/shared'

describe('Company domain entity', () => {
  test('should not create company with invalid e-mail address', () => {
    const invalidEmail = 'invalid_email'

    const error = Company.create({ name: 'any_name', email: invalidEmail, cnpj: '46.227.269/0001-06', phone: '(11)99000-3777' }).value as Error

    expect(error.name).toEqual('InvalidEmailError')
    expect(error.message).toEqual('Invalid email: ' + invalidEmail + '.')
  })

  test('should not create company with invalid name (too few characters)', () => {
    const invalidName = 'O        '

    const error = Company.create({ name: invalidName, email: 'any@mail.com', cnpj: '46.227.269/0001-06', phone: '(11)99000-3777' }).value as Error

    expect(error.name).toEqual('InvalidNameError')
  })

  test('should not create company with invalid name (too many characters)', () => {
    const invalidName = 'O'.repeat(257)

    const error = Company.create({ name: invalidName, email: 'any@mail.com', cnpj: '46.227.269/0001-06', phone: '(11)99000-3777' })

    expect(error).toEqual(left(new InvalidNameError(invalidName)))
  })

  test('should not create company with invalid cpf', () => {
    const invalidCnpj = '00.000.000/0000-00'

    const error = Company.create({ name: 'any_name', email: 'any@mail.com', cnpj: invalidCnpj, phone: '(11)99000-3777' }).value as Error

    expect(error.name).toEqual('InvalidCnpjError')
    expect(error.message).toEqual('Invalid cnpj: ' + invalidCnpj + '.')
  })

  test('should not create cnpj with invalid cpf', () => {
    const invalidPhone = '(11)99000-377'

    const error = Company.create({ name: 'any_name', email: 'any@mail.com', cnpj: '46.227.269/0001-06', phone: invalidPhone }).value as Error

    expect(error.name).toEqual('InvalidPhoneError')
    expect(error.message).toEqual('Invalid phone: ' + invalidPhone + '.')
  })

  test('should create company with valid data', () => {
    const validName = 'any_name'
    const validEmail = 'any@mail.com'
    const validCnpj = '46.227.269/0001-06'
    const validPhone = '(11)99000-3777'

    const company: Company = Company.create({ name: validName, email: validEmail, cnpj: validCnpj, phone: validPhone }).value as Company

    expect(company.name.value).toEqual(validName)
    expect(company.email.value).toEqual(validEmail)
  })
})
