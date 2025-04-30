import React from "react";
import { makeStyles } from "@mui/styles";
import { Button, Radio, RadioGroup, FormControlLabel } from "@mui/material";

const useStyles = makeStyles({
  button: {
    marginTop: "1rem",
  },
});

const ErrorRadios: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState<string>("");
  const [error, setError] = React.useState<boolean>(false);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setValue(event.target.value);
    setError(false);
  };

  const handleSubmit = () => {
    console.log(value);
  };

  return (
    <div>
      <RadioGroup
        aria-label="quiz"
        name="quiz"
        value={value}
        onChange={handleRadioChange}
      >
        {["Option 1", "Option 2", "Option 3"].map((op, j) => (
          <FormControlLabel
            key={j}
            value={op}
            control={<Radio />}
            label={"the worst " + j}
          />
        ))}
      </RadioGroup>
      <Button
        variant="outlined"
        color="primary"
        className={classes.button}
        onClick={handleSubmit}
      >
        Check Answer
      </Button>
    </div>
  );
};

export default ErrorRadios;
