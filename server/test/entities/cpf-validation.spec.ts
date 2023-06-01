import { Cpf } from '@/entities'

describe('Cpf validation', () => {
  test('should not accept null strings', () => {
    const cpf: null = null
    expect(Cpf.validate(cpf)).toBeFalsy()
  })

  test('should not accept empty strings', () => {
    const cpf: string = ''
    expect(Cpf.validate(cpf)).toBeFalsy()
  })

  test('should not accept cpf with letters', () => {
    const cpf: string = 'ler.pwr.wun-oz'
    expect(Cpf.validate(cpf)).toBeFalsy()
  })

  test('should not accept cpf less than 11 numbers', () => {
    const cpf: string = '896.987.609-0'.repeat(257)
    expect(Cpf.validate(cpf)).toBeFalsy()
  })

  test('should not accept cpf greater than 11 numbers', () => {
    const cpf: string = '896.987.609-032'.repeat(257)
    expect(Cpf.validate(cpf)).toBeFalsy()
  })

  test('should accept valid cpf', () => {
    const cpf: string = '896.987.609-03'
    expect(Cpf.validate(cpf)).toBeTruthy()
  })
})
