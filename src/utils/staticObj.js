export const errorObj = {
  email: null,
  password: null,
};

export const userObj = {
  email: "",
  password: "",
};

export const dropObj = [
  { text: "Select role", value: "" },
  { text: "Teacher", value: "teacher" },
  { text: "Student", value: "student" },
];

export const teacherNavObj = [
  { to: "dashboard", text: "Dashboard" },
  { to: "students", text: "Student" },
  { to: "profile", text: "Profile" },
];

export const studentNavObj = [
  { to: "dashboard", text: "Dashboard" },
  { to: "profile", text: "Profile" },
];

export const signUpUserObj = {
  name: "",
  email: "",
  password: "",
  role: "",
};

export const allStudentHeader = ["Index", "Name", "Email", "Status", "Action"];
export const studentTableHeader = ["Index", "Subject", "Score", "Rank"];
export const examListHeader = [
  "Subject",
  "Email",
  "Notes",
  "View Exam",
  "Delete Exam",
];
export const examFormHeader = ["Index", "Question", "Answer", "Action"];
export const studentDashboardHeader = [
  "Index",
  "Subject",
  "Email",
  "Notes",
  "Action",
];
export const studentResultHeader = ["Index", "Subject", "Score", "Rank"];
export const examDetailHeader = ["Index", "Question", "Answer", "Action"];

export const questionsErrorObj = {
  questionError: "",
  answerError: "",
  optionsError: "",
};
export const teacherErrorObj = {
  subjectError: "",
  queError: "",
  noteError: "",
};
export const TOTAL_QUESTIONS = 15;

export const resetPasswordObj = {
  oldPassword: "",
  password: "",
  confirmPassword: "",
};
export const resetPasswordErrorObj = {
  oldPassword: "",
  password: "",
  confirmPassword: "",
};
