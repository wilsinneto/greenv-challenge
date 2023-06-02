import { CompanyData } from '@/entities/company'

export interface CompanyRepository {
  add(user: CompanyData): Promise<void>
  findCompanyByEmail(email: string): Promise<CompanyData>
  findAllCompanies(): Promise<CompanyData[]>
  exists(company: CompanyData): Promise<boolean>
}
