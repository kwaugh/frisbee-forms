$(function() {
    var default_number = $('#default-number').val();
    $('.quantity').change(function() {
        var value = $(this).val();    
        var current_num = $(this).parents('.size').first().children('.number').length;
        console.log(current_num);
        console.log('value - current_num =', value - current_num);
        for (var i = 0; i < value - current_num; i++) { // Add new number boxes
            $(this).parent().after("<div class='form-group col-xs-offset-1 number'><label>Number:</label><input type='number'\
                class='form-control' name='" + i + "'value='" + default_number + "' placeholder='Number'></div>");
        }
        for (var i = 0; i < current_num - value; i++) { // Delete unneeded number boxes
            $(this).parents('.size:first').children('.number:first').remove();
        } 
    });
});
