class TestLayer extends tutils.Layer {
	world: p2.World;
	factor: number = 100;
	tick: number;
	readonly groupBounds = 1 << 1;
	readonly groupBall = 1 << 2;

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

		this.layer.addEventListener(egret.TimerEvent.ENTER_FRAME, this.onEnterFrame, this);
		this.layer.touchEnabled = true;
		this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
	}

	private onEnterFrame(evt: egret.TimerEvent): void {
		let mx = this.xEgretToP2(this.stage.stageWidth/2);
		let my = this.yEgretToP2(this.stage.stageHeight/2);
		// let now = egret.getTimer();
		// let dt = now - this.tick;
		// this.tick = now;
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
			
			// 万有引力
			// body.force[0] = 0;
			// body.force[1] = 0;
			// for (let j=0; j<this.world.bodies.length; j++) {
			// 	if (j === i) {
			// 		continue;
			// 	}
			// 	let body2 = this.world.bodies[j];
			// 	let shape = body2.shapes[0];
			// 	if (!(shape instanceof p2.Circle)) {
			// 		continue;
			// 	}
			// 	let a = Math.atan2(body2.position[1]-body.position[1], body2.position[0]-body.position[0]);
			// 	let f = this.calcF(body2, body);
			// 	body.force[0] += Math.cos(a) * f;
			// 	body.force[1] += Math.sin(a) * f;
			// }
		}
	}

	private onTouchBegin(evt: egret.TouchEvent): void {
		if (Math.random() < 0.5) {
			// this.createBox(evt.localX, evt.localY);
			this.createCircle(evt.localX, evt.localY);
		} else {
			this.createCircle(evt.localX, evt.localY);
		}
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

	private createCircle(x: number, y: number): void {
		const r = 50;
		let x2 = this.xEgretToP2(x);
		let y2 = this.yEgretToP2(y);
		let r2 = this.lEgretToP2(r);
        let shape = new p2.Circle({ radius: r2 });
		let body = new p2.Body({ mass: 1, position: [x2, y2], angularVelocity: 0});
        body.addShape(shape);
        this.world.addBody(body);
		body.velocity[0] = Math.random() * 20 - 10;
		shape.collisionGroup = this.groupBall;
		shape.collisionMask = this.groupBounds;

		let obj = tutils.createBitmapByName("ball_png");
		this.addChild(obj);
		obj.width = r * 2;
		obj.height = r * 2;
		obj.anchorOffsetX = obj.width / 2;
		obj.anchorOffsetY = obj.height / 2;
		obj.x = x;
		obj.y = y;

		body.displays = [obj];
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