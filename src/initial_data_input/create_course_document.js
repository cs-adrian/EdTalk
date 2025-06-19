import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js"; // adjust the path to match your project structure

/**
 * Creates a course document in Firestore using the provided data.
 * @param {Object} course - Course data object.
 */
export async function createCourseDocument(course) {
  const {
    courseCode,
    courseId,
    courseName,
    professorId,
    professorName,
    program,
    section,
    term,
    yearLevel,
  } = course;

  const courseDocRef = doc(db, "courses", courseId);
  const existing = await getDoc(courseDocRef);
  if (existing.exists()) {
    console.warn(`Course ${courseId} already exists. Skipping.`);
    return;
  }
  try {
    await setDoc(courseDocRef, {
      courseCode,
      courseId,
      courseName,
      professorId,
      professorName,
      program,
      section,
      term,
      yearLevel,
    });

    console.log(`✅ Course document created: ${courseId}`);
  } catch (error) {
    console.error("❌ Failed to create course document:", error);
  }
}
