var LightAutocomplete = (function (main) {
	main = function Core($input, options) {
		var classList = 'light-autocomplete-list',
		classItem = 'light-autocomplete-element',
		selectorList = '.light-autocomplete-list ul',
		selectorContainer = '.light-autocomplete-element',
		idInput = '',
		search = '',
		last = 0,
		firstItem = 1,
		stringErrors = 'DEV Console ------> ',
		dataArr = [],
		defaults = {
			devMode: true,
			minChar: 1,
			heightOfElement: 50,
			visibleElementInList: 5,
			maxSize: 6,
			onClick: function(item) {
				setItem(item);
			},
			onPressEnterKey: function(item) {
				setItem(item);
				if(listExists()){
					adjustTempleteItem();
				}
			},
			onClickOut: function(item) {
				setItem(item);
			}
		};
		defaults = mergeDefaultOptions(defaults, options);
		if(defaults.devMode) {
			getErrorsInDevMode();
		}
		init();
		function init() {
			createIdInput();
			$input.keypress(function(e) {
				switch(e.which) {
					/* Enter */
					case 13:
						e.preventDefault();
						if(search.length < defaults.minChar) {
							dataArr = [];
						}
						var index = parseInt($(selectorContainer + '.selected').attr('item')) - 1;
						var item = dataArr[index];
						defaults.onPressEnterKey(item);
						$(window).trigger('click');
						return false;
					break;
				}
			});
			defaults.maxHeight = defaults.heightOfElement * defaults.visibleElementInList;
			setKeyDown();
			setKeyUp();
			insertTemplate();
			setClickOut();
			setAutocompleteBrowserOff();
			setSelectedItem();
		}
		function createIdInput() {
			if(typeof($input.attr('id')) !== 'undefined' && $input.attr('id') !== null) {
				idInput = '#' + $input.attr('id');
			} else {
				idInput = 'light-autocomplete-' + Math.ceil(Math.random() * 1000000);
				$input.attr('id', idInput);
				idInput = '#' + idInput;
			}
		}
		function mergeDefaultOptions(obj, src) {
			Object.keys(src).forEach(function(key) {
				obj[key] = src[key];
			});
			return obj;
		}
		function setSelectedItem() {
			$(document).on('mouseover', selectorContainer, function(e) {
				e.preventDefault();
				$(selectorContainer).removeClass('selected');
				$(this).addClass('selected');
				return false;
			});
		}
		function setKeyDown() {
			bindOffKeyDown();
			$input.on('keydown', function(e) {
				if(e.keyCode == 38 || e.keyCode == 40) {
					e.preventDefault();
				}
			});
		}
		function setKeyUp(){
			bindOffKeyup();
			$input.on('keyup', function(e) {
				if(detectKeysPress(e)){
					return false;
				}
				adjustTempleteItem();
				search = $input.val().toLowerCase();
				if(search.length >= defaults.minChar){
					defaults.sourceData(search, function(data) {
						createDropDown(data);
					});
				}
			});
		}
		function detectKeysPress(e) {
			switch(e.keyCode) {
				/* Enter */
				case 13:
				/* Left */
				case 37:
				/* Right */
				case 39:
					e.preventDefault();
					return true;
				break;
				/* Up */
				case 38:
					e.preventDefault();
					var item = parseInt($(selectorContainer + '.selected').attr('item'));
					$(selectorContainer).removeClass('selected');
					if(item > 1) {
						$(selectorContainer + '[item="' + (item - 1) + '"]').addClass('selected');
					} else {
						$(selectorContainer + '[item="' + 1 + '"]').addClass('selected');
					}
					if(item == firstItem && item != 1) {
						$(selectorList).animate({
							scrollTop: '-=' + defaults.heightOfElement
						}, 50);
						firstItem--;
					}
					return true;
				break;
				/* Down */
				case 40:
					e.preventDefault();
					var item = parseInt($(selectorContainer + '.selected').attr('item'));
					$(selectorContainer).removeClass('selected');
					if(item < last) {
						$(selectorContainer + '[item="' + (item + 1) + '"]').addClass('selected');
					} else {
						$(selectorContainer + '[item="' + last + '"]').addClass('selected');
					}
					if(item == (firstItem + defaults.visibleElementInList - 1) && item != last) {
						$(selectorList).animate({
							scrollTop: '+=' + defaults.heightOfElement
						}, 50);
						firstItem++;
					}
					return true;
				break;
				default:
					firstItem = 1;
				break;
			}
		}
		function createDropDown(data) {
			var index = 0;
			if(listExists()) {
				adjustTempleteItem();
			}
			dataArr = data;
			dataArr.forEach(function(element, i) {
				if(defaults.maxSize !== false) {
					if(index >= defaults.maxSize){
						return false;
					}
				}
				if(element.label.toLowerCase().indexOf(search) > -1) {
					index++;
					last = index;
					$(selectorList, $input.parent()).append(createTempleteItem(element, index));
					setClick(getItem(index));
				}
			});
		}
		function listExists() {
			if($(selectorList + ' li').length > 0) {
				return true;
			}
			return false;
		}
		function setItem(element) {
			if (typeof element !== 'undefined') {
				$input.val(element.label);
			}
		}
		function setClickOut(){
			$(window).on('click',function() {
				if(dataArr.length > 0) {
					defaults.onClickOut(dataArr[0]);
				}
				$(selectorList).parent().hide();
			});
			$(selectorList).parent().on('click',function(event){
				event.stopPropagation();
			});
		}
		/*
		*	Set the click event and use the default function.
		*	
		*/
		function setClick($element, item) {
			bindOffClick($element);
			var index = parseInt($element.attr('item')) - 1;
			item = dataArr[index];
			$element.on('click', function() {
				defaults.onClick(item);
				$(window).trigger('click');
			});
		}
		/*
		*	Get the item at index.
		*	NOTICE:
		*	The first index is 1 and not 0.
		*/
		function getItem(index) {
			return $(selectorContainer + '[item="' + index + '"]' );
		}
		/*
		*	Insert the list template in the DOM.
		*/
		function insertTemplate() {
			$(createTemplateList()).insertAfter(idInput);
		}
		/*
		*	I use this function to set the list to empty in the DOM.
		*/
		function adjustTempleteItem() {
			$(selectorList).parent().show();
			$(selectorList, $input.parent()).html('');
		}
		/*
		*	Create template for the list.
		*/
		function createTemplateList() {
			return '<div class="' + classList + '" style="display:none; position: relative; z-index: 1000;"><ul style="position: absolute; overflow-y: scroll; left: 0; max-height: ' + defaults.maxHeight + 'px;"></ul></div>'
		}
		/*
		*	Create template for each items in list.
		*/
		function createTempleteItem(item, index) {
			var seleceted = '';
			if(index == 1) seleceted = ' selected';
			return  '<li><div item="' + index + '" class="' + classElement + ' ' + seleceted + '" style="max-height: ' + defaults.heightOfElement + 'px;">' + item.label + '</div></li>';
		}
		/*
		*	Set off autocomplete of the browser.
		*/
		function setAutocompleteBrowserOff() {
			$input.attr('autocomplete', 'off');
		}
		/*
		*	Bind events to the input element and the item in list
		*	to be sure that they aren't events associeted.
		*/
		function bindOffKeyDown() {
			$input.off('keydown');
		}
		function bindOffClick($element) {
			$element.off('click');
		}
		function bindOffKeyup() {
			$input.off('keyup');
		}
		/*
		*	Function that check if a number is an Int.
		*/
		function isInt(n){
			return Number(n) === n && n % 1 === 0;
		}
		/*
		*	I use getErrorsInDevMode to check if element is an input and
		*	to be sure that function sourceData() exist because is mandatory.
		*/
		function getErrorsInDevMode() {
			var errors = [];
			if(!$input.is('input') || $input.length <= 0) {
				errors.push(stringErrors + 'The selector doesn\'t match any input!');
			}
			if(!defaults.sourceData){
				errors.push(stringErrors + 'sourceData is mandatory!');
			}
			errors.forEach(function(el) {
				console.error(el);
			});
		}
	}
	return main;
})(LightAutocomplete || {});

(function($) {
	$.fn.lightAutocomplete = function(options) { 
		new LightAutocomplete($(this), options);
		return $(this);
	}
})(jQuery);