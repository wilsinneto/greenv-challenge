import { Cnpj, Email, Name, Phone, CompanyData } from '@/entities/company'
import { InvalidCnpjError, InvalidEmailError, InvalidNameError, InvalidPasswordError, InvalidPhoneError } from '@/entities/errors'
import { Either, left, right } from '@/shared'
import { randomUUID } from 'crypto'

export class Company {
  public readonly id?: string | undefined
  public readonly email: Email
  public readonly name: Name
  public readonly cnpj: Cnpj
  public readonly phone: Phone

  private constructor (id: string, name: Name, email: Email, cnpj: Cnpj, phone: Phone) {
    this.id = id || randomUUID()
    this.name = name
    this.email = email
    this.cnpj = cnpj
    this.phone = phone
  }

  static create (
    companyData: CompanyData
  ): Either<InvalidNameError | InvalidEmailError | InvalidPasswordError | InvalidCnpjError | InvalidPhoneError, Company> {
    const nameOrError = Name.create(companyData.name)
    if (nameOrError.isLeft()) {
      return left(nameOrError.value)
    }

    const emailOrError = Email.create(companyData.email)
    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }

    const cnpjOrError = Cnpj.create(companyData.cnpj)
    if (cnpjOrError.isLeft()) {
      return left(cnpjOrError.value)
    }

    const phoneOrError = Phone.create(companyData.phone)
    if (phoneOrError.isLeft()) {
      return left(phoneOrError.value)
    }

    const name: Name = nameOrError.value as Name
    const email: Email = emailOrError.value as Email
    const cnpj: Cnpj = cnpjOrError.value as Cnpj
    const phone: Phone = phoneOrError.value as Phone

    return right(new Company(companyData.id, name, email, cnpj, phone))
  }
}
