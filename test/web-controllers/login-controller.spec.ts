import { UserData } from '@/entities'
import { InvalidEmailOrPasswordError } from '@/entities/errors/invalid-email-password-error'
import { UseCase } from '@/usecases/ports'
import { CreateUser } from '@/usecases/user'
import { Login } from '@/usecases/user/login'
import { UserRepository } from '@/usecases/user/ports'
import { InMemoryUserRepository } from '@/usecases/user/repository'
import { CreateUserController } from '@/web-controllers/create-user-controller'
import { LoginController } from '@/web-controllers/login-controller'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'

describe('Login web controller', () => {
  const users: UserData[] = []
  const repo: UserRepository = new InMemoryUserRepository(users)
  const createUserUseCase: UseCase = new CreateUser(repo)
  const loginUserUseCase: UseCase = new Login(repo)
  const createUserController: CreateUserController = new CreateUserController(createUserUseCase)
  const loginController: LoginController = new LoginController(loginUserUseCase)

  class ErrorThrowingUseCaseStub implements UseCase {
    perform (request: any): Promise<void> {
      throw Error()
    }
  }

  const errorThrowingUseCaseStub: UseCase = new ErrorThrowingUseCaseStub()

  test('should return status code 200 when request contains valid login data', async () => {
    const createUserRequest: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com',
        password: 'abc'
      }
    }
    const loginRequest: HttpRequest = {
      body: {
        email: 'any@mail.com',
        password: 'abc'
      }
    }

    await createUserController.handle(createUserRequest)

    const response = await loginController.handle(loginRequest)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ email: 'any@mail.com' })
  })

  test('should return status code 400 when request contains invalid login email', async () => {
    const requestWithInvalidEmail: HttpRequest = {
      body: {
        email: 'invalid@mail.com',
        password: 'abc'
      }
    }

    const response: HttpResponse = await loginController.handle(requestWithInvalidEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidEmailOrPasswordError)
  })

  test('should return status code 400 when request contains invalid user password', async () => {
    const createUserRequest: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@mail.com',
        password: 'abc'
      }
    }
    const loginRequest: HttpRequest = {
      body: {
        email: 'any@mail.com',
        password: 'cba'
      }
    }

    await createUserController.handle(createUserRequest)

    const response = await loginController.handle(loginRequest)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidEmailOrPasswordError)
  })

  test('should return status code 500 when server raises', async () => {
    const request: HttpRequest = {
      body: {
        email: 'any@mail.com',
        password: 'abc'
      }
    }

    const controller: LoginController = new LoginController(errorThrowingUseCaseStub)
    const response: HttpResponse = await controller.handle(request)

    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
