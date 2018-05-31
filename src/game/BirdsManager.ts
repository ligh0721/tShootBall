class BirdsManager{
    m_blue_birds: {[id: string]: BlueBird} = {};
	m_orange_birds: {[id: string]: OrangeBird} = {};

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

		for ( let id in this.m_orange_birds)
		{
			let orange_bird = this.m_orange_birds[id];
			orange_bird.fly();
		}

		this.removeOutofBounds();

		if(blue_count >= 10)
		{
			return;
		}
		else
		{
			this.generateBlue();
		}

		if(orange_count >=5)
		{
			return;
		}
		else
		{
			this.generateOrange();
		}
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

	public intersectOrange(hero:Hero):number[]
	{
		let ret = [];
		let blue_rect = new egret.Rectangle(0,0,0,0);
		let orange_rect = new egret.Rectangle(0,0,0,0);
		let hero_displays = hero.getDisplays();

		for ( let i=0; i<hero_displays.length;i++)
		{
			let blue_display = hero_displays[i];
			blue_rect.setTo(blue_display.x,blue_display.y,blue_display.width,blue_display.height);

			for(let id in this.m_orange_birds)
			{
				let orange_bird = this.m_orange_birds[id];
				let orange_display = orange_bird.getDisplay();
				orange_rect.setTo(orange_display.x,orange_display.y,orange_display.width,orange_display.height);

				if(blue_rect.intersects(orange_rect))
				{
					ret.push(i);
				}
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
	
	private  generateBlue()
	{
		let stage_width = this.m_layer.stage.stageWidth;
		let stage_height = this.m_layer.stage.stageHeight;
		let x = Math.random()* stage_width;
		let y = 20;
		let max = FlyBehavior.BLUE_BIRD_END - FlyBehavior.BLUE_BIRD_BEGIN;
		let fly_behavior = Math.floor(Math.random()* max + FlyBehavior.BLUE_BIRD_BEGIN);
		let display = this.createDisplay(x,y,"hero_png");
		let blue_bird = new BlueBird(display,fly_behavior);
		this.m_layer.addChild(display);

		let id = blue_bird.getID();
		this.m_blue_birds[id] = blue_bird;
	}


	private  generateOrange()
	{
		let stage_width = this.m_layer.stage.stageWidth;
		let stage_height = this.m_layer.stage.stageHeight;
		let x = Math.random()* stage_width;
		let y = 20;
		let max = FlyBehavior.ORANGE_BIRD_END - FlyBehavior.ORANGE_BIRD_BEGIN;
		let fly_behavior = Math.floor(Math.random()* max + FlyBehavior.ORANGE_BIRD_BEGIN);
		let display = this.createDisplay(x,y,"enemy_png");
		let orange_bird = new OrangeBird(display,fly_behavior);
		this.m_layer.addChild(display);

		let id = orange_bird.getID();
		this.m_orange_birds[id] = orange_bird;
	}
	
	

	private createDisplay(x: number, y: number,res_name:string): egret.DisplayObject {
		let obj = tutils.createBitmapByName(res_name);
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

		for ( let id in this.m_orange_birds)
		{
			let orange_bird = this.m_orange_birds[id];
			let display = orange_bird.getDisplay();
		
			if(display.x > this.m_layer.stage.stageWidth || display.x < 0 || display.y > this.m_layer.stage.stageHeight)
			{
				this.m_layer.removeChild(display);
				delete this.m_orange_birds[id];
			}
		}

	}
}