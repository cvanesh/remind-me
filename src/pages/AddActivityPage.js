import React, { useState, useContext, useEffect } from 'react';
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
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { CirclePicker } from 'react-color';
import { getAvailableIcons, getCategoryIcons, getIconComponent } from '../utils/iconUtils';
import CategorySelector from '../components/CategorySelector';

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
  const { addActivity, activities } = useContext(ActivityContext);
  
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('book');
  const [selectedColor, setSelectedColor] = useState('#6200ee');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [frequency, setFrequency] = useState('daily');
  const [error, setError] = useState('');
  
  // For icon filtering
  const [iconCategory, setIconCategory] = useState('');
  const availableIcons = iconCategory 
    ? getCategoryIcons(iconCategory) 
    : getAvailableIcons();
  
  // Predefined categories
  const categories = [
    'General',
    'Health',
    'Fitness',
    'Productivity',
    'Learning',
    'Mindfulness',
    'Social',
    'Custom...'
  ];
  
  // Get existing categories from activities
  const existingCategories = activities ? [...new Set(activities.map(a => a.category || 'General'))] : [];
  const allCategories = [...new Set([...categories, ...existingCategories])];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!name.trim()) {
      setError('Please enter a name for your activity');
      return;
    }
    
    // Determine the final category
    const finalCategory = selectedCategory === 'Custom...' ? customCategory : selectedCategory;
    
    if (selectedCategory === 'Custom...' && !customCategory.trim()) {
      setError('Please enter a custom category name');
      return;
    }
    
    // Add the activity
    addActivity({
      name,
      icon: selectedIcon,
      color: selectedColor,
      category: finalCategory,
      frequency: frequency
    });
    
    // Navigate back to home
    history.push('/');
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
      
      {error && (
        <Typography color="error" style={{ marginBottom: 16 }}>
          {error}
        </Typography>
      )}
      
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
        
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setShowCustomCategory(e.target.value === 'Custom...');
            }}
            label="Category"
          >
            {allCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {showCustomCategory && (
          <TextField
            label="Custom Category Name"
            variant="outlined"
            fullWidth
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            margin="normal"
          />
        )}
        
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel id="frequency-label">Frequency</InputLabel>
          <Select
            labelId="frequency-label"
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            label="Frequency"
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
        
        <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
          Choose an Icon:
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Icon Category</InputLabel>
          <Select
            value={iconCategory}
            onChange={(e) => setIconCategory(e.target.value)}
          >
            <MenuItem value="">All Icons</MenuItem>
            <MenuItem value="Kids">Kids Daily Habits</MenuItem>
            <MenuItem value="Exercise">Exercise</MenuItem>
            <MenuItem value="Reading">Reading</MenuItem>
            <MenuItem value="Food">Food & Drink</MenuItem>
            <MenuItem value="Work">Work & School</MenuItem>
            <MenuItem value="Leisure">Leisure</MenuItem>
          </Select>
        </FormControl>
        
        <Grid container spacing={2} className={classes.iconGrid}>
          {availableIcons.map((iconOption) => (
            <Grid item key={iconOption.value}>
              <IconButton
                className={classes.iconButton}
                color={selectedIcon === iconOption.value ? "primary" : "default"}
                onClick={() => setSelectedIcon(iconOption.value)}
              >
                <iconOption.icon />
              </IconButton>
              <Typography variant="caption" display="block" align="center">
                {iconOption.label}
              </Typography>
            </Grid>
          ))}
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