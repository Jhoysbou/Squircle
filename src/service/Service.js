class Service {
    constructor(canvas, extraCanvas) {
        this.canvas = canvas;
        this.extraCanvas = extraCanvas;
        this.pica = require('pica')();
    }

    processImage = (ctx, img, n) => {
        this.canvas.current.width = img.width;
        this.canvas.current.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height,     // source rectangle
            0, 0, this.canvas.current.width, this.canvas.current.height);

        let imgData = ctx.getImageData(0, 0, this.canvas.current.width, this.canvas.current.height);
        let data = imgData.data;

        const a = this.canvas.current.width / 2;
        const b = this.canvas.current.height / 2;

        const center = {
            x: a,
            y: b
        };

        let j = 0;
        for (let i = 0; i < data.length; i += 4) {
            let x = i / 4 - center.x - j * this.canvas.current.width;
            let y = center.y - j;

            if (!this.isContain(x, y, a, b, n)) {
                imgData.data[i + 3] = 0;
            }

            if (i !== 0 && i / 4 % this.canvas.current.width === 0) {
                j++;
            }
        }

        ctx.putImageData(imgData, 0, 0);

        this.pica.resize(this.canvas.current, this.extraCanvas.current, {
            alpha: true,
            unsharpAmount: 0,
            unsharpRadius: 0.3,
            unsharpThreshold: 0
        });
    };


    isContain = (x, y, a, b, n) => {
        return Math.pow(Math.abs(x / a), n) + Math.pow(Math.abs(y / b), n) <= 1;
    };
}

export default Service;