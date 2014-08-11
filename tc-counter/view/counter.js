//********************************\\
//        Message binding         \\
//********************************\\

nodecg.listenFor('setCounter', setCounter);
nodecg.listenFor('incrementCounter', incrementCounter);
nodecg.listenFor('decrementCounter', decrementCounter);
nodecg.listenFor('resetCounter', resetCounter);


//********************************\\
//      I wish I had sounds!      \\
//********************************\\

// $.ionSound({
  // sounds: [           // set needed sounds names
    // "counter_show",
    // "counter_hide"
  // ],
  // path: "snd/",       // set path to sounds
  // multiPlay: true,    // can play multiple sounds at once
  // volume: "0.15"      // not so loud please
// });


//********************************\\
//        Global variables        \\
//********************************\\

// Keep track of the current value of the counter
var counterValue = 0;

// Counter value goals as requested by the admin backend
var requestedValue = 0;

// Sometimes we just don't want to be interrupted, y'know?
var isBusy = false;

// Keep a Timer handle for hiding the counter, so that it can be cancelled when a new nodecg message arrives
var hidingTimerHandle = false;


//********************************\\
//         Counter pulse          \\
//********************************\\

// Pulse every 2 seconds to see if we need to do anything with the current counter value
function checkCounterValue() {

    if ( counterValue < requestedValue && !isBusy ) {
        showCounter();
        setTimeout(function() { processIncrement(); }, 1000);
    }
    else if ( counterValue > requestedValue && !isBusy ) {
        showCounter();
        setTimeout(function() { processDecrement(); }, 1000);
    }
    
    setTimeout(function() { checkCounterValue(); }, 1500);
}
checkCounterValue();


//********************************\\
//    NodeCG Message handlers     \\
//********************************\\

// Handle the setCounter message
function setCounter (data) {
    if (!data.value) return;
    counterValue = data.value;
    requestedValue = data.value;

    $('#countervalue').html(data.value);
    showCounter();
    setTimeoutHideCounter();
}

// Handle the incrementCounter message
function incrementCounter (data) {
    if (!data.value) return;
    if ( data.value > requestedValue ) {
        cancelHiding();
        showCounter();
        requestedValue = data.value;
    }
}

// Handle the decrementCounter message
function decrementCounter (data) {
    if (!data.value) return;
    if ( data.value < requestedValue ) {
        cancelHiding();
        showCounter();
        requestedValue = data.value;
    }

}

// Handle the resetCounter message
function resetCounter() {
    counterValue = 0;
    requestedValue = 0;
    $('#countervalue').html(counterValue);
    hideCounter();
}


//********************************\\
//       Message processing       \\
//********************************\\

// Process the counter incrementation/decrementation. Recurses until requested counter value has been reached.
function processIncrement() { processIncrementDecrement(true); }
function processDecrement() { processIncrementDecrement(false); }
function processIncrementDecrement(isIncrement) {
    isBusy = true;
    
    // Hide the current value
    $('#countervalue').fadeOut('fast', function() {
    
        // Write the new value to html
        if( isIncrement ) {
            counterValue++;
        }
        else {
            counterValue--;
        }
        $('#countervalue').html(counterValue);
        
        // Show the value
        $('#countervalue').fadeIn('slow', function() {
            
            // Recurse if we aren't finished yet
            if ( (isIncrement && counterValue < requestedValue) || (!isIncrement && counterValue > requestedValue) ) {
                processIncrementDecrement(isIncrement);
            }
            else if (counterValue == requestedValue) {
                isBusy = false;
                setTimeoutHideCounter();
            }
        });
    });
}


//********************************\\
//      Hide & Show counter       \\
//********************************\\

// Show the whole thing on screen
function showCounter () {

    //$.ionSound.play('counter_show');

    var tl = new TimelineLite({paused: true});

    //add our tweens to the timeline
    tl.to($('#counter'), 0.3, {width:"8em"});
    tl.to($('#countertitlecontainer'), 0.4, {backgroundColor:"#F37424"}, "0");
    tl.to($('#countervaluecontainer'), 0.5, {height:"3.3em"}, "0.4");

    tl.play();

}

// Cancel the hiding timeout Timer
function cancelHiding() {
    if ( hidingTimerHandle != false ) {
        clearTimeout(hidingTimerHandle);
    }
}

function setTimeoutHideCounter() {
    hidingTimerHandle = setTimeout(function() { hideCounter(); }, 6000);
}

// Take the whole thing off the screen
function hideCounter() {

    // Postpone hiding if we are busy 
    if ( isBusy ) {
        cancelHiding();
        hidingTimerHandle = setTimeout(function() { hideCounter() }, 2000);
    }
    else {
        //$.ionSound.play('counter_hide');

        var tl = new TimelineLite({paused: true});

        //add our tweens to the timeline
        tl.to($('#countervaluecontainer'), 0.5, {height:"0"});
        tl.to($('#counter'), 0.3, {width:"0"}, "0.4");
        tl.to($('#countertitlecontainer'), 0, {backgroundColor:"#ffcc28"}, "1");

        tl.play();
    }
}
