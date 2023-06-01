import { Secret, SignOptions } from 'jsonwebtoken'

export interface Jwt {
  sign(payload: string | Buffer | object, secretOrPrivateKey: Secret, options?: SignOptions): string
}
