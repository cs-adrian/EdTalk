import { fetchStudentProfile } from "./studentDataService";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

//Gagawa ng initial feedback document based sa enrolled courses (For student side only)
export async function createInitialFeedbackDocuments(uid) {
  const student = await fetchStudentProfile(uid);
  const studentId = student.studentId;
  const enrolledCourses = student.enrolledCourses || [];

  for (const courseId of enrolledCourses) {
    const feedbackId = `${studentId}_${courseId}`;
    console.log(`${feedbackId}`)
    const feedbackDocRef = doc(db, "feedbacks", feedbackId);
    
    const feedbackSnap = await getDoc(feedbackDocRef);

    if (feedbackSnap.exists()) {
      console.log(`Feedback for ${feedbackId} already exists. Skipping.`);
      continue;
    }

    const courseDocRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseDocRef);

    if (!courseSnap.exists()) {
      console.warn(`Course ${courseId} not found. Skipping.`);
      continue;
    }

    const courseData = courseSnap.data();
    const professorId = courseData.professorId;
    

    const newFeedback = {
      studentId: studentId,
      courseId: courseId,
      professorId: professorId,
      comment: "",
      responses: [],
      status: "pending",
      rating: "0",
    };

    await setDoc(feedbackDocRef, newFeedback);
    console.log(`Created feedback document: ${feedbackId}`);
  }
}


// Submit or update feedback (For student side only)
export async function submitFeedback({ studentId, courseId, professorId, comments, responses }) {
  if (!studentId || !courseId || !professorId) {
    throw new Error("Missing required data to submit feedback.");
  }

  const feedbackId = `${studentId}_${courseId}`;
  const feedbackDocRef = doc(db, "feedbacks", feedbackId);

  const feedbackData = {
    studentId,
    courseId,
    professorId,
    comment: comments,
    responses, // Array of { question, rating }
    status: "submitted",
    rating: calculateAverageRating(responses).toString(), 
  };

  await setDoc(feedbackDocRef, feedbackData);
}

// Load feedback to prefill form for editing
export async function fetchFeedbackByStudentAndCourse(studentId, courseId) {
  const feedbackId = `${studentId}_${courseId}`;
  console.log(`${feedbackId}`)
  const feedbackDocRef = doc(db, "feedbacks", feedbackId);
  const feedbackSnap = await getDoc(feedbackDocRef);

  if (!feedbackSnap.exists()) return null;

  return feedbackSnap.data();
}

// Clear feedback content (For student side only)
export async function clearFeedback(studentId, courseId) {
  const feedbackId = `${studentId}_${courseId}`;
  const feedbackDocRef = doc(db, "feedbacks", feedbackId);

  const clearedData = {
    comment: "",
    responses: [],
    status: "pending",
    rating: "0",
  };

  await setDoc(feedbackDocRef, clearedData, { merge: true });
}


function calculateAverageRating(responses) {
  if (!responses || responses.length === 0) return 0;

  const sum = responses.reduce((acc, r) => acc + (parseInt(r.rating)), 0);
  return sum / responses.length;
}

