export class InvalidCpfError extends Error {
  public readonly name = 'InvalidCpfError'

  constructor (cpf: string) {
    super('Invalid cpf: ' + cpf + '.')
  }
}
