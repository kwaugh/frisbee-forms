function initTimezoneOffset() {
    var offset = new Date().getTimezoneOffset();
    $('#timezone-offset').val(offset);
}

$(function() {
    initTimezoneOffset();
    var isFirstItem = true;
    var form = $(document).find('form');

    var sizes = " \
        <div class='form-group item-sizes'> \
            <label>Available Sizes:</label> \
            <select multiple class='form-control tall-select' required> \
            <option value=''>N/A</option> \
            <option value='XS'>X-Small</option> \
            <option value='S'>Small</option> \
            <option value='M'>Medium</option> \
            <option value='L'>Large</option> \
            <option value='XL'>X-Large</option> \
            <option value='XXL'>X-X-Large</option> \
            <option value='Women XS'>Women X-Small</option> \
            <option value='Women S'>Women Small</option> \
            <option value='Women M'>Women Medium</option> \
            <option value='Women L'>Women Large</option> \
            <option value='Women XL'>Women X-Large</option> \
            <option value='Women XXL'>Women X-X-Large</option> \
            </select> \
        </div> \
    ";

    var number_options = " \
        <div class='number-options'> \
            <select multiple class='form-control'> \
                <option value='fb'>Front and Back</option> \
                <option value='b'>Back</option> \
                <option value='f'>Front</option> \
                <option value='n'>No numbers</option> \
            </select> \
        </div> \
    ";

    $('#add-item').click(function(e) {
        var num_items_on_page = $(form).find('.item-parent').length;
        var subitem_num = $(form).find('.subitem-group').length;
        var item_num = num_items_on_page;
        var max_num = item_num + subitem_num;
        $(this).before("\
            <div class='item-parent'> \
                <div class='form-group>'> \
                    <div class='form-group'> \
                        <label>Item:</label> \
                        <button class='glyphicon glyphicon-remove pull-right remove-item text-danger'></button> \
                        <input type='text' id='item-"+ item_num + "' name='item-num-" + item_num + "' class='form-control' placeholder='Item' required/> \
                    </div> \
                </div> \
            <div class='form-group'> \
                <label>Upload Photo:</label>&nbsp \
                <input type='file' name='photo-" + item_num + "'> \
            </div> \
            <div class='form-group supports-nums-wrapper'> \
                <label>Supports Numbers:</label>&nbsp \
                <input type='checkbox' class='supports-nums' name='supports-nums-" + item_num + "' checked> \
                " + number_options + " \
            </div> \
            " + sizes + " \
            <div class='form-group'><button class='btn btn-info add-subitem'>Add Sub Item</button></div></div>"
        ); // end of insertion
        // add name to item sizes select input
        $(this).siblings('.item-parent').last().children('.item-sizes:first')
            .children('select:first').attr('name', 'item-size-' + max_num);
        // add name to number options select input
        $(this).siblings('.item-parent').last().children('.supports-nums-wrapper')
            .children('.number-options:first').children('select:first')
            .attr('name', 'number-options-' + max_num);
        isFirstItem = false;
        if (!isFirstItem && num_items_on_page !== 0) {
            $(this).prev().prepend('<hr></hr>');
        } else {
            isFirstItem = false;
        }
        return false;
    });

    $(document).on('click', '.add-subitem', function(e) {
        var subitem_num = $(form).find('.subitem-group').length;
        $(this).before("<div class='subitem-group col-xs-offset-1'><div class='form-group'><label>Sub Item:</label> \
                                <button class='glyphicon glyphicon-remove pull-right remove-subitem text-danger'></button>\
                                <input type='text' id='subitem-"+ subitem_num + "' name='subitem-num-" + subitem_num + "' class='form-control' placeholder='Sub Item' required/> \
                                </div><div class='form-group sizes-group'>" + sizes + "</div></div>");
        $(this).parent().siblings('.item-sizes').remove();
        /* Add proper name to select input */
        $(this).siblings('.subitem-group').last().children('.sizes-group').children('.item-sizes').children('select').attr('name', 'subitem-size-' + subitem_num);
        return false;
    });

    $(document).on('click', '.remove-item', function(e) {
        $(this).parents('.item-parent').remove();
        return false;
    });

    $(document).on('click', '.remove-subitem', function(e) {
        $(this).parents('.subitem-group').remove();
        return false;
    });

    $(document).on('change', '.supports-nums', function(e) {
        if (this.checked) {
            $(this).after(number_options);
            // add name to number options select input
            var num_id = $(this).parent().siblings(':first').children(':first').
                children('input:first').attr('id');
            var num = num_id.substring(num_id.indexOf('-') + 1);
            $(this).siblings('.number-options:first').children('select:first')
                .attr('name', 'number-options-' + num);
        } else { // remove the select with the number options
            $(this).siblings('.number-options:first').remove();
        }
    });
});
