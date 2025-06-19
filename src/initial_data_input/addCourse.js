import { createCourseDocument } from "../initial_data_input/create_course_document.js";

const sampleCourse = {
  courseCode: "COSC95A",
  courseId: "COSC95A_BSCS3-2_2024-2025-S2",
  courseName: "Programming Languages",
  professorId: "elvin123456",
  professorName: "Elvin Cerezo",
  program: "Bachelor of Science in Computer Science",
  section: "BSCS 3-2",
  term: "2024-2025-S2",
  yearLevel: "3",
};

createCourseDocument(sampleCourse);
