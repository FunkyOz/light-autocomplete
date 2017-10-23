# LightAutocomplete.js
A light and easy to use autocomplete front-end plugin written in jQuery.
## Installation.
Include the script `light-autocomplete.js` after the jquery plugin.
## Quick Start.
Instance the `lightAutocomplete()` with options. The `sourceData()` callback is mandatory.
```javascript
var cities: [
  { label: 'Turin' },
  { label: 'New York' },
  { label: 'Manchester' },
  { label: 'Paris' },
  { label: 'Milan' },
];

var options: {
  sourceData: function(success) {
    success(cities);
  }
}

$('#light-autocomplete').lightAutocomplete(options);
```
### Add additionals fields.
You can add other fields to your `data` variable if you'd like to use it when an item is clicked.
```javascript
var data: [
  { label: 'Turin', value: 'Best city in the world.' },
  { label: 'New York', value: 'More opportunities.' },
  { label: 'Manchester', value: 'Nice city' },
  { label: 'Paris', value: 'The city of Love' },
  { label: 'Milan', value: 'More Fashion?' }
];

var options: {
  sourceData: function(success) {
    success(data);
  },
  onClick: function(item) {
    $('#light-autocomplete').val(item.label);
    $('.brother-of-light-autocomplete').text(item.value);
  }
}

$('#light-autocomplete').lightAutocomplete(options);
```
### Detect enter press.
You're even the possibility to detect the press of enter key.
```javascript
var options: {
  ...
  onPressEnterKey: function(item) {
    $('#light-autocomplete').val(item.label);
  }
  ...
}

$('#light-autocomplete').lightAutocomplete(options);
```
### Detect click out of element.
When the user click out of the list you have the possibility to controll him.
```javascript
var options: {
  ...
  onPressEnterKey: function(item) {
    $('#light-autocomplete').val(item.label);
  }
  ...
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
## All additionals options, with default value.
```javascript
var options: {
  /*
  * Is a variable to call errors.
  */
  devMode: true,
  /* 
  * The minimun number of character to search.
  */
  minChar: 1,
  /*
  * Height of an element in list.
  */
  heightOfElement: 50,
  /*
  * Number of elements in list.
  */
  visibleElementInList: 5,
  /*
  * Max size to return in drop down.
  */
  maxSize: 6,
  sourceData: function(success) {
    success(data);
  },
  onClick: function(item) {},
  onPressEnterKey: function(item) {},
  onClickOut: function(item) {}
}

$('#light-autocomplete').lightAutocomplete(options);
```