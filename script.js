(function() {
	'use strict';
	
	$('#glossary-entries').html(db.definitions.map(item => {
		return $('<tr>').append([
			$('<td>').text(item.term),
			$('<td>').text(item.definition),
			$('<td>').append(() => {
				return (!item.sources.length) ? 
					$('<span>').text('No sources') : 
					$('<details>').html([
						$('<summary>').text('Sources'),
						$('<ul>').append(item.sources.map(source => {
							return $('<li>').append([
								$('<a>').attr('target', '_blank').attr('href', source.url).text(source.name)
							]);
						}))
					]);
			})
		])
	}));
	
	function delay(cb, ms) {
		let timer = 0;

		return function () {
			let context = this;
			let args = arguments;

			clearTimeout(timer);

			timer = setTimeout(function () {
				cb.apply(context, args);
			}, ms || 0);
		};
	}
	
	$('#table-search').on('keyup', function (e) {
		let that = this;
		
		return delay(function() {
			let value = that.value;
			let target = $(that.ariaLabel);
			
			let rows = target.find('tr');
			if(!value) {
				return rows.filter('.hide').removeClass('hide');
			}
			
			let matching = rows.filter(function() {
				return this.innerText.replace(/[\r\n\t]{1,}/g, ' ').toLowerCase().match(value.toLowerCase()) !== null;
			});
			
			rows.not(matching).filter(':not(.hide)').addClass('hide');
			matching.not('.hide').removeClass('hide');
		}, 1700)();
	});
	
	$('#table-search').trigger('keyup');
})();