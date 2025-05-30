import { doc, getDoc, query, where, collection, getDocs } from "firebase/firestore";
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

// Fetch list of enrolled courses for a student with full feedback object
export async function fetchEnrolledCoursesWithFeedback(student) {
  const enrolledCourses = student.enrolledCourses || [];
  const courseDataList = [];

  for (const courseId of enrolledCourses) {
    const courseDocRef = doc(db, "courses", courseId);
    const courseDocSnap = await getDoc(courseDocRef);

    if (!courseDocSnap.exists()) continue;

    const courseData = courseDocSnap.data();

    // Construct feedback document ID: studentId + courseId
    // Ganyan ginamit ko na document Id ng feedbacks hahaha
    const feedbackDocId = `${student.studentId}_${courseId}`;
    const feedbackDocRef = doc(db, "feedbacks", feedbackDocId);
    const feedbackDocSnap = await getDoc(feedbackDocRef);

    const feedbackData = feedbackDocSnap.exists()
      ? feedbackDocSnap.data()
      : null;

    courseDataList.push({
      courseId,
      ...courseData,
      feedback: feedbackData,
    });
  }

  return courseDataList;
}

export async function fetchProfessorByProfessorId(professorId) {
  const q = query(
    collection(db, "professors"),
    where("professorId", "==", professorId)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("Professor not found");
  }

  // return the first result since unique naman professor Id
  return querySnapshot.docs[0].data();
}
