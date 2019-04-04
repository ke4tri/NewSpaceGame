import Bullet from './Bullet';
import Particle from './Particle';
import { rotatePoint, randomNumBetween } from './helpers';

export default class Ship {
  constructor(args) {
    this.position = args.position
    this.velocity = {
      x: 0,
      y: 0
    }
    this.rotation = 0;
    // this.rotationSpeed = 6;
    this.rotationSpeed = 3;

    // this.speed = 0.15; 
    this.speed = 0.30;
    this.inertia = 0.99;
    // radius of space ship
    this.radius = 5;
    this.lastShot = 0;
    this.create = args.create;
    this.onDie = args.onDie;
  }

  destroy(){
    this.delete = true;
    this.onDie();

    // Explode
    for (let i = 0; i < 60; i++) {
      const particle = new Particle({
        lifeSpan: randomNumBetween(60, 100),
        size: randomNumBetween(1, 4),
        position: {
          x: this.position.x + randomNumBetween(-this.radius/4, this.radius/4),
          y: this.position.y + randomNumBetween(-this.radius/4, this.radius/4)
        },
        velocity: {
          x: randomNumBetween(-1.5, 1.5),
          y: randomNumBetween(-1.5, 1.5)
        }
      });
      this.create(particle, 'particles');
    }
  }

  rotate(dir){
    if (dir == 'LEFT') {
      this.rotation -= this.rotationSpeed;
    }
    if (dir == 'RIGHT') {
      this.rotation += this.rotationSpeed;
    }
  }

  accelerate(val){
    this.velocity.x -= Math.sin(-this.rotation*Math.PI/180) * this.speed;
    this.velocity.y -= Math.cos(-this.rotation*Math.PI/180) * this.speed;

    // Thruster particles
    let posDelta = rotatePoint({x:0, y:-10}, {x:0,y:0}, (this.rotation-180) * Math.PI / 180);
    const particle = new Particle({
      lifeSpan: randomNumBetween(20, 40),
      size: randomNumBetween(1, 10),
      position: {
        x: this.position.x + posDelta.x + randomNumBetween(-2, 2),
        y: this.position.y + posDelta.y + randomNumBetween(-2, 2)
      },
      velocity: {
        x: posDelta.x / randomNumBetween(9, 10),
        y: posDelta.y / randomNumBetween(4, 10)
      }
    });
    this.create(particle, 'particles');
  }

  render(state){
    // Controls
    if(state.keys.up){
      this.accelerate(1);
    }
    if(state.keys.left){
      this.rotate('LEFT');
    }
    if(state.keys.right){
      this.rotate('RIGHT');
    }
    //change the number value below to increase rate of fire.
    //lower the number the faste the shots
    if(state.keys.space && Date.now() - this.lastShot > 50){
      const bullet = new Bullet({ship: this});
      this.create(bullet, 'bullets');
      this.lastShot = Date.now();
    }

    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;

    // Rotation
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

    // Screen edges
    if(this.position.x > state.screen.width) this.position.x = 0;
    else if(this.position.x < 0) this.position.x = state.screen.width;
    if(this.position.y > state.screen.height) this.position.y = 0;
    else if(this.position.y < 0) this.position.y = state.screen.height;

    // Drawing of the Ship?
    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation * Math.PI / 180);
    context.strokeStyle = '#ffffff';
    context.fillStyle = '#000000';
    context.lineWidth = 2;
    context.beginPath();
    // context.moveTo(0, -15);
    // context.lineTo(10, 10);
    // context.lineTo(5, 7);
    // context.lineTo(-5, 7);
    // context.lineTo(-10, 10);
   // context.moveTo(-18, -23);
    context.lineTo(-14, 23);
    context.lineTo(-13, 20);
    context.lineTo(-12, 18);
    context.lineTo(-11, 16);
    context.lineTo(-10, 16);
    context.lineTo(-9, 21);
    context.lineTo(-8, 20);
    context.lineTo(-7, 17);
    context.lineTo(-6, 17);
    context.lineTo(-5, 22);
    context.lineTo(-4, 23);
    context.lineTo(-2, 22);
    context.lineTo(4, 22);
    context.lineTo(4, 17);
    context.lineTo(6, 16);
    context.lineTo(8, 17);
    context.lineTo(9, 21);
    context.lineTo(10, 23);
    context.lineTo(14, 23);
    context.lineTo(20, 22);
    context.lineTo(20, 17);
    context.lineTo(16, 12);
    context.lineTo(11,-20);
    context.lineTo(0,-24);
    context.lineTo(-10, -20);
    context.lineTo(-16, 12);
    context.lineTo(-18,17);
    
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  }
}
