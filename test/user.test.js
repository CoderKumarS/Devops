const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/user');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('GET /users', () => {
    it('should return message when list is empty', async () => {
        const res = await request(app).get('/users');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            message: "List is empty"
        });
    });

    it('should return list of users', async () => {
        // Create a user first
        await request(app)
            .post('/users')
            .send({ name: "Kumar", email: "email@email.com" });
        const res = await request(app).get('/users');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            message: "List of users",
            users: [
                {
                    id: 1,
                    name: "Kumar",
                    email: "email@email.com"
                }
            ]
        });
    });
});

describe('POST /users', () => {
    it('should create a new user', async () => {
        const res = await request(app)
            .post('/users')
            .send({ name: "Kumar2", email: "email@email.com" });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            message: "User created",
            user: {
                id: 2,
                name: "Kumar2",
                email: "email@email.com"
            }
        });
    });

    it('should return 400 for invalid input', async () => {
        const res = await request(app)
            .post('/users')
            .send({ name: "", email: "invalid-email" });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
            error: "Invalid input"
        });
    });
});

describe('GET /users/:id', () => {
    it('should return user by ID', async () => {
        await request(app)
            .post('/users')
            .send({ name: "Kumar", email: "email@email.com" });
        const res = await request(app).get('/users/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            message: "User with ID: 1",
            user: {
                id: 1,
                name: "Kumar",
                email: "email@email.com"
            }
        });
    });

    it('should return 404 for non-existent user', async () => {
        const res = await request(app).get('/users/999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "User not found" });
    });
});

describe('PUT /users/:id', () => {
    it('should update user by ID', async () => {
        await request(app)
            .post('/users')
            .send({ name: "Kumar", email: "email@email.com" });
        const res = await request(app)
            .put('/users/1')
            .send({ name: "Updated Kumar", email: "email@email.com" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            message: "User with ID: 1 updated",
            user: {
                id: 1,
                name: "Updated Kumar",
                email: "email@email.com"
            }
        });
    });

    it('should return 404 for non-existent user', async () => {
        const res = await request(app)
            .put('/users/999')
            .send({ name: "Non-existent User", email: "email@email.com" });
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "User not found" });
    });

    it('should return 400 for invalid input', async () => {
        await request(app)
            .post('/users')
            .send({ name: "Kumar", email: "email@email.com" });
        const res = await request(app)
            .put('/users/1')
            .send({ name: "", email: "invalid-email" });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
            error: "Invalid input"
        });
    });
});

describe('DELETE /users/:id', () => {
    it('should delete user by ID', async () => {
        await request(app)
            .post('/users')
            .send({ name: "Kumar", email: "email@email.com" });
        const res = await request(app).delete('/users/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            message: "User with ID: 1 deleted"
        });
    });

    it('should return 404 for non-existent user', async () => {
        const res = await request(app).delete('/users/999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "User not found" });
    });

    it('should return 400 for invalid user ID', async () => {
        const res = await request(app).delete('/users/invalid-id');
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
            message: "Invalid user ID"
        });
    });
});