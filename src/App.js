import React, { useEffect, useContext, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Paper from '@material-ui/core/Paper';
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import BarChartIcon from '@material-ui/icons/BarChart';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import SettingsIcon from '@material-ui/icons/Settings';

import HomePage from './pages/HomePage';
import AddActivityPage from './pages/AddActivityPage';
import StatsPage from './pages/StatsPage';
import AchievementsPage from './pages/AchievementsPage';
import SettingsPage from './pages/SettingsPage';
import OnboardingTutorial from './components/OnboardingTutorial';
import { ThemeContext } from './context/ThemeContext';
import { checkDueNotifications } from './utils/notificationService';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  content: {
    flexGrow: 1,
    paddingBottom: theme.spacing(7),
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
}));

function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { darkMode } = useContext(ThemeContext);
  const [showTutorial, setShowTutorial] = useState(false);
  
  useEffect(() => {
    // Check for due notifications when app starts
    checkDueNotifications();
    
    // Show tutorial for first-time users
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <div className={classes.content}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/add" component={AddActivityPage} />
            <Route path="/stats" component={StatsPage} />
            <Route path="/achievements" component={AchievementsPage} />
            <Route path="/settings" component={SettingsPage} />
          </Switch>
        </div>
        <Paper elevation={3} className={classes.bottomNav}>
          <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            showLabels
          >
            <BottomNavigationAction label="Home" icon={<HomeIcon />} component={Link} to="/" />
            <BottomNavigationAction label="Add" icon={<AddIcon />} component={Link} to="/add" />
            <BottomNavigationAction label="Stats" icon={<BarChartIcon />} component={Link} to="/stats" />
            <BottomNavigationAction label="Trophies" icon={<EmojiEventsIcon />} component={Link} to="/achievements" />
            <BottomNavigationAction label="Settings" icon={<SettingsIcon />} component={Link} to="/settings" />
          </BottomNavigation>
        </Paper>
        
        {/* Onboarding Tutorial */}
        <OnboardingTutorial 
          open={showTutorial} 
          onClose={() => setShowTutorial(false)} 
        />
      </div>
    </Router>
  );
}

export default App;
