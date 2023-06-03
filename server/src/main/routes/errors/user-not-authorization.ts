export class UserNotAuthorization extends Error {
  public readonly name = 'UserNotAuthorization'

  constructor () {
    super('User not authorized.')
  }
}
