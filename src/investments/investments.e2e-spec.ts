import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { UserRole } from '../modules/users/entities/user.entity';

describe('InvestmentsController (e2e)', () => {
  let app: INestApplication;
  let entrepreneurToken: string;
  let investorToken: string;
  let createdProjectId: string;
  let createdInvestmentId: string;

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
        email: 'entrepreneur2@example.com',
        password: 'Password123!',
        firstname: 'John',
        lastname: 'Doe',
        role: UserRole.ENTREPRENEUR,
      });

    const entrepreneurResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'entrepreneur2@example.com',
        password: 'Password123!',
      });
    entrepreneurToken = entrepreneurResponse.body.access_token;

    // Créer un investisseur et obtenir son token
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'investor2@example.com',
        password: 'Password123!',
        firstname: 'Jane',
        lastname: 'Smith',
        role: UserRole.INVESTOR,
      });

    const investorResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'investor2@example.com',
        password: 'Password123!',
      });
    investorToken = investorResponse.body.access_token;

    // Créer un projet pour les tests d'investissement
    const projectResponse = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${entrepreneurToken}`)
      .send({
        title: 'Investment Test Project',
        description: 'Test Description',
        budget: 10000,
        category: 'Technology',
      });
    createdProjectId = projectResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /investments', () => {
    it('should create an investment successfully as investor', () => {
      return request(app.getHttpServer())
        .post('/investments')
        .set('Authorization', `Bearer ${investorToken}`)
        .send({
          projectId: createdProjectId,
          amount: 5000,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.projectId).toBe(createdProjectId);
          expect(res.body.amount).toBe(5000);
          createdInvestmentId = res.body.id;
        });
    });

    it('should fail when creating investment as entrepreneur', () => {
      return request(app.getHttpServer())
        .post('/investments')
        .set('Authorization', `Bearer ${entrepreneurToken}`)
        .send({
          projectId: createdProjectId,
          amount: 5000,
        })
        .expect(403);
    });

    it('should fail with invalid amount', () => {
      return request(app.getHttpServer())
        .post('/investments')
        .set('Authorization', `Bearer ${investorToken}`)
        .send({
          projectId: createdProjectId,
          amount: -1000,
        })
        .expect(400);
    });

    it('should fail with non-existent project', () => {
      return request(app.getHttpServer())
        .post('/investments')
        .set('Authorization', `Bearer ${investorToken}`)
        .send({
          projectId: 'non-existent-id',
          amount: 5000,
        })
        .expect(404);
    });
  });

  describe('GET /investments', () => {
    it('should get all investments for investor', () => {
      return request(app.getHttpServer())
        .get('/investments')
        .set('Authorization', `Bearer ${investorToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should fail when entrepreneur tries to get all investments', () => {
      return request(app.getHttpServer())
        .get('/investments')
        .set('Authorization', `Bearer ${entrepreneurToken}`)
        .expect(403);
    });
  });

  describe('GET /investments/project/:id', () => {
    it('should get investments for a project', () => {
      return request(app.getHttpServer())
        .get(`/investments/project/${createdProjectId}`)
        .set('Authorization', `Bearer ${entrepreneurToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should fail with non-existent project', () => {
      return request(app.getHttpServer())
        .get('/investments/project/non-existent-id')
        .set('Authorization', `Bearer ${entrepreneurToken}`)
        .expect(404);
    });
  });

  describe('DELETE /investments/:id', () => {
    it('should delete investment as owner', () => {
      return request(app.getHttpServer())
        .delete(`/investments/${createdInvestmentId}`)
        .set('Authorization', `Bearer ${investorToken}`)
        .expect(200);
    });

    it('should fail when non-owner tries to delete', () => {
      // Create a new investment first
      return request(app.getHttpServer())
        .post('/investments')
        .set('Authorization', `Bearer ${investorToken}`)
        .send({
          projectId: createdProjectId,
          amount: 3000,
        })
        .expect(201)
        .then((res) => {
          const investmentId = res.body.id;
          // Try to delete as entrepreneur
          return request(app.getHttpServer())
            .delete(`/investments/${investmentId}`)
            .set('Authorization', `Bearer ${entrepreneurToken}`)
            .expect(403);
        });
    });
  });
}); 