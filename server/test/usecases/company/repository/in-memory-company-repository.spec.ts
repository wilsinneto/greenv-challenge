import { CompanyData } from '@/entities/company'
import { InMemoryCompanyRepository } from '@/usecases/company/repository'

describe('In memory Company repository', () => {
  test('should return null if company is not found', async () => {
    const companies: CompanyData[] = []
    const sut = new InMemoryCompanyRepository(companies)
    const company = await sut.findCompanyByEmail('any@mail.com')
    expect(company).toBeNull()
  })

  test('should return company if it is found in the repository', async () => {
    const companies: CompanyData[] = []
    const name = 'any_name'
    const email = 'any@mail.com'
    const cnpj = '46.227.269/0001-06'
    const phone = '(11)99000-3777'
    const sut = new InMemoryCompanyRepository(companies)
    await sut.add({ name, email, cnpj, phone })
    const company = await sut.findCompanyByEmail('any@mail.com')
    expect(company.name).toBe('any_name')
  })

  test('should return all companies in the repository', async () => {
    const companies: CompanyData[] = [
      { name: 'any_name', email: 'any@mail.com', cnpj: '46.227.269/0001-06', phone: '(11)99000-3777' },
      { name: 'second_name', email: 'second@mail.com', cnpj: '46.227.269/0001-06', phone: '(11)99000-3777' }
    ]

    const sut = new InMemoryCompanyRepository(companies)
    const returnedCompanies = sut.findAllCompanies()

    expect((await returnedCompanies).length).toBe(2)
  })
})
