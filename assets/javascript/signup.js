$(document).ready(function() {

    var $userEmail = $('#user-email');
    var $userPass = $('#password');
    var $submitBtn = $('#submit-signup-btn');

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
    $submitBtn.on('click', function(event) {
        event.preventDefault();
        var email = $userEmail.val();
        var pass = $userPass.val();
        firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
            alert('Wrong email or password!');
            console.log(error.message);
        });
    });

    // Acting upon user sign in and sign out
    firebase.auth().onAuthStateChanged(function(user) { 
        if (user) {
            window.location = "index.html";
        } else {
            console.log('nothing')
        }
    });

});