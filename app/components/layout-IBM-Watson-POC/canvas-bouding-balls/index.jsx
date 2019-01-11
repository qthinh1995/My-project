import React, { Component } from 'react'

export default class Notification extends Component {

    state = {
        className: 'notification not-display'
    }

    componentDidMount() {
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');

        window.addEventListener('resize', () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        })

        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        Math.randomRange = function (from, to) {
            const range = to - from;
            if (range>0) {
                return this.random() * range + from;
            } else if (range === 0) {
                return from
            } else {
                return this.random() * -range + to;
            }
        }

        function Circle(x, y, dx, dy, radius, gravity, bounding, index) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.radius = radius;
            this.tall = [];
            this.tallLength = 5;
            this.color = '#009800';
            this.motionBlur = false;
            this.gravity = gravity;
            this.bounding = bounding;
            this.index = index;
            this.verticalbouding = false;

            this.draw = function (opacity = 0.3) {
                ctx.fillStyle = this.color;
                // ctx.font = '18px Arial';
                // ctx.fillText(this.index, this.x - 7, this.y);
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.globalAlpha = opacity;
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.strokeStyle = this.color;
                ctx.stroke();
            }

            // this.constructor.draw = function (x, y, radius, opacity = 1) {
            //     ctx.beginPath();
            //     ctx.arc(x, y, radius, 0, Math.PI * 2, false);
            //     ctx.globalAlpha = opacity;
            //     ctx.fillStyle = 'rgb(0, 0, 100)';
            //     // ctx.fill();
            //     ctx.strokeStyle = 'rgb(0, 0, 100)';
            //     ctx.stroke();
            // }

            this.isConllision = function (object2) {
                const x1 = this.x;
                const y1 = this.y;
                const radius1 = this.radius;

                const x2 = object2.x;
                const y2 = object2.y;
                const radius2 = object2.radius;


                return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)) <= radius1 + radius2;
            }

            this.solveConllision = function (object2) {
                const x1 = this.x;
                const y1 = this.y;
                const dx1 = this.dx;
                const dy1 = this.dy;
                const dxy1 = Math.sqrt(Math.pow(dx1, 2) + Math.pow(dy1, 2));
                const radius1 = this.radius;

                const x2 = object2.x;
                const y2 = object2.y;
                const dx2 = object2.dx;
                const dy2 = object2.dy;
                const dxy2 = Math.sqrt(Math.pow(dx2, 2) + Math.pow(dy2, 2));
                const radius2 = object2.radius;

                const dentaX = (x1 - x2) / 2;
                const dentaY = (y1 - y2) / 2;
                const dentaXY = Math.sqrt(Math.pow(dentaX, 2) + Math.pow(dentaY, 2));

                const newDentaX1 = dentaX * (radius1 / dentaXY) * (dxy1 / radius1);
                const newDentaY1 = dentaY * (radius1 / dentaXY) * (dxy1 / radius1);
                // newDentaX1 = Number.parseFloat(newDentaX1.toFixed(7))
                // newDentaY1 = Number.parseFloat(newDentaY1.toFixed(7))

                const newDentaX2 = -dentaX * (radius2 / dentaXY) * (dxy2 / radius2);
                const newDentaY2 = -dentaY * (radius2 / dentaXY) * (dxy2 / radius2);
                // newDentaX2 = Number.parseFloat(newDentaX2.toFixed(7))
                // newDentaY2 = Number.parseFloat(newDentaY2.toFixed(7))


                // newDentaX1 =  Math.floor(newDentaX1*10000)/10000
                // newDentaY1 =  Math.floor(newDentaY1*10000)/10000
                // newDentaX2 =  Math.floor(newDentaX2*10000)/10000
                // newDentaY2 =  Math.floor(newDentaY2*10000)/10000

                // const d1 = Math.sqrt(Math.pow(dentaDx, 2) + Math.pow(dentaDy, 2))
                // // const d2 = Math.sqrt(Math.pow(dx2, 2) + Math.pow(dy2, 2))

                // // const ddx1 = x1 < x2 ? -1 : 1;
                // // const ddy1 = y1 < y2 ? -1 : 1;

                object2.dx = object2.dx + newDentaX2 - newDentaX1;
                // x1 < x2 ? - Math.abs(object2.dx): Math.abs(object2.dx);
                object2.dy = object2.dy + newDentaY2 - newDentaY1;
                // y1 < y2 ? - Math.abs(object2.dy): Math.abs(object2.dy);

                // const ddx2 = x1 < x2 ? -1 : 1;
                // const ddy2 = y1 < y2 ? -1 : 1;

                this.dx = this.dx + newDentaX1 - newDentaX2;
                this.dy = this.dy + newDentaY1 - newDentaY2;
                // x2 < x1 ? Math.abs(object2.dy): - Mah.abs(object2.dy);
                // y2 < y1 ? Math.abs(object2.dy): - Math.abs(object2.dy);

                const newDXY1 = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
                const newDXY2 = Math.sqrt(Math.pow(object2.dx, 2) + Math.pow(object2.dy, 2));

                if (newDXY1 + newDXY2 > dxy1 + dxy2) {
                    const alpha = (dxy1 + dxy2) / (newDXY1 + newDXY2);
                    this.dx = this.dx * alpha;
                    this.dy = this.dy * alpha;
                    object2.dx = object2.dx * alpha;
                    object2.dy = object2.dy * alpha;
                }

                if (this.y + this.radius > canvas.height || this.y < this.radius) {
                    this.y = this.y - this.dy;
                    this.dy = 0;
                    object2.dy -= this.dy * this.bounding;
                }

                if (object2.y + object2.radius > canvas.height || object2.y < object2.radius) {
                    object2.y = object2.y - object2.dy;
                    object2.dy = 0;
                    this.dy -= object2.dy * object2.bounding;
                }
                if (this.x + this.radius > canvas.width || this.x < this.radius) {
                    this.x = this.x - this.dx;
                    this.dx = 0;
                    object2.dx -= this.dx;
                }
                if (object2.x + object2.radius > canvas.width || object2.x < object2.radius) {
                    object2.x = object2.x - object2.dx;
                    object2.dx = 0;
                    this.dx -= object2.dx;
                }


                // this.x += slowMotion ? this.dx / 4 : this.dx;
                // this.y += slowMotion ? this.dy / 4 : this.dy;
                // object2.x += slowMotion ? object2.dx / 4 : object2.dx;
                // object2.y += slowMotion ? object2.dy / 4 : object2.dy;
            }

            this.update = function (conllisionObj, indexU, slowMotion) {
                if (this.x + this.radius > canvas.width || this.x < this.radius) {
                    this.x = this.x - this.dx * (1 - this.bounding);
                    this.dx = -this.dx;
                    // if (this.verticalbouding) {
                    //     // debugger;
                    // }
                    this.verticalbouding = true;
                } else {
                    this.verticalbouding = false
                }
                if (this.y + this.radius > canvas.height || this.y < this.radius) {
                    // this.dy = -this.dy;

                    // this.y = canvas.height - this.radius;
                    // if (this.dy < 5 && this.dy > 0) {
                    //     this.dy--;
                    // }

                    this.y = this.y - this.dy * (1 - this.bounding);
                    if (this.x + this.radius > canvas.width || this.x < this.radius) {
                        this.x = this.x - this.dx * (1 - this.bounding);
                    }
                    this.dy = -this.dy * this.bounding;
                    this.dx = this.dx * this.bounding;
                } else {
                    this.dy += gravity;
                }

                ////check oderly
                // if (conllisionObj.length) {
                //     const i = index + 1;
                //     while ( i < conllisionObj.length ) {
                //         // if(index === undefined || i!== index){
                //         if (this.isConllision(conllisionObj[i])) {
                //             this.solveConllision(conllisionObj[i], slowMotion)
                //         }
                //         i++;
                //         // }
                //     }
                // }

                //check reverse
                if (conllisionObj.length) {
                    let i = indexU - 1;
                    while (i > -1) {
                        // if(index === undefined || i!== index){
                        if (this.isConllision(conllisionObj[i])) {
                            this.solveConllision(conllisionObj[i], slowMotion)
                        }
                        i--;
                        // }
                    }
                }

                if (this.motionBlur) {
                    if (Math.sqrt(this.dx * this.dx + this.dy * this.dy) > (this.radius * 1.5)) {
                        const n = Math.sqrt(this.dx * this.dx + this.dy * this.dy) / (this.radius * 1.5);
                        // n = n /1.5;
                        for (let i = 2; i < (n + 1); i++) {
                            const percent = (1 - 1 / n) / n * i / 2;
                            // this.tall.push(new Circle(this.x + this.dx*percent, this.y + this.dy*percent, 0, 0, this.radius));
                            // this.tallLength = n;
                            Circle.draw(this.x + this.dx * percent, this.y + this.dy * percent, this.radius, percent);
                        }
                    }
                }
                this.x += slowMotion ? this.dx / 4 : this.dx;
                this.y += slowMotion ? this.dy / 4 : this.dy;

                // if(Math.sqrt(this.dx * this.dx + this.dy *this.dy) > (this.radius/2) ){
                //     const n = Math.sqrt(this.dx * this.dx + this.dy *this.dy) > (this.radius/2);
                //     for(const i = 0 ; i < n; i ++){
                //         this.tall.push(new Circle(this.x, this.y, 0, 0, this.radius))
                //     }
                // }

                this.draw();
                if (this.tall.length > this.tallLength) {
                    const n = this.tall.length - this.tallLength;
                    for (let i = 0; i < n; i++) {
                        this.tall.shift();
                    }
                }
                for (let i = 0; i < this.tall.length; i++) {
                    this.tall[i].draw(1 / (this.tall.length + 1) * (i + 1))
                }
                // this.tall.push(new Circle(this.x, this.y, 0, 0, this.radius))

                // const circleArray = [];
                // for (const i = 0; i < 20; i++) {
                //     circleArray.push(new Circle(this.x - this.dx / 2 * i, this.y - this.dy / 2*i, this.dx, this.dy, this.radius-i));
                // }
                // for (const i = 0; i < circleArray.length; i++) {
                //     circleArray[i].draw();
                // }
            }
        }

        function Game() {
            this.gravity = 0.2;
            this.bounding = 0.3;
            this.animateFrame = null;
            // this.circleArray = [ new Circle(100, 100, 0, 0, 50, 0, this.bounding)];
            this.circleArray = [];
            this.slowMotion = false;
            this.maxBall = 140;

            this.initGame = function (ballAmount = 1) {
                for (let i = 0; i < ballAmount; i++) {
                    const radius = 11 * (window.innerWidth /1440);
                    
                    //for text
                    // const x = Math.randomRange(radius, canvas.width - radius);
                    // const y = Math.randomRange(300, 301);
                    // const dx = this.circleArray.length> 0 ? 0 : 4;
                    // const dy = 0;

                    //for real
                    let x = Math.randomRange(radius, canvas.width - radius);
                    let y = Math.randomRange(radius, canvas.height - radius)
                    const dx = Math.randomRange(-4, 4);
                    const dy = Math.randomRange(-4, 4);

                    let newCircle = new Circle(x, y, dx, dy, radius, this.gravity, this.bounding, this.circleArray.length);

                    const maxTime = 100;
                    let time = 0;
                    for (let j = 0; j < this.circleArray.length; j++) {
                        if (time >= maxTime) {
                            break;
                        }
                        if (newCircle.isConllision(this.circleArray[j])) {
                            x = Math.randomRange(radius, canvas.width - radius);
                            y = Math.randomRange(radius, canvas.height - radius);
                            newCircle = new Circle(x, y, dx, dy, radius, this.gravity, this.bounding, this.circleArray.length);
                            j = -1;
                            time++;
                        }
                    }
                    if (time < maxTime) {
                        this.circleArray.push(newCircle);
                    }
                    if (this.circleArray.length > this.maxBall) {
                        this.circleArray.shift();
                    }
                }
            }

            this.animate = function () {
                if (!this.animateFrame) {
                    // this.initGame();
                    this.animateFrame = window.requestAnimationFrame(this.animate.bind(this));
                } else {
                    window.requestAnimationFrame(this.animate.bind(this));
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // ctx.fillStyle = "black";
                // ctx.fillRect(0, 0, canvas.width, canvas.height);

                // //check oderly
                // if( this.circleArray ){
                //     i = this.circleArray.length-1;
                // }
                // for (const i = 0; i < this.circleArray.length; i++) {
                //     this.circleArray[i].update(this.circleArray, i, this.slowMotion);
                // }

                //check reverse
                let i = -1;
                if (this.circleArray) {
                    i = this.circleArray.length - 1;
                }
                for (i; i !== -1; i--) {
                    this.circleArray[i].update(this.circleArray, i, this.slowMotion);
                    // this.circleArray[i].checkConllision(this.circleArray, i, this.slowMotion);
                }
            }

            this.getStartTime = function (e) {
                if (e.which === 32) {
                    document.removeEventListener('keydown', this.getStartTime.bind(this))
                    if (this.animateFrame) {
                        this.initGame();
                    } else {
                        this.initGame();
                        this.animate()
                    }
                }
            }

            document.addEventListener('keydown', this.getStartTime.bind(this))
        }

        const game = new Game();
        setInterval(() => {
            if (game.animateFrame) {
                game.initGame()
            } else {
                game.initGame()
                game.animate()
            }
        }, 100)
    }

    render() {
        //   const { message, className } = this.state
        return (
            <canvas className="canvas-waiting"></canvas>
        )
    }
}
