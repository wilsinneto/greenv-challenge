import { UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError, InvalidPasswordError } from '@/entities/errors'
import { UseCase } from '@/usecases/ports'
import { CreateUser } from '@/usecases/user'
import { UserRepository } from '@/usecases/user/ports'
import { InMemoryUserRepository } from '@/usecases/user/repository'
import { CreateUserController } from '@/web-controllers/create-user-controller'
import { MissingParamError } from '@/web-controllers/errors/missing-param-error'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'

describe('Create user web controller', () => {
  const users: UserData[] = []
  const repo: UserRepository = new InMemoryUserRepository(users)
  const useCase: UseCase = new CreateUser(repo)
  const controller: CreateUserController = new CreateUserController(useCase)

  class ErrorThrowingUseCaseStub implements UseCase {
    perform (request: any): Promise<void> {
      throw Error()
    }
  }

  const errorThrowingUseCaseStub: UseCase = new ErrorThrowingUseCaseStub()

  test('should return status code 201 when request contains valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com',
        password: 'abc'
      }
    }

    const response: HttpResponse = await controller.handle(request)

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({ name: 'Any name', email: 'any@mail.com' })
  })

  test('should return status code 400 when request contains invalid user name', async () => {
    const requestWithInvalidName: HttpRequest = {
      body: {
        name: 'A',
        email: 'any@mail.com',
        password: 'abc'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithInvalidName)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidNameError)
  })

  test('should return status code 400 when request contains invalid user email', async () => {
    const requestWithInvalidEmail: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any_mail.com',
        password: 'abc'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithInvalidEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidEmailError)
  })

  test('should return status code 400 when request contains invalid user password', async () => {
    const requestWithInvalidEmail: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com',
        password: 'a'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithInvalidEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidPasswordError)
  })

  test('should return status code 400 when request is missing user name', async () => {
    const requestWithMissingName: HttpRequest = {
      body: {
        email: 'any@mail.com',
        password: 'abc'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithMissingName)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name.')
  })

  test('should return status code 400 when request is missing user email', async () => {
    const requestWithMissingEmail: HttpRequest = {
      body: {
        name: 'Any name',
        password: 'abc'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithMissingEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: email.')
  })

  test('should return status code 400 when request is missing user name and email', async () => {
    const requestWithMissingNameAndEmail: HttpRequest = {
      body: {}
    }

    const response: HttpResponse = await controller.handle(requestWithMissingNameAndEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name email password.')
  })

  test('should return status code 500 when server raises', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com',
        password: 'abc'
      }
    }

    const controller: CreateUserController = new CreateUserController(errorThrowingUseCaseStub)
    const response: HttpResponse = await controller.handle(request)

    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
