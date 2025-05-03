import React from 'react';
import ToothIcon from '@material-ui/icons/Opacity';
import FoodIcon from '@material-ui/icons/Restaurant';
import RunIcon from '@material-ui/icons/DirectionsRun';
import BookIcon from '@material-ui/icons/MenuBook';
import MusicIcon from '@material-ui/icons/MusicNote';
import SleepIcon from '@material-ui/icons/Hotel';
import SchoolIcon from '@material-ui/icons/School';
import GameIcon from '@material-ui/icons/SportsEsports';
import ArtIcon from '@material-ui/icons/Brush';
import PetIcon from '@material-ui/icons/Pets';
import CleanIcon from '@material-ui/icons/Bathtub'; // Changed from CleaningServices to Bathtub
import WaterIcon from '@material-ui/icons/LocalDrink';

// List of available icons for activities
export const availableIcons = [
  'tooth', 'food', 'run', 'book', 'music', 
  'sleep', 'school', 'game', 'art', 'pet', 'clean', 'water'
];

// Function to get the icon component based on the icon name
export const getIconComponent = (iconName) => {
  switch (iconName) {
    case 'tooth':
      return ToothIcon;
    case 'food':
      return FoodIcon;
    case 'run':
      return RunIcon;
    case 'book':
      return BookIcon;
    case 'music':
      return MusicIcon;
    case 'sleep':
      return SleepIcon;
    case 'school':
      return SchoolIcon;
    case 'game':
      return GameIcon;
    case 'art':
      return ArtIcon;
    case 'pet':
      return PetIcon;
    case 'clean':
      return CleanIcon;
    case 'water':
      return WaterIcon;
    default:
      return BookIcon; // Default icon
  }
};