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
