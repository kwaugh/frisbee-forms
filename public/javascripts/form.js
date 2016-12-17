$(function() {
    var default_number = $('#default-number').val();
    $('.quantity').change(function() {
        var value = $(this).val();    
        var current_num = $(this).siblings('.number').length;
        var item_name = $(this).parent().siblings('.item-name:first').text();
	    item_name = item_name.replace("'", "");
        var supports_nums = $(this).parent().siblings('.supports-nums:first').text();
        if (supports_nums === 'true') {
            for (var i = 0; i < value - current_num; i++) { // Add new number boxes
                var line_break = current_num === 0 && i === 0 ? '<br>' : '';
                $(this).parent().append("<div class='form-group col-xs-offset-1 number'>" + line_break + "<label>Number:</label><input type='number' class=\
                    'form-control' name='number-" + item_name + "-" + (parseInt(i) + parseInt(value)) + "' value='" + default_number + "' placeholder='Number'></div>");
                }
        }
        for (var i = 0; i < current_num - value; i++) { // Delete unneeded number boxes
            $(this).siblings('.number:last').remove();
        } 
    });
});
