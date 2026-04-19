const newsController = require('../controllers/newsController');
const router = require('express').Router();
const middleware = require('../middlewares/middleware');

router.post('/api/news/add', middleware.auth, newsController.add_news);
router.get('/api/news/images', middleware.auth, newsController.get_images);
router.post('/api/news/images/add', middleware.auth, newsController.add_images);
router.get('/api/news', middleware.auth, newsController.get_all_news);
router.get('/api/news/edit/:news_id', middleware.auth, newsController.get_edit_news);
router.put('/api/news/update/:news_id', middleware.auth, newsController.update_news);
router.patch('/api/news/update/status', middleware.auth, newsController.update_news_status);
router.patch("/api/news/update/breaking", middleware.auth, newsController.update_news_breaking);
router.patch("/api/news/update/featured", middleware.auth, newsController.update_news_featured);
router.patch("/api/news/update/pinned", middleware.auth, newsController.update_news_pinned);
router.delete('/api/news/delete/:news_id', middleware.auth, newsController.delete_news);


module.exports = router;