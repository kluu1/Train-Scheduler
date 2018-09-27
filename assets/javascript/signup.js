$(document).ready(function() {

    // Get DOM Elements
    var $userEmail = $('#user-email');
    var $userPass = $('#password');
    var $submitBtn = $('#submit-signup-btn');
    var $errorMsg = $('#error-message');

    // When submit button is clicked
    $submitBtn.on('click', function(event) {
        event.preventDefault();
        var email = $userEmail.val();
        var pass = $userPass.val();

        if (pass.length < 7) {
            $errorMsg.show()
            $errorMsg.text('*Password must be at least 8 characters long!');
            $userPass.val('');
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
                alert('Wrong email or password!');
                console.log(error.message);
            });
        }
    });

    // Acting upon user sign in and sign out
    firebase.auth().onAuthStateChanged(function(user) { 
        if (user) {
            window.location = "index.html";
        } else {
            console.log('not logged in')
        }
    });

});