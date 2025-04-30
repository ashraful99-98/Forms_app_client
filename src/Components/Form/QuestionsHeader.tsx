import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  FormControlLabel,
  Radio,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

type OptionType = {
  optionText: string;
};

type QuestionType = {
  questionText: string;
  options: OptionType[];
  open: boolean;
};

const QuestionsHeader: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([
    {
      questionText: "Question",
      options: [{ optionText: "option 1" }],
      open: false,
    },
  ]);

  const addMoreQuestionField = () => {
    expandCloseAll();
    setQuestions((prev) => [
      ...prev,
      {
        questionText: "Question",
        options: [{ optionText: "option 1" }],
        open: true,
      },
    ]);
  };

  const addOption = (i: number) => {
    const newQuestions = [...questions];
    if (newQuestions[i].options.length < 5) {
      newQuestions[i].options.push({ optionText: "option gg" });
      setQuestions(newQuestions);
    } else {
      console.log("Max 5 options");
    }
  };

  const removeOption = (i: number, j: number) => {
    const newQuestions = [...questions];
    if (newQuestions[i].options.length > 1) {
      newQuestions[i].options.splice(j, 1);
      setQuestions(newQuestions);
    }
  };

  const expandCloseAll = () => {
    const newQuestions = questions.map((q) => ({ ...q, open: false }));
    setQuestions(newQuestions);
  };

  const handleExpand = (i: number) => {
    const newQuestions = questions.map((q, j) => ({
      ...q,
      open: i === j,
    }));
    setQuestions(newQuestions);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = Array.from(questions);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setQuestions(reordered);
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {questions.map((ques, i) => (
                <Draggable
                  key={i.toString()}
                  draggableId={i.toString()}
                  index={i}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        marginBottom: "9px",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <Accordion
                        expanded={ques.open}
                        onChange={() => handleExpand(i)}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel-content"
                          id={`panel-${i}`}
                        >
                          {!ques.open && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography variant="subtitle1">
                                Form description {i + 1}
                              </Typography>
                              <FormControlLabel
                                disabled
                                control={<Radio />}
                                label="Option 1"
                              />
                            </div>
                          )}
                        </AccordionSummary>
                        <AccordionDetails>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <Typography variant="subtitle1">
                              Form description {i + 1}
                            </Typography>
                            <div style={{ width: "100%" }}>
                              {ques.options.map((op, j) => (
                                <div
                                  key={j}
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 8,
                                  }}
                                >
                                  <Radio disabled />
                                  <TextField
                                    fullWidth
                                    placeholder="Option text"
                                    defaultValue={op.optionText}
                                    style={{ marginRight: 8 }}
                                  />
                                  <IconButton aria-label="image">
                                    <CropOriginalIcon />
                                  </IconButton>
                                  <IconButton
                                    aria-label="delete"
                                    onClick={() => removeOption(i, j)}
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </div>
                              ))}
                            </div>
                            <FormControlLabel
                              disabled
                              control={<Radio />}
                              label={
                                <Button
                                  size="small"
                                  onClick={() => addOption(i)}
                                  style={{
                                    textTransform: "none",
                                    marginLeft: "-5px",
                                  }}
                                >
                                  Add Option
                                </Button>
                              }
                            />
                            <Typography variant="body2" color="textSecondary">
                              No More
                            </Typography>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        onClick={addMoreQuestionField}
        variant="contained"
        color="primary"
        style={{ marginTop: 16 }}
      >
        Add Question
      </Button>
    </div>
  );
};

export default QuestionsHeader;
