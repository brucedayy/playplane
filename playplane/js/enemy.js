/**
 * bruceday
 */

//敌机类
var Enemy = function () {
    //敌机dom元素
    this.dom = null;
    //是否存活
    this.isLive = true;
    this.init();

    //是否发弹中
    this.isSend = false;
}
Enemy.prototype = {
    //敌机横向移动速度
    movepx: 10,
    //敌机纵向移动速度
    movepy: 2,
    //敌机移动频率
    movesp: 100,
    //敌机移动频率映射
    movespMap: {
        1: 60,
        2: 40,
        3: 30,
        4: 20
    },
    //初始化
    init: function () {
        this.dom = document.createElement('div');
        this.dom.className = 'enemy';
    },
    //设置敌机初始位置,x与y坐标
    setPosition: function (x, y) {
        this.dom.style.left = x + 'px';
        this.dom.style.top = y + 'px';
    },
    //敌机动画，就是移动，传入参数为游戏背景的宽与高
    animation: function (gameWidth, gameHeight) {
        var _this = this,

		//实际的横向移动速度，左或者右
		_movepx = this.dom.offsetLeft > gameWidth / 2 ? -1 * this.movepx : this.movepx;
        //处理移动函数
        var process = function () {

            //敌机的x,y坐标
            var left = _this.dom.offsetLeft, top = _this.dom.offsetTop;
            //向右移动
            if (_movepx > 0) {
                left = left + _movepx >= gameWidth - _this.dom.clientWidth ? gameWidth - _this.dom.clientWidth : left + _movepx;
            }
                //向左移动
            else {
                left = left + _movepx <= 0 ? 0 : left + _movepx;
            }
            //是否要掉转方向
            if (left <= 0 || left >= gameWidth - _this.dom.clientWidth) { _movepx *= -1; }
            //向下移动
            top = top + _this.movepy >= gameHeight - _this.dom.clientHeight ? gameHeight - _this.dom.clientHeight : top + _this.movepy;
            //设置敌机位置
            _this.dom.style.top = top + 'px';
            _this.dom.style.left = left + 'px';
            //判断是否撞到飞机玩家
            var isCrash = _this.OnCheckCrash();
            //判断是否飞到尽头，是否活着，是否撞到飞机玩家
            if (top < gameHeight - _this.dom.clientHeight && _this.isLive && !isCrash) {
                //继续移动
                setTimeout(process, _this.movesp);
            }
            else {
                //敌机死了而且没撞到飞机玩家
                if (!_this.isLive && !isCrash) {	//爆炸
                    _this.effect();

                    //播放飞机爆炸背景音乐
                    var bgauto = document.getElementById("bombauto");
                    bgauto.play();
                }

                    //敌机撞到飞机玩家
                else {
                    //爆炸
                    _this.effect();
                    //游戏结束
                    setTimeout(function () { _this.gameover(); }, 100);
                    ////设置开始游戏按钮的文本为"再来一把"
                    //document.getElementById("startBtn").innerText = "再来一把";
                    ////设置初始界面浮现元素
                    //document.getElementById('maintitle').style.visibility = "visible";
                    //document.getElementById('ranking').style.visibility = "visible";
                    //document.getElementById('help').style.visibility = "visible";
                }
            }
        }
        //开始移动
        process();
    },
    //敌机爆炸
    effect: function () {
        this.dom.className = 'bingo';
        var _this = this;
        setTimeout(function () { _this.onend() }, 50);
    },
    //外部接口，检测是否撞到飞机玩家
    OnCheckCrash: function () { },
    //敌机结束事件
    onend: function () { },
    //游戏结束
    gameover: function () { }

    //敌机发射子弹


}
