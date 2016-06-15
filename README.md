# Drop
移动端下拉刷新

#背景介绍
称动端的用户基数很大，为了解决用户刷新问题，更友好的用户体验感，用户触摸拖动指定区块，自动加载最新内容。

#安装配置
* 移动端的js库:zepto.min.js，兼容触屏touch事件
* js插件:drop.js，实现拖动加载功能
* 样式，drop.css，drom的样式

#使用方法

````
<script src="js/zepto.min.js?v=2016060701"></script>
<script src="js/drop.js?v=2016060701"></script>
<script type="text/javascript">
    $('#content').drop({ //绑定指定的元素
    action:function(tocher) { //用户拖动完，触发事件
        tocher.resetload(); //需要重新设置可拖动，不然无法再次拖动}
    });
 </script>
````

#效果预览
[Demo](http://keepsilent.github.io/drop/index.html)

#环境下运行
* chrome手机模式:运行流畅,不卡顿
* Iphone 5s:运行流畅,不卡顿
* 红米: 运行不流畅，卡顿(安桌机真心不行)

#Bug
由于移动端的都有下拖刷新功能，两者达到一定位置时,发现拉动抖动,估计是硬伤

#参考资料
* B站APP拖动刷新
* [移动端下拉刷新、上拉加载更多插件](https://github.com/ximan/dropload)

