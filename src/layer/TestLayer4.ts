enum FlyBehavior
{
	ORANGE_BIRD_BEGIN,
	O_FLY_STRAIGHT_DOWN, //垂直向下
	O_FLY_DOWN_RANDOM_LR,    //向下的同时， 随机左右摇摆(仅用于橙色的鸟)
	ORANGE_BIRD_END,

	
	BLUE_BIRD_BEGIN,
	B_FLY_DOWN_LFET = BLUE_BIRD_BEGIN,         //以一定角度向屏幕左侧飞出
	B_FLY_DOWN_RIGHT,        //以一定角度向屏幕右侧飞出
	B_FLY_STRAIGHT_DOWN, //垂直向下
	BLUE_BIRD_END,
}




class Bird
{
	display: egret.DisplayObject;
	fly_behavior: number;
	static id:number = 0;

	public constructor(display:egret.DisplayObject,fly_behavior:FlyBehavior)
	{
		Bird.id++;
		this.display = display;
		this.fly_behavior = fly_behavior;
	}

	public getDisplay()
	{
		return this.display;
	}

	public getFlyBehavior()
	{
		return this.fly_behavior;
	}

	public getID()
	{
		return Bird.id;
	}

}


class BlueBird extends Bird
{
	public constructor(display:egret.DisplayObject,fly_behavior:FlyBehavior)
	{
		super(display,fly_behavior);
	}

	public fly()
	{
		let fly_behavior = this.getFlyBehavior();
		let display = this.getDisplay();
		if(fly_behavior == FlyBehavior.B_FLY_DOWN_LFET)
		{
			this.display.x--;
			this.display.y++;
		}
		else if(fly_behavior == FlyBehavior.B_FLY_DOWN_RIGHT)
		{
			this.display.x++;
			this.display.y++;
		}
		else if(fly_behavior == FlyBehavior.B_FLY_STRAIGHT_DOWN)
		{
			this.display.y++;
		}
	
	}
}

class OrangeBird extends Bird
{
	public constructor(display:egret.DisplayObject,fly_behavior:FlyBehavior)
	{
		super(display,fly_behavior);
	}
}

class BirdsManager{
    m_blue_birds: {[id: string]: BlueBird} = {};
	m_orange_birds: {[id: string]: Bird} = {};

	m_layer:tutils.Layer;

	public init(layer:tutils.Layer)
	{
		this.m_layer = layer;
	}
	
	public  generate()
	{
		let stage_width = this.m_layer.stage.stageWidth;
		let stage_height = this.m_layer.stage.stageHeight;
		let x = Math.random()* stage_width;
		let y = 20;
		let max = FlyBehavior.BLUE_BIRD_END - FlyBehavior.BLUE_BIRD_BEGIN;
		let fly_behavior = Math.floor(Math.random()* max + FlyBehavior.BLUE_BIRD_BEGIN);
		let display = this.createBlueDisplay(x,y);
		let blue_bird = new BlueBird(display,fly_behavior);
		this.m_layer.addChild(display);

		let id = blue_bird.getID();
		//console.log("new blue bird, id = " + id + ", FlyBehavior = " + fly_behavior);
		this.m_blue_birds[id] = blue_bird;
	}

	private createBlueDisplay(x: number, y: number): egret.DisplayObject {
		let obj = tutils.createBitmapByName("hero_png");
		obj.anchorOffsetX = obj.width / 2;
		obj.anchorOffsetY = obj.height / 2;
		obj.x = x;
		obj.y = y;
		return obj;
	}

	public getBlueCount()
	{
		return Object.keys(this.m_blue_birds).length;
	}
	
	public getOrangeCount()
	{
		return Object.keys(this.m_orange_birds).length;
	}

	private removeOutofBounds()
	{
		for ( let id in this.m_blue_birds)
		{
			let blue_bird = this.m_blue_birds[id];
			let display = blue_bird.getDisplay();
			
		
			if(display.x > this.m_layer.stage.stageWidth || display.x < 0 || display.y > this.m_layer.stage.stageHeight)
			{

				this.m_layer.removeChild(display);
				delete this.m_blue_birds[id];
			}
		}
	}

	public onEnterFrame()
	{
		let blue_count = this.getBlueCount();
		let orange_count = this.getOrangeCount();

		for ( let id in this.m_blue_birds)
		{
			let blue_bird = this.m_blue_birds[id];
			blue_bird.fly();
		}

		this.removeOutofBounds();

		if(blue_count >= 10)
		{
			return;
		}
		this.generate();

	}
		
}

class HPDisplay
{
	m_layer:tutils.Layer;
	m_hp:number;
	m_display:egret.DisplayObject;
	public init(layer:tutils.Layer)
	{
		this.m_layer = layer;
	}

	public setHP(hp:number)
	{
		this.m_hp = hp;
	}
	public getHP() :number
	{
		return this.m_hp;
	}

	private create() {

	}
}


class TestLayer4 extends tutils.Layer {
	
	m_last_tick_time:number;//上一次进入帧函数的时间
	m_balls:egret.DisplayObject[] = [];
	m_ball_r:number;


	m_dst_x:number;
	m_dst_y:number;

	birds_manager:BirdsManager;

	// override
	protected onCfgStage(): void {
		this.stage.frameRate = 60;
		
	}

	// override
	protected onInit(): void {
		//let bgCtrl = new tutils.BackgroundController(this.stage.stageWidth, this.stage.stageHeight, "wings_bg_png").create();
		//this.addChild(bgCtrl.gameObject);
		//bgCtrl.start(15);
		let bg = tutils.createBitmapByName("wings_bg_png");
		this.addChild(bg);

		this.layer.touchEnabled = true;

		this.layer.addEventListener(egret.TimerEvent.ENTER_FRAME, this.onEnterFrame, this);
		this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this.layer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		this.layer.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);

        this.m_dst_x = this.stage.stageWidth * 0.5;
        this.m_dst_y = this.stage.stageHeight * 0.5;
		this.m_ball_r = 50;

		for (let i=0; i<10; i++) {
			let ball = this.createDisplayBall(this.m_dst_x, this.m_dst_y,this.m_ball_r);
			this.layer.addChild(ball);
			this.m_balls.push(ball);
		}
        
        this.m_last_tick_time = egret.getTimer();

		this.birds_manager  = new BirdsManager();
		this.birds_manager.init(this);
		
	}

	private onEnterFrame(evt: egret.TimerEvent): void {

		let current_time = egret.getTimer();
        let dt = current_time - this.m_last_tick_time;
        this.m_last_tick_time = current_time;

        let dty = 30;

		for (let i=0; i<this.m_balls.length; i++) {
			let dstX = i===0 ? this.m_dst_x : this.m_balls[i-1].x;
			let dstY = i===0 ? this.m_dst_y : this.m_balls[i-1].y+dty;
			let ball = this.m_balls[i];
			
			let d = this.distance(ball.x, ball.y, dstX, dstY);
			let a = Math.atan2(dstY-ball.y, dstX-ball.x);
			let v = this.calcV(d);
			let vx = v * Math.cos(a) * v;
			let vy = v * Math.sin(a) * v;
			ball.x += vx * dt;
			ball.y += vy * dt;
		}
		this.birds_manager.onEnterFrame();
	}

    private calcV(d: number): number {
        let v = Math.log(d*0.01+1);
        return v;
    }

	private onTouchBegin(evt: egret.TouchEvent): void {
//		console.log("touch begin:" + "x:" + evt.localX + ",y:" + evt.localY);
        this.m_dst_x = evt.localX;
        this.m_dst_y = evt.localY;	
	}

	private onTouchMove(evt: egret.TouchEvent): void
	{
		//console.log("touch move:" + "x:" + evt.localX + ",y:" + evt.localY);
        this.m_dst_x = evt.localX;
        this.m_dst_y = evt.localY;
	}

	private onTouchEnd(evt: egret.TouchEvent): void
	{
		
	}



	private createDisplayBall(x: number, y: number, r:number): egret.DisplayObject {
		//let obj = tutils.createBitmapByName("ball_png");
		let obj = tutils.createBitmapByName("hero_png");
		obj.width = r * 2;
		obj.height = r * 2;
		obj.anchorOffsetX = obj.width / 2;
		obj.anchorOffsetY = obj.height / 2;
		obj.x = x;
		obj.y = y;
		return obj;
	}

	private distance(x1:number,y1:number,x2:number,y2:number):number
	{
		let a = (x1-x2) * (x1-x2);
		let b = (y1-y2) * (y1-y2);

		return Math.sqrt(a+b);
	}

}