class TestLayer extends tutils.Layer {
	world: p2.World;
	factor: number = 1.0;
	tick: number;

	debug: egret.Shape;

	// override
	protected onCfgStage(): void {
		this.stage.frameRate = 60;
	}

	// override
	protected onInit(): void {
		let bg = tutils.createBitmapByName("grid100_png");
		this.addChild(bg);
		this.debug = new egret.Shape();
		this.addChild(this.debug);
		this.debug.graphics.lineStyle(3, 0xffffff);

		this.tick = egret.getTimer();
		this.createWorld();
		this.createGround();

		this.layer.addEventListener(egret.TimerEvent.ENTER_FRAME, this.onEnterFrame, this);
		this.layer.touchEnabled = true;
		this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
	}

	private onEnterFrame(evt: egret.TimerEvent): void {
		let dt = egret.getTimer() - this.tick;
		this.world.step(dt);

		this.debug.graphics.clear();
        for (let i=0; i<this.world.bodies.length; i++) {
            let body = this.world.bodies[i];
            for (let j=0; j<body.shapes.length; j++) {
                let shape = body.shapes[j];
				if (shape instanceof p2.Convex) {
					this.drawConvex(body, shape);
				}
			}
		}
	}

	private drawConvex(b: p2.Body, shape: p2.Convex): void {
        let g: egret.Graphics = this.debug.graphics;
        g.lineStyle(3, 0xffffff);
        g.beginFill(0x000000, 0.5);

        let worldPoint: number[] = [];
        b.toWorldFrame(worldPoint, shape.vertices[0]);
        //g.moveTo(worldPoint[0], worldPoint[1]);
		g.moveTo(this.xP2ToEgret(b.position[0]), this.yP2ToEgret(b.position[1]));
		g.lineTo(this.xP2ToEgret(worldPoint[0]), this.yP2ToEgret(worldPoint[1]));
        for (let i=1; i<=shape.vertices.length; i++) {
            b.toWorldFrame(worldPoint, shape.vertices[i % shape.vertices.length]);
			g.lineTo(this.xP2ToEgret(worldPoint[0]), this.yP2ToEgret(worldPoint[1]));
        }

        g.endFill();
    }

	private onTouchBegin(evt: egret.TouchEvent): void {
		this.createShape(evt.localX, evt.localY);
	}

	private lEgretToP2(l: number): number {
		return l / this.factor;
	}

	private lP2ToEgret(l: number): number {
		return l * this.factor;
	}

	private xEgretToP2(x: number): number {
		return x / this.factor;
	}

	private xP2ToEgret(x: number): number {
		return x * this.factor;
	}

	private yEgretToP2(y: number): number {
		return -y / this.factor;
	}

	private yP2ToEgret(y: number): number {
		return -y * this.factor;
	}

	private createWorld(): void {
        let world: p2.World = new p2.World();
        world.sleepMode = p2.World.BODY_SLEEPING;
        world.gravity = [0, 10];
        this.world = world;
    }

	private createGround(): void {
        let h: number = this.stage.stageHeight;
        let groundShape: p2.Plane = new p2.Plane();
        let groundBody: p2.Body = new p2.Body();
		groundBody.position[1] = this.yEgretToP2(h);
        groundBody.angle = Math.PI;
        groundBody.addShape(groundShape); 
        this.world.addBody(groundBody);
    }

	private createShape(x: number, y: number): void {
		let x2 = this.xEgretToP2(x);
		let y2 = this.yEgretToP2(y);
		let w2 = this.lEgretToP2(100);
		let h2 = this.lEgretToP2(50);
        let boxShape: p2.Shape = new p2.Box({ width: w2, height: h2 });
        let boxBody: p2.Body = new p2.Body({ mass: 1, position: [x2, y2], angularVelocity: 0 });
        boxBody.addShape(boxShape);
        this.world.addBody(boxBody);
	}
}