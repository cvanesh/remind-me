import React from 'react';
// Import existing icons
import BookIcon from '@material-ui/icons/Book';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import LocalDrinkIcon from '@material-ui/icons/LocalDrink';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import WorkIcon from '@material-ui/icons/Work';
import SchoolIcon from '@material-ui/icons/School';
import HomeIcon from '@material-ui/icons/Home';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import CodeIcon from '@material-ui/icons/Code';
import BrushIcon from '@material-ui/icons/Brush';
import SpaIcon from '@material-ui/icons/Spa';

// Import new icons for the requested categories
import ChildCareIcon from '@material-ui/icons/ChildCare';
import ToysIcon from '@material-ui/icons/Toys';
import BathtubIcon from '@material-ui/icons/Bathtub';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import SportsIcon from '@material-ui/icons/Sports';
import SportsTennisIcon from '@material-ui/icons/SportsTennis';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import LocalLaundryServiceIcon from '@material-ui/icons/LocalLaundryService';
import HotelIcon from '@material-ui/icons/Hotel';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';
import SportsFootballIcon from '@material-ui/icons/SportsFootball';
import SportsBaseballIcon from '@material-ui/icons/SportsBaseball';
import SportsVolleyballIcon from '@material-ui/icons/SportsVolleyball';

// Map icon names to components
const iconMap = {
  // Existing icons
  'book': BookIcon,
  'fitness': FitnessCenterIcon,
  'food': RestaurantIcon,
  'drink': LocalDrinkIcon,
  'time': WatchLaterIcon,
  'work': WorkIcon,
  'school': SchoolIcon,
  'home': HomeIcon,
  'music': MusicNoteIcon,
  'code': CodeIcon,
  'art': BrushIcon,
  'meditation': SpaIcon,
  
  // Kids daily habits
  'childcare': ChildCareIcon,
  'toys': ToysIcon,
  'bath': BathtubIcon,
  'bedtime': HotelIcon,
  'homework': SchoolIcon,
  'cleanup': LocalLaundryServiceIcon,
  'brushteeth': BathtubIcon,
  
  // Exercise
  'exercise': AccessibilityNewIcon,
  'sports': SportsIcon,
  'workout': FitnessCenterIcon,
  'stretch': EmojiPeopleIcon,
  
  // Tennis
  'tennis': SportsTennisIcon,
  
  // Cycling
  'cycling': DirectionsBikeIcon,
  'bike': DirectionsBikeIcon,
  
  // Running
  'running': DirectionsRunIcon,
  'run': DirectionsRunIcon,
  'jog': DirectionsRunIcon,
  
  // Reading
  'reading': MenuBookIcon,
  'books': ImportContactsIcon,
  'study': ImportContactsIcon,
  
  // Additional sports
  'basketball': SportsBasketballIcon,
  'football': SportsFootballIcon,
  'baseball': SportsBaseballIcon,
  'volleyball': SportsVolleyballIcon,
  
  // Additional daily activities
  'fastfood': FastfoodIcon
};

// Function to get icon component by name
export const getIconComponent = (iconName) => {
  return iconMap[iconName.toLowerCase()] || BookIcon; // Default to BookIcon if not found
};

// Function to get all available icon options for selection
export const getAvailableIcons = () => {
  return Object.keys(iconMap).map(key => ({
    value: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    icon: iconMap[key]
  }));
};

// Function to get category-specific icons
export const getCategoryIcons = (category) => {
  const categoryIconMap = {
    'Kids': ['childcare', 'toys', 'bath', 'bedtime', 'homework', 'cleanup', 'brushteeth'],
    'Exercise': ['exercise', 'sports', 'workout', 'stretch', 'tennis', 'cycling', 'running', 'basketball', 'football', 'baseball', 'volleyball'],
    'Reading': ['reading', 'books', 'study'],
    'Food': ['food', 'drink', 'fastfood'],
    'Work': ['work', 'code', 'school', 'time'],
    'Leisure': ['music', 'art', 'meditation', 'home']
  };
  
  const iconKeys = categoryIconMap[category] || Object.keys(iconMap);
  
  return iconKeys.map(key => ({
    value: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    icon: iconMap[key]
  }));
};