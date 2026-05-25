const request = require('supertest');
const path = require('path');
const fs = require('fs');

process.env.DB_PATH = path.join(__dirname, '../../data/test_notes.db');

const app = require('../../backend/src/app');
const { closeDb } = require('../../backend/src/db/database');

let token;
let noteId;

beforeAll(async () => {
  const res = await request(app).post('/api/auth/register').send({
    username: 'notesuser',
    email: 'notes@example.com',
    password: 'secret123',
  });
  token = res.body.token;
});

afterAll(() => {
  closeDb();
  if (fs.existsSync(process.env.DB_PATH)) fs.unlinkSync(process.env.DB_PATH);
});

describe('GET /api/notes', () => {
  it('returns empty list for new user', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/notes', () => {
  it('creates a note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My First Note', content: 'Hello World' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('My First Note');
    expect(res.body.content).toBe('Hello World');
    noteId = res.body.id;
  });

  it('creates a note without content', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'No Content Note' });
    expect(res.status).toBe(201);
    expect(res.body.content).toBe('');
  });

  it('rejects note without title', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'no title here' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/notes/:id', () => {
  it('returns a specific note', async () => {
    const res = await request(app)
      .get(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(noteId);
  });

  it('returns 404 for non-existent note', async () => {
    const res = await request(app)
      .get('/api/notes/99999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/notes/:id', () => {
  it('updates a note', async () => {
    const res = await request(app)
      .put(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title', content: 'Updated content' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('returns 404 for non-existent note', async () => {
    const res = await request(app)
      .put('/api/notes/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Ghost' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/notes/:id', () => {
  it('deletes a note', async () => {
    const res = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  it('returns 404 when deleting already deleted note', async () => {
    const res = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
