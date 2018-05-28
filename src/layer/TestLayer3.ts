class TestLayer3 extends tutils.Layer {
	
	m_last_tick_time:number;//上一次进入帧函数的时间
	m_ball:egret.DisplayObject;
    m_ball2:egret.DisplayObject;
    m_ball3:egret.DisplayObject;

	m_ball_r:number;


	m_dst_x:number;
	m_dst_y:number;



	m_K:number; //常量 V=K * D
	m_XSign:number; 
	m_YSign:number; 


	// override
	protected onCfgStage(): void {
		this.stage.frameRate = 60;
	}

	// override
	protected onInit(): void {
		let bg = tutils.createBitmapByName("grid100_png");
		this.addChild(bg);

		this.layer.touchEnabled = true;

		this.layer.addEventListener(egret.TimerEvent.ENTER_FRAME, this.onEnterFrame, this);
		this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this.layer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		this.layer.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);

        this.m_dst_x = 200;
        this.m_dst_y = 200;
		this.m_ball_r = 20;
		this.m_ball = this.createDisplayBall(this.m_dst_x, this.m_dst_y,this.m_ball_r);
		this.layer.addChild(this.m_ball);
        this.m_ball2 = this.createDisplayBall(this.m_dst_x, this.m_dst_y,this.m_ball_r);
        this.layer.addChild(this.m_ball2);
        this.m_ball3 = this.createDisplayBall(this.m_dst_x, this.m_dst_y,this.m_ball_r);
        this.layer.addChild(this.m_ball3);

		this.m_K = 0.002;
        this.m_last_tick_time = egret.getTimer();
	}





	private onEnterFrame(evt: egret.TimerEvent): void {
		let current_time = egret.getTimer();
        let dt = current_time - this.m_last_tick_time;
        this.m_last_tick_time = current_time;

        let k = 0.003;
        let d = this.distance(this.m_ball.x, this.m_ball.y, this.m_dst_x, this.m_dst_y);
        let a = Math.atan2(this.m_dst_y-this.m_ball.y, this.m_dst_x-this.m_ball.x);
        let v = this.calcV(d);
        let vx = v * Math.cos(a) * v;
        let vy = v * Math.sin(a) * v;
        this.m_ball.x += vx * dt;
        this.m_ball.y += vy * dt;

		let dty = 30;
		let ball1y = this.m_ball.y + dty;
        let d2 = this.distance(this.m_ball.x, ball1y, this.m_ball2.x, this.m_ball2.y);
        let a2 = Math.atan2(ball1y-this.m_ball2.y, this.m_ball.x-this.m_ball2.x);
        let v2 = this.calcV(d2);
        let vx2 = v * Math.cos(a2) * v2;
        let vy2 = v * Math.sin(a2) * v2;
        this.m_ball2.x += vx2 * dt;
        this.m_ball2.y += vy2 * dt;

		let ball2y = this.m_ball2.y + dty;
        d2 = this.distance(this.m_ball2.x, ball2y, this.m_ball3.x, this.m_ball3.y);
        a2 = Math.atan2(ball2y-this.m_ball3.y, this.m_ball2.x-this.m_ball3.x);
        v2 = this.calcV(d2);
        vx2 = v * Math.cos(a2) * v2;
        vy2 = v * Math.sin(a2) * v2;
        this.m_ball3.x += vx2 * dt;
        this.m_ball3.y += vy2 * dt;

	}

    private calcV(d: number): number {
        let v = Math.log(d*0.01+1);
        return v;
    }

	private onTouchBegin(evt: egret.TouchEvent): void {
		console.log("touch begin:" + "x:" + evt.localX + ",y:" + evt.localY);
        this.m_dst_x = evt.localX;
        this.m_dst_y = evt.localY;
    
	}

	private onTouchMove(evt: egret.TouchEvent): void
	{
		this.m_dst_x = evt.localX;
        this.m_dst_y = evt.localY;
	}

	private onTouchEnd(evt: egret.TouchEvent): void
	{

	}



	private createDisplayBall(x: number, y: number, r:number): egret.DisplayObject {
		let obj = tutils.createBitmapByName("ball_png");
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