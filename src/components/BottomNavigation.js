import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import BarChartIcon from '@material-ui/icons/BarChart';
import SettingsIcon from '@material-ui/icons/Settings';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: 1000,
    borderRadius: '20px 20px 0 0',
    boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
  },
  action: {
    '&.Mui-selected': {
      color: '#4CAF50',
    },
  },
});

export default function SimpleBottomNavigation() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  
  const pathToValue = {
    '/': 0,
    '/add': 1,
    '/stats': 2,
    '/settings': 3,
  };
  
  const [value, setValue] = React.useState(pathToValue[location.pathname] || 0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const paths = ['/', '/add', '/stats', '/settings'];
    history.push(paths[newValue]);
  };

  return (
    <Paper elevation={3} className={classes.root}>
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
      >
        <BottomNavigationAction 
          label="Home" 
          icon={<HomeIcon />} 
          className={classes.action}
        />
        <BottomNavigationAction 
          label="Add" 
          icon={<AddCircleIcon />} 
          className={classes.action}
        />
        <BottomNavigationAction 
          label="Stats" 
          icon={<BarChartIcon />} 
          className={classes.action}
        />
        <BottomNavigationAction 
          label="Settings" 
          icon={<SettingsIcon />} 
          className={classes.action}
        />
      </BottomNavigation>
    </Paper>
  );
}