class BirdsManager{
    m_blue_birds: {[id: string]: BlueBird} = {};
	m_orange_birds: {[id: string]: Bird} = {};

	m_layer:tutils.Layer;

	public init(layer:tutils.Layer)
	{
		this.m_layer = layer;
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

	public intersectBlue(rect:egret.Rectangle): BlueBird[]
	{
		let ret = [];
		let blue_rect = new egret.Rectangle(0,0,0,0);

		for ( let id in this.m_blue_birds)
		{
			let blue_bird = this.m_blue_birds[id];
			let display = blue_bird.getDisplay();
			blue_rect.setTo(display.x,display.y,display.width,display.height);

			if(rect.intersects(blue_rect))
			{
				ret.push(blue_bird);
				delete this.m_blue_birds[id];
			}
		}
		return ret;
	}

	public getBlueCount():number
	{
		return Object.keys(this.m_blue_birds).length;
	}
	
	public getOrangeCount():number
	{
		return Object.keys(this.m_orange_birds).length;
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




		
}