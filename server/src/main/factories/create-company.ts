import { CreateCompany } from '@/usecases/company'
import { CreateCompanyController } from '@/web-controllers'
import { PrismaCompanyRepository } from '@/external/repositories/prisma'
import { prisma } from '@/external/repositories/prisma/helper'

export const makeCreateCompanyController = (): CreateCompanyController => {
  const inMemoryCompanyRepository = new PrismaCompanyRepository(prisma)
  const createCompanyUseCase = new CreateCompany(inMemoryCompanyRepository)
  const createCompanyController = new CreateCompanyController(createCompanyUseCase)

  return createCompanyController
}
