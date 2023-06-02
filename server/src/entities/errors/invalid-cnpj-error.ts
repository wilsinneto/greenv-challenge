export class InvalidCnpjError extends Error {
  public readonly name = 'InvalidCnpjError'

  constructor (cnpj: string) {
    super('Invalid cnpj: ' + cnpj + '.')
  }
}
