import React, { useContext, useState } from 'react';
import { ActivityContext } from '../context/ActivityContext';
import { 
  Container, 
  Typography, 
  Paper, 
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Switch,
  Divider,
  ListItemIcon,
  Avatar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import InfoIcon from '@material-ui/icons/Info';
import { getIconComponent } from '../utils/iconUtils';

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
  listItem: {
    borderRadius: 8,
    marginBottom: theme.spacing(1),
  },
  activityIcon: {
    marginRight: theme.spacing(2),
  },
  sectionTitle: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  version: {
    textAlign: 'center',
    marginTop: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: theme.spacing(1),
  },
}));

const SettingsPage = () => {
  const classes = useStyles();
  const { activities, deleteActivity } = useContext(ActivityContext);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [notifications, setNotifications] = useState(
    localStorage.getItem('notifications') === 'true'
  );
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );
  
  const handleDeleteClick = (activity) => {
    setActivityToDelete(activity);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (activityToDelete) {
      deleteActivity(activityToDelete.id);
    }
    setDeleteDialogOpen(false);
  };
  
  const handleNotificationsChange = (event) => {
    const newValue = event.target.checked;
    setNotifications(newValue);
    localStorage.setItem('notifications', newValue);
  };
  
  const handleDarkModeChange = (event) => {
    const newValue = event.target.checked;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', newValue);
    // In a real app, you would apply the theme change here
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h1" className={classes.header}>
        Settings
      </Typography>
      
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom>
          App Preferences
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Notifications" 
              secondary="Get reminders for your activities"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={notifications}
                onChange={handleNotificationsChange}
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <Brightness4Icon />
            </ListItemIcon>
            <ListItemText 
              primary="Dark Mode" 
              secondary="Use dark theme"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={darkMode}
                onChange={handleDarkModeChange}
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
      
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom>
          Manage Activities
        </Typography>
        
        <List>
          {activities.map((activity) => {
            const IconComponent = getIconComponent(activity.icon);
            return (
              <ListItem key={activity.id} className={classes.listItem}>
                <ListItemIcon>
                  <Avatar style={{ backgroundColor: 'transparent', color: activity.color }}>
                    <IconComponent />
                  </Avatar>
                </ListItemIcon>
                <ListItemText 
                  primary={activity.name}
                  secondary={activity.streak > 0 ? `${activity.streak} day streak` : 'No active streak'}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleDeleteClick(activity)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
        
        {activities.length === 0 && (
          <Typography variant="body2" color="textSecondary" align="center">
            No activities to manage. Add some from the Add page!
          </Typography>
        )}
      </Paper>
      
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom>
          About
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText 
              primary="HabitHeroes"
              secondary="A fun way for kids to track daily activities"
            />
          </ListItem>
        </List>
      </Paper>
      
      <Typography variant="body2" className={classes.version}>
        Version 1.0.0
      </Typography>
      
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Activity</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{activityToDelete?.name}"? This will remove all streak data for this activity.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsPage;