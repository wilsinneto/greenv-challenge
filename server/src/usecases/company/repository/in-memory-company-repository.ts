import { CompanyData } from '@/entities/company'
import { CompanyRepository } from '@/usecases/company/ports'

export class InMemoryCompanyRepository implements CompanyRepository {
  private repository: CompanyData[]

  constructor (repository: CompanyData[]) {
    this.repository = repository
  }

  async add (company: CompanyData): Promise<void> {
    const exists = await this.exists(company)

    if (!exists) {
      this.repository.push(company)
    }
  }

  async findCompanyByEmail (email: string): Promise<CompanyData> {
    const company = this.repository.find(company => company.email === email)

    return company || null
  }

  async findAllCompanies (): Promise<CompanyData[]> {
    return this.repository
  }

  async exists (company: CompanyData): Promise<boolean> {
    if (await this.findCompanyByEmail(company.email) === null) {
      return false
    }

    return true
  }
}
