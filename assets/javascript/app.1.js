// FIREBASE / JS

// Initialize Firebase
var config = {
    apiKey: "AIzaSyD3hQ9K38uI336xDMsidQMn1RrOg4wFY_I",
    authDomain: "bunalestrains.firebaseapp.com",
    databaseURL: "https://bunalestrains.firebaseio.com",
    projectId: "bunalestrains",
    storageBucket: "bunalestrains.appspot.com",
    messagingSenderId: "493167110733"
};
firebase.initializeApp(config);

var database = firebase.database();

// Variable and Input
var trainName = "";
var destination = "";
var firstTrain = 0;
var freq = 0;
var currentTime = moment();
var key = "";
var passover = "";

// Grabbing user input

$("#newTrain").on("click", function (event) {
    event.preventDefault();


    // Inputs into variables
    trainName = $("#nameInput").val().trim();

    destination = $("#destinationInput").val().trim();

    firstTrain = $("#firstInput").val().trim();

    freq = $("#frequencyInput").val().trim();







    // Send to Firebase Database
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        freq: freq
    });


    // Clear fields
    $('#myform')[0].reset();

    return false;

});

// Time conversions and calculations
database.ref().on("child_added", function (childSnapshot) {

    var freq = childSnapshot.val().freq;
    var NewFirstTrain = moment(firstTrain, "HH:mm").subtract("1, years");
    var difference = currentTime.diff(moment(NewFirstTrain), "minutes");
    var remainder = difference % freq;
    var newTrain = freq - remainder;
    var nextTrain = moment().add(newTrain, "minutes").format("hh:mm a");
    var key = childSnapshot.key;



    // Sending info to schedule

    var Name = childSnapshot.val().trainName;
    var Place = childSnapshot.val().destination;
    var Interval = childSnapshot.val().freq;


    $("#schedulePanel>tbody").append("<tr><td>" + Name + "</td><td>" + Place + "</td><td> every " + Interval + " min </td><td>" + nextTrain + "</td><td>" + newTrain + " min</td><td> <button class='edit' id=" + key + " data-toggle='modal' data-target='#exampleModal'><i class='fas fa-edit' aria-hidden='true'></i></button> <button class='remove' id=" + key + "><i class='fa fa-trash' aria-hidden='true'></i></button></td></tr>");


    // Error check
}, function (errorObject) {
    console.log("Errors: " + errorObject.code);
});



// Clock in header
setInterval(function () {
    $("#clock").html(moment(moment()).format("hh:mm:ss a"));
}, 1000);

// remove
$(document).on('click', ".remove", function () {

    var choice = confirm("Are you sure you want to remove this train? ):");

    if (choice === true) {
        var thisKey = $(this).attr("id");
        database.ref().child(thisKey).remove();
        location.reload();
    }
    else {
        return false;
    }
});


// edit
$(document).on('click', ".edit", function () {

    passover = $(this).attr("id");

});

// Edit save
$(document).on('click', "#editButton", function () {

trainName = $("#nameEdit").val().trim();

destination = $("#destinationEdit").val().trim();

firstTrain = $("#firstEdit").val().trim();

freq = $("#frequencyEdit").val().trim();

database.ref(passover).update({
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    freq: freq
});


location.reload();


});



