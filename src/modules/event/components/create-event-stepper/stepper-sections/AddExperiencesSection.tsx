import { useEffect } from "react";
import { Box, Button } from "@mui/material";
import * as React from "react";
import { StepperContext } from "../StepperContext";
import AddExperiences from "../../AddExperiences";

export default function AddExperiencesStepperSection(props: any) {
  const { handleNext, handleBack, setCurrentStepValidity } =
    React.useContext(StepperContext);

  /* 
    Hook used to tell the parent it is valid. 
    This will cause the parent to run any additional code when this condition is reached
    */
  useEffect(() => {
    // For now we will set this section's default state to valid
    if (props?.onSectionValid) {
      setCurrentStepValidity(true);
    }
  }, []);

  return (
    <>
      <AddExperiences />

      <Box
        sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
        alignItems="center"
      >
        <Button
          onClick={handleBack}
          sx={{ mt: 3, ml: 1, mr: 1 }}
          variant="outlined"
        >
          Back
        </Button>
        <Button
          variant="contained"
          sx={{ mt: 3, ml: 1 }}
          disabled={false}
          color="primary"
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>
    </>
  );
}
