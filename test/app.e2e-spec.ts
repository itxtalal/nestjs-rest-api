import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';
import { inspect } from 'util';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  //? Start the application before running tests
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333, () => {
      console.log('Testing on port 3333');
    });

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  //? Close the application after running tests
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const validCredentials = {
      email: 'test@testing.com',
      password: 'test1234',
    };

    describe('Signup', () => {
      it('should throw if email empty', () => {
        pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: '',
            password: validCredentials.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: validCredentials.email,
            password: '',
          })
          .expectStatus(400);
      });
      it('should throw if body empty', () => {
        pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup a user with valid credentials', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(validCredentials)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      const invalidCredentials = {
        email: 'test@testing.com',
        password: 'test12345',
      };
      it('should throw if email empty', () => {
        pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: '',
            password: validCredentials.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: validCredentials.email,
            password: '',
          })
          .expectStatus(400);
      });
      it('should throw if body empty', () => {
        pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin a user with valid credentials', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(validCredentials)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
      it('should not signin a user with invalid credentials', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(invalidCredentials)
          .expectStatus(403);
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200);
        // .inspect();
      });
    });
    describe('Edit user', () => {
      it('should edit users data', () => {
        const dto = {
          firstName: 'talal',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'My GitHub Profile',
        link: 'https://github.com/itxtalal',
      };
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams({ id: '$S{bookmarkId}' })
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .withBody({})
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Edit bookmark', () => {
      const dto: EditBookmarkDto = {
        description: 'This is my GitHub profile Link, you can check it out',
      };
      it('should edit the bookmark details', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams({ id: '$S{bookmarkId}' })
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.description);
      });
    });
    describe('Delete bookmark', () => {
      it('should delete the bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams({ id: '$S{bookmarkId}' })
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(204);
      });

      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
