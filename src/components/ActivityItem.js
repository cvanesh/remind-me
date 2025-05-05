// ... existing code ...

const useStyles = makeStyles((theme) => ({
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: 16,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'hidden',
    borderLeft: '8px solid',
    cursor: 'pointer', // Add cursor pointer to indicate clickable
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[2],
    },
  },
  icon: {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  content: {
    flexGrow: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  streakBadge: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    borderRadius: 16,
    padding: '4px 12px',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    marginTop: 4,
    width: 'fit-content',
  },
  streakIcon: {
    fontSize: '0.875rem',
    marginRight: 4,
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing(2),
    fontSize: '0.875rem',
    fontWeight: 'medium',
    color: theme.palette.text.secondary,
  },
  completed: {
    color: theme.palette.success.main,
  },
  pending: {
    color: theme.palette.text.secondary,
  },
}));

const ActivityItem = ({ activity, onToggleComplete }) => {
  const classes = useStyles();
  
  // Handle click on the entire card
  const handleCardClick = () => {
    onToggleComplete(activity.id);
  };
  
  return (
    <div 
      className={classes.activityItem}
      style={{ borderLeftColor: activity.color || '#f50057' }}
      onClick={handleCardClick}
    >
      <div className={classes.icon}>
        {getActivityIcon(activity.category)}
      </div>
      
      <div className={classes.content}>
        <Typography variant="body1" className={classes.title}>
          {activity.name}
        </Typography>
        
        {activity.streak > 0 && (
          <div className={classes.streakBadge}>
            <LocalFireDepartmentIcon className={classes.streakIcon} />
            {activity.streak} day streak!
          </div>
        )}
      </div>
      
      {/* Compact status indicator */}
      <div className={`${classes.statusIndicator} ${activity.completed ? classes.completed : classes.pending}`}>
        {activity.completed ? (
          <>
            <CheckCircleIcon fontSize="small" style={{ marginRight: 4 }} />
            Done
          </>
        ) : (
          <>
            <RadioButtonUncheckedIcon fontSize="small" style={{ marginRight: 4 }} />
            Todo
          </>
        )}
      </div>
    </div>
  );
};