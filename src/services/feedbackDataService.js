import { fetchStudentProfile } from "./studentDataService";
import { doc, setDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebase";

//Creates initial feedback document based on enrolled courses 
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
      studentName: student.name,
      studentId: studentId,
      section: student.section,
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


// Submit or update feedback 
export async function submitFeedback({studentName, studentId, section, courseId, professorId, comments, responses }) {
  if (!studentId || !courseId || !professorId) {
    throw new Error("Missing required data to submit feedback.");
  }

  const feedbackId = `${studentId}_${courseId}`;
  const feedbackDocRef = doc(db, "feedbacks", feedbackId);

  const feedbackData = {
    studentName,
    studentId,
    section,
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

// Clear feedback content
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

// For calculating the average rating of a feedback response
function calculateAverageRating(responses) {
  if (!responses || responses.length === 0) return 0;

  const sum = responses.reduce((acc, r) => acc + (parseInt(r.rating)), 0);
  return sum / responses.length;
}


/* for professors only*/

// Fetch all feedback documents for a specific professor
export async function fetchFeedbacksByProfessorId(professorId) {
  const feedbacksRef = collection(db, "feedbacks");

  const q = query(feedbacksRef, where("professorId", "==", professorId));

  const snapshot = await getDocs(q);
  const feedbacks = [];

  snapshot.forEach(doc => {
    feedbacks.push({ id: doc.id, ...doc.data() });
  });

  return feedbacks;
}

export function calculateProfessorStats(feedbacks) {
  const submittedFeedbacks = feedbacks.filter(fb => fb.status === "submitted");
  const totalFeedbacks = submittedFeedbacks.length;

  if (totalFeedbacks === 0) {
    return { averageRating: 0, totalFeedbacks: 0 };
  }

  const sumRatings = submittedFeedbacks.reduce((acc, fb) => acc + parseFloat(fb.rating), 0);
  const averageRating = sumRatings / totalFeedbacks;

  return {
    averageRating: parseFloat(averageRating.toFixed(2)),
    totalFeedbacks
  };
}
