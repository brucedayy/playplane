/**
 * bruceday
 */

//敌方子弹类
var EnemyBullet = function () {
    //子弹Dom元素
    this.dom = null;
    this.init();
};
EnemyBullet.prototype = {
    //子弹移动速度
    movepx: 4,
    //子弹移动频率
    movesp: 10,
    init: function () {
        this.dom = document.createElement('div');
        this.dom.className = 'enemyBullet';
    },

    //设置敌机子弹的初始位置，根据敌机位置决定
    setInitPosition: function (enemyinfo) {
        this.dom.style.top = enemyinfo.offsetTop + 20 + 'px';
        this.dom.style.left = enemyinfo.offsetLeft + 20+ 'px';
    },

    animation: function (flyerInfo) {
        var _this = this;
        //处理移动函数
        var process = function () {
            var top = _this.dom.offsetTop;
            top = top + _this.movepx >= 0 ? top + _this.movepx : 0;
            _this.dom.style.top = top + 'px';

            //判断子弹是否撞到玩家飞机
            var x1 = _this.dom.offsetLeft + 5; //敌机子弹的中心x坐标
            var y1 = _this.dom.offsetTop + 5; //敌机子弹的中心y坐标
            var x2 = flyerInfo.offsetLeft + 25; //玩家飞机的中心x坐标
            var y2 = flyerInfo.offsetTop + 25; //玩家飞机的中心y坐标
            
            if (Math.abs(Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))-10*Math.sqrt(2))<1)
            {
                //alert(Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) - 10 * Math.sqrt(2));               
                //设置开始游戏按钮的文本为"再来一把"

                //消除界面的炮弹元素
                //var divGamePanel = document.getElementById('gamePanel');
                //for (var i = 0; i < divGamePanel.children.length; i++) {
                //    if (divGamePanel.children[i].className == "enemyBullet") {
                //        divGamePanel.children[i].remove();
                //    }
                //}
                document.getElementById('staticglobalvalue').innerText = 'die';
            }

         
            //判断是否移动到尽头
            if (top < 480) {               
                setTimeout(process, _this.movesp);
            } else {
                _this.dom.remove();
            }
        }
        process();
    }
};