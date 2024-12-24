const express = require("express");
const { authenticate } = require("../middlewares/auth");
const { getPurchasedCourses, getRecommendedCourses, getClasses, getChaptersBySubject } = require("../controllers/course.controller");

const router = express.Router();

router.post("/users-courses", authenticate, getPurchasedCourses);
router.post("/recommended-courses", authenticate, getRecommendedCourses);
router.post("/classes-by-course", authenticate, getClasses);
router.post("/chapter-by-subject", authenticate, getChaptersBySubject);


module.exports = router;
