(function() {
	'use strict';
	
	function delay(callback, ms) {
		var timer = 0;
		return function () {
			var context = this,
				args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function () {
				callback.apply(context, args);
			}, ms || 0);
		};
	}

	$('#glossary-entries').html(db.definitions.map(item => {
		return $('<tr>').append([
			$('<td>').text(item.term),
			$('<td>').text(item.definition),
			$('<td>').append(() => {
				return (!item.sources.length) ? 
					$('<span>').text('No Publications') : 
					$('<details>').html([
						$('<summary>').text('Publications'),
						$('<ul>').append(item.sources.map(source => {
							return $('<li>').append([
								$('<a>').attr('target', '_blank').attr('href', source.url).text(source.name)
							]);
						}))
					]);
			})
		])
	}));
	
	$('input.filter').on('keyup', function() {
		$(this).attr('value', this.value.trim() || null);
	});

	$('input.filter').on('keyup', delay(function() {
		let filters = $('input.filter[value]');
		let rows = $('#glossary-entries>tr');
		
		if(!!filters.length) {
			rows.each(function() {
				let tr = $(this);
				let tds = tr.find('td').attr('match', null);
				
				tds.each(function() {
					let td = $(this);
					
					let value = filters.eq(td.index()).val();
					let text = td.text().trim().split(/\n{1,}/g).join(' ');
					
					let state = null;
					if(!!value) {
						let match = new RegExp(value, 'gi');
						if(match.test(text)) {
							state = true;
						}
					}
					
					td.attr('match', state);
				});
				
				if(!tds.filter('[match]').length) {
					tr.hide();
				}
			});
			
			rows.has('td[match]').show();
		} else {
			rows.show().find('td').attr('match', true);
		}
	}, 1700));
	
	$('input.filter').trigger('keyup');
})();