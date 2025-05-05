import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { ActivityContext } from '../context/ActivityContext';
import { ThemeContext } from '../context/ThemeContext';
import { 
  Container, 
  Typography, 
  Paper, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Box,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import NotificationsIcon from '@material-ui/icons/Notifications';
import BrightnessIcon from '@material-ui/icons/Brightness4';
import SecurityIcon from '@material-ui/icons/Security';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(10),
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    borderRadius: 16,
  },
  dangerZone: {
    marginTop: theme.spacing(4),
    borderColor: theme.palette.error.main,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  dangerHeader: {
    color: theme.palette.error.main,
    padding: theme.spacing(2),
  },
  resetButton: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
}));

const SettingsPage = () => {
  const classes = useStyles();
  const { activities, setActivities, completedToday, setCompletedToday, achievements, setAchievements } = useContext(ActivityContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const history = useHistory(); // Add this line to get access to history
  
  // State for settings
  const [notifications, setNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  
  // State for reset confirmation dialog
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  // Math puzzle states
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathPuzzle, setMathPuzzle] = useState({ num1: 0, num2: 0, operation: '+', result: 0 });
  const [mathError, setMathError] = useState('');
  
  // Generate a random math puzzle
  const generateMathPuzzle = () => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2, result;
    
    switch(operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 10;
        num2 = Math.floor(Math.random() * 50) + 10;
        result = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 50;
        num2 = Math.floor(Math.random() * 40) + 10;
        result = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 12) + 2;
        num2 = Math.floor(Math.random() * 12) + 2;
        result = num1 * num2;
        break;
      default:
        num1 = 10;
        num2 = 5;
        result = 15;
    }
    
    setMathPuzzle({ num1, num2, operation, result });
    setMathAnswer('');
    setMathError('');
  };
  
  // Open reset dialog and generate puzzle
  const openResetDialog = () => {
    generateMathPuzzle();
    setResetDialogOpen(true);
  };
  
  const handleResetApp = () => {
    // Verify math answer
    const userAnswer = parseInt(mathAnswer, 10);
    
    if (isNaN(userAnswer) || userAnswer !== mathPuzzle.result) {
      setMathError('Incorrect answer. Please try again.');
      return;
    }
    
    // Clear all app data
    localStorage.clear();
    
    // Close dialog
    setResetDialogOpen(false);
    
    // Navigate to home page
    history.push('/');
    
    // Reload the page after navigation
    window.location.reload();
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h1" className={classes.header}>
        Settings
      </Typography>
      
      <Paper className={classes.paper}>
        <List>
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Notifications" 
              secondary="Receive reminders for your activities"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
          
          <Divider />
          
          <ListItem>
            <ListItemIcon>
              <BrightnessIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Dark Mode" 
              secondary="Use dark theme throughout the app"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={darkMode}
                onChange={toggleDarkMode}
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
          
          <Divider />
          
          <ListItem>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Privacy Mode" 
              secondary="Hide sensitive information on the home screen"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={privacyMode}
                onChange={() => setPrivacyMode(!privacyMode)}
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
      
      <Paper className={`${classes.paper} ${classes.dangerZone}`}>
        <Typography variant="h6" className={classes.dangerHeader}>
          Danger Zone
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <DeleteIcon color="error" />
            </ListItemIcon>
            <ListItemText 
              primary="Reset App" 
              secondary="This will delete all your activities, achievements, and settings. This action cannot be undone."
              style={{ marginRight: 100 }} // Add margin to prevent text overlap with button
            />
            <ListItemSecondaryAction>
              <Button 
                variant="contained" 
                className={classes.resetButton}
                onClick={openResetDialog}
              >
                Reset
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        
        {/* Reset Confirmation Dialog with Math Puzzle */}
        <Dialog
          open={resetDialogOpen}
          onClose={() => setResetDialogOpen(false)}
        >
          <DialogTitle>{"Reset HabitHeroes?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This will permanently delete all your activities, achievements, and settings. 
              This action cannot be undone.
            </DialogContentText>
            
            <Box mt={3}>
              <Typography variant="subtitle1" gutterBottom>
                To confirm, please solve this math problem:
              </Typography>
              
              <Typography variant="h6" align="center" gutterBottom>
                {mathPuzzle.num1} {mathPuzzle.operation} {mathPuzzle.num2} = ?
              </Typography>
              
              <TextField
                label="Your Answer"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                error={!!mathError}
                helperText={mathError}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResetDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={handleResetApp} 
              className={classes.resetButton}
              disabled={!mathAnswer}
            >
              Reset Everything
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default SettingsPage;