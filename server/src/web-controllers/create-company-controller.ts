import { CompanyData } from '@/entities/company'
import { UseCase } from '@/usecases/ports'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { badRequest, created, serverError } from '@/web-controllers/util/http-helper'
import { MissingParamError } from './errors/missing-param-error'

export class CreateCompanyController {
  private readonly usecase: UseCase

  constructor (usecase: UseCase) {
    this.usecase = usecase
  }

  public async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, cnpj, phone } = request.body

      if (!name || !email || !cnpj || !phone) {
        let missingParam = !name ? 'name ' : ''
        missingParam += !email ? 'email ' : ''
        missingParam += !cnpj ? 'cnpj ' : ''
        missingParam += !phone ? 'phone' : ''

        return badRequest(new MissingParamError(missingParam.trim()))
      }

      const companyData: CompanyData = request.body
      const response = await this.usecase.perform(companyData)

      if (response.isLeft()) {
        return badRequest(response.value)
      }

      if (response.isRight()) {
        return created({
          id: response.value.id,
          name: response.value.name,
          email: response.value.email,
          cnpj: response.value.cnpj,
          phone: response.value.phone
        })
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
