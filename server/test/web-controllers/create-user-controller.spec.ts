import { UserData } from '@/entities/user'
import { InvalidCpfError, InvalidEmailError, InvalidNameError, InvalidPasswordError } from '@/entities/errors'
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
        password: 'abc',
        cpf: '896.987.609-03',
        phone: '(11)99000-3777'
      }
    }

    const response: HttpResponse = await controller.handle(request)

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({ name: 'Any name', email: 'any@mail.com', cpf: '896.987.609-03', phone: '(11)99000-3777' })
  })

  test('should return status code 400 when request contains invalid user name', async () => {
    const requestWithInvalidName: HttpRequest = {
      body: {
        name: 'A',
        email: 'any@mail.com',
        password: 'abc',
        cpf: '896.987.609-03',
        phone: '(11)99000-3777'
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
        password: 'abc',
        cpf: '896.987.609-03',
        phone: '(11)99000-3777'
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
        password: 'a',
        cpf: '896.987.609-03',
        phone: '(11)99000-3777'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithInvalidEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidPasswordError)
  })

  test('should return status code 400 when request contains invalid user cpf', async () => {
    const requestWithInvalidCpf: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com',
        password: 'abc',
        cpf: '896.987.609-00',
        phone: '(11)99000-3777'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithInvalidCpf)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidCpfError)
  })

  test('should return status code 400 when request is missing user name', async () => {
    const requestWithMissingName: HttpRequest = {
      body: {
        email: 'any@mail.com',
        password: 'abc',
        cpf: '896.987.609-03',
        phone: '(11)99000-3777'
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
        password: 'abc',
        cpf: '896.987.609-03',
        phone: '(11)99000-3777'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithMissingEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: email.')
  })

  test('should return status code 400 when request is missing user cpf', async () => {
    const requestWithMissingCpf: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com',
        password: 'abc',
        phone: '(11)99000-3777'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithMissingCpf)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: cpf.')
  })

  test('should return status code 400 when request is missing user phone', async () => {
    const requestWithMissingPhone: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com',
        password: 'abc',
        cpf: '896.987.609-03'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithMissingPhone)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: phone.')
  })

  test('should return status code 400 when request is missing user name, email, cpf and phone', async () => {
    const requestWithMissingNameEmailAndCpf: HttpRequest = {
      body: {}
    }

    const response: HttpResponse = await controller.handle(requestWithMissingNameEmailAndCpf)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name email password cpf phone.')
  })

  test('should return status code 500 when server raises', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com',
        password: 'abc',
        cpf: '896.987.609-03',
        phone: '(11)99000-3777'
      }
    }

    const controller: CreateUserController = new CreateUserController(errorThrowingUseCaseStub)
    const response: HttpResponse = await controller.handle(request)

    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
