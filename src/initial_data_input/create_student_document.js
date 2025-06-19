import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js"; // Adjust path based on your structure

/**
 * Creates a student document in Firestore using the provided data.
 * @param {string} studentId - The document ID to use.
 * @param {Object} studentData - Student data object.
 */
export async function createStudentDocument(documentId, studentData) {
  const studentDocRef = doc(db, "students", documentId);
  const existing = await getDoc(studentDocRef);

  if (existing.exists()) {
    console.warn(`Student ${documentId} already exists. Skipping.`);
    return;
  }

  try {
    await setDoc(studentDocRef, {
      ...studentData,
      enrolledCourses: [], // Initialize with empty array as per your note
    });

    console.log(`✅ Student document created: ${documentId}`);
  } catch (error) {
    console.error("❌ Failed to create student document:", error);
  }
}




//import { createStudentDocument } from "../initial_data_input/create_student_document.js";

// You set the document ID manually
const documentId = "9F2jdpnByjZyoKjoLh73VYSyKMn1";


const studentData = {
  academicAdvisor: "Prof. Tony Stark",
  email: "main.sarahbernadine.buban@cvsu.edu.ph",
  fullName: "Sarah Bernadine P. Buban",
  name: "Sarah Buban",
  phoneNumber: "639124516789",
  profilePicture: "https://…", // Replace with actual URL
  program: "Bachelor of Science in Computer Science",
  section: "BSCS 3-2",
  studentId: "202201234",
  yearLevel: "3",
};


createStudentDocument(documentId, studentData);
