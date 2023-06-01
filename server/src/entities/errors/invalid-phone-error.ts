export class InvalidPhoneError extends Error {
  public readonly name = 'InvalidPhoneError'

  constructor (phone: string) {
    super('Invalid phone: ' + phone + '.')
  }
}
