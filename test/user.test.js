const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('../routes/user');
const { User } = require('../models/user'); // Adjust path if needed

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect('mongodb://localhost:27017/backend_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
});

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
        const user = await User.create({ name: "Kumar", email: "email@email.com" });
        const res = await request(app).get('/users');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            message: "List of users",
            users: [
                {
                    _id: user._id.toString(),
                    name: "Kumar",
                    email: "email@email.com",
                    __v: 0
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
        expect(res.body).toMatchObject({
            message: "User created",
            user: {
                name: "Kumar2",
                email: "email@email.com"
            }
        });
        expect(res.body.user).toHaveProperty('_id');
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
        const user = await User.create({ name: "Kumar", email: "email@email.com" });
        const res = await request(app).get(`/users/${user._id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            message: `User with ID: ${user._id}`,
            user: {
                _id: user._id.toString(),
                name: "Kumar",
                email: "email@email.com",
                __v: 0
            }
        });
    });

    it('should return 404 for non-existent user', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/users/${fakeId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "User not found" });
    });
});

describe('PUT /users/:id', () => {
    it('should update user by ID', async () => {
        const user = await User.create({ name: "Kumar", email: "email@email.com" });
        const res = await request(app)
            .put(`/users/${user._id}`)
            .send({ name: "Updated Kumar", email: "email@email.com" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            message: `User updated`,
            user: {
                _id: user._id.toString(),
                name: "Updated Kumar",
                email: "email@email.com"
            }
        });
    });

    it('should return 404 for non-existent user', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .put(`/users/${fakeId}`)
            .send({ name: "Non-existent User", email: "email@email.com" });
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: "User not found" });
    });

    it('should return 400 for invalid input', async () => {
        const user = await User.create({ name: "Kumar", email: "email@email.com" });
        const res = await request(app)
            .put(`/users/${user._id}`)
            .send({ name: "", email: "invalid-email" });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
            error: "Invalid input"
        });
    });
});

describe('DELETE /users/:id', () => {
    it('should delete user by ID', async () => {
        const user = await User.create({ name: "Kumar", email: "email@email.com" });
        const res = await request(app).delete(`/users/${user._id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            message: `User with ID: ${user._id} deleted`
        });
    });

    it('should return 404 for non-existent user', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/users/${fakeId}`);
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