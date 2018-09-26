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
    $nanFreq = $('#nan-frequency');
    $reqFields.hide();
    $militaryT.hide();
    $nanFreq.hide();

    // Initialize all tooltips on a page
    $('[data-toggle="tooltip"]').tooltip()

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

        // Prevents the page from reloading
        event.preventDefault();

        $reqFields.hide();
        $militaryT.hide();
        $nanFreq.hide();

        // Create scope variables and store user inputs
        var trainName = $trainName.val().trim();
        var destination = $destinationInput.val().trim();
        var firstTrainTime = $firstTrainTime.val().trim();
        var trainFrequency = $frequencyInput.val().trim();

        // Check that all fields are filled out
        if (trainName === "" || destination === "" || firstTrainTime === "" || trainFrequency === "") {
            $reqFields.show();
            $reqFields.text('*ALL fields are required to add a train to the schedule.');
            return false;		
        // Check if First Train Time is in military time
        } else if (firstTrainTime.length !== 5 || firstTrainTime.substring(2,3) !== ':') {
            $militaryT.show();
            $militaryT.text('*First train time must be in military time.');
            return false;
        // Check if frequency is a number
        } else if (isNaN(trainFrequency)) {
            $nanFreq.show();
            $nanFreq.text('*Frequency is not a number. Please enter a number in minutes.');
            $("#not-a-number").html("Not a number. Enter a number (in minutes).");
            return false;
        }
        
        {
            // Create a new object to store new train data
            var newTrain = {
                    name: trainName,
                    destination: destination,
                    firstTrain: firstTrainTime,
                    frequency: trainFrequency,
                    dateAdded: firebase.database.ServerValue.TIMESTAMP
                }

            // Insert new train data into the database
            trainsRef.push(newTrain);

            // Confirmation modal that appears when user submits form and train is added successfully
		    $(".add-train-modal").html("<p>" + newTrain.trainName + " was successfully added to the current schedule.");
		    $('#addTrain').modal();

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



    

      