$(document).ready(function() {

    // Get DOM Elements
    var $userEmail = $('#user-email');
    var $userPass = $('#password');
    var $submitBtn = $('#submit-signup-btn');
    var $errorMsg = $('#error-message');

    // Create on click event listener for submit button
    $submitBtn.on('click', function(event) {
        event.preventDefault();
        var email = $userEmail.val();
        var pass = $userPass.val();

        // Check if password is at least 8 characters long
        if (pass.length < 7) {
            $errorMsg.show();
            $errorMsg.text('*Password must be at least 8 characters long!');
            $userPass.val('');
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(value) {
                console.log(value);
            }).catch(function(error) {
                console.log(error.message);
            });
        }
        
    });


    function registerUsername(email,password,displayName){
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(value) {
            console.log(value);
            }).catch(function(error) {
                console.log(error);
            });
    }

    // If signed up, redirect to home page
    // firebase.auth().onAuthStateChanged(function(user) { 
    //     if (user) {
    //         window.location = "index.html";
    //     } else {
    //         console.log('user not logged in')
    //     }
    // });

});