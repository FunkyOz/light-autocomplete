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
You have the possibility to take the pressure of enter key.
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
Variable `search` is the string to find in array. It will be updated every time you press a character.
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
  onPressEnter: function(item) {},
  onPressTab: function(item) {},
  onPressEsc: function(item) {}
}

$('#light-autocomplete').lightAutocomplete(options);
```
## People.
Copyright (c) 2017 Author [Lorenzo Dessimoni](https://www.linkedin.com/in/lorenzo-dessimoni-092894ab/)
## License.
[MIT](https://github.com/FunkyOz/light-autocomplete/blob/master/LICENSE)
