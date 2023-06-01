import { UserData } from '@/entities'
import { UseCase } from '@/usecases/ports'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { badRequest, created, serverError } from '@/web-controllers/util/http-helper'
import { MissingParamError } from './errors/missing-param-error'

export class CreateUserController {
  private readonly usecase: UseCase

  constructor (usecase: UseCase) {
    this.usecase = usecase
  }

  public async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password, cpf, phone } = request.body

      if (!name || !email || !password || !cpf || !phone) {
        let missingParam = !name ? 'name ' : ''
        missingParam += !email ? 'email ' : ''
        missingParam += !password ? 'password ' : ''
        missingParam += !cpf ? 'cpf ' : ''
        missingParam += !phone ? 'phone' : ''

        return badRequest(new MissingParamError(missingParam.trim()))
      }

      const userData: UserData = request.body
      const response = await this.usecase.perform(userData)

      if (response.isLeft()) {
        return badRequest(response.value)
      }

      if (response.isRight()) {
        return created({
          name: response.value.name,
          email: response.value.email,
          cpf: response.value.cpf,
          phone: response.value.phone
        })
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
