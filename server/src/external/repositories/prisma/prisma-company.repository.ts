import { CompanyData } from '@/entities/company'
import { CompanyRepository } from '@/usecases/company/ports'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

export class PrismaCompanyRepository implements CompanyRepository {
  private repository: PrismaClient

  constructor (repository: PrismaClient) {
    this.repository = repository
  }

  async add (company: CompanyData): Promise<void> {
    const exists = await this.exists(company)

    if (exists) return

    await this.repository.companies.create({
      data: {
        id: randomUUID(),
        name: company.name,
        email: company.email,
        cnpj: company.cnpj,
        phone: company.phone
      }
    })
  }

  async findCompanyByEmail (email: string): Promise<CompanyData> {
    return await this.repository.companies.findUnique({
      where: {
        email
      }
    })
  }

  async findAllCompanies (): Promise<CompanyData[]> {
    return await this.repository.companies.findMany()
  }

  async exists (company: CompanyData): Promise<boolean> {
    const companyOrNull = await this.repository.companies.findUnique({
      where: {
        email: company.email
      }
    })

    if (!companyOrNull) return false

    return true
  }
}
