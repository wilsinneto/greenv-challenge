import request from 'supertest'

import app from '@/main/config/app'

describe('Create company route', () => {
  test('should return an account on success', async () => {
    app.post('/test_cors', (req, res) => {
      res.send()
    })
    await request(app)
      .post('/api/company')
      .send({
        name: 'Any name',
        email: 'any@mail.com',
        cnpj: '46.227.269/0001-06',
        phone: '(11)99000-3777'
      })
      .expect(201)
  })
})
