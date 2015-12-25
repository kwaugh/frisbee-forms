$(function() {
    var default_number = $('#default-number').val();
    $('.quantity').change(function() {
        var value = $(this).val();    
        var current_num = $(this).parents('.size').first().children('.number').length;
        var item_name = $(this).parent().siblings('.item-name:first').text();
        console.log(item_name);
        for (var i = 0; i < value - current_num; i++) { // Add new number boxes
            $(this).parents('.size').append("<div class='form-group col-xs-offset-1 number'><label>Number:</label><input type='number' class=\
                'form-control' name='number-" + item_name + "-" + (parseInt(i) + parseInt(value)) + "'value='" + default_number + "' placeholder='Number'></div>");
        }
        for (var i = 0; i < current_num - value; i++) { // Delete unneeded number boxes
            $(this).parents('.size:first').children('.number:first').remove();
        } 
    });
});
