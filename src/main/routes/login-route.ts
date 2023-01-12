import { Router } from 'express'
import { adaptLoginRoute } from '../adapters'
import { makeLoginController } from '../factories/login'

export default (router: Router): void => {
  router.post('/login', adaptLoginRoute(makeLoginController()))
}
