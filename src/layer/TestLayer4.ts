class TestLayer4 extends tutils.Layer {
	
	m_last_tick_time:number;//上一次进入帧函数的时间
	m_birds_manager:BirdsManager;
	m_progress:ShapeProgress;
	m_hero:Hero;

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
        this.m_last_tick_time = egret.getTimer();
		this.m_birds_manager  = new BirdsManager();
		this.m_birds_manager.init(this);
		this.m_progress = new ShapeProgress(this.layer,tutils.ProgressFillDirection.LeftToRight,100,30,0xff0000,0xffff00);
		this.m_hero = new Hero();
		this.m_hero.init(this,this.stage.stageWidth/2,this.stage.stageHeight/2,50);

		let percent = this.m_hero.getHP()/100;
		this.m_progress.percent = percent;
	}

	private onEnterFrame(evt: egret.TimerEvent): void {
		let current_time = egret.getTimer();
        let dt = current_time - this.m_last_tick_time;
        this.m_last_tick_time = current_time;
		this.m_hero.fly(dt);
		this.m_birds_manager.onEnterFrame();

		//碰撞检测：头雁和蓝色大雁、 头雁和宝物、 雁子队列和橙色敌雁

		this.handleCollision();

		this.m_progress.percent = this.m_hero.getHP()/100;
		
	}

	private handleCollision()
	{
		//此处的代码逻辑是：头雁和蓝色大雁相交时，英雄吃蓝色大雁，而birds_manager减去相应大雁
		let leader = this.m_hero.getLeaderDisplay();
		let rect = new egret.Rectangle(leader.x,leader.y,leader.width,leader.height);

		let new_birds = this.m_birds_manager.intersectBlue(rect);
		for(let i=0;i<new_birds.length;i++)
		{
			this.m_hero.eatBird(new_birds[i]);
		}
	}

	private onTouchBegin(evt: egret.TouchEvent): void {
		this.m_hero.setDestX( evt.localX);
		this.m_hero.setDestY( evt.localY);	
	}
	private onTouchMove(evt: egret.TouchEvent): void {
		this.m_hero.setDestX( evt.localX);
		this.m_hero.setDestY( evt.localY);	
	}
}