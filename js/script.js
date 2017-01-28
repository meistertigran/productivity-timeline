$(document).ready(function(){
    var timeline = new Timeline(new Date());
    
    //Zoom In
    $(timeline.scaleInSelector).click(function(){
        timeline.scaleTimeIn();
    });
    
    //Zoom Out
    $(timeline.scaleOutSelector).click(function(){
        timeline.scaleTimeOut();
    });
    
    //Show time
    $(TIME_SELECTOR).mouseover(function(e){
    
        $(this).mousemove(function(e){
            var distance_from_middle = (e.pageX/$(window).width())*100 - timeline.nowPoint,
                time_from_now = (distance_from_middle/100)*timeline.currentTimeScale,
                the_cursor_date = new Date(NOW + time_from_now);
 
            $('#future .hours').html(the_cursor_date.getHours());
            $('#future .min').html(the_cursor_date.getMinutes());
            
        });
        
    });
    
    //Add markers
    $(FUTURE_TIME_SELECTOR).mousedown(function(e){
    
        var distance_cursor = e.pageX;
        
        if(timeline.cursorMarkerType == 'milestone')
            timeline.addMilestonePrototype(distance_cursor);
        
        if(timeline.cursorMarkerType == 'timespan'){
            timeline.addTimespanPrototype(distance_cursor);
        }
        
        if(timeline.cursorMarkerType == 'goal')
            timeline.addGoalPrototype(distance_cursor);
    
    }).mousemove(function(e){
        
    }).mouseup(function(e){
        
    });
    
    timeline.afterMilestonePrototypeCreated = function() {
        $(MILESTONE_PROTOTYPE_SELECTOR).hover(function(e){
            //e.preventDefault();
            setTimeout(function(){
                $(e.target).find('textarea').focus();
            },500);
        });
        
    }
    
    //Moving timeline via grabbing
    var isDown = false,
        startPoint = 0;
    
    $(document).mousedown(function(e){
       isDown = true;
        startPoint = e.pageX;
    }).mouseup(function(){
        isDown = false;
    });
    
    $(document).bind('mousewheel', function(e){
        if(e.originalEvent.wheelDelta /120 > 0) {
            timeline.scaleTimeIn();
        }
        else{
            timeline.scaleTimeOut();
        }
    });
    
    $(document).mousemove(function(e){
        var distancePix,
            distancePerc,
            distanceTime;
        
        if(isDown){
            distancePix = startPoint - e.pageX;
            distancePerc = timeline.pixleToPercent(distancePix);
            distanceTime = timeline.percentToTime(distancePerc);
            
            timeline.setChangeableDate(new Date(timeline.changeableDate.getTime() + distanceTime));
            
            startPoint = e.pageX;
        }
    });
});


$(document).ready(function(){
////////////////
// DIGITAL CLOCK
////////////////

// Create a newDate() object
var newDate = new Date();
// Extract the current date from Date object
newDate.setDate(newDate.getDate());
// Output the day, date, month and year   

setInterval( function() {
	// Create a newDate() object and extract the seconds of the current time on the visitor's
	var seconds = new Date().getSeconds();
	// Add a leading zero to seconds value
	$("#current-time-pop .sec").html(( seconds < 10 ? "0" : "" ) + seconds);
	},1000);
	
setInterval( function() {
	// Create a newDate() object and extract the minutes of the current time on the visitor's
	var minutes = new Date().getMinutes();
	// Add a leading zero to the minutes value
	$("#current-time-pop .min").html(( minutes < 10 ? "0" : "" ) + minutes);
    },1000);
	
setInterval( function() {
	// Create a newDate() object and extract the hours of the current time on the visitor's
	var hours = new Date().getHours();
	// Add a leading zero to the hours value
	$("#current-time-pop .hours").html(( hours < 10 ? "0" : "" ) + hours);
    }, 1000);	
});