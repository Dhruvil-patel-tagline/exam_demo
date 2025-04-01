import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import edit from "../../assets/edit.svg";
import { fetchEditExamList } from "../../redux/action/examActions";
import ButtonCom from "../../shared/ButtonCom";
import Table from "../../shared/Table";
import { getCookie } from "../../utils/getCookie";
import { examDetailHeader } from "../../utils/staticObj";
import "./css/teacher.css";

const ExamDetail = () => {
  const token = getCookie("authToken");
  const examListObj = useSelector((state) => state?.editExam);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();

  const initialSubject = state?.subject || "";
  const initialNotes = state?.notes || ["", ""];
  const [examData, setExamData] = useState({
    subjectName: initialSubject,
    notes: initialNotes,
    questions: [],
  });
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (examListObj?.quesArray.length) {
      setExamData({
        ...examData,
        questions: examListObj?.quesArray,
      });
      setQuestions(examListObj?.quesArray);
    }
  }, [examListObj]);

  const handleEdit = (index) => {
    navigate(`/updateExam/${id}`, {
      state: {
        subject: initialSubject,
        notes: initialNotes,
        examId: id,
        currentQ: index,
        questions: questions,
      },
    });
  };

  useEffect(() => {
    dispatch(fetchEditExamList(id, token));
  }, [id, token]);

  const tableData = useMemo(() => {
    return examData?.questions?.map((q, index) => ({
      Index: index + 1,
      Question: q?.question,
      Answer: q?.answer,
      Action: (
        <ButtonCom onClick={() => handleEdit(index)}>
          <span className="bntIcon">
            <img src={edit} width="18px" height="18px" />
            Edit
          </span>
        </ButtonCom>
      ),
    }));
  }, [examData]);

  return (
    <div className="examDetailRoot">
      <div style={{ width: "100%", maxWidth: "900px" }}>
        <Table
          tableData={tableData}
          tableHeader={examDetailHeader}
          isLoading={examListObj.loading}
          minWidth={"500px"}
          error={examListObj.error}
        />
      </div>
    </div>
  );
};

export default ExamDetail;
