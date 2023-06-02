import { InvalidCnpjError, InvalidEmailError, InvalidNameError, InvalidPhoneError } from '@/entities/errors'
import { Company, CompanyData } from '@/entities/company'
import { Either, left, right } from '@/shared'
import { UseCase } from '@/usecases/ports'
import { CompanyRepository } from '@/usecases/company/ports'

export class CreateCompany implements UseCase {
  private readonly companyRepo: CompanyRepository

  constructor (companyRepo: CompanyRepository) {
    this.companyRepo = companyRepo
  }

  public async perform (request: CompanyData):
    Promise<Either<InvalidNameError | InvalidEmailError | InvalidCnpjError | InvalidPhoneError, CompanyData>> {
    const companyOrError: Either<InvalidNameError | InvalidEmailError | InvalidCnpjError | InvalidPhoneError, Company> = Company.create(request)

    if (companyOrError.isLeft()) {
      return left(companyOrError.value)
    }

    if (!(await this.companyRepo.exists(request))) {
      await this.companyRepo.add(request)
    }

    return right({ id: companyOrError.value.id, ...request })
  }
}
