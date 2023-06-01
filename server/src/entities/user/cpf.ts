import { InvalidCpfError } from '@/entities/errors'
import { Either, left, right } from '@/shared'

export class Cpf {
  public readonly value: string

  private constructor (cpf: string) {
    this.value = cpf
  }

  static create (cpf: string): Either<InvalidCpfError, Cpf> {
    if (!Cpf.validate(cpf)) {
      return left(new InvalidCpfError(cpf))
    }

    return right(new Cpf(cpf))
  }

  public static validate (cpf: string): boolean {
    if (!cpf) {
      return false
    }

    if (typeof cpf !== 'string') {
      return false
    }

    cpf = cpf.replace(/[^\d]+/g, '')

    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) {
      return false
    }

    const cpfInList = cpf.split('')

    const validator = cpfInList
      .filter((digit, index, array) => index >= array.length - 2 && digit)
      .map((element) => +element)

    const toValidate = (pop) =>
      cpfInList
        .filter((digit, index, array) => index < array.length - pop && digit)
        .map((element) => +element)

    const rest = (count, pop) =>
      ((toValidate(pop).reduce((soma, el, i) => soma + el * (count - i), 0) *
        10) %
        11) %
      10

    return !(rest(10, 2) !== validator[0] || rest(11, 1) !== validator[1])
  }
}
