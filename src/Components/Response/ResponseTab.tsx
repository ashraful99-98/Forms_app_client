import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FormType, useFormContext } from "../../context/FormContext";

// Option and Question type definitions

export interface ImageDataType {
  public_id: string;
  url: string;
}
interface OptionType {
  _id?: string;
  optionText: string;
  optionImage?: ImageDataType;
}

export interface QuestionType {
  _id: string;
  questionText: string;
  questionImage?: ImageDataType;
  options: OptionType[];
}

export interface ResponseItem {
  questionId: string;
  optionId?: string;
  answerText?: string;
}

export interface ResponseType {
  _id?: string;
  formId: string;
  userId: string;
  response: ResponseItem[];
  submittedAt?: string;
}

export interface ResponseTabProps {
  formData: FormType;
  formId: string;
}

// interface QuestionsTabProps {
//   formData: FormDataType;
// }

const ResponseTab: React.FC<ResponseTabProps> = ({ formData, formId }) => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const { responses, fetchResponsesByFormId } = useFormContext();

  useEffect(() => {
    if (formData?.questions) {
      setQuestions(formData.questions as QuestionType[]);
    }
  }, [formData]);

  useEffect(() => {
    if (formId) {
      fetchResponsesByFormId(formId);
    }
  }, [formId, fetchResponsesByFormId]);

  const getSelectedOption = (
    qId: string,
    questionIndex: number,
    responseIndex: number
  ): string => {
    const responseData = responses[responseIndex];
    if (!responseData) return "Not attempted";

    const selectedOption = responseData.response.find(
      (item) => item.questionId === qId
    );
    if (selectedOption) {
      const option = questions[questionIndex]?.options.find(
        (opt) => opt._id === selectedOption.optionId
      );
      return option ? option.optionText : "Not attempted";
    }
    return "Not attempted";
  };

  // ✅ Runtime safety check
  if (!formData || !formData._id) {
    return (
      <div>
        <h2>Loading form details...</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>Responses</h2>
      <TableContainer component={Paper}>
        <Table aria-label="responses table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>User</strong>
              </TableCell>
              {questions.map((question, index) => (
                <TableCell key={question._id} align="right">
                  {question.questionText}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {responses.map((response, responseIndex) => (
              <TableRow key={response._id || responseIndex}>
                <TableCell component="th" scope="row">
                  {response.userId}
                </TableCell>
                {questions.map((question, questionIndex) => (
                  <TableCell key={question._id} align="right">
                    {getSelectedOption(
                      question._id,
                      questionIndex,
                      responseIndex
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ResponseTab;
