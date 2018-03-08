$(document).ready(function() {  
    // this is the firebase configuration
    var config = {

          apiKey: "AIzaSyCLkYChIDVTTULvOAURC3D5LJUXWSzck0Y",
          authDomain: "trainhw-74bbe.firebaseapp.com",
          databaseURL: "https://trainhw-74bbe.firebaseio.com",
          projectId: "trainhw-74bbe",
          storageBucket: "trainhw-74bbe.appspot.com",
          messagingSenderId: "443121143323"

        };

    firebase.initializeApp(config);

    var database = firebase.database();

    // store train data in the firebase database on click
    function storeData() {

        // get the value from the input fields to set them in the database
        var trainName = $('#trainNameInput').val().trim();
        var destination = $('#destinationInput').val().trim();
        var firstTrainTime = moment($('#firstTrainTimeInput').val(), 'HH:mm').format('x');
        var frequency = $('#trainFrequencyInput').val().trim();

        // firebase input value reference
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        });

        // setting emply values in the inout fields
        $('#trainNameInput').val('');
        $('#destinationInput').val('');
        $('#firstTrainTimeInput').val('');
        $('#trainFrequencyInput').val('');
        return false;
    };

    // calculates the next train time and minutes until arrival
    function getMinutesAway(firstTrainTime, frequency) {
        var timeRemaining;

        firstTrainTime = moment(parseInt(firstTrainTime));
        
        var currentTime = moment();
        
        var timeDiff = currentTime - firstTrainTime

    // changing time difference format in minutes
        timeDiff = Math.floor(timeDiff / (60 * 1000));
        // if first train is later than current time
        if (timeDiff < 0) {
            timeDiff = Math.abs(timeDiff);
            timeRemaining = timeDiff;
        } else {
            // finding modulus of time diff and frequency to check the time remaining for next
            timeRemaining = frequency - (timeDiff % frequency);
        }
        return timeRemaining;
    };

    //populates added trains to firebase and to the table when user enters data
    database.ref().on('child_added', function(childSnapshot) {
        
        var trainName = childSnapshot.val().trainName;
        var destination = childSnapshot.val().destination;
        var firstTrainTime = childSnapshot.val().firstTrainTime;

        //converting first train time
        var firstTrain = moment(parseInt(firstTrainTime)).format('HH:mm');
        var frequency = childSnapshot.val().frequency;
        var minutesAway = getMinutesAway(firstTrainTime, frequency);
        var nextTrain = moment().add(minutesAway, 'minutes').format('hh:mm A');

        console.log(childSnapshot.val());

        $('#trainTable > tbody').append(
            '<tr id="' + trainName + '" data-first-train="' + firstTrain + '">' +
            '<td class="name">' + trainName + '</td>' +
            '<td class="trainDestination">' + destination + '</td>' +
            '<td class="trainFrequency">' + frequency + '</td>' +
            '<td class="nextArrival">' + nextTrain + '</td>' +
            '<td class="nextTrainTime">' + minutesAway + '</td></tr>');


        // an error object function which will consolelog any error
    }, function(errorObject) {
        console.log("The code failed: " + errorObject.code);
    });

    $('#submitButton').on('click', storeData);

});



