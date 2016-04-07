$(function() {
    $('#index-form').submit(function(e) {
        
    });    

    $('#select-name').change(function() {
        if ($('#select-name').val() !== 'Custom') {
            $('.textbox-name').prop('disabled', true); 
            var index =  $('#select-name option:selected').attr('id');
            index = index.substring(0, index.indexOf('-')); // Remove 'name'
            $('#default-jersey-number').val($('#' + index + '-number').text());
        } else {
            $('.textbox-name').prop('disabled', false); 
            $("#default-jersey-number").val('');
        }
        updateInput('team');
        updateInput('phone');
        updateInput('email');
    });
});

function updateInput(id) {
    var value =  $('#select-name option:selected').attr(id);
    if (typeof value !== 'undefined' && value !== 'undefined') {
        $('#' + id).val(value);            
    } else {
        $('#' + id).val('');            
    }
}
