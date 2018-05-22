class TestLayer2 extends tutils.Layer {
	world: p2.World;
	factor: number = 100;
	tick: number;
	readonly groupBounds = 1 << 1;
	readonly groupBall = 1 << 2;
	obj: egret.DisplayObject;

	lastx: number;
	lasty: number;
	last_tick: number;
	speed_x :number;
	speed_y :number;
	current_id :number;


    egret_balls:Object = {}; //DisplayObject
 	p2_balls: Object = {};   //p2.Body

	egret_bullets:Object = {};//DisplayObject
    p2_bullets: {[id: string]: p2.Body} = {};   //p2.Body

	// override
	protected onCfgStage(): void {
		this.stage.frameRate = 60;
	}

	// override
	protected onInit(): void {
		let bg = tutils.createBitmapByName("grid100_png");
		this.addChild(bg);

		this.tick = egret.getTimer();
		this.createWorld();
		this.createBounds();


		this.world.on("beginContact", this.onBeginContact, this);

		this.layer.addEventListener(egret.TimerEvent.ENTER_FRAME, this.onEnterFrame, this);
		this.layer.touchEnabled = true;
		this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this.layer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		this.layer.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);

		this.current_id = 0;
		this.initBalls();
	}

	private createBullet(x:number,y:number)
	{
		let r = 10;
		let mass = 0;
		let speed_x = 0;
		let speed_y = 0;
		let collisionGroup = this.groupBounds;
		let collisionMask = this.groupBounds|this.groupBall;
			
		let egret_ball = this.createDisplayBall(x,y,r);
		let p2_ball = this.createP2Ball(x,y,r,speed_x,speed_y,egret_ball, mass,collisionGroup,collisionMask);
		p2_ball.velocity[1] = 5;
		this.egret_bullets[p2_ball.id] = egret_ball;
		this.p2_bullets[p2_ball.id] = p2_ball;
		this.addChild(egret_ball);
		this.world.addBody(p2_ball);
		console.log("bullet created, id:" + p2_ball.id);

	}

	private initBalls()
	{
		let i=1;
		let collisionGroup = this.groupBall;
		let collisionMask = this.groupBounds;
		let mass = 1;
		let r = 40;
		let speed_x = 0;
		let speed_y = 0;
		for( i=1;i<=5;i++)
		{
			let x = 100*i;
			let y = 100+i*20;
			this.createBall(x,y,r,speed_x,speed_y,mass);
		}
	}

	private createBall(x:number,y:number,r:number,speed_x:number,speed_y:number,mass:number)
	{
		let i=1;
		let collisionGroup = this.groupBall;
		let collisionMask = this.groupBounds;

		let egret_ball = this.createDisplayBall(x,y,r);
		let p2_ball = this.createP2Ball(x,y,r,speed_x,speed_y,egret_ball, mass,collisionGroup,collisionMask);
		this.egret_balls[p2_ball.id] = egret_ball;
		this.p2_balls[p2_ball.id] = p2_ball;
		this.addChild(egret_ball);
		this.world.addBody(p2_ball);
		console.log("ball created, id:" + p2_ball.id);
		
	}


	private onEnterFrame(evt: egret.TimerEvent): void {
		let mx = this.xEgretToP2(this.stage.stageWidth/2);
		let my = this.yEgretToP2(this.stage.stageHeight/2);

		this.world.step(1/this.stage.frameRate);
		
        for (let i=0; i<this.world.bodies.length; i++) {
            let body = this.world.bodies[i];
            let shape = body.shapes[0];
			
			
			if (shape instanceof p2.Box || shape instanceof p2.Circle) {
				let obj = body.displays[0];
				obj.x = this.xP2ToEgret(body.position[0]);
				obj.y = this.yP2ToEgret(body.position[1]);
				obj.rotation = -(body.angle + shape.angle) * tutils.DegPerRad;
				obj.alpha = body.sleepState===p2.Body.SLEEPING ? 0.5 : 1;
			} else {
				continue;
			}
		}
	}
	
	//球和子弹碰
	private onBallBulletHit(ball:p2.Body,shape_r:number)
	{
		let x = this.xP2ToEgret(ball.position[0]);
		let y = this.yP2ToEgret(ball.position[1]);
		let r = this.lP2ToEgret(shape_r);
		console.log("r is " +r);

		//移除显示和物理引擎中的ball
		this.layer.removeChild(this.egret_balls[ball.id]);
		this.world.removeBody(ball);

		//分裂两个
		let speed_x = 1;
		let speed_y = 0;
		let mass = 1;
		this.createBall(x,y,r/2,speed_x,speed_y,mass);
	}

        // beginContactEvent: {
        //     type: string;
        //     shapeA: Shape;
        //     shapeB: Shape;
        //     bodyA: Body;
        //     bodyB: Body;
        //     contactEquations: ContactEquation[];
        // };
	private onBeginContact(event):void{
		//console.log("onBeginContact, event.bodyA.id: " + event.bodyA.id);
		//console.log("onBeginContact, event.bodyB.id: " + event.bodyB.id);
		//找到对应的display对象， 从屏幕中去除

		//两种情况：
		//1. 球和地碰
		//2. 球和子弹碰
		let bodyA = event.bodyA;
		let bodyB = event.bodyB;
		
		let shapeA = event.shapeA;
		let shapeB = event.shapeB;

		let idA = String(bodyA.id);
		let idB = String(bodyB.id);

		
		let isAGround = shapeA.collisionGroup == this.groupBounds && shapeA.collisionMask ==  this.groupBall; //A是否是地面
		let isBGround = shapeB.collisionGroup == this.groupBounds && shapeB.collisionMask ==  this.groupBall; //B是否是地面

		if(isAGround || isBGround)
		{
			//1. 球和地碰
		}
		else
		{
			//2. 球和子弹碰
			let hasA = this.p2_balls.hasOwnProperty((idA));
			
			if(hasA)
			{
				//A是球,B是子弹
				let ball = this.p2_balls[idA];
				let shape_r = event.shapeA.radius;
				this.onBallBulletHit(ball,shape_r);
			}
			else
			{
				//A是子弹，B是球
				let ball = this.p2_balls[idB];
				let shape_r = event.shapeB.radius;
				this.onBallBulletHit(ball,shape_r);

			}
		}
	}

	private onTouchBegin(evt: egret.TouchEvent): void {
		console.log("touch begin:" + "x:" + evt.localX + ",y:" + evt.localY);
		this.createBullet(evt.localX,this.stage.stageHeight);

	}

	private onTouchMove(evt: egret.TouchEvent): void
	{
		console.log("touch move:" + "x:" + evt.localX + ",y:" + evt.localY);
	}

	private onTouchEnd(evt: egret.TouchEvent): void
	{

	}
	
	
	private lEgretToP2(l: number): number {
		return l/this.factor;
	}

	private lP2ToEgret(l: number): number {
		return l*this.factor;
	}

	private xEgretToP2(x: number): number {
		return x/this.factor;
	}

	private xP2ToEgret(x: number): number {
		return x*this.factor;
	}

	private yEgretToP2(y: number): number {
		return -y/this.factor;
	}

	private yP2ToEgret(y: number): number {
		return -y*this.factor;
	}

	private createWorld(): void {
        let world: p2.World = new p2.World();
        world.sleepMode = p2.World.BODY_SLEEPING;
		world.gravity = [0, -9.8];
		world.defaultContactMaterial.restitution = 1.0;
		world.defaultContactMaterial.friction = 0;
		world.applyDamping = false;
        this.world = world;
    }

	private createBounds(): void {
        let h: number = this.stage.stageHeight;
		let w: number = this.stage.stageWidth;
        let body = new p2.Body();
		this.world.addBody(body);
		body.displays = [];
		body.position[0] = this.xEgretToP2(0);
		body.position[1] = this.yEgretToP2(h);

		// bottom
		let shape = new p2.Plane();
        body.addShape(shape, [0, 0], 0);
		shape.collisionGroup = this.groupBounds;
		shape.collisionMask = this.groupBall;
		let obj = new egret.Shape();
		this.addChild(obj);
		obj.graphics.lineStyle(3, 0x00ff00);
		obj.graphics.moveTo(0, h);
		obj.graphics.lineTo(w, h);
		body.displays.push(obj);

		// left
		shape = new p2.Plane();
        body.addShape(shape, [0, 0], -90/tutils.DegPerRad); 
		shape.collisionGroup = this.groupBounds;
		shape.collisionMask = this.groupBall;
		obj = new egret.Shape();
		this.addChild(obj);
		obj.graphics.lineStyle(3, 0x00ff00);
		obj.graphics.moveTo(0, 0);
		obj.graphics.lineTo(0, h);
		body.displays.push(obj);

		// right
		shape = new p2.Plane();
        body.addShape(shape, [this.xEgretToP2(w), 0], 90/tutils.DegPerRad); 
		shape.collisionGroup = this.groupBounds;
		shape.collisionMask = this.groupBall;
		obj = new egret.Shape();
		this.addChild(obj);
		obj.graphics.lineStyle(3, 0x00ff00);
		obj.graphics.moveTo(w, 0);
		obj.graphics.lineTo(w, h);
		body.displays.push(obj);

		// top
		shape = new p2.Plane();
        body.addShape(shape, [0, this.yEgretToP2(-h)], 180/tutils.DegPerRad); 
		shape.collisionGroup = this.groupBounds;
		shape.collisionMask = this.groupBall;
		obj = new egret.Shape();
		this.addChild(obj);
		obj.graphics.lineStyle(3, 0x00ff00);
		obj.graphics.moveTo(0, 0);
		obj.graphics.lineTo(w, 0);
		body.displays.push(obj);
    }

	private createBox(x: number, y: number): void {
		const w = 100;
		const h = 50;
		let x2 = this.xEgretToP2(x);
		let y2 = this.yEgretToP2(y);
		let w2 = this.lEgretToP2(w);
		let h2 = this.lEgretToP2(h);
        let shape = new p2.Box({ width: w2, height: h2 });
        let body = new p2.Body({ mass: 1, position: [x2, y2], angularVelocity: 0});
        body.addShape(shape);
        this.world.addBody(body);

		let obj = tutils.createBitmapByName("box_png");
		this.addChild(obj);
		obj.width = w;
		obj.height = h;
		obj.anchorOffsetX = w / 2;
		obj.anchorOffsetY = h / 2;
		obj.x = x;
		obj.y = y;

		body.displays = [obj];
	}
	private createP2Ball(x:number,y:number,r:number,speed_x:number,speed_y:number,egret_ball:egret.DisplayObject,mass:number,collisionGroup:number,collisionMask:number): p2.Body
	{
		let x2 = this.xEgretToP2(x);
		let y2 = this.yEgretToP2(y);
		let r2 = this.lEgretToP2(r);
        let shape = new p2.Circle({ radius: r2 });
		let body = new p2.Body({ mass: mass, position: [x2, y2], angularVelocity: 0});
        body.addShape(shape);
		body.velocity[0] = this.xEgretToP2(speed_x)*1000;
		body.velocity[1] = this.yEgretToP2(speed_y)*1000;
		
	
		shape.collisionGroup = collisionGroup;
		shape.collisionMask = collisionMask;
		body.displays = [egret_ball];
		return body;
	}
	private createDisplayBall(x: number, y: number,r:number): egret.DisplayObject {
		let obj = tutils.createBitmapByName("ball_png");
		obj.width = r * 2;
		obj.height = r * 2;
		obj.anchorOffsetX = obj.width / 2;
		obj.anchorOffsetY = obj.height / 2;
		obj.x = x;
		obj.y = y;
		return obj;

	}

	private calcF(body1: p2.Body, body2: p2.Body): number {
		const G = 6.67408e-11;
		let dtx = body2.position[0] - body1.position[0];
		let dty = body2.position[1] - body1.position[1];
		let dis = Math.sqrt(dtx*dtx+dty*dty);
		let f = G * body1.mass * body2.mass / dis / dis;
		return f;
	}
}