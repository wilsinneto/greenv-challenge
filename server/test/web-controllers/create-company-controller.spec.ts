import { CompanyData } from '@/entities/company'
import { InvalidCnpjError, InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { UseCase } from '@/usecases/ports'
import { CreateCompany } from '@/usecases/company'
import { CompanyRepository } from '@/usecases/company/ports'
import { InMemoryCompanyRepository } from '@/usecases/company/repository'
import { CreateCompanyController } from '@/web-controllers/create-company-controller'
import { MissingParamError } from '@/web-controllers/errors/missing-param-error'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'

describe('Create company web controller', () => {
  const companies: CompanyData[] = []
  const repo: CompanyRepository = new InMemoryCompanyRepository(companies)
  const useCase: UseCase = new CreateCompany(repo)
  const controller: CreateCompanyController = new CreateCompanyController(useCase)

  class ErrorThrowingUseCaseStub implements UseCase {
    perform (request: any): Promise<void> {
      throw Error()
    }
  }

  const errorThrowingUseCaseStub: UseCase = new ErrorThrowingUseCaseStub()

  test('should return status code 201 when request contains valid company data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com',
        cnpj: '46.227.269/0001-06',
        phone: '(11)99000-3777'
      }
    }

    const response: HttpResponse = await controller.handle(request)

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(expect.objectContaining({ name: 'Any name', email: 'any@mail.com', cnpj: '46.227.269/0001-06', phone: '(11)99000-3777' }))
  })

  test('should return status code 400 when request contains invalid company name', async () => {
    const requestWithInvalidName: HttpRequest = {
      body: {
        name: 'A',
        email: 'any@mail.com',
        cnpj: '46.227.269/0001-06',
        phone: '(11)99000-3777'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithInvalidName)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidNameError)
  })

  test('should return status code 400 when request contains invalid company email', async () => {
    const requestWithInvalidEmail: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any_mail.com',
        cnpj: '46.227.269/0001-06',
        phone: '(11)99000-3777'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithInvalidEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidEmailError)
  })

  test('should return status code 400 when request contains invalid company cnpj', async () => {
    const requestWithInvalidCnpj: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com',
        cnpj: '46.227.269/0001-00',
        phone: '(11)99000-3777'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithInvalidCnpj)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidCnpjError)
  })

  test('should return status code 400 when request is missing company name', async () => {
    const requestWithMissingName: HttpRequest = {
      body: {
        email: 'any@mail.com',
        cnpj: '46.227.269/0001-06',
        phone: '(11)99000-3777'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithMissingName)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name.')
  })

  test('should return status code 400 when request is missing company email', async () => {
    const requestWithMissingEmail: HttpRequest = {
      body: {
        name: 'Any name',
        cnpj: '46.227.269/0001-06',
        phone: '(11)99000-3777'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithMissingEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: email.')
  })

  test('should return status code 400 when request is missing company cnpj', async () => {
    const requestWithMissingCnpj: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com',
        phone: '(11)99000-3777'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithMissingCnpj)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: cnpj.')
  })

  test('should return status code 400 when request is missing company phone', async () => {
    const requestWithMissingPhone: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com',
        cnpj: '46.227.269/0001-06'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithMissingPhone)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: phone.')
  })

  test('should return status code 400 when request is missing company name, email, cnpj and phone', async () => {
    const requestWithMissingNameEmailAndCnpj: HttpRequest = {
      body: {}
    }

    const response: HttpResponse = await controller.handle(requestWithMissingNameEmailAndCnpj)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name email cnpj phone.')
  })

  test('should return status code 500 when server raises', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com',
        cnpj: '46.227.269/0001-06',
        phone: '(11)99000-3777'
      }
    }

    const controller: CreateCompanyController = new CreateCompanyController(errorThrowingUseCaseStub)
    const response: HttpResponse = await controller.handle(request)

    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
