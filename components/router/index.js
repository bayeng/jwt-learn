const router = require('express').Router();
const authRouter = require('../auth/auth.routes');

router.use(authRouter);

module.exports = router;
