# LightAutocomplete.js
A light and easy to use autocomplete front-end plugin written in jQuery.
## Installation.
Include the script `light-autocomplete.js` after the jquery plugin.
## Quick Start.
Instance the `lightAutocomplete()` with options.
```javascript
var data: {
  label: 'Label to show',
  value: 'Value to set'
}

var options: {
  sourceData: function(success) {
    success(data);
  }
}

$('#light-autocomplete').lightAutocomplete(options);
```
## Set Data From Ajax Request.
Variable `search` is the string that you're searching. It will be updated every time you search a letter.
```javascript
var options: {
  sourceData: function(success, search) {
    $.ajax({
      url: 'url-to-fetch-data',
      method: 'POST',
      dataType: 'json',
      data: {
        stringToSearch: search
      },
      success: function(data) {
        success(data);
      }
    });
  }
}

$('#light-autocomplete').lightAutocomplete(options);
```
