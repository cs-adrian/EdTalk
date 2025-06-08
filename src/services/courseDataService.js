import { db } from "../firebase";
import { collection, getDocs, doc, getDoc, query, where, } from "firebase/firestore";

// Helper: Extract studentId from feedback document ID
function extractStudentId(feedbackDocId) {
  return feedbackDocId.split("_")[0];
}

// 1. Get number of students from a section enrolled in a course
export async function getStudentCountInSectionForCourse(courseId, section) {
  const studentsSnapshot = await getDocs(collection(db, "students"));
  let count = 0;

  studentsSnapshot.forEach(docSnap => {
    const student = docSnap.data();
    const isInSection = student.section === section;
    const isEnrolled = student.enrolledCourses?.includes(courseId);
    if (isInSection && isEnrolled) {
      count++;
    }
  });

  return count;
}

// 2. Get overall rating of the course based on feedbacks from a section
export async function getAverageRatingForCourseInSection(courseId, section) {
  const q = query(
    collection(db, "feedbacks"),
    where("courseId", "==", courseId),
    where("section", "==", section),
    where("status", "==", "submitted")
  );

  const snapshot = await getDocs(q);
  let totalRating = 0;
  let count = 0;

  snapshot.forEach(doc => {
    const feedback = doc.data();
    totalRating += Number(feedback.rating); // Ensure it's numeric
    count++;
  });

  return count > 0 ? totalRating / count : 0;
}



// 3. Get number of feedback responses for a course from a section
export async function getFeedbackCountForCourseInSection(courseId, section) {
  const q = query(
    collection(db, "feedbacks"),
    where("courseId", "==", courseId),
    where("section", "==", section),
    where("status", "==", "submitted")
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

// 4. Fetch all submitted feedbacks for a course from a section
export async function fetchFeedbacksForCourseInSection(courseId, section) {
  const q = query(
    collection(db, "feedbacks"),
    where("courseId", "==", courseId),
    where("section", "==", section),
    where("status", "==", "submitted")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

