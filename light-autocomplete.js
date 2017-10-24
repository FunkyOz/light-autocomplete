(function ($) {
	'use strict';

	var keys = {
		ENTER: 13,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		TAB: 9,
		ESC: 27
	};

	function LightAutocomplete(input, options) {
		this.options = options;
		this.$input = $(input);
		var that = this;
		
		that.classes = {
			list: 'light-autocomplete-list',
			element: 'light-autocomplete-element',
			container: 'light-autocomplete-container'
		},
		that.selectors ={
			list: '.light-autocomplete-list ul',
			element: '.' + that.classes.element,
			container: '.' + that.classes.container
		},
		that.id = '',
		that.search = '',
		that.last = 0,
		that.firstItem = 1,
		that.stringErrors = 'DEV Console ------> ',
		that.dataArr = [],
		that.defaults = {
			minChar: 1,
			heightOfElement: 50,
			visibleElementInList: 5,
			maxSize: 6,
			onClick: function(item) {
				that.setItem(item);
			},
			onPressEnterKey: function(item) {
				that.setItem(item);
			},
			onFocusOut: function(item) {
				that.setItem(item);
			},
		};

		that.init();
	};

	$.LightAutocomplete = LightAutocomplete;

	LightAutocomplete.prototype = {
		
		init: function() {
			var that = this;
			that.defaults = $.extend({}, that.defaults, that.options);
			that.defaults.maxHeight = that.defaults.heightOfElement * that.defaults.visibleElementInList;
			that.createInputID();
			that.setAutocompleteBrowserOff();
			that.createContainer();
			that.insertTemplate();
			that.setKeyDown();
			that.setKeyUp();
			that.setPressEnterKey();
			that.setFocus();
		},
		createInputID: function() {
			var that = this;
			if(typeof(that.$input.attr('id')) !== 'undefined' && that.$input.attr('id') !== null) {
				that.id = '#' + that.$input.attr('id');
			} else {
				that.id = 'light-autocomplete-' + Math.ceil(Math.random() * 1000000);
				that.$input.attr('id', that.id);
				that.id = '#' + that.id;
			}
		},
		setElementMouseover: function() {
			var that = this;
			var $element = $(that.selectors.element);
			$element.on('mouseover.lightAutocomplete touchstart.lightAutocomplete', function(e) {
				e.preventDefault();
				$(that.selectors.element).removeClass('selected');
				$(this).addClass('selected');
				return false;
			});
		},
		setKeyDown: function() {
			var that = this;
			that.$input.on('keydown.lightAutocomplete', function(e) {
				if(e.keyCode == keys.UP || e.keyCode == keys.DOWN) {
					e.preventDefault();
					return false;
				}
				switch(e.keyCode) {
					case keys.ESC:
						e.preventDefault();
					case keys.TAB:
						that.ifNotMatchData();
						var item = that.dataArr[0];
						that.defaults.onFocusOut(item);
						that.resetDropDown();
					break;
				}
			});
		},
		setKeyUp: function(){
			var that = this;
			that.$input.on('keyup.lightAutocomplete', function(e) {
				if(that.isMoveArrow(e)){
					return false;
				}
				that.showTemplate();
				that.search = that.$input.val().toLowerCase();
				if(that.search.length >= that.defaults.minChar){
					that.defaults.sourceData(that.search, function(data) {
						if(data.lenght > 0) that.dataArr = [];
						that.createDropDown(data);
					});
				}
			});
		},
		isMoveArrow: function(e) {
			var that = this;
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
					var item = parseInt($(that.selectors.element + '.selected').attr('item'));
					$(that.selectors.element).removeClass('selected');
					if(item > 1) {
						$(that.selectors.element + '[item="' + (item - 1) + '"]').addClass('selected');
					} else {
						$(that.selectors.element + '[item="' + 1 + '"]').addClass('selected');
					}
					if(item == that.firstItem && item != 1) {
						$(that.selectors.list, that.selectors.container).animate({
							scrollTop: '-=' + that.defaults.heightOfElement
						}, 50);
						that.firstItem--;
					}
					return true;
				break;
				case keys.DOWN:
					e.preventDefault();
					var item = parseInt($(that.selectors.element + '.selected').attr('item'));
					$(that.selectors.element).removeClass('selected');
					if(item < that.last) {
						$(that.selectors.element + '[item="' + (item + 1) + '"]').addClass('selected');
					} else {
						$(that.selectors.element + '[item="' + that.last + '"]').addClass('selected');
					}
					if(item == (that.firstItem + that.defaults.visibleElementInList - 1) && item != that.last) {
						$(that.selectors.list, that.selectors.container).animate({
							scrollTop: '+=' + that.defaults.heightOfElement
						}, 50);
						that.firstItem++;
					}
					return true;
				break;
				default:
					that.firstItem = 1;
				break;
			}
		},
		createDropDown: function(data) {
			var that = this;
			var index = 0;
			data.forEach(function(element, i) {
				if(that.defaults.maxSize !== false) {
					if(index >= that.defaults.maxSize){
						return false;
					}
				}
				if(element.label.toLowerCase().indexOf(that.search) > -1) {
					that.dataArr[index] = element;
					that.last = ++index;
					$(that.selectors.list, that.selectors.container, that.$input.parent()).append(that.createTempleteItem(element, index));
				}
			});
			that.setClick();
			that.setElementMouseover();
		},
		setFocus: function() {
			var that = this;
			$(document).mouseup(function(e) {
				var container = $(that.selectors.container);
				if (!container.is(e.target) && container.has(e.target).length === 0)  {
					if(that.$input.val() == '') {
						that.dataArr = [];
					}
					var item = that.dataArr[0];
					that.defaults.onFocusOut(item);
					that.dataArr = [];
					$(that.selectors.list, that.selectors.container).parent().remove();
					that.insertTemplate();
				}
			});
		},
		setItem: function(item) {
			var that = this;
			if (typeof item !== 'undefined') {
				that.$input.val(item.label);
			}
		},
		setPressEnterKey: function() {
			var that = this;
			that.$input.keypress(function(e) {
				switch(e.which) {
					case keys.ENTER:
						that.ifNotMatchData();
						if(that.search.length < that.defaults.minChar) {
							that.dataArr = [];
						}
						var index = parseInt($(that.selectors.element + '.selected').attr('item')) - 1;
						var item = that.dataArr[index];
						that.defaults.onPressEnterKey(item);
						that.resetDropDown();
						e.preventDefault();
					break;
				}
			});
		},
		setClick: function() {
			var that = this;
			var $element = $(that.selectors.element);
			$element.on('click.lightAutocomplete tap.lightAutocomplete', function() {
				that.ifNotMatchData();
				var index = parseInt($(this).attr('item')) - 1;
				var item = that.dataArr[index];
				that.defaults.onClick(item);
				that.resetDropDown();
			});
		},
		resetDropDown: function() {
			var that = this;
			that.dataArr = [];
			$(that.selectors.list, that.selectors.container).parent().remove();
			that.insertTemplate();
		},
		insertTemplate: function() {
			var that = this;
			$(that.createTemplateList()).insertAfter(that.id);
		},
		ifNotMatchData: function() {
			var that = this;
			if(that.$input.val() == '') {
				that.dataArr = [];
			}
			if(!$(that.selectors.list + ' li', that.selectors.container).length) {
				that.dataArr = [];
				that.$input.val('');
			}
		},
		showTemplate: function() {
			var that = this;
			$(that.selectors.list, that.selectors.container).parent().show();
			$(that.selectors.list, that.selectors.container).html('');
		},
		createContainer: function() {
			var that = this;
			that.$input.wrap('<div class="' + that.classes.container + '"></div>');
		},
		createTemplateList: function() {
			var that = this;
			return '<div class="' + that.classes.list + '" style="display:none;"><ul style="overflow-y: scroll; max-height: ' + that.defaults.maxHeight + 'px;"></ul></div>'
		},
		createTempleteItem: function(item, index) {
			var that = this;
			var seleceted = '';
			if(index == 1) seleceted = ' selected';
			return  '<li><div item="' + index + '" class="' + that.classes.element + ' ' + seleceted + '" style="max-height: ' + that.defaults.heightOfElement + 'px;">' + item.label + '</div></li>';
		},
		setAutocompleteBrowserOff: function() {
			var that = this;
			that.$input.attr('autocomplete', 'off');
		}
	}
	$.fn.devLightAutocomplete = function (options, args) {
        var dataKey = 'lightAutocomplete';
        if (!arguments.length) {
            return this.first().data(dataKey);
        }
        return this.each(function () {
            var inputElement = $(this),
				instance = inputElement.data(dataKey);
            if (typeof options === 'string') {
                if (instance && typeof instance[options] === 'function') {
                    instance[options](args);
                }
            } else {
                if (instance && instance.dispose) {
                    instance.dispose();
                }
                instance = new LightAutocomplete(this, options);
                inputElement.data(dataKey, instance);
            }
        });
    };
    if (!$.fn.lightAutocomplete) {
        $.fn.lightAutocomplete = $.fn.devLightAutocomplete;
    }
})(jQuery);