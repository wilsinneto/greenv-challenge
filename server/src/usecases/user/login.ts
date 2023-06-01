import { Password } from '@/entities'

import { InvalidEmailOrPasswordError } from '@/entities/errors/invalid-email-password-error'
import { Either, left, right } from '@/shared'
import { UseCase } from '@/usecases/ports'
import { Jwt, LoginInputData, LoginOutputData, UserRepository } from '@/usecases/user/ports'

export class Login implements UseCase {
  private readonly userRepo: UserRepository
  private readonly jwt: Jwt

  constructor (userRepo: UserRepository, jwt: Jwt) {
    this.userRepo = userRepo
    this.jwt = jwt
  }

  public async perform (request: LoginInputData):
    Promise<Either<InvalidEmailOrPasswordError, LoginOutputData>> {
    const userOrNull = await this.userRepo.findUserByEmail(request.email)

    if (!userOrNull) {
      return left(new InvalidEmailOrPasswordError())
    }

    if (userOrNull && (Password.decrypt(userOrNull.password) !== request.password)) {
      return left(new InvalidEmailOrPasswordError())
    }

    const payload = {
      name: userOrNull.name,
      email: userOrNull.email,
      cpf: userOrNull.cpf,
      phone: userOrNull.phone
    }

    return right({
      ...payload,
      token: this.jwt.sign(payload, process.env.SECRET_KEY || 'secret_key')
    })
  }
}
