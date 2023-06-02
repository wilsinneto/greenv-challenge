import { InvalidCnpjError } from '@/entities/errors'
import { Either, left, right } from '@/shared'

export class Cnpj {
  public readonly value: string

  private constructor (cnpj: string) {
    this.value = cnpj
  }

  static create (cnpj: string): Either<InvalidCnpjError, Cnpj> {
    if (!Cnpj.validate(cnpj)) {
      return left(new InvalidCnpjError(cnpj))
    }

    return right(new Cnpj(cnpj))
  }

  public static validate (cnpj: string): boolean {
    if (!cnpj) return false

    const isString = typeof cnpj === 'string'
    const validTypes = isString || Number.isInteger(cnpj) || Array.isArray(cnpj)

    if (!validTypes) return false

    if (isString) {
      if (cnpj.length < 14 || cnpj.length > 18) return false

      const digitsOnly = /^\d{14}$/.test(cnpj)
      const validFormat = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/.test(cnpj)
      const isValid = digitsOnly || validFormat

      if (!isValid) return false
    }

    const match = cnpj.toString().match(/\d/g)
    const numbers = Array.isArray(match) ? match.map(Number) : []

    if (numbers.length !== 14) return false

    const items = [...new Set(numbers)]
    if (items.length === 1) return false

    const calc = (x) => {
      const slice = numbers.slice(0, x)
      let factor = x - 7
      let sum = 0

      for (let i = x; i >= 1; i--) {
        const n = slice[x - i]
        sum += n * factor--
        if (factor < 2) factor = 9
      }

      const result = 11 - (sum % 11)

      return result > 9 ? 0 : result
    }

    const digits = numbers.slice(12)
    const digit0 = calc(12)
    if (digit0 !== digits[0]) return false

    const digit1 = calc(13)
    return digit1 === digits[1]
  }
}
