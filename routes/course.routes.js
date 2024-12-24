const express = require("express");
const { authenticate } = require("../middlewares/auth");
const { getPurchasedCourses, getRecommendedCourses, getClasses, getChaptersBySubject, getLectureByChapter, buycourse, getCoursesProgress, saveLectures, markasCompleted } = require("../controllers/course.controller");

const router = express.Router();

router.post("/users-courses", authenticate, getPurchasedCourses);
router.post("/recommended-courses", authenticate, getRecommendedCourses);
router.post("/classes-by-course", authenticate, getClasses);
router.post("/chapter-by-subject", authenticate, getChaptersBySubject);
router.post("/lecture-by-chapter", authenticate, getLectureByChapter);
router.get("/course-progress", authenticate, getCoursesProgress);
router.post("/save-lecture", authenticate, saveLectures);
router.post("/mark-as-completed", authenticate, markasCompleted);
router.post("/buy-course", buycourse);

module.exports = router;
