const express = require('express')
const router = express.Router()

// define the home page route
router.get('/', (req, res) => {
    res.send('Home page')
})
// define the about route
router.get('/about', (req, res) => {
    res.send('About page')
})
router.get('/contact', (req, res) => {
    res.send('Contact page')
})
router.get('/gallery', (req, res) => {
    res.send('Gallery page')
})
router.get('/login', (req, res) => {
    res.send('Login page')
})

module.exports = router
