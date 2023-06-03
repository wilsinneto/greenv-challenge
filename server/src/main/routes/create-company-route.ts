import { adaptCreateCompanyRoute } from '@/main/adapters'
import { makeCreateCompanyController } from '@/main/factories'
import { authentication } from '@/main/middleware/authentication'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/company', authentication, adaptCreateCompanyRoute(makeCreateCompanyController()))
}
