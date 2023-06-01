import { Cpf, Email, Name, Password, UserData } from '@/entities'
import { InvalidCpfError, InvalidEmailError, InvalidNameError, InvalidPasswordError } from '@/entities/errors'
import { Either, left, right } from '@/shared'

export class User {
  public readonly email: Email
  public readonly name: Name
  public readonly password: Password
  public readonly cpf: Cpf

  private constructor (name: Name, email: Email, password: Password, cpf: Cpf) {
    this.name = name
    this.email = email
    this.password = password
    this.cpf = cpf
  }

  static create (
    userData: UserData
  ): Either<InvalidNameError | InvalidEmailError | InvalidPasswordError | InvalidCpfError, User> {
    const nameOrError = Name.create(userData.name)
    if (nameOrError.isLeft()) {
      return left(nameOrError.value)
    }

    const emailOrError = Email.create(userData.email)
    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }

    const passwordOrError = Password.create(userData.password)
    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value)
    }

    const cpfOrError = Cpf.create(userData.cpf)
    if (cpfOrError.isLeft()) {
      return left(cpfOrError.value)
    }

    const name: Name = nameOrError.value as Name
    const email: Email = emailOrError.value as Email
    const password: Password = passwordOrError.value as Password
    const cpf: Cpf = cpfOrError.value as Cpf

    return right(new User(name, email, password, cpf))
  }
}
