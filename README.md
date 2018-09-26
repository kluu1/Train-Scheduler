# Train Scheduler
Live Demo: https://kluu1.github.io/Train-Scheduler/
- A simple train schedule app that shows list of trains with destination, frequency, next arrival, and minutes away
- When the page loads, it wil only display the current train schedule
- Users can sign up and login to add new trains to the schedule

## Design Notes
- Train data is stored in Firebase Realtime Database
- When a new train is added to the database, the train schedule will update
- All required fields must be populated, and checks for military time, and frequency must be a number
- Moment.js library is used to convert and format time
- Logic in the app will calculate when the next train arrival
- Firebase authentication is enabled for email and password

## Technologies used
- Firebase
- Moment.js
- JavaScript
- jQuery
- Bootstrap
- HTML5
- CSS3
