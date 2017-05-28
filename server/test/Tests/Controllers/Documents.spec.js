import supertest from 'supertest';
import chai from 'chai';
import app from '../../../../server';
import databaseData from '../../TestHelpers/DatabaseData';

const expect = chai.expect;
const request = supertest.agent(app);
const superAdminUser = databaseData.superAdminUser;
const adminUser = databaseData.adminUser;
const regularUser = databaseData.regularUser;
const testDocument = databaseData.testDocument;
const invalidDocument = databaseData.invalidDocument;

describe('The Document API', function () {
  this.timeout(15000);
  let superAdminToken;
  let adminToken;
  let regularUserToken;

  before((done) => {
    request.post('/api/users/login')
      .send(superAdminUser)
      .end((error, res) => {
        superAdminToken = `JWT ${res.body.token}`;
        request.post('/api/users/login')
          .send(adminUser)
          .end((err, response) => {
            adminToken = `JWT ${response.body.token}`;
            request.post('/api/users/login')
              .send(regularUser)
              .end((err, res) => {
                regularUserToken = `JWT ${res.body.token}`;
                done();
              });
          });
      });
  });

  describe('DOCUMENTS REQUESTS', () => {
    describe('POST: /api/documents', () => {
      it('should create document if required fields are valid', (done) => {
        request.post('/api/documents')
        .set({ Authorization: superAdminToken })
        .send(testDocument)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
      });

      it('should return error if compulsory fields are invalid', (done) => {
        request.post('/api/documents')
        .set({ Authorization: regularUserToken })
        .send(invalidDocument)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('GET: /api/documents', () => {
      it('should return all available documents to super admin', (done) => {
        request.get('/api/documents')
        .set({ Authorization: superAdminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.documents.length).to.equal(10);
          done();
        });
      });

      it('should return admin\'s own documents, all regular user' +
      'documents,as well as public documents of anyone', (done) => {
        request.get('/api/documents')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.documents.length).to.equal(6);
          done();
        });
      });

      it('should return regular user\'s own documents, ' +
      'as well as public documents of anyone', (done) => {
        request.get('/api/documents')
        .set({ Authorization: regularUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.documents.length).to.equal(5);
          done();
        });
      });

      it('should allow user specify limit and offset', (done) => {
        request.get('/api/documents?limit=3&offset=3')
        .set({ Authorization: superAdminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.documents.length).to.equal(3);
          expect(res.body.paginationInfo.pageSize).to.equal(3);
          expect(res.body.paginationInfo.pageCount).to.equal(4);
          expect(res.body.paginationInfo.totalCount).to.equal(10);
          expect(res.body.paginationInfo.currentPage).to.equal(2);
          done();
        });
      });
    });

    describe('GET: /api/documents/:id', () => {
      it('should return any document to super admin', (done) => {
        // document with id 3 is private and belongs to an admin user
        request.get('/api/documents/3')
          .set({ Authorization: superAdminToken })
          .end((err, res) => {
            expect(res.status).to.equal(200);
          // document with id 5 has access role and belongs to a regular user
            request.get('/api/documents/5')
              .set({ Authorization: superAdminToken })
              .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
              });
          });
      });

      it('should return error if admin tries to access super admin\'s' +
      'private or role documents', (done) => {
        request.get('/api/documents/1')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });

      it('should return any regular user document for admin', (done) => {
        request.get('/api/documents/3')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          request.get('/api/documents/5')
          .set({ Authorization: adminToken })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            done();
          });
        });
      });

      it('should return error if regular user tries to access private or ' +
      'role documents of admin or super admin', (done) => {
        request.get('/api/documents/1')
        .set({ Authorization: regularUserToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          request.get('/api/documents/4')
          .set({ Authorization: regularUserToken })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          });
        });
      });

      it('should return error if document does not exist', (done) => {
        request.get('/api/documents/90')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          request.get('/api/documents/120')
          .set({ Authorization: regularUserToken })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          });
        });
      });

      it('should return any public document or role document belonging to ' +
      'regular users to a regular user', (done) => {
        request.get('/api/documents/2')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          request.get('/api/documents/5')
          .set({ Authorization: regularUserToken })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            done();
          });
        });
      });
    });

    describe('PUT: /api/documents/:id', () => {
      it('should allow super admin to edit any document', (done) => {
        request.put('/api/documents/3')
        .set({ Authorization: superAdminToken })
        .send({ title: 'Tayelolu' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('Tayelolu');
          done();
        });
      });

      it('should allow admin to edit document belonging to a regular user ' +
      'and their own', (done) => {
        request.put('/api/documents/5')
        .set({ Authorization: adminToken })
        .send({ title: 'Kehinde' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('Kehinde');
          done();
        });
      });

      it('should not allow admin to edit document belonging to another admin ' +
      'or super admin', (done) => {
        request.put('/api/documents/4')
        .set({ Authorization: adminToken })
        .send({ title: 'Kehinde' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          request.put('/api/documents/1')
          .set({ Authorization: adminToken })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          });
        });
      });

      it('should not allow regular user edit any document apart from theirs',
       (done) => {
         request.put('/api/documents/2')
         .set({ Authorization: regularUserToken })
         .send({ title: 'Kehinde' })
         .end((err, res) => {
           expect(res.status).to.equal(400);
           request.put('/api/documents/1')
           .set({ Authorization: regularUserToken })
           .end((err, res) => {
             expect(res.status).to.equal(400);
             done();
           });
         });
       });
    });

    describe('DELETE: /api/documents/:id', () => {
      it('should allow super admin delete any document', (done) => {
        request.delete('/api/documents/3')
        .set({ Authorization: superAdminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          request.delete('/api/documents/2')
          .set({ Authorization: superAdminToken })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            done();
          });
        });
      });

      it('should allow admin delete regular user documents', (done) => {
        request.delete('/api/documents/9')
        .set({ Authorization: adminToken })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
      });

      it('should not allow admin delete super admin or other admin documents',
       (done) => {
         request.delete('/api/documents/6')
          .set({ Authorization: adminToken })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            request.delete('/api/documents/4')
             .set({ Authorization: adminToken })
             .end((err, res) => {
               expect(res.status).to.equal(400);
               done();
             });
          });
       });

      it('should not allow the deletion of protected documents', (done) => {
        request.delete('/api/documents/1')
         .set({ Authorization: superAdminToken })
         .end((err, res) => {
           expect(res.status).to.equal(403);
           done();
         });
      });

      it('should allow a regular user to delete their documents and only ' +
      'their documents', (done) => {
        request.delete('/api/documents/5')
         .set({ Authorization: regularUserToken })
         .end((err, res) => {
           expect(res.status).to.equal(200);
           request.delete('/api/documents/1')
            .set({ Authorization: regularUserToken })
            .end((err, res) => {
              expect(res.status).to.equal(400);
              done();
            });
         });
      });
    });
  });
});
