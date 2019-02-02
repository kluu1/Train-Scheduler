# Train Scheduler
Live Demo: https://kluu1.github.io/Train-Scheduler/
- A simple train schedule app that shows a list of trains with destination, frequency, next arrival, and minutes away
- When the page loads, it wil only display the current train schedule
- Only logged in users can add/remove trains to/from the schedule

## Preview
![Alt text](/assets/images/trains.png?raw=true "Screenshot")

## Design Notes
- Firebase authentication is enabled on for Email/Password
- Users must be logged in to add or remove trains from the schedule
- Users can sign up if they don't have an account, password must be at least 8 characters long
- Train data is stored in Firebase Realtime Database ('/trains')
- When a new train is added to the database, the train schedule will update
- All required fields must be populated - Checks for military time and frequency must be a number
- Moment.js library is used to convert and format time
- Logic in the app will calculate when the next train arrival and minutes away

## Technologies used
- Firebase
- Moment.js
- JavaScript
- jQuery
- Bootstrap
- HTML5
- CSS3
