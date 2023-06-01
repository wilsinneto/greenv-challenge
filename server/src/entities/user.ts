import { Cpf, Email, Name, Password, Phone, UserData } from '@/entities'
import { InvalidCpfError, InvalidEmailError, InvalidNameError, InvalidPasswordError, InvalidPhoneError } from '@/entities/errors'
import { Either, left, right } from '@/shared'

export class User {
  public readonly email: Email
  public readonly name: Name
  public readonly password: Password
  public readonly cpf: Cpf
  public readonly phone: Phone

  private constructor (name: Name, email: Email, password: Password, cpf: Cpf, phone: Phone) {
    this.name = name
    this.email = email
    this.password = password
    this.cpf = cpf
    this.phone = phone
  }

  static create (
    userData: UserData
  ): Either<InvalidNameError | InvalidEmailError | InvalidPasswordError | InvalidCpfError | InvalidPhoneError, User> {
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

    const phoneOrError = Phone.create(userData.phone)
    if (phoneOrError.isLeft()) {
      return left(phoneOrError.value)
    }

    const name: Name = nameOrError.value as Name
    const email: Email = emailOrError.value as Email
    const password: Password = passwordOrError.value as Password
    const cpf: Cpf = cpfOrError.value as Cpf
    const phone: Phone = phoneOrError.value as Phone

    return right(new User(name, email, password, cpf, phone))
  }
}
