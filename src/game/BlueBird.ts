
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

