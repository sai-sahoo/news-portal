const authController = require('../controllers/authController');
const router = require('express').Router();
const middleware = require('../middlewares/middleware');

router.post('/api/login', authController.login);
router.post('/api/writer/add', middleware.auth, middleware.role, authController.add_writer);
router.get('/api/news/writers', middleware.auth, middleware.role, authController.get_writers);
router.get('/api/news/writer/:id', middleware.auth, middleware.role, authController.getWriterById);
router.put('/api/update/writer/:id', middleware.auth, middleware.role, authController.update_writer);
router.delete('/api/delete/writer/:id', middleware.auth, middleware.role, authController.delete_writer);
router.put('/api/profile/update/:id', middleware.auth, middleware.role, authController.update_profile);
router.get('/api/profile/:id', middleware.auth, middleware.role, authController.getProfileById);
router.post('/api/change-password', middleware.auth, authController.changePassword);

module.exports = router;