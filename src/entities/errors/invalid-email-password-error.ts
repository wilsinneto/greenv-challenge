export class InvalidEmailOrPasswordError extends Error {
  public readonly name = 'InvalidEmailOrPasswordError'

  constructor () {
    super('Invalid email or password.')
  }
}
