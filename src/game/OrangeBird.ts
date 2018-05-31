class OrangeBird extends Bird
{
	public constructor(display:egret.DisplayObject,fly_behavior:FlyBehavior)
	{
		super(display,fly_behavior);
	}

	public fly()
	{
		let fly_behavior = this.getFlyBehavior();
		let display = this.getDisplay();
		if(fly_behavior == FlyBehavior.O_FLY_DOWN_RANDOM_LR)
		{
			this.display.x++;
			this.display.y++;
		}
		else if(fly_behavior == FlyBehavior.O_FLY_STRAIGHT_DOWN)
		{
			this.display.y++;
		}

	
	}
}