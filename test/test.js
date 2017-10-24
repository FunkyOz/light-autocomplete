var options = {
    sourceData: function(search, success) {
        dataResponse = [];
        data.forEach(function(el, i) {
            dataResponse.push({
                label: i +  ' - ' + el.label,
                value: i +  ' - ' + el.value
            });
        });
        success(dataResponse);
    },
    minChar: 3
    
};

$('#light-autocomplete').lightAutocomplete(options);