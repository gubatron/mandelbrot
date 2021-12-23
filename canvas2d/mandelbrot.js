const canvas = document.getElementById('canvas')
canvas.addEventListener('click', (e) => {
    const viewPoint = new Vector2D(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
    const modelPoint = v2m(viewPoint)

    // recenter
    CENTER_X = modelPoint.x
    CENTER_Y = modelPoint.y

    MODEL_W /= 2
    MODEL_H /= 2

    render()
})
const ctx = canvas.getContext('2d')

// view
const W = 800
const H = 600

// model
let CENTER_X = 0
let CENTER_Y = 0
let MODEL_W = 2
let MODEL_H = 2

// Vector 2D Class
class Vector2D {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class Complex {
    constructor(real, imag) {
        this.real = real
        this.imag = imag
    }

    length() {
        return Math.sqrt(this.real * this.real + this.imag * this.imag)
    }

    mul(other) {
        //first outers inners lasts
        //(a+bi)(c+di)
        return new Complex(this.real * other.real - this.imag * other.imag, this.real * other.imag + this.imag * other.real)
    }

    add(other) {
        return new Complex(this.real + other.real, this.imag + other.imag)
    }

    square() {
        return this.mul(this)
    }

}


// view -> model mapping
function v2m(p) {
    return new Vector2D(CENTER_X - MODEL_W / 2 + MODEL_W * p.x / W, CENTER_Y - MODEL_H / 2 + MODEL_H * p.y / H)
}

// (x,y) -> color
function mandelbrot(p) {
    const ITERATIONS = 100

    // javascript representation of Z in complex space
    let z = new Complex(0, 0)
    // z_{n+1} = z_n^2 + c

    const c = new Complex(p.x, p.y)
    for (let i = 0; i < ITERATIONS; ++i) {
        z = z.square().add(c)
        // outside bounds
        if (z.length() > 2) {
            //the hue is an angle
            const hue = Math.trunc(360*(ITERATIONS-i)/ITERATIONS)
            // saturation
            const sat = Math.trunc(100*(ITERATIONS-i)/ITERATIONS) + '%'
            // light
            const light = Math.trunc(100*(ITERATIONS-i)/ITERATIONS) + '%'            
            return `hsl(${hue},${sat},${light})`
        }
    }
    return '#000'
}

function drawPixel(p, color) {
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    ctx.lineTo(p.x + 1, p.y + 1)
    ctx.strokeStyle = color
    ctx.stroke()
}

function render() {
    for (let x = 0; x < W; ++x) {
        for (let y = 0; y < H; ++y) {
            const viewPoint = new Vector2D(x, y)
            const modelPoint = v2m(viewPoint)
            const color = mandelbrot(modelPoint)
            drawPixel(viewPoint, color)
        }
    }
}

render()