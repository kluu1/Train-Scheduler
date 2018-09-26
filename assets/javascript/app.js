$(document).ready(function() {

    // Get DOM elements
    $trainName = $('#train-name-input');
    $destinationInput = $('#destination-input');
    $firstTrainTime = $('#first-train-input');
    $frequencyInput = $('#frequency-input');
    $addTrainBtn = $('#add-train-btn');
    $trainTable = $('#train-table');
    $clock = $('#clock');
    $reqFields = $('#required-fields');
    $militaryT = $('#not-military-time');
    $reqFields.hide();
    $militaryT.hide();
    

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB94hM745QQLwmBtzMonrXZeQVTC754aMI",
        authDomain: "train-scheduler-9e96c.firebaseapp.com",
        databaseURL: "https://train-scheduler-9e96c.firebaseio.com",
        projectId: "train-scheduler-9e96c",
        storageBucket: "train-scheduler-9e96c.appspot.com",
        messagingSenderId: "543830915095"
    };
    firebase.initializeApp(config);

    // Setup clock to display current time
    setInterval(function(){
        $clock.text(moment().format('hh:mm:ss A'))
    }, 1000);

    // Create database references
    var database = firebase.database();
    var trainsRef = database.ref('/trains');

    // Create event listener to add new train on click
    $addTrainBtn.on('click', function(event) {

        event.preventDefault();

        $reqFields.hide();
        $militaryT.hide();

        // Create scope variables and store user inputs
        var trainName = $trainName.val().trim();
        var destination = $destinationInput.val().trim();
        var firstTrainTime = $firstTrainTime.val().trim();
        var frequencyInput = $frequencyInput.val().trim();

        // Check that all fields are filled out
        if (trainName === "" || destination === "" || firstTrainTime === "" || frequencyInput === "") {
            $reqFields.show();
            return false;		
        // Check if First Train Time is in military time
        } else if (firstTrainTime.length !== 5 || firstTrainTime.substring(2,3) !== ':') {
            $militaryT.show();
            return false;
        } else {
            // Create a new object to store new train data
            var newTrain = {
                    name: trainName,
                    destination: destination,
                    firstTrain: firstTrainTime,
                    frequency: frequencyInput,
                    dateAdded: firebase.database.ServerValue.TIMESTAMP
                }

            // Insert new train data into the database
            trainsRef.push(newTrain);

            // Clears users input
            $trainName.val('');
            $destinationInput.val('');
            $firstTrainTime.val('');
            $frequencyInput.val('');
        }

    });
    
    // Reference Firebase when page loads and train added
    database.ref().child('/trains').on('value', getTrains);

    // Function to get train data and display
    function getTrains(snapshot) {

        $trainTable.empty()

        snapshot.forEach(function(childSnapshot) {
            var train = childSnapshot.val();
            var trainKey = train.key;
            var name = train.name;
            var firstTrain = train.firstTrain;
            var tFrequency = train.frequency;
            var destination = train.destination;
            var newTime;

            var convertedFirstTrain = moment(firstTrain, "HH:mm").subtract(1, "years").format("X");

            // Compute the difference from now and first train,
            // Convert the difference into minutes,
            // Get the remainder of time and store in variable
            var timeDiff = moment().diff(moment.unix(convertedFirstTrain), 'minutes'); 
            var tRemainder = timeDiff % tFrequency;

            // Calculate minutes till arrival
            var tMinutesTillTrain = tFrequency - tRemainder;

            // Calculate the arrival time by adding mintues till arrival to the currrent time
            arrivalTime = moment().add(tMinutesTillTrain, "m").format("hh:mm A");

            if (timeDiff >= 0) {
                newTime = null;
                newTime = moment().add(tMinutesTillTrain, 'minutes').format('hh:mm A');
            } else {
                newTime = null;
                newTime = convertedFirstTrain;
                tMinutesTillTrain = Math.abs(timeDiff - 1);
            }

            $trainTable.append(
                "<tr><td>" + name + 
                "</td><td>" + destination + 
                "</td><td>" + tFrequency + 
                "</td><td>" + arrivalTime + 
                "</td><td>" + tMinutesTillTrain + 
                "</td></tr>");

        });
    }

});



    

      