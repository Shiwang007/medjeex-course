const express = require("express");
const { authenticate } = require("../middlewares/auth");
const { getPurchasedCourses, getRecommendedCourses, getClasses, getChaptersBySubject, getLectureByChapter, buycourse, getCoursesProgress, saveLectures, markasCompleted, likeLecture, disLikeLecture, addLectureComments, getLectureComments, getNestedComments, getNotesByLecture, getNotesByLectureId, addNestedComments, likeComments, deleteComment } = require("../controllers/course.controller");

const router = express.Router();

router.post("/users-courses", authenticate, getPurchasedCourses);
router.post("/recommended-courses", authenticate, getRecommendedCourses);
router.post("/classes-by-course", authenticate, getClasses);
router.post("/chapter-by-subject", authenticate, getChaptersBySubject);
router.post("/lecture-by-chapter", authenticate, getLectureByChapter);
router.get("/course-progress", authenticate, getCoursesProgress);
router.post("/all-notes-by-lecture", authenticate, getNotesByLecture);
router.post("/notes-by-lectureId", authenticate, getNotesByLectureId);
router.post("/save-lecture", authenticate, saveLectures);
router.post("/mark-as-completed", authenticate, markasCompleted);
router.post("/like-lecture", authenticate, likeLecture);
router.post("/dislike-lecture", authenticate, disLikeLecture);

// comment routes
router.post("/add-comment", authenticate, addLectureComments);
router.post("/add-nested-comment", authenticate, addNestedComments);
router.post("/lecture-comments", authenticate, getLectureComments);
router.post("/nested-comments", authenticate, getNestedComments);
router.post("/like-comment", authenticate, likeComments);
router.post("/delete-comment", authenticate, deleteComment);

router.post("/buy-course", buycourse);

module.exports = router;
