var options = {
     sourceData: function(search, success) {
        $.ajax({
            url: 'http://lorenzodessimoni.altervista.org/get_list_city.php',
            method: 'POST',
            dataType: 'json',
            data: {
                autocomplete: search
            },
            success: function(data) {
                success(data);
            }
        });
    },
    maxSize: false,
    minChar: 3
};

$('#light-autocomplete').lightAutocomplete(options);