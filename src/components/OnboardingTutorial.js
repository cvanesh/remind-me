import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  MobileStepper,
  Box,
  Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    borderRadius: 16,
    maxWidth: 500,
  },
  stepContent: {
    padding: theme.spacing(2),
    textAlign: 'center',
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  stepIcon: {
    fontSize: '3rem',
    marginBottom: theme.spacing(2),
  },
  stepper: {
    backgroundColor: 'transparent',
  }
}));

const OnboardingTutorial = ({ open, onClose }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to HabitHeroes!",
      content: "Track your daily activities, build streaks, and earn achievements as you develop healthy habits.",
      icon: "🎯"
    },
    {
      title: "Add Activities",
      content: "Start by adding activities you want to track. Choose from various icons and colors to personalize them.",
      icon: "➕"
    },
    {
      title: "Build Streaks",
      content: "Complete activities daily to build streaks. The longer your streak, the more achievements you'll unlock!",
      icon: "🔥"
    },
    {
      title: "Earn Achievements",
      content: "Unlock special achievements as you maintain streaks and complete activities consistently.",
      icon: "🏆"
    },
    {
      title: "Track Your Progress",
      content: "View detailed statistics about your habits and see how you improve over time.",
      icon: "📊"
    }
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinish = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      classes={{ paper: classes.dialogPaper }}
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" align="center">
          {tutorialSteps[activeStep].title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Paper elevation={0} className={classes.stepContent}>
          <Box className={classes.stepIcon}>
            {tutorialSteps[activeStep].icon}
          </Box>
          <Typography variant="body1">
            {tutorialSteps[activeStep].content}
          </Typography>
        </Paper>
      </DialogContent>
      <MobileStepper
        variant="dots"
        steps={tutorialSteps.length}
        position="static"
        activeStep={activeStep}
        className={classes.stepper}
        nextButton={
          activeStep === tutorialSteps.length - 1 ? (
            <Button size="small" onClick={handleFinish} color="primary">
              Finish
            </Button>
          ) : (
            <Button size="small" onClick={handleNext} color="primary">
              Next
              <KeyboardArrowRight />
            </Button>
          )
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </Dialog>
  );
};

export default OnboardingTutorial;