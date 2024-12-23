const User = require("../models/user");
const Chapter = require("../models/chapter.model");
const Instructor = require("../models/instructor.model");
const Course = require("../models/course-admin.model");
const Lecture = require("../models/lecture.model");
const Notes = require("../models/notes.model");
const mongoose = require("mongoose");

exports.getPurchasedCourses = async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Fetching Purchased Course Data Failed.",
        error: {
          code: "USER_NOT_FOUND",
          details: "User does not exist.",
        },
      });  
    } 

    const purchasedCourseIds = user.purchasedCourses.map(
      (course) => course.courseId
    );

    const courses = await Course.find({
      _id: { $in: purchasedCourseIds },
      standard: user.standard,
      published: true,
    })
      .select(
        "courseName imageUrls tags courseFeatures courseDuration courseDescription price discountedPrice faq instructorId"
      )
      .limit(10)
      .populate("instructorId", "_id fullname qualification instructorImg")
      .lean();

    if (courses.length <= 0) {
      return res.status(404).json({
        status: "error",
        message: "No purchased courses found.",
        error: {
          code: "NO_COURSES",
          details: "No purchased courses available for the user.",
        },
      });
    }

    const purchasedCourses = courses.map((course) => ({
      _id: course._id,
      courseName: course.courseName,
      allImageUrls: course.imageUrls,
      subjectsTags: course.tags,
      highlightPoints: course.courseFeatures,
      descriptionPoints: course.courseDescription,
      instructorsInfo: course.instructorId,
      isPurchased: true,
      indicators: [
        {
          iconImg:
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWxpYnJhcnktYmlnIj48cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSIxOCIgeD0iMyIgeT0iMyIgcng9IjEiLz48cGF0aCBkPSJNNyAzdjE4Ii8+PHBhdGggZD0iTTIwLjQgMTguOWMuMi41LS4xIDEuMS0uNiAxLjNsLTEuOS43Yy0uNS4yLTEuMS0uMS0xLjMtLjZMMTEuMSA1LjFjLS4yLS41LjEtMS4xLjYtMS4zbDEuOS0uN2MuNS0uMiAxLjEuMSAxLjMuNloiLz48L3N2Zz4=",
          displayName: `${course.tags.length} Subjects Covered`,
        },
        {
          iconImg:
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWxpYnJhcnktYmlnIj48cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSIxOCIgeD0iMyIgeT0iMyIgcng9IjEiLz48cGF0aCBkPSJNNyAzdjE4Ii8+PHBhdGggZD0iTTIwLjQgMTguOWMuMi41LS4xIDEuMS0uNiAxLjNsLTEuOS43Yy0uNS4yLTEuMS0uMS0xLjMtLjZMMTEuMSA1LjFjLS4yLS41LjEtMS4xLjYtMS4zbDEuOS0uN2MuNS0uMiAxLjEuMSAxLjMuNloiLz48L3N2Zz4=",
          displayName: `${course.courseDuration} months`,
        },
      ],
      faq: course.faq,
    }));

    return res.status(200).json({
      status: "success",
      message: "purchased Courses fetched successfully",
      data: { courses: purchasedCourses },
    });
  } catch (error) {
    console.error("Error fetching test series:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

exports.getRecommendedCourses = async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id).lean();

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Fetching Recommended Course Data Failed.",
        error: {
          code: "USER_NOT_FOUND",
          details: "User does not exist.",
        },
      });
    }

      const purchasedCourseIds = user.purchasedCourses.map(
        (course) => course.courseId
      );

    const courses = await Course.find({
      _id: { $nin: purchasedCourseIds },
      standard: user.standard,
      published: true,
    })
      .select(
        "courseName imageUrls tags courseFeatures courseDuration courseDescription price discountedPrice faq instructorId"
      )
      .limit(10)
      .populate("instructorId", "_id fullname qualification instructorImg")
      .lean();

    if (courses.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No recommended courses found.",
        error: {
          code: "NO_COURSES",
          details: "No recommended courses available for the user.",
        },
      });
    }

    const recommendedCourses = courses.map((course) => ({
      _id: course._id,
      courseName: course.courseName,
      allImageUrls: course.imageUrls,
      subjectsTags: course.tags,
      highlightPoints: course.courseFeatures,
      descriptionPoints: course.courseDescription,
      instructorsInfo: course.instructorId,
      price: {
        amount: course.price,
        discountPrice: course.discountedPrice,
        currency: "INR",
        discountPercentage: parseFloat(
          (
            ((course.price - course.discountedPrice) / course.price) *
            100
          ).toFixed(2)
        ),
      },
      isPurchased: false,
      indicators: [
        {
          iconImg:
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWxpYnJhcnktYmlnIj48cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSIxOCIgeD0iMyIgeT0iMyIgcng9IjEiLz48cGF0aCBkPSJNNyAzdjE4Ii8+PHBhdGggZD0iTTIwLjQgMTguOWMuMi41LS4xIDEuMS0uNiAxLjNsLTEuOS43Yy0uNS4yLTEuMS0uMS0xLjMtLjZMMTEuMSA1LjFjLS4yLS41LjEtMS4xLjYtMS4zbDEuOS0uN2MuNS0uMiAxLjEuMSAxLjMuNloiLz48L3N2Zz4=",
          displayName: `${course.tags.length} Subjects Covered`,
        },
        {
          iconImg:
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWxpYnJhcnktYmlnIj48cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSIxOCIgeD0iMyIgeT0iMyIgcng9IjEiLz48cGF0aCBkPSJNNyAzdjE4Ii8+PHBhdGggZD0iTTIwLjQgMTguOWMuMi41LS4xIDEuMS0uNiAxLjNsLTEuOS43Yy0uNS4yLTEuMS0uMS0xLjMtLjZMMTEuMSA1LjFjLS4yLS41LjEtMS4xLjYtMS4zbDEuOS0uN2MuNS0uMiAxLjEuMSAxLjMuNloiLz48L3N2Zz4=",
          displayName: `${course.courseDuration} months`,
        },
      ],
      faq: course.faq,
    }));

    return res.status(200).json({
      status: "success",
      message: "Recommended Courses fetched successfully",
      data: { courses: recommendedCourses },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        details: "An unexpected error occurred. Please try again later.",
      },
    });
  }
};

exports.getClasses = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        status: "error",
        message: "Fetching Classes Data Failed.",
        error: {
          code: "NO_CLASS_DATA",
          details: "Provide the required fields.",
        },
      });
    }

    const subjects = await Chapter.aggregate([
      {
        $match: {
          courseId: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: "$subjectName",
          chapterCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          subjectName: "$_id",
          chapterCount: 1,
        },
      },
    ]);

    if (!subjects.length) {
      return res.status(200).json({
        status: "error",
        message: "No subjects found for the given course.",
        error: {
          code: "NO_SUBJECTS_FOUND",
          details: "No data available for the provided course ID.",
        },
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Subjects and chapter count fetched successfully.",
      data: subjects,
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        details: "An unexpected error occurred. Please try again later.",
      },
    });
  }
};

exports.getChaptersBySubject = async (req, res) => {
  try {
    const { subjectName, courseId } = req.body;

    if (!courseId) {
      return res.status(404).json({
        status: "error",
        message: "Fetching Classes Data Failed.",
        error: {
          code: "NO_CLASS_DATA",
          details: "Provide the required fields.",
        },
      });
    }

    const chapterData = await Chapter.aggregate([
      {
        $match: {
          courseId: new mongoose.Types.ObjectId(courseId),
          subjectName: subjectName,
        },
      },
      {
        $lookup: {
          from: "lectures",
          localField: "_id",
          foreignField: "chapterId",
          as: "lectures",
        },
      },
      {
        $addFields: {
          lectureCount: { $size: "$lectures" },
          totalNotesCount: {
            $sum: "$lectures.notesCount",
          },
        },
      },
      {
        $project: {
          _id: 1,
          chapterName: 1,
          lectureCount: 1,
          totalNotesCount: 1,
        },
      },
    ]);

    if (!chapterData.length) {
      return res.status(404).json({
        status: "error",
        message: "No data found for the given course.",
        error: {
          code: "NO_DATA_FOUND",
          details: "No chapters, lectures, or notes available for the course.",
        },
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Data fetched successfully.",
      data: chapterData,
    });
  } catch (error) {
    console.error("Error fetching class details with counts:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        details: "An unexpected error occurred. Please try again later.",
      },
    });
  }
};

exports.getLectureByChapter = async (req, res) => {
  try {
    const { chapterId, courseId } = req.body;

    if (!chapterId || !courseId) {
      return res.status(400).json({
        status: "error",
        message: "Fetching Lectures Failed.",
        error: {
          code: "NO_CHAPTER_ID",
          details: "Provide the required chapter ID or course ID.",
        },
      });
    }

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({
        status: "error",
        message: "Chapter not found.",
        error: {
          code: "CHAPTER_NOT_FOUND",
          details: "The provided chapter ID does not match any record.",
        },
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Chapter not found.",
        error: {
          code: "Course_NOT_FOUND",
          details: "The provided course ID does not match any record.",
        },
      });
    }

    const lectures = await Lecture.aggregate([
      {
        $match: {
          chapterId: new mongoose.Types.ObjectId(chapterId),
          courseId: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $addFields: {
          streamKey: {
            $cond: {
              if: { $eq: ["$status", "live"] },
              then: "$streamKey",
              else: null,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          videoTitle: 1,
          videoLink: 1,
          duration: 1,
          status: 1,
          lectureDate: 1,
          streamKey: 1,
        },
      },
      { $sort: { lectureDate: 1 } },
    ]);

    if (!lectures.length) {
      return res.status(404).json({
        status: "error",
        message: "No lectures found for the given chapter.",
        error: {
          code: "NO_LECTURES_FOUND",
          details: "Ensure the chapter ID is correct and try again.",
        },
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Lectures fetched successfully.",
      data: lectures,
    });
  } catch (error) {
    console.error("Error fetching lectures by chapter:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        details: "An unexpected error occurred. Please try again later.",
      },
    });
  }
};

exports.getNotesByLecture = async (req, res) => {
  try {
    const { chapterId } = req.body;

    if (!chapterId) {
      return res.status(400).json({
        status: "error",
        message: "Fetching Notes Failed.",
        error: {
          code: "NO_CHAPTER_ID",
          details: "Provide the required chapter ID.",
        },
      });
    }

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({
        status: "error",
        message: "Chapter not found.",
        error: {
          code: "CHAPTER_NOT_FOUND",
          details: "The provided chapter ID does not match any record.",
        },
      });
    }

    const data = await Lecture.aggregate([
      {
        $match: { chapterId: new mongoose.Types.ObjectId(chapterId) },
      },
      {
        $lookup: {
          from: "notes",
          localField: "_id",
          foreignField: "lectureId",
          as: "notes",
        },
      },
      {
        $project: {
          _id: 1,
          lecturerName: 1,
          notes: {
            _id: 1,
            noteTitle: 1,
            noteContent: 1,
          },
        },
      },
      {
        $sort: { lectureDate: 1 },
      },
    ]);

    if (!data.length) {
      return res.status(404).json({
        status: "error",
        message: "No lectures or notes found for the given chapter.",
        error: {
          code: "NO_LECTURES_FOUND",
          details: "Ensure the chapter ID is correct and try again.",
        },
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Lectures and notes fetched successfully.",
      data: data,
    });
  } catch (error) {
    console.error("Error fetching notes by lecture:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        details: "An unexpected error occurred. Please try again later.",
      },
    });
  }
};

exports.getCoursesProgress = async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await User.findById({ _id });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Fetching Course Data Failed.",
        error: {
          code: "USER_NOT_FOUND",
          details: "User does not exist.",
        },
      });
    }

    const purchasedCourseMap = user.purchasedCourses.reduce((acc, course) => {
      if (course.completedLectures.length > 0) {
        acc[course.courseId.toString()] = course.completedLectures.length;
      }
      return acc;
    }, {});

    const courseIds = Object.keys(purchasedCourseMap);

    if (courseIds.length === 0) {
      return res.status(200).json({
        status: "error",
        message: "No started courses found.",
        error: {
          code: "NO_STARTED_COURSES",
          details: "User has not completed any lectures in any courses.",
        },
      });
    }

    const courses = await Course.aggregate([
      {
        $match: {
          _id: { $in: courseIds.map((id) => new mongoose.Types.ObjectId(id)) },
        },
      },
      {
        $lookup: {
          from: "lectures",
          localField: "_id",
          foreignField: "courseId",
          as: "courseLectures",
        },
      },
      {
        $addFields: {
          totalLectures: { $size: "$courseLectures" },
        },
      },
      {
        $project: {
          courseName: 1,
          totalLectures: 1,
        },
      },
    ]);

    if (courses.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No course details found.",
        error: {
          code: "COURSE_NOT_FOUND",
          details: "No details available for the started courses.",
        },
      });
    }

    const startedCourses = courses.map((course) => ({
      courseId: course._id,
      courseName: course.courseName,
      progress: Math.round(
        (purchasedCourseMap[course._id.toString()] / course.totalLectures) * 100
      ),
    }));

    return res.status(200).json({
      status: "success",
      message: "Started Courses fetched successfully.",
      data: startedCourses,
    });
  } catch (error) {
    console.error("Error fetching started courses:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

exports.saveLectures = async (req, res) => {
  try {
    const { _id } = req.user;
    const { lectureId } = req.body;

    if (!lectureId) {
      return res.status(400).json({
        status: "error",
        message: "Saving lecture Failed.",
        error: {
          code: "NO_LECTURE_ID",
          details: "Provide the required lecture ID.",
        }
      })
    }

    const user = await User.findById({ _id });
   
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Saving lecture Failed.",
        error: {
          code: "USER_NOT_FOUND",
          details: "User does not exist.",
        },
      });
    }

    const lecture = await Lecture.findById({ _id: lectureId });

    if (!lecture) {
      return res.status(404).json({
        status: "error",
        message: "Saving lecture Failed.",
        error: {
          code: "LECTURE_NOT_FOUND",
          details: "Lecture does not exist.",
        },
      });
    }

    await user.savedLectures.push(lectureId);
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Lecture saved successfully"
    });    
  } catch (error) {
    console.error("Error saving lectures:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
    
  }
}

exports.markasCompleted = async (req, res) => {
  try {
    const { lectureId, courseId } = req.body;
    const { _id } = req.user;

    if (!lectureId || !courseId) {
      return res.status(400).json({
        status: "error",
        message: "Marking lecture as completed Failed.",
        error: {
          code: "NO_LECTURE_ID",
          details: "Provide the required lecture ID or course ID.",
        },
      });
    }

    const user = await User.findOneAndUpdate(
      {
        _id,
        "purchasedCourses.courseId": courseId,
        "purchasedCourses.completedLectures": { $ne: lectureId },
      },
      {
        $push: { "purchasedCourses.$.completedLectures": lectureId },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Marking lecture as completed Failed.",
        error: {
          code: "USER_NOT_FOUND",
          details: "User or course not found.",
        },
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Lecture marked as completed.",
    });
  } catch (error) {
    console.error("Error marking lecture as completed:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};


exports.buycourse = async (req, res) => {
   try {
     const { courseId, userId } = req.body;

     if (!courseId || !userId) {
       return res.status(400).json({
         success: false,
         message: "CourseId and UserId are required.",
       });
     }

     const user = await User.findById(userId);

     if (!user) {
       return res.status(404).json({
         success: false,
         message: "User not found.",
       });
     }

     const isAlreadyPurchased = user.purchasedCourses.some(
       (course) => course.courseId.toString() === courseId
     );

     if (isAlreadyPurchased) {
       return res.status(400).json({
         success: false,
         message: "Course is already purchased.",
       });
     }

     user.purchasedCourses.push({
       courseId,
       completedLectures: [],
     });

     await user.save();

     return res.status(200).json({
       success: true,
       message: "Course added to purchased list successfully.",
     });
   } catch (error) {
     console.error("Error fetching Courses:", error);
     return res.status(500).json({
       status: "error",
       message: "Internal server error.",
     });
   }
}