/**
 * bruceday
 */

//扩展数组方法，删除特定的值
Array.prototype.remove = function(obj){
	
	for(var i=0,l=this.length;i < l;i++){
		if(this[i] == obj){
			this.splice(i,1);
			return this;
		}
	}
	throw "The Array has no this Obj";
}

//背景声音文件数组
var bgSoundArray = {
    1: "action_world1.mp3",
    2: "action_world2.mp3",
    3: "action_world3.mp3",
    4: "action_world4.mp3",
    5: "action_world5.mp3",
    6: "destroyer_lazser1.mp3"
};


//游戏控制类
var Game = {
	//游戏背景dom
	gamePanel : null,
	//飞机玩家
	flyer : null,
	//敌机列表
	enemyList : [],
	//分数
	score : 0,
	//游戏是否结束
	isGameOver : false,
	//初始化
	init : function(){		
		var _this = this;
		//获取游戏背景
		this.gamePanel = document.getElementById("gamePanel");
		//游戏背景获得焦点
		this.gamePanel.focus();
		//启动飞机
		this.startFlyer();
		//启动 敌机
		this.startEnemy();
		//设置键盘按下与释放事件
		document.body.onkeydown  = function(e){_this.onkeydown(e);};
		document.body.onkeyup = function (e) { _this.onkeyup(e); }

	    //启动声音
		this.palysound();
	},
	//启动飞机
	startFlyer : function(){		
		var _this = this;
		//新建飞机对象
		this.flyer = new Flyer();
		//设置位置
		this.flyer.setPosition(this.gamePanel,this.gamePanel.clientWidth,this.gamePanel.clientHeight);
		//重写发弹函数
		this.flyer.onSendBullet = function(){this.sendBullet(_this.enemyList);};
		//重写修改分数
		this.flyer.onChangeScore = function(){_this.changeScore();};
	},
	//启动敌机
	startEnemy : function(){
		//游戏结束，退出
		if(this.isGameOver)return;		
		var _this = this;
		//新建一个敌机对象
		var enemy = new Enemy();	  

		//将敌机添加进游戏背景
		this.gamePanel.appendChild(enemy.dom);
		//随机出敌机的x坐标位置
		var randomX = parseInt(Math.random()* (this.gamePanel.clientWidth / enemy.dom.clientWidth),10);
		//设置位置
		enemy.setPosition(randomX * enemy.dom.clientWidth, 0);	 

		setTimeout(function () {
		    //创建敌机炮弹对象
		    var enemybullet = new EnemyBullet();
		    //将敌机炮弹加进游戏背景
		    this.gamePanel.appendChild(enemybullet.dom);
		    //设置敌机炮弹的初始位置
		    enemybullet.setInitPosition(enemy.dom);
		    enemybullet.animation(_this.flyer.dom);
		},2000);
         
		
		//重写检测是否击中飞机玩家
		enemy.OnCheckCrash = function(){
			//游戏结束，退出
			if(_this.isGameOver)return;
			//判断是否击中
			if(Math.sqrt(Math.pow(_this.flyer.dom.offsetLeft-this.dom.offsetLeft,2)+Math.pow(_this.flyer.dom.offsetTop-this.dom.offsetTop,2))
				<= _this.flyer.dom.clientWidth / 2 + this.dom.clientWidth / 2 || document.getElementById('staticglobalvalue').innerHTML=="die") {
				//敌机死亡
				this.isLive = false;
				//飞机玩家爆炸
				_this.flyer.burstFlyer();
			    //设置staticglobalvalue为true
				document.getElementById('staticglobalvalue').innerHTML == "live";
				return true;
			}
			return false;
		}
		//重写敌机结束事件
		enemy.onend = function(){
			_this.gamePanel.removeChild(this.dom);
			_this.enemyList.remove(this);
		}
		//游戏结束函数
		enemy.gameover = function(){_this.gameover();}
		//敌机移动
		enemy.animation(this.gamePanel.clientWidth,this.gamePanel.clientHeight);
		//将敌机添加到列表中
		this.enemyList.push(enemy);
		//启动
		setTimeout(function(){_this.startEnemy();},500);
	},
	//键盘按下事件
	onkeydown : function(e){
		e = e || window.event;
		
		var keyCode = e.keyCode;
		
		//阻止浏览器默认事件
		if(keyCode == 32 || this.flyer.keyCodeAndDirection[keyCode]){
			if(e.preventDefault)e.preventDefault();
			else e.returnValue = false;
		}
		else return;
		//回调飞机键盘按下事件
		this.flyer.keydown(e);
	},
	//键盘释放事件
	onkeyup : function(e){
		e = e || window.event;
		//回调飞机键盘释放事件
		this.flyer.keyup(e);
	},
	//修改分数
	changeScore : function(){		
	    this.score += 100;
	    finalScore += 100;
		document.getElementById('score').innerHTML =  this.score;
		//分数级别
		var scoreLevel = parseInt(this.score / 3000,10) + 1;
		//判断是否升级飞机子弹级别
		if(scoreLevel > 1){
			this.flyer.bulletLevel = scoreLevel>=5?5:scoreLevel;
			//修改敌机移动速度
			Enemy.prototype.movesp = Enemy.prototype.movespMap[this.flyer.bulletLevel];

		    //修改敌机图片
            

		    //修改背景图片
			var bgimg = document.getElementById('bgimg');
			bgimg.setAttribute("src", "img/bg" + this.flyer.bulletLevel + ".jpg");
		    var bgsubone = document.getElementById("bgsubonediv");
		    var bgsubtwo = document.getElementById("bgsubtwodiv");
		    bgsubtwo.innerHTML = bgsubone.innerHTML; //克隆demo1为demo2
		    //播放背景音乐
		}
	},
	//游戏结束
	gameover: function () {

		this.isGameOver = true;		
		document.getElementById('score').innerHTML = "游戏结束，您的得分是:" + finalScore;
		//var scoreTmp=document.getElementById('score').innerHTML;
		//document.getElementById('score').innerHTML = "游戏结束，您的得分是:" + scoreTmp;

		for(var i=0,l=this.enemyList.length;i < l;i++){
			this.gamePanel.removeChild(this.enemyList[0].dom);
			this.enemyList.remove(this.enemyList[0]);
		}
		
		this.gamePanel.removeChild(this.flyer.dom);
		this.flyer = null;
		this.score = 0;		
		this.gamePanel = null;		
		document.body.onkeydown = null;
		document.body.onkeyup = null;		
		document.getElementById('startBtn').style.display = 'block';
        //将速度频率变为100
		Enemy.prototype.movesp = 100;
	    //设置开始游戏按钮的文本为"再来一把"
		document.getElementById("startBtn").innerText = "再来一把";
	    //设置初始界面浮现元素
		document.getElementById('maintitle').style.visibility = "visible";
		document.getElementById('ranking').style.visibility = "visible";
		document.getElementById('help').style.visibility = "visible";
		document.getElementById("askScoreDiv").style.visibility = "visible";
	},

    //播放背景音乐
	palysound: function () {
	    var bgauto = document.getElementById("bgauto");
	    bgauto.setAttribute("src", "music/action_world1.mp3");
	}
}
//游戏开始入口
function Start() {
    finalScore = 0;
    if (document.getElementById('staticglobalvalue').innerText = 'live')
        Game.isGameOver = false;
    else
        Game.isGameOver = true;
	Game.init();
	document.getElementById('startBtn').style.display = 'none';
	document.getElementById('score').innerHTML = 0;
    //修改背景图片
	var bgimg = document.getElementById('bgimg');
	bgimg.setAttribute("src", "img/bg.jpg");
	var bgsubone = document.getElementById("bgsubonediv");
	var bgsubtwo = document.getElementById("bgsubtwodiv");
	bgsubtwo.innerHTML = bgsubone.innerHTML; //克隆demo1为demo2

    //隐藏标题，按钮
	document.getElementById('maintitle').style.visibility = "hidden";
	document.getElementById('ranking').style.visibility = "hidden";
	document.getElementById('help').style.visibility = "hidden";

}
