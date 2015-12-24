$(function() {
    $('#index-form').submit(function(e) {
        
    });    

    $('#select-name').change(function() {
        if ($('#select-name').val() !== 'Custom') {
            $('#textbox-name').prop('disabled', true); 
        } else {
            $('#textbox-name').prop('disabled', false); 
        }
    });
});
