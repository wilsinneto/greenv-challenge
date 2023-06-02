import { adaptCreateCompanyRoute } from '@/main/adapters'
import { makeCreateCompanyController } from '@/main/factories'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/company', adaptCreateCompanyRoute(makeCreateCompanyController()))
}
