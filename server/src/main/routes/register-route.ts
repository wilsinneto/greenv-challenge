import { adaptRegisterRoute } from '@/main/adapters'
import { makeCreateUserController } from '@/main/factories'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/register', adaptRegisterRoute(makeCreateUserController()))
}
