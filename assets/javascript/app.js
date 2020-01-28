//Variables
var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";

//jQuery Variables
var pokeTrain = $("#train-name");
var pokeTrainDestination = $("#train-destination");

var pokeTrainTime = $("#train-time").mask("00:00");
var pokeTimeFreq = $("#time-freq").mask("00");

//Firebase
var config = {
    apiKey: "AIzaSyCj_JerI5N2UDAkdgfddYi1NzJ8_pqgwEY",
    authDomain: "poketrain-fb9a0.firebaseapp.com",
    databaseURL: "https://poketrain-fb9a0.firebaseio.com",
    projectId: "poketrain-fb9a0",
    storageBucket: "poketrain-fb9a0.appspot.com",
    messagingSenderId: "414977322447",
    appId: "1:414977322447:web:cb2f3de7f75f9075b5f6ba"
};

firebase.initializeApp(config);

var database = firebase.database();

database.ref("/trains").on("child_added", function(snapshot){

    //local varibles to store date from firebase
    var trainDifference = 0;
    var trainRemainder = 0;
    var minutesArrival = "";
    var nextTrain = "";
    var frequency = snapshot.val().frequency;

    trainDifference = moment().diff(moment.unix(snapshot.val().time), "minutes");

    trainRemainder = trainDifference % frequency;

    minutesArrival = frequency - trainRemainder;

    nextTrain = moment().add(minutesArrival, "m").format("hh:mm A");

    $("table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrain+ "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();

    $("tr").hover(
        function(){
            $(this).find("span").show();
        },
        function(){
            $(this).find("span").hide();

        });
    $("#table-data").on("click", "tr span", function(){
        console.log(this);
        var trainReference = database.ref("/trains/");
        console.log(trainReference);
    });
    
});

//Call button event and store values
var saveInputs = function(event) {
    event.preventDefault();

    trainName = pokeTrain.val().trim();
    trainDestination = pokeTrainDestination.val().trim
    trainTime = moment(pokeTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = pokeTimeFreq.val().trim();

    database.ref("/trains").push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    //Empty form
    pokeTrain.val("");
    pokeTrainDestination.val("");
    pokeTrainTime.val("");
    pokeTimeFreq.val("");

};

$("#btn-add").on("click", function(event){
    if (pokeTrain.val().length === 0 || pokeTrainDestination.val().length === 0 || pokeTrainTime.val().length === 0 || pokeTimeFreq === 0) {
        alert("Please Fill All Required Fields");
    } else {
        saveInputs(event);
    }
});

$('form').on("keypress", function(event) {
    if (event.which === 13) {
        if (pokeTrain.val().length === 0 || pokeTrainDestination.val().length === 0 || pokeTrainTime.val().length === 0 || pokeTimeFreq === 0) {
            alert("Please Fill All Required Fields");
        } else {
            saveInputs(event);
        }
    }
});