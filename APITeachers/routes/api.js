var express = require('express');
var router = express.Router();

router.use('/users', require('./api/users.js'));
router.use('/admin', require('./api/admin.js'));
router.use('/students', require('./api/students'));
router.use('/student-classes', require('./api/student-classes'));
router.use('/ratings', require('./api/ratings'));
router.use('/teachers', require('./api/teachers'));
router.use('/teacher-classes', require('./api/teacher-classes'));
router.use('/booking', require('./api/booking'));

module.exports = router;