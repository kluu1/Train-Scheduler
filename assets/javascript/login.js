$(document).ready(function() {

    // Get DOM Elements
    var $userEmail = $('#user-email');
    var $userPass = $('#password');
    var $loginBtn = $('#submit-login-btn');

    // Event listener for SUBMIT button
    $loginBtn.on('click', function(event) {
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

    // If signed in, redirect user to home page
    firebase.auth().onAuthStateChanged(function(user) { 
        if (user) {
            window.location = "index.html";
        } else {
            console.log('nothing');
        }
    });

});