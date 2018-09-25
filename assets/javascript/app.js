$(document).ready(function() {

    // Get DOM elements
    $trainName = $('#trainNameInput');
    $destinationInput = $('#destinationInput');
    $firstTrainInput = $('#first-train-input');
    $frequencyInput = $('#frequencyInput');
    $addTrainBtn = $('#addTrainBtn');
    $trainTable = $('#train-table');
    $clock = $('#clock');
    $reqFields = $('#required-fields');
    $reqFields.hide();

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

        $reqFields.hide();

        // Prevent the page from reloading
        event.preventDefault();

        // Create scope variables and store user inputs
        var trainName = $trainName.val().trim();
        var destination = $destinationInput.val().trim();
        var firstTrainInput = moment($firstTrainInput.val().trim(), "HH:mm").subtract(1, "years").format("X");
        var frequencyInput = $frequencyInput.val().trim();

        //Check that all fields are filled out.
        if (trainName === "" || destination === "" || firstTrainInput === "" || frequencyInput === "") {
            $reqFields.show();
            return false;		
        }

        // Create a new object to store new train data
        var newTrain = {
            name: trainName,
            destination: destination,
            firstTrain: firstTrainInput,
            frequency: frequencyInput,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        }

        // Insert new train data into the database
        trainsRef.push(newTrain);

        // Clears users input
        $trainName.val('');
        $destinationInput.val('');
        $firstTrainInput.val('');
        $frequencyInput.val('');
    });

    trainsRef.on('child_added', getTrains);

    function getTrains(snap) {

        // Store snapshot value in data
        var data = snap.val();

        snap.forEach(function(childSnapshot){
            console.log(childSnapshot.key);
            console.log(childSnapshot.val());
        });

        // Store train data in scope variables
        var name = data.name;
        var destination = data.destination;
        var firstTrain = data.firstTrain;
        var frequency = data.frequency;
        var trainDiff = 0;
        var trainRemainder = 0;
        var arrivalTime = '';

        // Compute the difference from now and first train,
        // Convert the difference into minutes,
        // Get the remainder of time and store in variable
        trainDiff = moment().diff(moment.unix(firstTrain), "minutes"); 
        trainRemainder = trainDiff % frequency;

        // Calculate minutes till arrival
        var mintuesTillArrival = frequency - trainRemainder;

        // Calculate the arrival time by adding mintues till arrival to the currrent time
        arrivalTime = moment().add(mintuesTillArrival, "m").format("hh:mm A");

        // Add each train's data into the table 
        $trainTable.append(
            "<tr><td>" + name + 
            "</td><td>" + destination + 
            "</td><td>" + frequency + 
            "</td><td>" + arrivalTime + 
            "</td><td>" + mintuesTillArrival + 
            "</td></tr>");
    }//, function(errorObject) {
    //     console.log("The read failed: " + errorObject.code);
    // }

    // // Update minutes away by triggering change in firebase children
    // function updateMinAway() {
    //     dataRef.ref().child('trains').once('value', function(snapshot){
    //       snapshot.forEach(function(childSnapshot){
    //         fbTime = moment().format('X');
    //         dataRef.ref('trains/' + childSnapshot.key).update({
    //         currentTime: fbTime,
    //         })
    //       })    
    //     });
    //   };
  
    //   setInterval(timeUpdater, 10000);
   
});


