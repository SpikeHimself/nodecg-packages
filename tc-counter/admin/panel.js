/*
#tc-counter_set
Sets the counter to whatever value is currently in the #tc-counter_value textbox

#tc-counter_increment
Increments counter by 1

#tc-counter_decrement
Decrements counter by 1

#tc-counter_reset
Resets counter to 0
*/

$('#tc-counter_set').click(function() {
    var counterValue = $('#tc-counter_value').val();
    
    nodecg.sendMessage('setCounter', {
        value: counterValue
    });
});

$('#tc-counter_increment').click(function() {
    var counterValue = $('#tc-counter_value').val();
    counterValue++;
    
    $('#tc-counter_value').val(counterValue);

    nodecg.sendMessage('incrementCounter', {
        value: counterValue
    });
    
});

$('#tc-counter_decrement').click(function() {
    var counterValue = $('#tc-counter_value').val();
    counterValue--;
    
    $('#tc-counter_value').val(counterValue);

    nodecg.sendMessage('incrementCounter', {
        value: counterValue
    });
    
});

$('#tc-counter_reset').click(function() {
   
    $('#tc-counter_value').val(0);

    nodecg.sendMessage('resetCounter');
    
});

