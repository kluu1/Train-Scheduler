$(document).ready(function() {

    var $userEmail = $('#user-email');
    var $userPass = $('#password');
    var $loginBtn = $('#submit-login-btn');

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

    // When submit button is clicked
    $loginBtn.on('click', function(event) {
        console.log('btn pressed');
        event.preventDefault();
        var email = $userEmail.val();
        var pass = $userPass.val();
        firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
          });
    });

    // Redirect user if user is logged in
    firebase.auth().onAuthStateChanged(function(user) { 
        if (user) {
            window.location = "index.html";
        } else {
            console.log('nothing');
        }
    });

});