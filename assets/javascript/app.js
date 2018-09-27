$(document).ready(function() {

    // Get user DOM elements
    
    $btnLogin = $('#btn-login');
    $btnSignUp = $('#btn-sign-up');
    
    $btnLogOut = $('#btn-log-out');
    $currentUser = $('#current-user');
    $LogInAndPassInp = $('.form-inline').find('.input-group');

    // Get train DOM elements
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
    $addTrainCard = $('#add-train-card');
    
    // Hide elements on start up
    $reqFields.hide();
    $militaryT.hide();
    $nanFreq.hide();
    $addTrainCard.hide();
    $currentUser.hide();
    
    // Setup clock to display current time
    setInterval(function(){
        $clock.text(moment().format('hh:mm:ss A'))
    }, 1000);

    // Initialize all tooltips on a page
    $('[data-toggle="tooltip"]').tooltip()

    /*******************************
    *  Firebase Database
    ********************************/
    
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

    // Create database references
    var database = firebase.database();
    var trainsRef = database.ref('/trains');

    // Create event listener to add new train on click
    $addTrainBtn.on('click', function(event) {

        // Prevents the page from reloading
        event.preventDefault();

        // Hide fields error messages if shown
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
        } else {

            // Create new train object to store into database
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
    
    // Reference Firebase when page loads and new train is added
    database.ref().child('/trains').on('value', getTrains);

    // Function to get train data and display
    function getTrains(snapshot) {

        // Clear train table
        $trainTable.empty()

        // For each train, perform calulations and display to the page
        snapshot.forEach(function(childSnapshot) {
            var train = childSnapshot.val();
            var trainKey = childSnapshot.key;
            var name = train.name;
            var firstTrain = train.firstTrain;
            var tFrequency = train.frequency;
            var destination = train.destination;
            var newTime;
            var convertedFirstTrain = moment(firstTrain, "HH:mm").subtract(1, "years").format("X");

            // Time difference from now & first train & convert into minutes
            var timeDiff = moment().diff(moment.unix(convertedFirstTrain), 'minutes'); 

            // Get the remainder of time and store in variable
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

            // Add train to the train table
            $trainTable.append(
                "<tr class=" + trainKey + "><td>" + name + 
                "</td><td>" + destination + 
                "</td><td>" + tFrequency + 
                "</td><td>" + arrivalTime + 
                "</td><td>" + tMinutesTillTrain + 
                "</td><td>" + "<button class='delete btn btn-primary' data-train=" + trainKey + ">DELETE<i class='fa fa-trash' aria-hidden='true'></i></button>" +
                "</td></tr>");
        });

        // If user is logged out, don't show delete button
        var user = firebase.auth().currentUser;
        if (user) {
            $('.delete').show();
        } else {
            $('.delete').hide();
        }


    } // TODO: Handle ERROR?
    
    // Function to delete train
    $(document).on('click','.delete', function() {
        var trainKey = $(this).attr('data-train');
        database.ref("trains/" + trainKey).remove();
        $('.'+ trainKey).remove();
    });

    /*******************************
    *  Firebase Authentication
    ********************************/



    // Sign in with email and password
    $btnLogin.on('click', function(event) {
        event.preventDefault();
        window.location = "login.html";
  
      });

    $btnSignUp.on('click', function(event) {
        event.preventDefault();
        window.location = "signup.html";
    });

    // Acting upon user sign in and sign out
    firebase.auth().onAuthStateChanged(function(user) { 
        if (user) {
            $btnLogin.hide();
            $btnSignUp.hide();
            $addTrainCard.show();
            $btnLogOut.show();
            $currentUser.show();
            $currentUser.text(user.email);
            $('.delete').show();
        } else {
            $btnLogOut.hide();
            $btnLogin.show();
            $LogInAndPassInp.show();
            $currentUser.hide();
            $('.delete').hide();
        }
    });

    // User Log Out
    $btnLogOut.on('click', function(event) {
        firebase.auth().signOut();
        console.log('logged out');
    });

});



    

      