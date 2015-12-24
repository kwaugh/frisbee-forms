$(function() {
    var item_num = 0;
    $('#add-item').click(function(e) {
        $(this).before("<div class='form-group'><label>Item:</label> \
                                <button class='glyphicon glyphicon-remove pull-right remove-item'></button>\
                                <input type='text' id='item-"+ item_num + "' name='item-" + item_num + "' class='form-control'/> \
                                </div>" );
        return false;
    });

    $(document).on('click', '.remove-item', function(e) {
        $(this).parent().remove(); 
        return false;
    });
});
