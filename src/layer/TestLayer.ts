class TestLayer extends tutils.Layer {
	world: p2.World;

	protected onInit(): void {
		let bg = tutils.createBitmapByName("grid100_png");
		this.addChild(bg);
		this.createWorld();
	}

	private createWorld(): p2.World {
        let world: p2.World = new p2.World();
        world.sleepMode = p2.World.BODY_SLEEPING;
        world.gravity = [0, 10];
        this.world = world;
		return world;
    }
}