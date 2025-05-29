// src/services/studentService.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// Fetch student profile document by UID
export async function fetchStudentProfile(uid) {
  const docRef = doc(db, "students", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Student profile not found");
  }

  return docSnap.data();
}

// Fetch list of enrolled courses for a student with feedback status
export async function fetchEnrolledCoursesWithFeedback(student) {
  const enrolledCourses = student.enrolledCourses || [];
  const courseDataList = [];

  for (const courseId of enrolledCourses) {
    const courseDoc = await getDoc(doc(db, "courses", courseId));
    if (!courseDoc.exists()) continue;

    const courseData = courseDoc.data();

    // Construct feedback document ID: `${studentId}_${courseId}`
    const feedbackDocId = `${student.studentId}_${courseId}`;
    const feedbackRef = doc(db, "feedbacks", feedbackDocId);
    const feedbackSnap = await getDoc(feedbackRef);

    courseData.feedbackStatus = feedbackSnap.exists()
      ? feedbackSnap.data().status
      : "Pending";

    courseDataList.push(courseData);
  }

  return courseDataList;
}
