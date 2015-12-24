$(function() {
    var isFirstItem = true;
    var item_num = 0;
    var num_items_on_page = 0;

    var sizes = "<div class='form-group item-sizes'><label>Available Sizes:</label><select multiple class='form-control tall-select' required> \
                                                        <option value='xs'>X-Small</option> \
                                                        <option value='s'>Small</option> \
                                                        <option value='m'>Medium</option> \
                                                        <option value='l'>Large</option> \
                                                        <option value='xl'>X-Large</option> \
                                                    </select></div>";

    $('#add-item').click(function(e) {
        $(this).before("<div class='item-parent'><div class='form-group'><label>Item:</label> \
                            <button class='glyphicon glyphicon-remove pull-right remove-item text-danger'></button>\
                            <input type='text' id='item-"+ item_num + "' name='item-" + item_num + "' class='form-control' placeholder='Item' required/> \
                            </div>" + sizes + "\
                    <div class='form-group'><button class='btn btn-info add-subitem'>Add Sub Item</button></div></div>" );
        isFirstItem = false;
        if (!isFirstItem && num_items_on_page !== 0) {
            $(this).prev().prepend('<hr></hr>');
        } else {
            isFirstItem = false;
        }
        item_num++;
        num_items_on_page++;
        return false;
    });

    var subitem_num = 0;

    $(document).on('click', '.add-subitem', function(e) {
        $(this).before("<div class='subitem-group col-xs-offset-1'><div class='form-group'><label>Sub Item:</label> \
                                <button class='glyphicon glyphicon-remove pull-right remove-subitem text-danger'></button>\
                                <input type='text' id='subitem-"+ subitem_num + "' name='subitem-" + subitem_num + "' class='form-control' placeholder='Sub Item' required/> \
                                </div><div class='form-group sizes-group'>" + sizes + "</div></div>");
        $(this).parent().siblings('.item-sizes').remove();
        $(this).siblings('.subitem-group').last().children('.sizes-group').children('.item-sizes').children('select').attr('name', 'subitem-size-' + subitem_num);
        subitem_num++;
        return false;
    });

    $(document).on('click', '.remove-item', function(e) {
        $(this).parents('.item-parent').remove(); 
        num_items_on_page--;
        return false;
    });

    $(document).on('click', '.remove-subitem', function(e) {
        $(this).parents('.subitem-group').remove(); 
        return false;
    });

});
