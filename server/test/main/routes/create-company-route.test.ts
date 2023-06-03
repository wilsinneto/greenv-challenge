import request from 'supertest'

import app from '@/main/config/app'

describe('Create company route', () => {
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
        cpf: '033.371.534-96',
        phone: '(11)99000-3777'
      })

    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'any@mail.com',
        password: 'abc'
      })
      .expect(200)

    await request(app)
      .post('/api/company')
      .set('Authorization', 'bearer ' + response.body.token)
      .send({
        name: 'Any name',
        email: 'any@mail.com',
        cnpj: '46.227.269/0001-06',
        phone: '(11)99000-3777'
      })
      .expect(201)
  })
})
