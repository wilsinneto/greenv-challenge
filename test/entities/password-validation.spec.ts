import { Password } from '@/entities'

describe('Password validation', () => {
  test('should not accept null strings', () => {
    const password: null = null
    expect(Password.validate(password)).toBeFalsy()
  })

  test('should not accept empty strings', () => {
    const password: string = ''
    expect(Password.validate(password)).toBeFalsy()
  })

  test('should not accept local part larger than 30 chars', () => {
    const password: string = 'l'.repeat(31)
    expect(Password.validate(password)).toBeFalsy()
  })

  test('should accept valid password', () => {
    const password: string = 'abc'
    expect(Password.validate(password)).toBeTruthy()
  })

  test('should encrypted password value', () => {
    const password: string = 'abc'
    const { encryptedData } = Password.encrypt(password)
    expect(encryptedData).not.toEqual(password)
  })

  test('should decrypted password value', () => {
    const password: string = 'abc'
    const decryptedData = Password.decrypt(password)
    expect(decryptedData).toBe(password)
  })
})
