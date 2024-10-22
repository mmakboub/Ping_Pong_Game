export default class Player {
	constructor(x: number, y: number, width: number, height: number, color: string, score: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.score = score;
	}
	public x;
	public y;
	public width;
	public height;
	public color;
	public score;

	draw(context: CanvasRenderingContext2D | null | undefined) {
		if (context) {
			context.fillStyle = this.color;
			context.fillRect(this.x, this.y, this.width, this.height);
		}
		else
			console.error('No valid canvas context provided.');
	}

	moveY(newY: number) {
		this.y = newY;
	}

}