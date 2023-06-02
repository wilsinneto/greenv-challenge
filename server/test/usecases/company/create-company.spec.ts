import { CompanyData } from '@/entities/company'
import { CreateCompany } from '@/usecases/company'
import { CompanyRepository } from '@/usecases/company/ports'
import { InMemoryCompanyRepository } from '@/usecases/company/repository'

describe('Create company use case', () => {
  test('should add company with complete data', async () => {
    const companies: CompanyData[] = []
    const repo: CompanyRepository = new InMemoryCompanyRepository(companies)
    const useCase: CreateCompany = new CreateCompany(repo)
    const name = 'any_name'
    const email = 'any@email.com'
    const cnpj = '46.227.269/0001-06'
    const phone = '(11)99000-3777'

    const response = await useCase.perform({ name, email, cnpj, phone })
    const company = repo.findCompanyByEmail('any@email.com')

    expect((await company).name).toBe('any_name')
    expect(response.value.name).toBe('any_name')
  })

  test('should not add company with invalid email', async () => {
    const companies: CompanyData[] = []
    const repo: CompanyRepository = new InMemoryCompanyRepository(companies)
    const useCase: CreateCompany = new CreateCompany(repo)
    const name = 'any_name'
    const invalidEmail = 'invalid_email'
    const cnpj = '46.227.269/0001-06'
    const phone = '(11)99000-3777'

    const response = (await useCase.perform({ name, email: invalidEmail, cnpj, phone })).value as Error
    const company = await repo.findCompanyByEmail(invalidEmail)

    expect(company).toBeNull()
    expect(response.name).toEqual('InvalidEmailError')
  })

  test('should not add company with invalid name', async () => {
    const companies: CompanyData[] = []
    const repo: CompanyRepository = new InMemoryCompanyRepository(companies)
    const useCase: CreateCompany = new CreateCompany(repo)
    const invalidName = ''
    const email = 'any@email.com'
    const cnpj = '46.227.269/0001-06'
    const phone = '(11)99000-3777'

    const response = (await useCase.perform({ name: invalidName, email, cnpj, phone })).value as Error
    const company = await repo.findCompanyByEmail(email)

    expect(company).toBeNull()
    expect(response.name).toEqual('InvalidNameError')
  })

  test('should not add company with invalid cnpj', async () => {
    const companies: CompanyData[] = []
    const repo: CompanyRepository = new InMemoryCompanyRepository(companies)
    const useCase: CreateCompany = new CreateCompany(repo)
    const name = 'any name'
    const email = 'any@email.com'
    const invalidCnpj = '46.227.269/0001-00'
    const phone = '(11)99000-3777'

    const response = (await useCase.perform({ name, email, cnpj: invalidCnpj, phone })).value as Error
    const company = await repo.findCompanyByEmail(email)

    expect(company).toBeNull()
    expect(response.name).toEqual('InvalidCnpjError')
  })

  test('should not add company with invalid phone', async () => {
    const companies: CompanyData[] = []
    const repo: CompanyRepository = new InMemoryCompanyRepository(companies)
    const useCase: CreateCompany = new CreateCompany(repo)
    const name = 'any name'
    const email = 'any@email.com'
    const cnpj = '46.227.269/0001-06'
    const invalidPhone = '(11)99000-37779'

    const response = (await useCase.perform({ name, email, cnpj, phone: invalidPhone })).value as Error
    const company = await repo.findCompanyByEmail(email)

    expect(company).toBeNull()
    expect(response.name).toEqual('InvalidPhoneError')
  })
})
