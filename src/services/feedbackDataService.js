// src/services/feedbackDataService.js

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// Submit or update feedback
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
    rating: calculateAverageRating(responses).toString(), // Store as string for consistency
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

function calculateAverageRating(responses) {
  if (!responses || responses.length === 0) return 0;

  // Invert the 1–5 rating (1=Excellent becomes 5, 5=Poor becomes 1)
  const invertedSum = responses.reduce((acc, r) => acc + (6 - parseInt(r.rating)), 0);
  return invertedSum / responses.length;
}

