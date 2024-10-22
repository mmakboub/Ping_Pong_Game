export class Ball {
	constructor(x: number, y: number, radius: number, color: string){
		this.x = x;
		this.y = y;
		this.radius = radius;
		// this.speed = speed;
		// this.velocityX = velocityX;
		// this.velocityY = velocityY;
		this.color = color;
	}
	
	public x;
	public y;
	public radius;
	// public speed;
	// public velocityX;
	// public velocityY;
	public color;

	draw(context: CanvasRenderingContext2D | null | undefined) {
		if (context) {
			context.fillStyle = this.color;
			context.beginPath();
			context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			context.closePath();
			context.fill();
		}
	}
}