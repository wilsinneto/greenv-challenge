import request from 'supertest'

import app from '@/main/config/app'

describe('Register route', () => {
  test('should return an account on success', async () => {
    app.post('/test_cors', (req, res) => {
      res.send()
    })
    await request(app)
      .post('/api/register')
      .send({
        name: 'Any name',
        email: 'any@mail.com',
        password: 'abc',
        cpf: '896.987.609-03',
        phone: '(11)99000-3777'
      })
      .expect(201)
  })
})
