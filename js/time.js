var NOW = new Date().getTime(),
        DAY_IN_MILLISECONDS = 24*60*60*1000,
        TIME_SELECTOR = '#time',
        CURRENT_TIME_SELECTOR = '#current-time',
        FUTURE_TIME_SELECTOR = '#future',
        MARKER_SELECTOR = '.marker',
        MILESTONE_SELECTOR = '.milestone',
        MILESTONE_PROTOTYPE_SELECTOR = '.prototype',
        SCALE_IN_SELECTOR = '#add-day',
        SCALE_OUT_SELECTOR = '#sub-day',
        ADD_MARKER_SELECTOR =   '#add-marker-btn',
        DAY_MARKER = '.day',
        SCALE_COUNTER = 1;


function Timeline (dateObj) {
    this.scale = 1;
    this.nowPoint = 50;
    this.scaleInSelector = SCALE_IN_SELECTOR;
    this.scaleOutSelector = SCALE_OUT_SELECTOR;
    this.currentTimeScale = this.scale * DAY_IN_MILLISECONDS;
    this.changeableDate = dateObj;
    this.cursorMarkerType = 'milestone';
    this.markerCount = $(MARKER_SELECTOR).length;
    this.step = 30; //in minutes
    
    this.init();
}

Timeline.prototype.init = function(){
    var marker_count = this.markerCount;
    $(MARKER_SELECTOR).each(function(index){
        if(index%2 == 1)
            $(this).addClass('top');
        else
            $(this).addClass('bottom');
    });
    
    this.setDayMarkers();
    this.updateTime();
    this.startTimeAnimation();
}



/////////////////
// ALL FUNCTIONS FOR TIME MANAGING GO HERE
/////////////////



Timeline.prototype.updateTime = function(){
    var nPoint = this.nowPoint,
        curTimeScale = this.currentTimeScale;
    
    this.beforeUpdateTime();
    
    $(MARKER_SELECTOR).each(function(){
        var current_position,
            time_left_middle,
            percent_from_middle,
            formated_date = $(this).data('thedate');
        
        if($(this).hasClass('timespan')){
            $(this).css('width', (($(this).data('duration')/curTimeScale)*100)+'%');
        }
        
        time_left_middle = dateInMilliseconds(formated_date)-NOW;
        percent_from_middle = (time_left_middle/curTimeScale)*100;
        current_position = (percent_from_middle+nPoint)+'%';
        
        $(this).css('left',current_position);

    });
}


Timeline.prototype.setChangeableDate = function(dateObj){
    this.changeableDate = dateObj;
    this.updateNowPoint();
    this.updateTime();
}

Timeline.prototype.setNow = function(dateObj){
    NOW = dateObj.getTime();
    this.updateNowPoint();
    this.updateTime();
}

Timeline.prototype.updateNowPoint = function(){
    this.nowPoint =  (((NOW-this.changeableDate.getTime())/this.currentTimeScale)*100)+50;
    $(CURRENT_TIME_SELECTOR).css('width',this.nowPoint+'%');
}


Timeline.prototype.beforeUpdateTime = function() {
    
}



/////////////////
// ALL FUNCTIONS FOR SCALING GO HERE
/////////////////



Timeline.prototype.setScale = function(value) {
    this.scale = value;
    this.currentTimeScale =this.scale*DAY_IN_MILLISECONDS;
}

Timeline.prototype.scaleTime = function(newScale){
    var cDate = NOW,
        nPoint = this.nowPoint,
        curTimeScale = this.currentTimeScale;
    
    if(newScale != 0)
        this.setScale(newScale);
    
    this.updateTime();
    
    SCALE_COUNTER++;
}

Timeline.prototype.scaleTimeIn = function() {
    var currentScale = this.scale,
        nextScale = this.scale;
        
    if(this.scale > 1){
        nextScale = currentScale -1;
            
    }else{
        nextScale = currentScale/2;
    }
        
    this.scaleTime(nextScale);
}

Timeline.prototype.scaleTimeOut = function(){
    var currentScale = this.scale,
        nextScale = this.scale;
        
    if(this.scale > 1){
        nextScale = currentScale + 1;
            
    }else{
        nextScale = currentScale*2;
    }
        
    this.scaleTime(nextScale);
}



/////////////////
// ALL FUNCTIONS FOR MARKERS GO HERE
/////////////////



Timeline.prototype.setDayMarkers = function () {
    var thedate_before,
        thedate_after,
        changeable_time = this.changeableDate.getTime();
    
    //Setting the day marker for 100 days before and after current day
    for(var i =1; i<100;i++){
        thedate_before = moment(changeable_time).day((1-i)).format("DD-MM-YYYY");
        thedate_after = moment(changeable_time).day(i).format("DD-MM-YYYY");
        $(TIME_SELECTOR).append('<div class="marker day" data-thedate="'+ thedate_before +" "+ "00:00" +'"><span>'+moment(thedate_before,'DD-MM-YYYY').format('DD.MM.YYYY')+'</span></div>');
        $(TIME_SELECTOR).append('<div class="marker day" data-thedate="'+ thedate_after +" "+ "00:00" +'"><span>'+moment(thedate_after,'DD-MM-YYYY').format('DD.MM.YYYY')+'</span></div>');
    }

}

Timeline.prototype.addGoalPrototype = function(){
    
    
}

Timeline.prototype.addMilestonePrototype = function(dCursor){
    var milestone_element,
        distance_from_begining = dCursor,
        distance_from_now,
        time_from_now,
        main_date_obj,
        top_bottom;
    
    //Calculating the time for the current distance
    distance_from_now = this.pixleToPercent(distance_from_begining)-this.nowPoint;
    time_from_now = this.percentToTime(distance_from_now);
    main_date_obj = new Date(NOW + time_from_now);
    
    //
    //See if the post should appear on top or bottom
    //
    this.markerCount++;
    
    if(((this.markerCount-1)%2) == 1)
        top_bottom = 'top';
    else
        top_bottom = 'bottom';
    
    //Creating and appeding the element
    milestone_element = 
        '<div placholder="Write here..." class="milestone '+top_bottom+' prototype marker bigger-a milestone-create-anim" data-thedate="'+moment(main_date_obj.getTime()).format('DD-MM-YYYY HH:mm')+'">'
        +'<textarea></textarea>'
        +'</div>';
    
    $(TIME_SELECTOR).append(milestone_element);
    
    //Update time to position the element automatically
    this.updateTime();
    
    //Adding the event
    this.afterMilestonePrototypeCreated();
}


Timeline.prototype.afterMilestonePrototypeCreated = function() {
    
}



/////////////////
// ALL FUNCTIONS FOR ANIMATIONS GO HERE
/////////////////



Timeline.prototype.startTimeAnimation = function(){
    var me = this;
    
    setInterval( function() {
        var date_for_now = new Date(NOW +1000),
            date_for_changeable = new Date(me.changeableDate.getTime() + 1000);
        me.setNow(date_for_now);
        me.setChangeableDate(date_for_changeable);
        
    },1000);
    
}



//////////////////
// HELPER FUNCTIONS GO HERE
//////////////////



Timeline.prototype.pixleToPercent = function (pixel){
    return (pixel/$(window).width())*100;
}



Timeline.prototype.percentToTime = function(percent){
    return (percent/100)*this.currentTimeScale;
}




//Input date in format DD-MM-YYYY hh:mm output as timestamp

function dateInMilliseconds(dateString){
    
    var dateParts = dateString.split(' '),
        timeParts = dateParts[1].split(':'),
        date;

    dateParts = dateParts[0].split('-');
    date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);
    return date.getTime();
}
