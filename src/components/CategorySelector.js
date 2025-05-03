import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    minWidth: '100%',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  categoryChip: {
    margin: theme.spacing(0.5),
    borderRadius: 16,
  }
}));

// Predefined categories with colors
export const activityCategories = [
  { name: 'Health', color: '#4CAF50' },
  { name: 'Fitness', color: '#F44336' },
  { name: 'Learning', color: '#2196F3' },
  { name: 'Productivity', color: '#FF9800' },
  { name: 'Mindfulness', color: '#9C27B0' },
  { name: 'Social', color: '#00BCD4' },
  { name: 'Creativity', color: '#CDDC39' },
  { name: 'Other', color: '#9E9E9E' }
];

const CategorySelector = ({ selectedCategory, onChange }) => {
  const classes = useStyles();

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="category-select-label">Category</InputLabel>
      <Select
        labelId="category-select-label"
        id="category-select"
        value={selectedCategory || ''}
        onChange={(e) => onChange(e.target.value)}
        label="Category"
        renderValue={(selected) => {
          const category = activityCategories.find(cat => cat.name === selected);
          return (
            <Chip
              label={selected}
              className={classes.categoryChip}
              style={{ backgroundColor: category ? category.color : '#9E9E9E', color: 'white' }}
            />
          );
        }}
      >
        {activityCategories.map((category) => (
          <MenuItem key={category.name} value={category.name}>
            <Box display="flex" alignItems="center">
              <Box 
                width={16} 
                height={16} 
                borderRadius="50%" 
                bgcolor={category.color} 
                mr={1} 
              />
              {category.name}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategorySelector;