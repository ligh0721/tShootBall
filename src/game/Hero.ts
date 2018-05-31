
class Hero { 
	private m_displays:egret.DisplayObject[] = [];

	private m_layer:tutils.Layer;
	private m_dst_x:number;
	private m_dst_y:number;

	private m_hp:number;

	public init(layer:tutils.Layer,x:number,y:number,hp:number)
	{
		this.m_layer = layer;
		this.m_dst_x = x;
		this.m_dst_y = y;
		this.m_hp = hp;

		let r = 25;
		let obj = tutils.createBitmapByName("hero_png");
		obj.height = r * 2 * obj.height / obj.width;
		obj.width = r * 2;
		obj.anchorOffsetX = obj.width / 2;
		obj.anchorOffsetY = obj.height / 2;
		obj.x = x;
		obj.y = y;

		this.m_displays.push(obj);
		this.m_layer.addChild(obj);
	}

	public getHP():number
	{
		return this.m_hp;
	}

	public eatBird(new_bird:BlueBird)
	{
		let display = new_bird.getDisplay();
		this.m_displays.push(display);
		this.m_layer.addChild(display);

		this.m_hp += 10;
	}

	public onBeingAttacked(index:number)
	{
		console.log("the " + index +"th bird was attacked");
		this.m_hp -= 1;
	}

	public getLeaderDisplay():egret.DisplayObject
	{
		return this.m_displays[0];
	}

	public getDisplays():egret.DisplayObject[]
	{
		return this.m_displays;
	}

	public setDestX(x:number)
	{
		this.m_dst_x = x;
	}

	public setDestY(y:number)
	{
		this.m_dst_y = y;
	}


	public fly(dt:number)
	{
		let dty = 15;

		for (let i=0; i<this.m_displays.length; i++) {
			let dstX = i===0 ? this.m_dst_x : this.m_displays[i-1].x;
			let dstY = i===0 ? this.m_dst_y : this.m_displays[i-1].y+dty;
			let ball = this.m_displays[i];
			
			let d = this.distance(ball.x, ball.y, dstX, dstY);
			let a = Math.atan2(dstY-ball.y, dstX-ball.x);
			let v = this.calcV(d);
			let vx = v * Math.cos(a) * v;
			let vy = v * Math.sin(a) * v;
			ball.x += vx * dt;
			ball.y += vy * dt;
		}
	}

	private calcV(d: number): number {
        let v = Math.log(d*0.02+1);
        return v;
    }

	private distance(x1:number,y1:number,x2:number,y2:number):number
	{
		let a = (x1-x2) * (x1-x2);
		let b = (y1-y2) * (y1-y2);

		return Math.sqrt(a+b);
	}
}