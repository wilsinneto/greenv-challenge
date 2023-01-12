import { Password } from '@/entities'

import { InvalidEmailOrPasswordError } from '@/entities/errors/invalid-email-password-error'
import { Either, left, right } from '@/shared'
import { UseCase } from '@/usecases/ports'
import { LoginData, UserRepository } from '@/usecases/user/ports'

export class Login implements UseCase {
  private readonly userRepo: UserRepository

  constructor (userRepo: UserRepository) {
    this.userRepo = userRepo
  }

  public async perform (request: LoginData):
    Promise<Either<InvalidEmailOrPasswordError, LoginData>> {
    const userOrNull = await this.userRepo.findUserByEmail(request.email)

    if (!userOrNull) {
      return left(new InvalidEmailOrPasswordError())
    }

    if (userOrNull && (Password.decrypt(userOrNull.password) !== request.password)) {
      return left(new InvalidEmailOrPasswordError())
    }

    return right(request)
  }
}
