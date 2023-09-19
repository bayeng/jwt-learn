const router = require('express').Router();
const { register, login } = require('./auth.controller');

router.post('/api/register', register);
router.post('/api/login', login);

module.exports = router;
