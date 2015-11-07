(function(){
	// consider using a debounce utility if you get too many consecutive events
	$(window).on('motion', function(ev, data){
		var spot = $(data.spot.el);
		spot.addClass('active');
		setTimeout(function(){
			spot.removeClass('active');
		}, 230);
	});

	// examples for id usage
	$('#top-left').on('motion', function(){
		var now = Date.now()
		if((Date.now()-touched['left'])>500){
			touched['left'] = now
			calcShot('left')
		};
	});

	$('#top-right').on('motion', function(){
		var now = Date.now()
		if((Date.now()-touched['right'])>500){
			touched['right'] = now
			calcShot('right')
		};
	});
})();

var touched = {
	'right': 0,
	'left': 0
}
var shots = {}

function calcShot(me){
	var now = Date.now();

	var lastTouchedTime = 0;
	var lastTouched;
	for(var spot in touched){
		if(spot===me) continue;
		if(touched[spot]>lastTouchedTime){
			lastTouchedTime=touched[spot]
			lastTouched = spot
		}
	}

	if(now - lastTouchedTime < 500){
		console.log('shot ' + lastTouched + ' to ' + me);
	}
}