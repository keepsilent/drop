/**
 * 拖动元素自加加载新的数据
 *
 * @author keepsilent
 * @version 1.0.0
 */
;(function($){
    $.fn.drop = function(options){
        var defaults = {
            _this: this,
            _distance: 80,
            up: {
                class:"drop-tips",
                refresh:'<div class="refresh"><p><i class="icon-lightbulb"></i></p><p><i class="icon-arrow-down"></i>再拉,再拉就给你刷新哦</p></div>',
                update:'<div class="update"><p><i class="icon-lightbulb"></i></p><p><i class="icon-arrow-up"></i>够了啦,松开人家嘛</p></div>',
                load:'<div class="load"><p><i class="icon-lightbulb"></i></p><p><i class="icon-refresh icon-spin"></i>刷啊刷啊!,好累啊</p></div>',
                type:0
            },
            action:''
        };
        var options = $.extend(defaults, options);
        var tocher = {
            status:true,
            direction: 'up', //拉的方向,up:向下，down:向上
            touchMove: false,
            startPostion: {}, //开始触发坐标
            endPostion: {}, //结束触发坐标
            scrollTop: 0, //元素离顶部的距离,0为到达底部
            isScrolling: 0, //1:纵向滑动,0:横向滑动
            start:function(event) {
                tocher.startPostion = { //取第一个touch的坐标值
                    x: event.touches[0].pageX,
                    y: event.touches[0].pageY,
                    time:+new Date
                };
                options.up.type = 0;
                tocher.isScrolling = 0;
                tocher.scrollTop = $(window).scrollTop();//记录当前的离顶部的距离
            },
            move:function(event) {
                if (event.touches.length > 1 || event.scale && event.scale !== 1) { //多点触摸,当屏幕有多个touch或者页面被缩放过，就不执行move操作
                    return false;
                }

                tocher.endPostion = {
                    x:event.touches[0].pageX - tocher.startPostion.x,
                    y:event.touches[0].pageY - tocher.startPostion.y
                };

                tocher.isScrolling = Math.abs(tocher.endPostion.x) < Math.abs(tocher.endPostion.y) ?  1 : 0;
                if(tocher.isScrolling == 0) { //如果横向滑动，不触发事件
                    return false;
                }

                var moveY = tocher.endPostion.y;
                var absMoveY = Math.abs(moveY);

                if(moveY > 0) {
                    tocher.direction = 'down';
                } else if (moveY < 0) {
                    tocher.direction = 'up';
                }


                if(tocher.scrollTop <= 0 && tocher.direction == 'down') { //加载上方
                    event.preventDefault();
                    if(!tocher.touchMove) {
                        var html = '<div class="'+options.up.class+'">'+options.up.refresh+'</div>';
                        options._this.prepend(html);
                        tocher.touchMove = true;
                    }
                    tocher.animate(absMoveY);
                }
            },
            end:function(event){
                var moveY = tocher.endPostion.y;
                var absMoveY = Math.abs(moveY);
                var up = $('.'+options.up.class);

                if(tocher.scrollTop <= 0 && tocher.direction == 'down') {
                    options.up.type = 0;
                    tocher.transition(up,300);
                    if(absMoveY > options._distance){
                        up.css('height',up.find('div').height());
                        tocher.status = false;
                        up.html(options.up.load);
                        options.action(tocher);
                    } else {
                        if(tocher.direction == 'down' && tocher.touchMove == true) {
                            up.css({'height':'0'}).on('webkitTransitionEnd mozTransitionEnd transitionend',function(){
                                tocher.touchMove = false;

                                $(this).remove();
                            });
                        }
                    }
                }
            },
            animate:function(absMoveY) {//摸拟下拉动作
                var offsetY = 0;
                var up = $('.'+options.up.class);
                tocher.transition(up,0);

                if(absMoveY <= options._distance) { //下拉
                    offsetY = absMoveY;

                    if(options.up.type == 1) {
                        up.html(options.up.refresh);
                        tocher.rotate($('.icon-arrow-down'), 'trun', 180);
                    }
                    options.up.type = 0;
                } else if(absMoveY > options._distance && absMoveY <= options._distance * 2) { //指定距离 < 下拉距离 < 指定距离 * 2
                    offsetY = options._distance + (absMoveY - options._distance) * 0.5;

                    if(options.up.type == 0) {
                        up.html(options.up.update);
                        tocher.rotate($('.icon-arrow-up'),'trun',0);
                    }

                    options.up.type = 1;
                } else { //下拉距离 > 指定距离 * 2
                    offsetY = options._distance + options._distance * 0.5 + (absMoveY - options._distance * 2) * 0.2;
                }
                up.css('height',offsetY);
            },
            resetload:function() { //释放
                var up = $('.'+options.up.class);
                tocher.status = true;
                if(tocher.direction == 'down' && tocher.touchMove == true) {
                    up.css({'height':'0'}).on('webkitTransitionEnd mozTransitionEnd transitionend',function(){
                        tocher.touchMove = false;
                        $(this).remove();
                    });
                }
            },
            transition: function(dom,num) {
                dom.css({
                    '-moz-transition':'all '+num+'ms',
                    '-o-transition':'all '+num+'ms',
                    '-webkit-transition':'all '+num+'ms',
                    'transition':'all '+num+'ms'
                });
            },
            rotate:function(dom,className,rotate) {
                if(!dom.hasClass(className)) {
                    dom.addClass(className);
                }
            }
        };
        var operate = {
            init: function() {
                options._this.on('touchstart',function(e){
                    if(!tocher.status) {
                        return false;
                    }
                    tocher.start(e);
                });

                options._this.on('touchmove',function(e){
                    if(!tocher.status) {
                        return false;
                    }
                    tocher.move(e);
                });

                options._this.on('touchend',function(e){
                    if(!tocher.status) {
                        return false;
                    }
                    tocher.end(e);
                });
            }
        };
        operate.init();
    };
})(window.Zepto || window.jQuery);
