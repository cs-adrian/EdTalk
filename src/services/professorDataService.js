import { doc, getDoc, query, where, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

// Fetch professor profile document by UID
export async function fetchProfessorProfile(uid) {
  const docRef = doc(db, "professors", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Professor profile not found");
  }

  return docSnap.data();
}

// Fetch all courses handled by a professor (with course details)
export async function fetchCoursesHandledByProfessor(professor) {
  const coursesHandled = professor.coursesHandled || [];
  const courseDataList = [];

  for (const courseId of coursesHandled) {
    const courseDocRef = doc(db, "courses", courseId);
    const courseDocSnap = await getDoc(courseDocRef);

    if (!courseDocSnap.exists()) continue;

    const courseData = courseDocSnap.data();

    courseDataList.push({
      courseId,
      ...courseData,
    });
  }

  return courseDataList;
}

// Fetch professor data by professorId
export async function fetchProfessorByProfessorId(professorId) {
  const q = query(
    collection(db, "professors"),
    where("professorId", "==", professorId)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("Professor not found");
  }

  return querySnapshot.docs[0].data();
}
