const request = require('supertest');
const express = require('express');
const mainRouter = require('../routes/app');

const app = express();
app.use('/', mainRouter);

describe('GET /', () => {
    it('should return Home page', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Home page');
    });
});

describe('GET /about', () => {
    it('should return About page', async () => {
        const res = await request(app).get('/about');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('About page');
    });
});