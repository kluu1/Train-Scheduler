$(document).ready(function() {

    // Get user DOM elements
    var $btnLogin = $('#btn-login');
    var $btnSignUp = $('#btn-sign-up');
    var $btnLogOut = $('#btn-log-out');
    var $currentUser = $('#current-user');
    var $LogInAndPassInp = $('.form-inline').find('.input-group');

    // Get train DOM elements
    var $trainName = $('#train-name-input');
    var $destinationInput = $('#destination-input');
    var $firstTrainTime = $('#first-train-input');
    var $frequencyInput = $('#frequency-input');
    var $addTrainBtn = $('#add-train-btn');
    var $trainTable = $('#train-table');
    var $clock = $('#clock');
    var $reqFields = $('#required-fields');
    var $militaryT = $('#not-military-time');
    var $nanFreq = $('#nan-frequency');
    var $addTrainCard = $('#add-train-card');
    var $modalBody = $('.modal-body');
    
    // Setup clock to display current time on page
    setInterval(function() {
        $clock.text(moment().format('hh:mm:ss A'));
    }, 1000);

    // Initialize all tooltips on a page
    $('[data-toggle="tooltip"]').tooltip();

    /*****************************************
    *  Firebase Database
    ******************************************/

    // Create database references
    var database = firebase.database();
    var trainsRef = database.ref('/trains');

    // Create event listener to add new train on click
    $addTrainBtn.on('click', function(event) {

        // Make sure all error messages are hidden
        $reqFields.addClass('hide');
        $militaryT.addClass('hide');
        $nanFreq.addClass('hide');

        // Prevents the page from reloading
        event.preventDefault();

        // Create local variables to store user inputs
        var trainName = $trainName.val().trim();
        var destination = $destinationInput.val().trim();
        var firstTrainTime = $firstTrainTime.val().trim();
        var trainFrequency = $frequencyInput.val().trim();

        // Check that all required fields are NOT blank
        if (trainName === "" || destination === "" || firstTrainTime === "" || trainFrequency === "") {
            $reqFields.removeClass('hide');
            $reqFields.text('*ALL fields are required to add a train to the schedule.');
            return false;		

        // Check if First Train Time is in military time
        } else if (firstTrainTime.length !== 5 || firstTrainTime.substring(2,3) !== ':' || parseInt(firstTrainTime.charAt(0)) > 2 || parseInt(firstTrainTime.slice(3,5)) > 59) {
            $militaryT.removeClass('hide');
            $militaryT.text('*First train time must be in military time between 00:00 and 23:59.');
            return false;

        // Check if frequency is a number
        } else if (isNaN(trainFrequency)) {
            $nanFreq.removeClass('hide');
            $nanFreq.text('*Frequency is not a number. Please enter a number in minutes.');
            return false;

        // Create new train object to store into database
        } else {
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
		    $modalBody.text("'" + trainName + "' was successfully added to the schedule.");

            // Clears users input
            $trainName.val('');
            $destinationInput.val('');
            $firstTrainTime.val('');
            $frequencyInput.val('');

            // Make sure all error messages are hidden after train is added
            $reqFields.addClass('hide');
            $militaryT.addClass('hide');
            $nanFreq.addClass('hide');
        }

    });
    
    // Reference Firebase when page loads and new train is added
    database.ref().child('/trains').on('value', getTrains, function(err) {
        console.log(err);
    });

    // Function to get train data and display
    function getTrains(snapshot) {

        // Clear train table
        $trainTable.empty();

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
                "</td><td>" + "<button class='delete btn btn-primary hide' data-train=" + trainKey + ">DELETE<i class='fa fa-trash'></i></button>" +
                "</td></tr>");
        });

        // If user is logged out, don't show delete button
        var user = firebase.auth().currentUser;
        if (user) {
            $('.delete').removeClass('hide');
        } else {
            $('.delete').addClass('hide');
        }

    } 
    
    // Function to delete train from table AND Firebase database
    $(document).on('click','.delete', function() {
        var trainKey = $(this).attr('data-train');
        database.ref("trains/" + trainKey).remove();
        $('.'+ trainKey).remove();
    });

    /*****************************************
    *  Firebase Authentication
    ******************************************/

    // Redirect to Log In page
    $btnLogin.on('click', function(event) {
        event.preventDefault();
        window.location = "login.html";
      });

    // Redirect to Sign Up page
    $btnSignUp.on('click', function(event) {
        event.preventDefault();
        window.location = "signup.html";
    });

    // Acting upon user sign in and sign out
    firebase.auth().onAuthStateChanged(function(user) { 
        if (user) {
            $btnLogin.addClass('hide');
            $btnSignUp.addClass('hide');
            $addTrainCard.removeClass('hide');
            $btnLogOut.removeClass('hide');
            $currentUser.removeClass('hide');
            $currentUser.text(user.email);
            $('.delete').show();
        } else {
            $btnLogOut.addClass('hide');
            $btnLogin.removeClass('hide');
            $LogInAndPassInp.show();
            $currentUser.addClass('hide');
            $('.delete').addClass('hide');
        }
    });

    // Log current user out
    $btnLogOut.on('click', function(event) {
        firebase.auth().signOut();
        console.log('User is logged out.');
    });

});



    

      