import { UserData } from '@/entities/user'
import { UserRepository } from '@/usecases/user/ports'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

export class PrismaUserRepository implements UserRepository {
  private repository: PrismaClient

  constructor (repository: PrismaClient) {
    this.repository = repository
  }

  async add (user: UserData): Promise<void> {
    const exists = await this.exists(user)

    if (exists) return

    await this.repository.users.create({
      data: {
        id: randomUUID(),
        name: user.name,
        email: user.email,
        password: user.password,
        cpf: user.cpf,
        phone: user.phone
      }
    })
  }

  async findUserByEmail (email: string): Promise<UserData> {
    return await this.repository.users.findUnique({
      where: {
        email
      }
    })
  }

  async findAllUsers (): Promise<UserData[]> {
    return await this.repository.users.findMany()
  }

  async exists (user: UserData): Promise<boolean> {
    const userOrNull = await this.repository.users.findUnique({
      where: {
        email: user.email
      }
    })

    if (!userOrNull) return false

    return true
  }
}
