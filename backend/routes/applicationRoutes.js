const express = require('express');
const { applyToJob } = require('../controllers/applicationController');
const { isAuthenticated, isEmployee } = require('../middleware/auth');
const router = express.Router();

router.post('/', isAuthenticated, isEmployee, applyToJob);

module.exports = router;
