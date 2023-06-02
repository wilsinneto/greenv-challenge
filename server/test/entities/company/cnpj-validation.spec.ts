import { Cnpj } from '@/entities/company'

describe('Cnpj validation', () => {
  test('should not accept null strings', () => {
    const cnpj: null = null
    expect(Cnpj.validate(cnpj)).toBeFalsy()
  })

  test('should not accept empty strings', () => {
    const cnpj: string = ''
    expect(Cnpj.validate(cnpj)).toBeFalsy()
  })

  test('should not accept cnpj with letters', () => {
    const cnpj: string = 'lk.ssd.qwe/wwwe-wp'
    expect(Cnpj.validate(cnpj)).toBeFalsy()
  })

  test('should not accept cnpj less than 14 numbers', () => {
    const cnpj: string = '46.227.269/0001-0'
    expect(Cnpj.validate(cnpj)).toBeFalsy()
  })

  test('should not accept cnpj greater than 14 numbers', () => {
    const cnpj: string = '46.227.269/0001-066'
    expect(Cnpj.validate(cnpj)).toBeFalsy()
  })

  test('should accept valid cnpj', () => {
    const cnpj: string = '46.227.269/0001-06'
    expect(Cnpj.validate(cnpj)).toBeTruthy()
  })
})
