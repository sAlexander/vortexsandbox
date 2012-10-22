
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
function Vortex (base, reflection) {
    this.base = base;
    this.reflection = typeof reflection !== 'undefined' ? reflection : false;
}
Vortex.prototype.positive = function(){
    if(this.reflection){
        return !$(this.base).hasClass('positive');
    }else{
        return $(this.base).hasClass('positive');
    }
}
Vortex.prototype.y = function(){
    if(this.reflection){
        return parseFloat('-'+$(this.base).css('top'),10);
    }else{
        return parseFloat($(this.base).css('top'),10);
    }
}
Vortex.prototype.x = function(){
    return parseFloat($(this.base).css('left'),10);
}

Vortex.prototype.setx = function(value){
    $(this.base).css('left',value);
}

Vortex.prototype.sety = function(value){
    if(this.reflection){
        return true;
    }else{
        $(this.base).css('top',value);
    }
}


// Utility functions
ylen = function(a,b){return b.y() - a.y()};
xlen = function(a,b){return b.x() - a.x()};
radius = function(a,b){return Math.sqrt(Math.pow(xlen(a,b),2)+Math.pow(ylen(a,b),2))};
debug = function(statement){$('#debug').html($('#debug').html() + '\n' + statement)};
togglerunning = function(){ running = !running; $('#button').attr('value',running);};
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
    });
    return vars;
}


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
            var vroot = new Vortex(root);
            var u_x = 0;
            var u_y = 0;
            $('.vortex').each(function(iContr, contr){
                var vcontrnonref = new Vortex(contr);
                var vcontrref = new Vortex(contr, true);
                $.each([vcontrnonref, vcontrref], function(iVContr, vcontr){
                    if(vcontr.positive()){sign = 1}else{sign = -1}
                    var r = radius(vroot,vcontr);
                    if(r>1) {
                        var u_theta = sign*gamma / (2 * Math.PI * r);
                        u_y = u_y + u_theta*xlen(vroot,vcontr)/r;
                        u_x = u_x - u_theta*ylen(vroot,vcontr)/r;
                    };
                });
            });
            toadd_x.push(u_x*dt);
            toadd_y.push(u_y*dt);
        });
        vorticies.each(function(iRoot,root){
            var vroot = new Vortex(root);
            vroot.sety(vroot.y() + toadd_y.shift());
            vroot.setx(vroot.x() + toadd_x.shift());
        })
    }
}


$(document).ready(function(){
    if( getUrlVars()['init'] == 'spinning'){
        $('#container').append('<div class="vortex positive" style="left:200px; top:200px">+</div>');
        $('#container').append('<div class="vortex negative" style="left:200px; top:250px">-</div>');
        }
    if( getUrlVars()['init'] == 'leapfrog'){
        $('#container').append('<div class="vortex positive" style="left:200px; top:200px">+</div>');
        $('#container').append('<div class="vortex negative" style="left:200px; top:250px">-</div>');
        $('#container').append('<div class="vortex negative" style="left:200px; top:400px">-</div>');
        $('#container').append('<div class="vortex positive" style="left:200px; top:450px">+</div>');
        }
    if( getUrlVars()['init'] == 'expleapfrog'){
        $('#container').append('<div class="vortex positive" style="top:200px; left:200px">+</div>');
        $('#container').append('<div class="vortex negative" style="top:200px; left:250px">-</div>');
        $('#container').append('<div class="vortex negative" style="top:200px; left:400px">-</div>');
        $('#container').append('<div class="vortex positive" style="top:200px; left:450px">+</div>');
        }
    setInterval(stepforward,10);
    $('#button').click(togglerunning);
});
