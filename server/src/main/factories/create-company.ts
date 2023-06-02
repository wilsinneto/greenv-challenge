import { CreateCompany } from '@/usecases/company'
import { CreateCompanyController } from '@/web-controllers'
import { PrismaCompanyRepository } from '@/external/repositories/prisma'
import { prisma } from '@/external/repositories/prisma/helper'
import { InMemoryCompanyRepository } from '@/usecases/company/repository'
import { database } from '@/main/database'

export const makeCreateCompanyController = (): CreateCompanyController => {
  const companyRepository = process.env.NODE_ENV === 'test' ? new InMemoryCompanyRepository(database) : new PrismaCompanyRepository(prisma)
  const createCompanyUseCase = new CreateCompany(companyRepository)
  const createCompanyController = new CreateCompanyController(createCompanyUseCase)

  return createCompanyController
}
