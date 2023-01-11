import { CreateUserController } from '@/web-controllers'
import { HttpRequest } from '@/web-controllers/ports'
import { Request, Response } from 'express'

export const adaptRoute = (controller: CreateUserController) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body
    }
    const httpResponse = await controller.handle(httpRequest)

    response.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
