var LightAutocomplete = (function (main) {
	main = function Core($input, options) {
		var classList = 'light-autocomplete-list',
		classElement = 'light-autocomplete-element',
		classContainer = 'light-autocomplete-container',
		selectorList = '.light-autocomplete-list ul',
		selectorElement = '.' + classElement,
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
			},
			onClickOut: function(item) {
				setItem(item);
			},
			onFocusOut: function(item) {
				setItem(item);
			},
		};
		var keys = {
			ENTER: 13,
			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			DOWN: 40,
			TAB: 9,
			ESC: 27
		}
		defaults = mergeDefaultOptions(defaults, options);
		if(defaults.devMode) {
			getErrorsInDevMode();
		}
		init();
		function init() {
			defaults.maxHeight = defaults.heightOfElement * defaults.visibleElementInList;
			createInputID();
			setAutocompleteBrowserOff();
			createContainer();
			insertTemplate();
			setKeyDown();
			setKeyUp();
			setPressEnterKey();
			setFocusOut();
		}
		function createInputID() {
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
		function setElementMouseover() {
			var $element = $(selectorElement);
			bindOffMouseover($element);
			$element.on('mouseover', function(e) {
				e.preventDefault();
				$(selectorElement).removeClass('selected');
				$(this).addClass('selected');
				return false;
			});
		}
		
		function setKeyDown() {
			bindOffKeyDown();
			$input.on('keydown', function(e) {
				if(e.keyCode == keys.UP || e.keyCode == keys.DOWN) {
					e.preventDefault();
					return false;
				}
				switch(e.keyCode) {
					case keys.ESC:
						e.preventDefault();
					case keys.TAB:
						var item = dataArr[0];
						defaults.onFocusOut(item);
						resetDropDown();
					break;
				}
			});
		}
		function setKeyUp(){
			bindOffKeyup();
			$input.on('keyup', function(e) {
				if(isMoveArrow(e)){
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
		function isMoveArrow(e) {
			switch(e.keyCode) {
				case keys.ESC:
				case keys.TAB:
				case keys.ENTER:
				case keys.LEFT:
				case keys.RIGHT:
					e.preventDefault();
					return true;
				break;
				case keys.UP:
					e.preventDefault();
					var item = parseInt($(selectorElement + '.selected').attr('item'));
					$(selectorElement).removeClass('selected');
					if(item > 1) {
						$(selectorElement + '[item="' + (item - 1) + '"]').addClass('selected');
					} else {
						$(selectorElement + '[item="' + 1 + '"]').addClass('selected');
					}
					if(item == firstItem && item != 1) {
						$(selectorList).animate({
							scrollTop: '-=' + defaults.heightOfElement
						}, 50);
						firstItem--;
					}
					return true;
				break;
				case keys.DOWN:
					e.preventDefault();
					var item = parseInt($(selectorElement + '.selected').attr('item'));
					$(selectorElement).removeClass('selected');
					if(item < last) {
						$(selectorElement + '[item="' + (item + 1) + '"]').addClass('selected');
					} else {
						$(selectorElement + '[item="' + last + '"]').addClass('selected');
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
			data.forEach(function(element, i) {
				if(defaults.maxSize !== false) {
					if(index >= defaults.maxSize){
						return false;
					}
				}
				if(element.label.toLowerCase().indexOf(search) > -1) {
					dataArr[index] = element;
					last = ++index;
					$(selectorList, $input.parent()).append(createTempleteItem(element, index));
				}
			});
			setClick();
			setElementMouseover();
		}
		function setItem(item) {
			if (typeof item !== 'undefined') {
				$input.val(item.label);
			}
		}
		function setFocusOut() {
			bindOffFocusOut();
			$input.parent().on('focusout', function(e) {
				e.preventDefault();
				if(search.length < defaults.minChar) {
					return false;
				}
				var item = dataArr[0];
				defaults.onFocusOut(item);
				// resetDropDown();
			});
		}
		function setPressEnterKey() {
			$input.keypress(function(e) {
				switch(e.which) {
					case keys.ENTER:
						e.preventDefault();
						if(search.length < defaults.minChar) {
							dataArr = [];
						}
						var index = parseInt($(selectorElement + '.selected').attr('item')) - 1;
						var item = dataArr[index];
						defaults.onPressEnterKey(item);
						return false;
					break;
				}
			});
		}
		/*
		*	Set the click event and use the default function.
		*	
		*/
		function setClick() {
			var $element = $(selectorElement);
			bindOffClick($element);	
			$element.on('click', function(e) {
				e.preventDefault();
				var index = parseInt($(this).attr('item')) - 1;
				var item = dataArr[index];
				defaults.onClick(item);
				resetDropDown();
				return false;
			});
		}
		/*
		*	Get the item at index.
		*	NOTICE:
		*	The first index is 1 and not 0.
		*/
		function getElement(index) {
			return $(selectorElement + '[item="' + index + '"]' );
		}
		/**
		 * 
		 */
		function createContainer() {
			$input.wrap('<div class="' + classContainer + '"></div>');
		}
		/**
		 * 
		 */
		function resetDropDown() {
			dataArr = [];
			$(selectorList).parent().remove();
			insertTemplate();
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
			// <div> style="display:none; position: relative; z-index: 1000; height: ' + (defaults.maxHeight + $input.outerHeight()) + 'px;"
			return '<div class="' + classList + '" style="display:none;"><ul style="overflow-y: scroll; max-height: ' + defaults.maxHeight + 'px;"></ul></div>'
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
		function bindOffClick($element) {
			$element.off('click');
		}
		function bindOffMouseover($element) {
			$element.off('mouseover');
		}
		function bindOffKeyDown() {
			$input.off('keydown');
		}
		function bindOffKeyup() {
			$input.off('keyup');
		}
		function bindOffFocusOut(){
			$input.parent().off('focusout');
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