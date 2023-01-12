import { Either, left, right } from '@/shared'
import crypto, { Cipher } from 'node:crypto'
import { InvalidPasswordError } from './errors/invalid-password-error'

interface EncryptedOutput {
  cipher: Cipher,
  encryptedData: string
}

const algorithm: string = 'aes-256-cbc'
const initVector: Buffer = crypto.randomBytes(16)
const securityKey: Buffer = crypto.randomBytes(32)

export class Password {
  public readonly value: string

  private constructor (password: string) {
    this.value = password
  }

  static create (password: string): Either<InvalidPasswordError, Password> {
    if (Password.validate(password)) {
      const { encryptedData } = Password.encrypt(password)

      return right(new Password(encryptedData))
    }

    return left(new InvalidPasswordError(password))
  }

  static validate (email: string) {
    if (!email) {
      return false
    }

    if (email.length < 2) {
      return false
    }

    if (email.length > 30) {
      return false
    }

    return true
  }

  static encrypt (password: string): EncryptedOutput {
    const cipher = crypto.createCipheriv(algorithm, securityKey, initVector)
    let encryptedData = cipher.update(password, 'utf-8', 'hex')

    encryptedData += cipher.final('hex')

    return { cipher, encryptedData }
  }

  static decrypt (password: string): string {
    const { encryptedData } = Password.encrypt(password)

    const decipher = crypto.createDecipheriv(algorithm, securityKey, initVector)

    let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8')

    decryptedData += decipher.final('utf8')

    return decryptedData
  }
}
