import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { UserRole } from '../modules/users/entities/user.entity';

describe('ProjectsController (e2e)', () => {
  let app: INestApplication;
  let entrepreneurToken: string;
  let investorToken: string;
  let adminToken: string;
  let createdProjectId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Créer un entrepreneur et obtenir son token
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'entrepreneur@example.com',
        password: 'Password123!',
        firstname: 'John',
        lastname: 'Doe',
        role: UserRole.ENTREPRENEUR,
      });

    const entrepreneurResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'entrepreneur@example.com',
        password: 'Password123!',
      });
    entrepreneurToken = entrepreneurResponse.body.access_token;

    // Créer un investisseur et obtenir son token
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'investor@example.com',
        password: 'Password123!',
        firstname: 'Jane',
        lastname: 'Smith',
        role: UserRole.INVESTOR,
      });

    const investorResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'investor@example.com',
        password: 'Password123!',
      });
    investorToken = investorResponse.body.access_token;

    // Créer un admin et obtenir son token
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'admin@example.com',
        password: 'Password123!',
        firstname: 'Admin',
        lastname: 'User',
        role: UserRole.ADMIN,
      });

    const adminResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Password123!',
      });
    adminToken = adminResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /projects', () => {
    it('should create a project successfully as entrepreneur', () => {
      return request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${entrepreneurToken}`)
        .send({
          title: 'Test Project',
          description: 'Test Description',
          budget: 10000,
          category: 'Technology',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Project');
          createdProjectId = res.body.id;
        });
    });

    it('should fail when creating project as investor', () => {
      return request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${investorToken}`)
        .send({
          title: 'Test Project 2',
          description: 'Test Description',
          budget: 10000,
          category: 'Technology',
        })
        .expect(403);
    });

    it('should fail with invalid data', () => {
      return request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${entrepreneurToken}`)
        .send({
          title: '', // Invalid empty title
          description: 'Test Description',
          budget: -1000, // Invalid negative budget
          category: 'Technology',
        })
        .expect(400);
    });
  });

  describe('GET /projects', () => {
    it('should get all projects', () => {
      return request(app.getHttpServer())
        .get('/projects')
        .set('Authorization', `Bearer ${entrepreneurToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .get('/projects')
        .expect(401);
    });
  });

  describe('GET /projects/:id', () => {
    it('should get project by id', () => {
      return request(app.getHttpServer())
        .get(`/projects/${createdProjectId}`)
        .set('Authorization', `Bearer ${entrepreneurToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdProjectId);
          expect(res.body.title).toBe('Test Project');
        });
    });

    it('should fail with non-existent project id', () => {
      return request(app.getHttpServer())
        .get('/projects/non-existent-id')
        .set('Authorization', `Bearer ${entrepreneurToken}`)
        .expect(404);
    });
  });

  describe('DELETE /projects/:id', () => {
    it('should delete project as creator', () => {
      return request(app.getHttpServer())
        .delete(`/projects/${createdProjectId}`)
        .set('Authorization', `Bearer ${entrepreneurToken}`)
        .expect(200);
    });

    it('should fail when non-creator tries to delete', () => {
      return request(app.getHttpServer())
        .delete(`/projects/${createdProjectId}`)
        .set('Authorization', `Bearer ${investorToken}`)
        .expect(403);
    });

    it('should allow admin to delete any project', () => {
      // First create a new project
      return request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${entrepreneurToken}`)
        .send({
          title: 'Admin Delete Test',
          description: 'Test Description',
          budget: 10000,
          category: 'Technology',
        })
        .expect(201)
        .then((res) => {
          const projectId = res.body.id;
          // Then try to delete it as admin
          return request(app.getHttpServer())
            .delete(`/projects/${projectId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);
        });
    });
  });
}); 