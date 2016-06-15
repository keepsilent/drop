;(function($){
    $.fn.slide = function(options){
        var defaults = {
            id: 'slider', //容器名,例如:id="silder"
            nav: 'slide-nav',
            width: $(window).width(), //容器的宽度
            num: 0, //幻灯片的数量
            speed: 3000,
            timer: true //自动滚动
        }
        var options = $.extend(defaults, options);
        var operate = {
            index: 0,
            startPos:{},
            endPos:{},
            isScrolling: 0,
            timer: {},
            direction: 'left', //滚动方向,默认向左
            model: 'transform',//模式，默认transform，防止部份不支持
            start: function(event) {
                var touch = event.touches[0]; //touches数组对象获得屏幕上所有的touch，取第一个touch
                operate.startPos = { //取第一个touch的坐标值
                    x:touch.pageX,
                    y:touch.pageY,
                    time:+new Date
                };
                operate.isScrolling = 0; //这个参数判断是垂直滚动还是水平滚动

                var _this = config.$(options.id); //绑定事件
                config.addEvent(_this,'touchmove',function(event){operate.move(event)});
                config.addEvent(_this,'touchend',function(event){operate.end(event)});
            },
            move: function(event) {
                if (event.touches.length > 1 || event.scale && event.scale !== 1)  { //多点触摸,当屏幕有多个touch或者页面被缩放过，就不执行move操作
                    return false;
                }

                var touch = event.targetTouches[0];
                operate.endPos = {
                    x:touch.pageX - operate.startPos.x,
                    y:touch.pageY - operate.startPos.y
                };

                operate.isScrolling = Math.abs(operate.endPos.x) < Math.abs(operate.endPos.y) ?  1 : 0; //isScrolling为1时，表示纵向滑动，0为横向滑动
                if(operate.isScrolling == 0) {
                    event.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
                    operate.transform(operate.index);
                }
            },
            end: function(event) {
                var _this = config.$(options.id);
                var duration = +new Date - operate.startPos.time; // 滑动的持续时间

                if(operate.isScrolling === 0) {
                    //operate.direction = 'right';
                    if (Number(duration) > 10) {
                        if(operate.endPos.x > 10){
                            if(operate.index >= 1) {
                                operate.index -= 1;
                            }
                            operate.direction = 'right';
                        } else if(operate.endPos.x < -10){
                            if(operate.index < options.num - 1) {
                                operate.index += 1;
                            }
                            operate.direction = 'left';
                        }

                        if(operate.model == 'transform') {
                            var nav = $('#'+options.id + ' div.'+ options.nav).children();
                            var head = nav.eq(0).hasClass('current');
                            var end = nav.eq(options.num - 1).hasClass('current');

                            if((operate.index == 0) && head) {
                                operate.index = options.num - 1;
                            } else if((operate.index == options.num - 1) && end) {
                                operate.index = 0;
                            }
                        }

                        operate.transform(operate.index);
                    }

                    operate.isScrolling = 0;
                    operate.startPos = {};
                    operate.endPos = {};
                    config.delEvent(_this,'touchmove',function(event){operate.move(event)});
                    config.delEvent(_this,'touchend',function(event){operate.end(event)})
                }
            },
            transform : function(index) {
                var left = -index  * options.width;
                var nav = $('#'+options.id + ' div.'+ options.nav).children();
                nav.removeClass('current')
                nav.eq(index).addClass('current');

                if(operate.model == 'transform') {
                    operate.animate(index);
                }

                if(operate.model == 'position') {
                    $('#'+options.id+' ul').css('left',left);
                    $('#'+options.id+' ul').addClass('animate');
                }

                clearTimeout(operate.timer)
                operate.plan();
            },
            animate: function(index) {
                var before = index - 1;
                var after = index + 1;
                var children = $('#'+options.id+' ul').children();
                before = (before < 0 ) ? options.num - 1 : before;
                after = (after > options.num - 1) ?  0 : after;

                if(operate.direction == 'left') {
                    operate.moveCss(children.eq(before),300,options.width * -1);
                    operate.moveCss(children.eq(after),0,options.width);
                }

                if(operate.direction == 'right') {
                    operate.moveCss(children.eq(before),0,options.width * -1);
                    operate.moveCss(children.eq(after),300,options.width);
                }

                operate.moveCss(children.eq(index),300,0);
            },
            moveCss:function(dom,secoend,space) {
                dom.css({
                    '-moz-transition-duration' : secoend+'ms',
                    '-o-transition-duration' : secoend+'ms',
                    '-webkit-transition-duration' : secoend+'ms',
                    'transition-duration' : secoend+'ms',
                    '-moz-transform':'translate('+space+'px, 0px) translateZ(0px)',
                    '-o-transform':'translate('+space+'px, 0px) translateZ(0px)',
                    '-webkit-transform':'translate('+space+'px, 0px) translateZ(0px)',
                    'transform':'translate('+space+'px, 0px) translateZ(0px)'
                });
            },
            createNavigate: function(num) {
                var html = '';
                for(var i = 0; i < num; i++) {
                    html += '<span data-index="'+i+'"></span>';
                }
                $('#'+options.id + ' div.' + options.nav).html(html);
                $('#'+options.id + ' div.' + options.nav).css('marginLeft',(num * 14 + 16 - 6) / 2 * -1);
                $('#'+options.id + ' div.'+ options.nav).children().eq(0).addClass('current');

                $('#'+options.id + ' div.'+ options.nav+' span').click(function() {
                    var i = $(this).data('index')
                    operate.transform(i);
                });
            },
            plan: function() {
                if(options.timer) {
                    operate.direction = 'left';
                    operate.timer = setInterval(function(){
                        operate.index = operate.index + 1;
                        if(operate.index > options.num - 1 ) {
                            operate.index = 0;
                        }
                        operate.transform(operate.index)
                    },options.speed);
                }
            },
            supports : function(css) { //是否支持css3
                var prefix = '-moz- -o- -webkit-'.split(' ');
                var style = document.createElement('div').style;

                if(css in style) {
                    return true;
                }

                for(var i = 0; i < 3; i++) {
                    if (prefix[css] + css in style) {
                        return true;
                    }
                }

                return false;
            },
            init: function() {
                if(!config.touch()) {
                    return false;
                }

                var _this = config.$(options.id);
                options.width = $('#'+options.id).width();
                options.height = Math.round(parseInt(options.width) * 0.45);
                options.num = $('#'+options.id+' div.slide-inner ul').children().length;
                $('#'+options.id).css('height',operate.height);
                $('#'+options.id+' div.slide-inner ul').css('width',options.width * options.num);
                $('#'+options.id+' div.slide-inner ul').css('height',options.height);
                $('#'+options.id+' div.slide-inner ul li').css('width',options.width);
                $('#'+options.id+' div.slide-inner ul li').css('height',options.height);
                $('#'+options.id+' div.slide-inner ul li img').css('width',options.width);

                if(operate.supports('transform') && operate.supports('transition-duration')) {
                    var i = 0;
                    operate.model = 'transform';
                    $('#'+options.id+' div.slide-inner ul li').each(function() {
                        $(this).css('left',i * options.width);
                        i--;
                    });

                    operate.moveCss($('#'+options.id+' div.slide-inner ul li'),0,options.width * -1);
                    operate.moveCss($('#'+options.id+' ul').children().eq(0),0,0);
                    operate.moveCss($('#'+options.id+' ul').children().eq(1),0,options.width);
                } else {
                    operate.model = 'position';
                }

                operate.plan();
                operate.createNavigate(options.num);
                config.addEvent(_this,'touchstart',function(event){operate.start(event)});
            }
        }

        var config = {
            $ : function(objName) { //获取对象
                if(document.getElementById) {
                    return eval('document.getElementById("'+objName+'")');
                } else {
                    return eval('document.all.'+objName);
                }
            },
            touch: function() { //判断是否支持触屏
                if( typeof( window.ontouchstart ) === 'undefined') {
                    return false;
                }
                if( !this.touch ) {
                    return false;
                }
                return true;
            },
            addEvent: function(obj, eventType, func) { //兼容安桌手机,添加监听事件
                if(obj.attachEvent) {
                    obj.attachEvent("on" + eventType,func);
                } else {
                    obj.addEventListener(eventType,func,false);
                }
            },
            delEvent : function(obj,eventType,func) { //兼容安桌手机，移除监听事件
                if(obj.detachEvent) {
                    obj.detachEvent("on" + eventType,func);
                } else {
                    obj.removeEventListener(eventType,func,false);
                }
            }
        };

        operate.init();
    };
})(window.Zepto || window.jQuery);
