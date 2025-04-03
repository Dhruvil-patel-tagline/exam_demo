/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createExam, updateExam } from "../../redux/action/examActions";
import ButtonCom from "../../shared/ButtonCom";
import InputCom from "../../shared/InputCom";
import Loader from "../../shared/Loader";
import { getCookie } from "../../utils/getCookie";
import {
  questionsErrorObj,
  teacherErrorObj,
  TOTAL_QUESTIONS,
} from "../../utils/staticObj";
import validate, { uniqueOpt } from "../../utils/validate";
import Buttons from "./components/Buttons";
import Questions from "./components/Questions";
import SubmitCancelBtn from "./components/SubmitCancelBtn";
import "./css/teacher.css";

const TeacherForm = () => {
  const token = getCookie("authToken");
  const exams = useSelector((state) => state.exams);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const isUpdateForm = pathname.includes("updateExam");

  const [currentQuestion, setCurrentQuestion] = useState(state?.currentQ || 0);
  const [allQuestionError, setAllQuestionError] = useState(
    Array(TOTAL_QUESTIONS).fill(false),
  );
  const [questionsError, setQuestionsError] = useState(questionsErrorObj);
  const [error, setError] = useState(teacherErrorObj);
  const [examData, setExamData] = useState({
    subjectName: state?.subject || "",
    questions:
      state?.questions ||
      Array(TOTAL_QUESTIONS)
        .fill()
        .map(() => ({
          question: "",
          answer: "",
          options: ["", "", "", ""],
        })),
    notes: state?.notes || ["", ""],
  });

  const isDuplicateQuestion = (index, value) => {
    return examData.questions.some(
      (q, i) => i !== index && q?.question?.trim() === value?.trim(),
    );
  };

  const handleQueValidate = (index) => {
    const errors = {};
    errors.optionsError = "";
    const updatedQuestions = [...examData.questions];
    const value = updatedQuestions[index];
    if (validate("question", value.question)) {
      errors.questionError = "Question cannot be empty";
    } else if (isDuplicateQuestion(index, value?.question)) {
      errors.questionError = "Duplicate question not allowed";
    } else {
      errors.questionError = "";
    }
    errors.answerError = validate("Answer", updatedQuestions[index]?.answer);
    updatedQuestions[index]?.options.forEach((val) => {
      if (!val) {
        errors.optionsError = "4 option is required for each question";
      }
    });
    if (!uniqueOpt(updatedQuestions[index]?.options)) {
      errors.optionsError = "Same option not allowed";
    }
    setQuestionsError(errors);
    if (questionsError.optionsError) {
      return null;
    }
    return Object.values(errors).every((val) => !val);
  };

  const handleQuestionSave = (index, page) => {
    let allQue;
    if (handleQueValidate(index)) {
      allQue = allQuestionError.map((val, arrIndex) =>
        arrIndex === index ? true : val,
      );
      setAllQuestionError(allQue);
      page &&
        setCurrentQuestion(
          page === "previous" ? currentQuestion - 1 : currentQuestion + 1,
        );
    } else {
      allQue = allQuestionError.map((val, arrIndex) =>
        arrIndex === index ? false : val,
      );
      setAllQuestionError(allQue);
    }
    if (allQue) {
      allQue.every((val) => val) && setError({ ...error, queError: null });
    }
    return allQue;
  };

  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setExamData({ ...examData, subjectName: value });
    if (error["subjectError"]) {
      setError({ ...error, subjectError: validate("Subject name", value) });
    }
  };

  const handleNoteChange = (index, value) => {
    const updatedNotes = [...examData.notes];
    updatedNotes[index] = value;
    if (error["noteError"]) {
      let notesError = null;
      if (!updatedNotes.every((note) => note.trim() !== "")) {
        notesError = "Notes are required";
      }
      if (updatedNotes[0].trim() === updatedNotes[1].trim()) {
        notesError = "Notes can not be same";
      }
      setError({ ...error, noteError: notesError });
    }
    setExamData({ ...examData, notes: updatedNotes });
  };

  const handleValidate = useCallback(
    (result) => {
      const errors = { ...teacherErrorObj };
      errors.subjectError = validate("Subject name", examData.subjectName);
      if (!examData.notes.every((note) => note.trim() !== "")) {
        errors.noteError = "Notes are required";
      } else if (examData.notes[0].trim() === examData.notes[1].trim()) {
        errors.noteError = "Notes can not be same";
      }
      setError(errors);
      if (result) {
        if (!result.every((val) => val)) {
          errors.queError =
            "Please fill out all the question";
          toast.error("Please fill out all the details");
        }
      }
      return Object.values(errors).every((val) => !val);
    },
    [examData],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result = handleQuestionSave(currentQuestion);
    if (!handleValidate(result)) return;
    if (isUpdateForm) {
      dispatch(updateExam(examData, state?.examId, token, navigate));
    } else {
      dispatch(createExam(examData, token, navigate));
    }
  };

  const resetForm = () => {
    setExamData({
      subjectName: "",
      questions: Array(TOTAL_QUESTIONS)
        .fill()
        .map(() => ({
          question: "",
          answer: "",
          options: ["", "", "", ""],
        })),
      notes: ["", ""],
    });
    setQuestionsError(questionsErrorObj);
    setAllQuestionError(Array(TOTAL_QUESTIONS).fill(false));
    setError(teacherErrorObj);
    setCurrentQuestion(0);
  };

  useEffect(() => {
    if (state?.questions) {
      setAllQuestionError(Array(TOTAL_QUESTIONS).fill(true));
    }
  }, [isUpdateForm]);

  if (isUpdateForm) {
    if (!state?.questions) {
      return (
        <div className="teacherFormErrorContainer">
          <p style={{ paddingTop: "70px", marginBottom: "10px" }}>
            Error occurred
          </p>
          <ButtonCom type="button" color="white" onClick={() => navigate(-1)}>
            Back
          </ButtonCom>
        </div>
      );
    }
  }

  return (
    <div>
      <div style={{ paddingTop: "20px" }}>
        {exams?.loading && <Loader />}
        <h1 className="teacherFormHeading">
          {isUpdateForm ? "Edit Exam" : "Create Exam"}
        </h1>
        <div className="teacherFormInner">
          <form
            onSubmit={handleSubmit}
            onReset={resetForm}
            style={{ maxWidth: "1100px" }}
          >
            <label htmlFor="subjectName" style={{ fontSize: "20px" }}>
              Subject Name
            </label>
            {error?.subjectError && (
              <span className="teacherError">{error.subjectError}</span>
            )}
            <InputCom
              type="text"
              name="subjectName"
              id="subjectName"
              value={examData.subjectName}
              onChange={handleSubjectChange}
              placeholder="Subject Name"
            />
            <label className="teacherLabel">Question</label>
            <Questions
              examData={examData}
              setExamData={setExamData}
              questionsError={questionsError}
              setQuestionsError={setQuestionsError}
              currentQuestion={currentQuestion}
              isDuplicateQuestion={isDuplicateQuestion}
            />
            <div>
              <Buttons
                currentQuestion={currentQuestion}
                handleQuestionSave={handleQuestionSave}
              />
            </div>
            <label style={{ fontSize: "20px" }}>Notes</label>
            {error?.noteError && (
              <span className="teacherError">{error.noteError}</span>
            )}
            {examData.notes.map((note, index) => (
              <InputCom
                key={index}
                type="text"
                placeholder={`Note ${index + 1}`}
                value={note}
                onChange={(e) => handleNoteChange(index, e.target.value)}
              />
            ))}
            <SubmitCancelBtn isUpdateForm={isUpdateForm} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;
