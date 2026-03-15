import { ValidationPipe, type INestApplication } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import type { Server } from 'node:http'
import request from 'supertest'
import { AppModule } from '../src/app.module'

describe('App (e2e)', () => {
  let app: INestApplication
  let httpServer: Server

  beforeAll(async () => {
    process.env.TMDB_ACCESS_TOKEN = 'test-token'

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )

    await app.init()
    httpServer = app.getHttpServer() as Server
  })

  afterAll(async () => {
    await app.close()
  })

  it('/movies?page=abc returns 400', async () => {
    await request(httpServer).get('/movies?page=abc').expect(400)
  })

  it('/movies/search?title=&page=1 returns 400', async () => {
    await request(httpServer).get('/movies/search?title=&page=1').expect(400)
  })

  it('/movies/search?title=   &page=1 returns 400', async () => {
    await request(httpServer).get('/movies/search?title=   &page=1').expect(400)
  })

  it('/movies/genre/abc?page=1 returns 400', async () => {
    await request(httpServer).get('/movies/genre/abc?page=1').expect(400)
  })
})
