(function(){
	// consider using a debounce utility if you get too many consecutive events
	$(window).on('motion', function(ev, data){
		console.log('detected motion at', new Date(), 'with data:', data);
		var spot = $(data.spot.el);
		spot.addClass('active');
		setTimeout(function(){
			spot.removeClass('active');
		}, 230);
	});

	// examples for id usage
	$('#top-left').on('motion', function(){
		console.log('left');
	});

	$('#top-right').on('motion', function(){
		console.log('right');
	});
})();