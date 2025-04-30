// // new code
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  IconButton,
  FormControlLabel,
  Radio,
  Button,
  CircularProgress,
  Divider,
  Box,
  Alert,
  Grid,
  Paper,
} from "@mui/material";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SaveIcon from "@mui/icons-material/Save";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import ImageUploadModel from "./ImageUploadModel";
import { useFormContext } from "../../context/FormContext";
import { UploadProvider } from "../../context/UploadContext";
import titleImg from "../../images/untitlteImg.avif";

// Type Definitions
export interface ImageDataType {
  public_id: string;
  url: string;
}

export interface OptionType {
  optionText: string;
  optionImage?: ImageDataType;
}

export interface QuestionType {
  questionText: string;
  questionImage?: ImageDataType;
  options: OptionType[];
  open: boolean;
}

export interface FormDataType {
  _id?: any;
  formId?: string;
  name: string;
  description?: string;
  questions?: QuestionType[];
}

interface ImageContextData {
  question: number | null;
  option: number | null;
}

interface QuestionsTabProps {
  formData: FormDataType;
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({
  formData: initialFormData,
}) => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [openUploadImagePop, setOpenUploadImagePop] = useState<boolean>(false);
  const [imageContextData, setImageContextData] = useState<ImageContextData>({
    question: null,
    option: null,
  });
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [loadingFormData, setLoadingFormData] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { editForm } = useFormContext();

  useEffect(() => {
    if (initialFormData.questions) {
      if (initialFormData.questions.length === 0) {
        setQuestions([
          {
            questionText: "Question",
            options: [{ optionText: "Option 1" }],
            open: false,
          },
        ]);
      } else {
        setQuestions(initialFormData.questions);
      }
      setLoadingFormData(false);
    }
    setFormData(initialFormData);
  }, [initialFormData]);

  const saveQuestions = async () => {
    const data = {
      formId: formData._id,
      name: formData.name,
      description: formData.description,
      questions: questions,
    };

    try {
      const updatedForm = await editForm(data);
      if (updatedForm?.questions) {
        setQuestions(updatedForm.questions);
        setSuccessMessage("Questions saved successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error: any) {
      const resMessage =
        error.response?.data?.message || error.message || error.toString();
      console.error(resMessage);
      setErrorMessage(resMessage);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  // const isImagePresent = (img?: ImageDataType) =>
  //   Boolean(img && img.url.trim() !== "");

  const addMoreQuestionField = () => {
    const updated = questions.map((q) => ({ ...q, open: false }));
    setQuestions([
      ...updated,
      {
        questionText: "Question",
        options: [{ optionText: "Option 1" }],
        open: true,
      },
    ]);
  };

  const copyQuestion = (i: number) => {
    const qs = [...questions];
    const updated = qs.map((q) => ({ ...q, open: false }));
    setQuestions(updated);
    const copiedOptions = qs[i].options.map((op) => ({ ...op }));
    const newQuestion: QuestionType = {
      questionText: qs[i].questionText,
      questionImage: qs[i].questionImage
        ? {
            public_id: qs[i].questionImage?.public_id || "",
            url: qs[i].questionImage?.url || "",
          }
        : undefined,
      options: copiedOptions,
      open: true,
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const uploadImage = (i: number, j: number | null) => {
    setImageContextData({ question: i, option: j });
    setOpenUploadImagePop(true);
  };

  const updateImageLink = (link: string, context: ImageContextData) => {
    const updated = [...questions];
    if (context.option === null) {
      updated[context.question!].questionImage = {
        public_id: "",
        url: link,
      };
    } else {
      updated[context.question!].options[context.option].optionImage = {
        public_id: "",
        url: link,
      };
    }
    setQuestions(updated);
    setOpenUploadImagePop(false);
  };

  const deleteQuestion = (i: number) => {
    const updated = [...questions];
    if (updated.length > 1) {
      updated.splice(i, 1);
    }
    setQuestions(updated);
  };

  const handleOptionValue = (text: string, i: number, j: number) => {
    const updated = [...questions];
    updated[i].options[j].optionText = text;
    setQuestions(updated);
  };

  const handleQuestionValue = (text: string, i: number) => {
    const updated = [...questions];
    updated[i].questionText = text;
    setQuestions(updated);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = reorder(
      questions,
      result.source.index,
      result.destination.index
    );
    setQuestions(reordered);
  };

  const reorder = (
    list: QuestionType[],
    startIndex: number,
    endIndex: number
  ): QuestionType[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const showAsQuestion = (i: number) => {
    const updated = [...questions];
    updated[i].open = false;
    setQuestions(updated);
  };

  const addOption = (i: number) => {
    const updated = [...questions];
    if (updated[i].options.length < 5) {
      updated[i].options.push({
        optionText: `Option ${updated[i].options.length + 1}`,
      });
    }
    setQuestions(updated);
  };

  const removeOption = (i: number, j: number) => {
    const updated = [...questions];
    if (updated[i].options.length > 1) {
      updated[i].options.splice(j, 1);
    }
    setQuestions(updated);
  };

  const handleExpand = (i: number) => {
    const updated = questions.map((q, index) => ({ ...q, open: index === i }));
    setQuestions(updated);
  };

  const handleCloseUpload = () => {
    setOpenUploadImagePop(false);
  };

  // const questionsUI = () => {
  //   return questions.map((ques, i) => (
  //     <Draggable key={i} draggableId={`${i}`} index={i}>
  //       {(provided) => (
  //         <div
  //           ref={provided.innerRef}
  //           {...provided.draggableProps}
  //           {...provided.dragHandleProps}
  //         >
  //           <Box mb={2}>
  //             <Box width="100%" mb={-1}>
  //               <DragIndicatorIcon
  //                 sx={{
  //                   transform: "rotate(-90deg)",
  //                   color: "#DAE0E2",
  //                   fontSize: "small",
  //                 }}
  //               />
  //             </Box>
  //             <Accordion expanded={ques.open} onChange={() => handleExpand(i)}>
  //               <AccordionSummary id={`panel1a-header-${i}`}>
  //                 {!ques.open && (
  //                   <Box
  //                     display="flex"
  //                     flexDirection="column"
  //                     alignItems="flex-start"
  //                     ml={0.5}
  //                     py={2}
  //                   >
  //                     <Typography variant="subtitle1">
  //                       {i + 1}. {ques.questionText}
  //                     </Typography>
  //                     <Box sx={{ maxWidth: "500px" }}>
  //                       {isImagePresent(ques.questionImage) && (
  //                         <img
  //                           src={ques.questionImage?.url}
  //                           style={{ maxWidth: "100%" }}
  //                           alt="question"
  //                         />
  //                       )}
  //                     </Box>
  //                     {ques.options.map((op, j) => (
  //                       <Box key={j}>
  //                         <FormControlLabel
  //                           disabled
  //                           control={<Radio />}
  //                           label={
  //                             <Typography sx={{ color: "#555555" }}>
  //                               {op.optionText}
  //                             </Typography>
  //                           }
  //                         />
  //                         <Box sx={{ maxWidth: "400px" }}>
  //                           {op.optionImage && (
  //                             <img
  //                               src={op.optionImage.url}
  //                               style={{ maxWidth: "100%" }}
  //                               alt="option"
  //                             />
  //                           )}
  //                         </Box>
  //                       </Box>
  //                     ))}
  //                   </Box>
  //                 )}
  //               </AccordionSummary>
  //               <AccordionDetails>
  //                 <TextField
  //                   fullWidth
  //                   placeholder="Question Text"
  //                   multiline
  //                   variant="filled"
  //                   value={ques.questionText}
  //                   onChange={(e) => handleQuestionValue(e.target.value, i)}
  //                   sx={{ mb: 2 }}
  //                 />
  //                 {ques.options.map((op, j) => (
  //                   <Box key={j} display="flex" alignItems="center" mb={1.5}>
  //                     <Radio disabled />
  //                     <TextField
  //                       placeholder="Option Text"
  //                       variant="filled"
  //                       value={op.optionText}
  //                       onChange={(e) =>
  //                         handleOptionValue(e.target.value, i, j)
  //                       }
  //                       fullWidth
  //                     />
  //                     <IconButton onClick={() => uploadImage(i, j)}>
  //                       <CropOriginalIcon />
  //                     </IconButton>
  //                     <IconButton onClick={() => removeOption(i, j)}>
  //                       <CloseIcon />
  //                     </IconButton>
  //                   </Box>
  //                 ))}
  //                 <Button
  //                   onClick={() => addOption(i)}
  //                   startIcon={<AddCircleIcon />}
  //                   sx={{ mb: 2 }}
  //                 >
  //                   Add Option
  //                 </Button>
  //                 <Divider />
  //                 <Box mt={2} display="flex" justifyContent="flex-end">
  //                   <IconButton onClick={() => uploadImage(i, null)}>
  //                     <CropOriginalIcon />
  //                   </IconButton>
  //                   <IconButton onClick={() => copyQuestion(i)}>
  //                     <FilterNoneIcon />
  //                   </IconButton>
  //                   <IconButton onClick={() => deleteQuestion(i)}>
  //                     <DeleteOutlineIcon />
  //                   </IconButton>
  //                   <IconButton onClick={() => showAsQuestion(i)}>
  //                     <VisibilityIcon />
  //                   </IconButton>
  //                 </Box>
  //               </AccordionDetails>
  //             </Accordion>
  //           </Box>
  //         </div>
  //       )}
  //     </Draggable>
  //   ));
  // };

  const questionsUI = () => {
    return questions.map((ques, i) => (
      <Draggable key={i} draggableId={`${i}`} index={i}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Box mb={2}>
              <Box width="100%" mb={-1}>
                <DragIndicatorIcon
                  sx={{
                    transform: "rotate(-90deg)",
                    color: "#DAE0E2",
                    fontSize: "small",
                  }}
                />
              </Box>
              <Accordion expanded={ques.open} onChange={() => handleExpand(i)}>
                <AccordionSummary id={`panel1a-header-${i}`}>
                  {!ques.open && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                      ml={0.5}
                      py={2}
                    >
                      <Typography variant="subtitle1">
                        {i + 1}. {ques.questionText}
                      </Typography>

                      {/* Show question image if present */}
                      {ques.questionImage?.url && (
                        <Box sx={{ maxWidth: "500px" }}>
                          <img
                            src={ques.questionImage.url}
                            style={{ maxWidth: "100%" }}
                            alt="question"
                          />
                        </Box>
                      )}

                      {/* Options (collapsed view) */}
                      {ques.options.map((op, j) => (
                        <Box key={j}>
                          <FormControlLabel
                            disabled
                            control={<Radio />}
                            label={
                              <Typography sx={{ color: "#555555" }}>
                                {op.optionText}
                              </Typography>
                            }
                          />

                          {/* Show option image if present */}
                          {op.optionImage?.url && (
                            <Box sx={{ maxWidth: "400px" }}>
                              <img
                                src={op.optionImage.url}
                                style={{ maxWidth: "100%" }}
                                alt="option"
                              />
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    fullWidth
                    placeholder="Question Text"
                    multiline
                    variant="filled"
                    value={ques.questionText}
                    onChange={(e) => handleQuestionValue(e.target.value, i)}
                    sx={{ mb: 2 }}
                  />
                  {ques.options.map((op, j) => (
                    <Box key={j} display="flex" alignItems="center" mb={1.5}>
                      <Radio disabled />
                      <TextField
                        placeholder="Option Text"
                        variant="filled"
                        value={op.optionText}
                        onChange={(e) =>
                          handleOptionValue(e.target.value, i, j)
                        }
                        fullWidth
                      />
                      <IconButton onClick={() => uploadImage(i, j)}>
                        <CropOriginalIcon />
                      </IconButton>
                      <IconButton onClick={() => removeOption(i, j)}>
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    onClick={() => addOption(i)}
                    startIcon={<AddCircleIcon />}
                    sx={{ mb: 2 }}
                  >
                    Add Option
                  </Button>
                  <Divider />
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <IconButton onClick={() => uploadImage(i, null)}>
                      <CropOriginalIcon />
                    </IconButton>
                    <IconButton onClick={() => copyQuestion(i)}>
                      <FilterNoneIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteQuestion(i)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                    <IconButton onClick={() => showAsQuestion(i)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </div>
        )}
      </Draggable>
    ));
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      spacing={4}
      sx={{ mt: 2, mb: 2, pb: 4, px: { xs: 2, md: 6 } }}
    >
      {loadingFormData && <CircularProgress />}

      <Grid sx={{ width: "100%" }}>
        <Box sx={{ position: "relative", width: "100%" }}>
          <Box
            component="div"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${titleImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.9,
              zIndex: 1,
              borderRadius: 2,
            }}
          />
          <Paper
            elevation={2}
            sx={{
              width: "100%",
              borderTop: "8px solid teal",
              borderRadius: 2,
              overflow: "hidden",
              position: "relative",
              zIndex: 2,
              p: { xs: 2, sm: 4 },
              backgroundColor: "rgba(255, 255, 255, 0.85)",
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              {formData?.name || "Untitled Form"}
            </Typography>
            <Typography variant="subtitle1">
              {formData?.description || "No description provided."}
            </Typography>
          </Paper>
        </Box>
      </Grid>
      {/*
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>} */}

      <Grid sx={{ width: "100%" }}>
        <UploadProvider>
          <ImageUploadModel
            open={openUploadImagePop}
            onClose={handleCloseUpload}
            updateImageLink={updateImageLink}
            context={imageContextData}
          />
        </UploadProvider>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {questionsUI()}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Grid>
            <Button
              variant="contained"
              onClick={addMoreQuestionField}
              endIcon={<AddCircleIcon />}
              fullWidth
            >
              Add Question
            </Button>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={saveQuestions}
              endIcon={<SaveIcon />}
              fullWidth
            >
              Save Questions
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default QuestionsTab;
