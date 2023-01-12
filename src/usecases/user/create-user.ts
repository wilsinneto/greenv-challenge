import { InvalidEmailError, InvalidNameError, InvalidPasswordError } from '@/entities/errors'

import { User, UserData } from '@/entities'

import { Either, left, right } from '@/shared'
import { UseCase } from '@/usecases/ports'
import { UserRepository } from '@/usecases/user/ports'

export class CreateUser implements UseCase {
  private readonly userRepo: UserRepository

  constructor (userRepo: UserRepository) {
    this.userRepo = userRepo
  }

  public async perform (request: UserData):
    Promise<Either<InvalidNameError | InvalidEmailError | InvalidPasswordError, UserData>> {
    const userOrError: Either<InvalidNameError | InvalidEmailError | InvalidPasswordError, User> = User.create(request)

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    if (!(await this.userRepo.exists(request))) {
      await this.userRepo.add(request)
    }

    return right(request)
  }
}
