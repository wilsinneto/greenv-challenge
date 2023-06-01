import { Name } from '@/entities/user'

describe('Name validation', () => {
  test('should not accept null strings', () => {
    const name: null = null
    expect(Name.validate(name)).toBeFalsy()
  })

  test('should not accept empty strings', () => {
    const name: string = ''
    expect(Name.validate(name)).toBeFalsy()
  })

  test('should not accept name less than 2 chars', () => {
    const name: string = 'l'
    expect(Name.validate(name)).toBeFalsy()
  })

  test('should not accept name larger than 257 chars', () => {
    const name: string = 'l'.repeat(257)
    expect(Name.validate(name)).toBeFalsy()
  })

  test('should accept valid name', () => {
    const name: string = 'One name'
    expect(Name.validate(name)).toBeTruthy()
  })
})
