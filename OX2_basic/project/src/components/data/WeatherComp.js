
export const weatherColor = (name) => {
  if (name === 'overcast') {
    return '#A9A9A9'; // Dark gray color for overcast
  } else if (name === 'mostly-cloudy') {
    return '#C0C0C0'; // Silver color for mostly cloudy
  } else if (name === 'snowfall') {
    return '#FFFFFF'; // White color for snowfall
  } else if (name === 'cloudy') {
    return '#808080'; // Gray color for cloudy
  } else if (name === 'spring') {
    return '#BFD9C3'; // Soft green color for spring
  } else if (name === 'summer') {
    return '#FFEB94'; // Pale yellow color for summer
  } else if (name === 'fall') {
    return '#D6A4B4'; // Muted pink color for autumn
  } else if (name === 'winter') {
    return '#99B3E6'; // Light blue color for winter
  } else {
    return 'white';
  }
};


export const weatherIcon = (name) => {
  if (name === 'overcast') {
    return '☁️'; // Dark gray color for overcast
  } else if (name === 'mostly-cloudy') {
    return '🌥️'; // Silver color for mostly cloudy
  } else if (name === 'snowfall') {
    return '🌨️'; // White color for snowfall
  } else if (name === 'cloudy') {
    return '☁️'; // Gray color for cloudy
  } else if (name === 'spring') {
    return '🍃'; // Soft green color for spring
  } else if (name === 'summer') {
    return '🌻'; // Pale yellow color for summer
  } else if (name === 'fall') {
    return '🍂'; // Muted pink color for autumn
  } else if (name === 'winter') {
    return '🌲'; // Light blue color for winter
  } else {
    return 'white';
  }
}


export const getweatherData = (data) => {
  
  // Data is the date in this format 10-01-2024
  

}