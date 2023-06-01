import { Phone } from '@/entities/user'

describe('Phone validation', () => {
  test('should not accept null strings', () => {
    const phone: null = null
    expect(Phone.validate(phone)).toBeFalsy()
  })

  test('should not accept empty strings', () => {
    const phone: string = ''
    expect(Phone.validate(phone)).toBeFalsy()
  })

  test('should not accept phone with letters', () => {
    const phone: string = '(mm)abusa-abcd'
    expect(Phone.validate(phone)).toBeFalsy()
  })

  test('should not accept phone less than 11 numbers', () => {
    const phone: string = '(11)99000-377'
    expect(Phone.validate(phone)).toBeFalsy()
  })

  test('should not accept phone greater than 11 numbers', () => {
    const phone: string = '(11)99000-37772'
    expect(Phone.validate(phone)).toBeFalsy()
  })

  test('should accept valid phone', () => {
    const phone: string = '(11)99000-3777'
    expect(Phone.validate(phone)).toBeTruthy()
  })
})
