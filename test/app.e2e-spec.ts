import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum'
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';


describe('E2E Test', () => {

    let app: INestApplication
    let prismaService: PrismaService
    const port = 3001

    beforeAll(async () => {

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication()
        app.useGlobalPipes(new ValidationPipe())

        await app.init()
        await app.listen(port)
        pactum.request.setBaseUrl(`http://localhost:${port}`)

        prismaService = app.get(PrismaService)
        await prismaService.cleanDb()
    })

    afterAll(() => {
        app.close()
    })

    // AUTH
    describe('/auth', () => {

        describe('POST /sign-up', () => {
            const dto: AuthDto = {
                email: 'test1@gmail.com',
                password: 'password123'
            }
            it('should throw if email empty', () => {
                return pactum.spec()
                    .post('/auth/sign-up')
                    .withBody({
                        password: dto.password
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST)
            })
            it('should throw if password empty', () => {
                return pactum.spec()
                    .post('/auth/sign-up')
                    .withBody({
                        email: dto.email
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST)
            })
            it('should throw if no body provided', () => {
                return pactum.spec()
                    .post('/auth/sign-up')
                    .expectStatus(HttpStatus.BAD_REQUEST)
            })
            it('should sign up', () => {
                return pactum.spec()
                    .post('/auth/sign-up')
                    .withBody(dto)
                    .expectStatus(HttpStatus.CREATED)
                    .inspect()
            })
        })

        describe('POST /sign-in', () => {
            const dto: AuthDto = {
                email: 'test1@gmail.com',
                password: 'password123'
            }
            it('should throw if email empty', () => {
                return pactum.spec()
                    .post('/auth/sign-in')
                    .withBody({
                        password: dto.password
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST)
            })
            it('should throw if password empty', () => {
                return pactum.spec()
                    .post('/auth/sign-in')
                    .withBody({
                        email: dto.email
                    })
                    .expectStatus(HttpStatus.BAD_REQUEST)
            })
            it('should throw if no body provided', () => {
                return pactum.spec()
                    .post('/auth/sign-in')
                    .expectStatus(HttpStatus.BAD_REQUEST)
            })
            it('should sign in', () => {
                return pactum.spec()
                    .post('/auth/sign-in')
                    .withBody(dto)
                    .expectStatus(HttpStatus.OK)
                    .stores('userAccessToken', 'access_token')
                    .inspect()
            })
        })

    })

    // USER
    describe('/users', () => {

        describe('GET /me', () => {
            it('should get current user', () => {
                return pactum.spec()
                    .get('/users/me')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAccessToken}'
                    })
                    .expectStatus(HttpStatus.OK)
                    .inspect()
            })
        })

        describe('PATCH /', () => {
            it('should edit user', () => {
                const dto: EditUserDto = {
                    firstName: "sus1",
                    email: "testEdit@gmail.com"
                }
                return pactum.spec()
                    .patch('/users')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAccessToken}'
                    })
                    .withBody(dto)
                    .expectStatus(HttpStatus.OK)
                    .expectBodyContains(dto.firstName)
                    .expectBodyContains(dto.email)
                    .inspect()
            })
        })


    })

    // CATEGORY
    describe('/categories', () => {

        describe('POST /create', () => {

        })

        describe('POST /edit', () => {

        })

        describe('POST /delete', () => {

        })

        describe('GET /id', () => {

        })

    })


});
