
// Set mousedown to create a new vortex
$('#container').bind('contextmenu',function(e){ return false;});
$('#container').mousedown(function(event) {
    switch (event.which) {
        case 1:
            var x = event.pageX - this.offsetLeft; var y = event.pageY - this.offsetTop;
            $('#container').append('<div class="vortex positive" style="left:' + x + '.11px; top:' + y + 'px">+</div>');
            break;
        case 3:
            var x = event.pageX - this.offsetLeft; var y = event.pageY - this.offsetTop;
            $('#container').append('<div class="vortex negative" style="left:' + x + '.11px; top:' + y + 'px">-</div>');
            break;
        case 2:
            alert('Center mouse button pressed');
            break;
        default:
            alert('You have a strange mouse');
    }
});

// Create a reflective class for each vortex
function Refvort (base) {this.base = base; return this;}
Refvort.prototype.hasClass = function(klass){
    switch(klass)
    {
        case 'positive': if(this.base.hasClass('positive')){return false;}else{return true;}; break;
        case 'negative': if(this.base.hasClass('negative')){return false;}else{return true;}; break;
        default: return false;
    }
}
Refvort.prototype.css = function (attr){
    switch(attr)
    {
        case 'top': return '-'+this.base.css('top'); break;
        case 'left': return this.base.css('left'); break;
        default: '0px';
    }
}



// Utility functions
y = function(a){return parseFloat(a.css('top'),10)};
x = function(a){return parseFloat(a.css('left'),10)};
sety = function(a){ return false}
ylen = function(a,b){return y(b) - y(a)};
xlen = function(a,b){return x(b) - x(a)};
radius = function(a,b){return Math.sqrt(Math.pow(xlen(a,b),2)+Math.pow(ylen(a,b),2))};
debug = function(statement){$('#debug').html($('#debug').html() + '\n' + statement)};
togglerunning = function(){ running = !running; $('#button').attr('value',running);};

// Variable to hold the running state
var running = false

// Update function
stepforward = function(){
    if(running){
        var dt = 2;
        var gamma = 100;
        vorticies = $('.vortex');
        toadd_x = []; toadd_y = [];
        vorticies.each(function(iRoot,root){
            var u_x = 0;
            var u_y = 0;
            $('.vortex').each(function(iContr, contr){
                if($(contr).hasClass('positive')){sign = 1}else{sign = -1}
                if(radius(root,contr)>1) {
                    var r = radius(root,contr);
                    var u_theta = sign*gamma / (2 * Math.PI * r);
                    u_y = u_y + u_theta*xlen(root,contr)/r;
                    u_x = u_x - u_theta*ylen(root,contr)/r;
                };
            });
            toadd_x.push(u_x*dt);
            toadd_y.push(u_y*dt);
        });
        vorticies.each(function(iRoot,root){
            $(root).css('top',y(root) + toadd_y.shift());
            $(root).css('left',x(root) + toadd_x.shift());
        })
    }

}


$(document).ready(function(){
setInterval(stepforward,10);
$('#button').click(togglerunning);
});
