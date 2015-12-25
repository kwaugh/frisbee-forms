$(function() {
    var default_number = $('#default-number').val();
    $('.quantity').change(function() {
        var value = $(this).val();    
        for (var i = 0; i < value; i++) {
            $(this).parent().after("<div class='form-group col-xs-offset-1'><label>Number:</label><input type='number' class='form-control' name='" + i + "'\
                value='" + default_number + "' placeholder='Number'></div>");
        }
    });
});
