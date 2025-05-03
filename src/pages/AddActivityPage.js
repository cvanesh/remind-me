import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { ActivityContext } from '../context/ActivityContext';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  Paper,
  Box,
  IconButton,
  Avatar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { CirclePicker } from 'react-color';
import { availableIcons, getIconComponent } from '../utils/iconUtils';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(10),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
    color: theme.palette.primary.main,
  },
  form: {
    marginTop: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(3),
    borderRadius: 20,
    padding: theme.spacing(1.5),
    fontWeight: 'bold',
  },
  iconGrid: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  iconPaper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  selectedIcon: {
    backgroundColor: theme.palette.action.selected,
    transform: 'scale(1.05)',
  },
  colorPicker: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  iconPreview: {
    width: 60,
    height: 60,
    margin: '0 auto',
    marginBottom: theme.spacing(2),
  },
}));

const AddActivityPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const { addActivity } = useContext(ActivityContext);
  
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [selectedColor, setSelectedColor] = useState('#4CAF50');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && selectedIcon) {
      addActivity({
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
      });
      history.push('/');
    }
  };
  
  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
  };
  
  const IconPreview = selectedIcon ? getIconComponent(selectedIcon) : null;

  return (
    <Container className={classes.root}>
      <Box className={classes.header}>
        <IconButton onClick={() => history.push('/')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h1" className={classes.title}>
          Add New Activity
        </Typography>
      </Box>
      
      <form onSubmit={handleSubmit} className={classes.form}>
        <TextField
          label="Activity Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          margin="normal"
        />
        
        <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
          Choose an Icon:
        </Typography>
        
        <Grid container spacing={2} className={classes.iconGrid}>
          {availableIcons.map((icon) => {
            const IconComponent = getIconComponent(icon);
            return (
              <Grid item xs={3} key={icon}>
                <Paper 
                  className={`${classes.iconPaper} ${selectedIcon === icon ? classes.selectedIcon : ''}`}
                  onClick={() => setSelectedIcon(icon)}
                  style={{ borderColor: selectedIcon === icon ? selectedColor : 'transparent' }}
                >
                  <IconComponent style={{ color: selectedColor }} />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
        
        <Typography variant="h6" gutterBottom>
          Choose a Color:
        </Typography>
        
        <Box className={classes.colorPicker}>
          <CirclePicker
            color={selectedColor}
            onChange={handleColorChange}
            width="100%"
            circleSize={28}
            colors={[
              '#F44336', '#E91E63', '#9C27B0', '#673AB7', 
              '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
              '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
              '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'
            ]}
          />
        </Box>
        
        {selectedIcon && (
          <Box textAlign="center" mt={3}>
            <Typography variant="h6" gutterBottom>
              Preview:
            </Typography>
            <Avatar className={classes.iconPreview} style={{ backgroundColor: 'transparent', color: selectedColor }}>
              <IconPreview fontSize="large" />
            </Avatar>
            <Typography variant="body1">
              {name || 'Activity Name'}
            </Typography>
          </Box>
        )}
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className={classes.submitButton}
          disabled={!name.trim() || !selectedIcon}
        >
          Add Activity
        </Button>
      </form>
    </Container>
  );
};

export default AddActivityPage;