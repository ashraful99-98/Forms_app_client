import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Grid,
  Paper,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../context/AuthContext";
import { useFormContext, FormType } from "../../context/FormContext";
import { useParams } from "react-router-dom";

// Interfaces
export interface ImageDataType {
  public_id: string;
  url: string;
}

interface Option {
  _id: string;
  optionText: string;
  optionImage?: ImageDataType;
}

interface Question {
  _id: string;
  questionText: string;
  questionImage?: ImageDataType;
  options: Option[];
}

interface ResponseData {
  questionId: string;
  optionId: string;
}

const UserView: React.FC = () => {
  const { user } = useAuth();
  const { fetchFormById, submitResponse } = useFormContext();
  const { formId } = useParams<{ formId: string }>();

  const [userId, setUserId] = useState<string>("");
  const [formData, setFormData] = useState<FormType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responseData, setResponseData] = useState<ResponseData[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {}
  );

  // Set user ID
  useEffect(() => {
    if (user) {
      setUserId(user._id);
    } else {
      const anonymousUserId =
        "anonymous" +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      setUserId(anonymousUserId);
    }
  }, [user]);

  // Fetch form
  useEffect(() => {
    if (!formId) return;

    fetchFormById(formId)
      .then((data: FormType) => {
        setFormData(data);
        setQuestions(data.questions as Question[]);
      })
      .catch((error: any) => {
        const resMessage =
          error.response?.data?.message || error.message || error.toString();
        console.error(resMessage);
      });
  }, [formId, fetchFormById]);

  // Handle radio button change
  const handleRadioChange = (optionId: string, questionId: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));

    setResponseData((prevResponses) => {
      const index = prevResponses.findIndex((r) => r.questionId === questionId);
      const newResponse = { questionId, optionId };
      if (index === -1) {
        return [...prevResponses, newResponse];
      } else {
        const updatedResponses = [...prevResponses];
        updatedResponses[index] = newResponse;
        return updatedResponses;
      }
    });
  };

  // Submit handler
  const handleSubmit = () => {
    if (!formData) return;

    const submissionData = {
      formId: formData._id,
      userId,
      response: responseData,
    };

    submitResponse(submissionData)
      .then(() => {
        setIsSubmitted(true);
      })
      .catch((error: any) => {
        const resMessage =
          error.response?.data?.message || error.message || error.toString();
        console.error(resMessage);
      });
  };

  const reloadForAnotherResponse = () => {
    window.location.reload();
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh" }}>
      <AppBar position="static" style={{ backgroundColor: "teal" }}>
        <Toolbar>
          <IconButton
            edge="start"
            style={{ marginRight: "10px", marginBottom: "5px" }}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Forms App</Typography>
        </Toolbar>
      </AppBar>

      <Grid container direction="column" alignItems="center">
        <Grid
          style={{
            borderTop: "10px solid teal",
            borderRadius: 10,
            width: "100%",
            maxWidth: "900px",
            marginTop: "20px",
          }}
        >
          <Paper elevation={2}>
            <div style={{ padding: "20px" }}>
              <Typography variant="h4" gutterBottom>
                {formData.name}
              </Typography>
              <Typography variant="subtitle1">
                {formData.description}
              </Typography>
            </div>
          </Paper>

          {!isSubmitted ? (
            <>
              {questions.map((ques) => (
                <Paper
                  key={ques._id}
                  style={{ marginTop: "16px", padding: "15px" }}
                >
                  <Typography variant="subtitle1">
                    {ques.questionText}
                  </Typography>

                  {/* Conditional question image */}
                  {ques.questionImage?.url && (
                    <Box sx={{ maxWidth: "500px" }}>
                      <img
                        src={ques.questionImage.url}
                        width="100%"
                        alt="question"
                        style={{ marginTop: "10px" }}
                      />
                    </Box>
                  )}

                  <RadioGroup
                    aria-label={`question-${ques._id}`}
                    name={`question-${ques._id}`}
                    value={selectedValues[ques._id] || ""}
                    onChange={(e) =>
                      handleRadioChange(e.target.value, ques._id)
                    }
                  >
                    {ques.options.map((op) => (
                      <div key={op._id} style={{ marginLeft: "10px" }}>
                        <FormControlLabel
                          value={op._id}
                          control={<Radio />}
                          label={op.optionText}
                        />
                        {/* Conditional option image */}
                        {op.optionImage?.url && (
                          <Box sx={{ maxWidth: "400px" }}>
                            <img
                              src={op.optionImage.url}
                              width="100%"
                              alt="option"
                              style={{
                                marginLeft: "25px",
                                marginBottom: "10px",
                              }}
                            />
                          </Box>
                        )}
                        <Divider />
                      </div>
                    ))}
                  </RadioGroup>
                </Paper>
              ))}

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ marginTop: "10px" }}
              >
                Submit
              </Button>
            </>
          ) : (
            <Paper style={{ marginTop: "20px", padding: "20px" }}>
              <Typography variant="h6">Form submitted!</Typography>
              <Typography variant="body2">
                Thanks for submitting the form.
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                onClick={reloadForAnotherResponse}
                style={{ marginTop: "10px" }}
              >
                Submit another response
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default UserView;
