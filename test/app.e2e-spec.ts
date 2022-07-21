import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';

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

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  //? Close the application after running tests
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it.todo('should signup a new user');
    });
    describe('Signin', () => {
      it.todo('should signin a user');
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it.todo('should return users data');
    });
    describe('Edit user', () => {
      it.todo('should edit users data');
    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {
      it.todo('should create a new bookmark');
    });
    describe('Get bookmarks', () => {
      it.todo('should return all the bookmarks');
    });
    describe('Get bookmark by id', () => {
      it.todo('should return the bookmark of given id');
    });
    describe('Edit bookmark', () => {
      it.todo('should edit the bookmark details');
    });
    describe('Delete bookmark', () => {
      it.todo('should delete the bookmark');
    });
  });
});
