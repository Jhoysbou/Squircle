import React, {createRef, useState} from 'react';
import './App.css';
import {convert} from "./util/convert";


function App(props) {
    const [size, setSize] = useState([150, 150]);
    const canvas = createRef();
    const canvas1 = createRef();
    const n = 4;
    const pica = require('pica')();

    const onChange = (e) => {
        const imgFile = e.target.files[0];
        let img = new Image();
        img.src = URL.createObjectURL(imgFile);
        const ctx = canvas.current.getContext('2d');
        ctx.imageSmoothingEnabled = true;


        img.onload = () => {
            canvas.current.width = img.width;
            canvas.current.height = img.height;

            ctx.drawImage(img, 0, 0, img.width, img.height,     // source rectangle
                0, 0, canvas.current.width, canvas.current.height);
            processImage(ctx);
        }
    };

    const processImage = (ctx) => {
        let imgData = ctx.getImageData(0, 0, canvas.current.width, canvas.current.height);
        let data = imgData.data;

        const a = canvas.current.width / 2;
        const b = canvas.current.height / 2;

        const center = {
            x: a,
            y: b
        };

        let j = 0;
        for (let i = 0; i < data.length; i += 4) {
            let x = i / 4 - center.x - j * canvas.current.width;
            let y = center.y - j;

            if (!isContain(x, y, a, b, n)) {
                imgData.data[i + 3] = 0;
            }

            if (i !== 0 && i / 4 % canvas.current.width === 0) {
                j++;
            }
        }

        // data = antialiasing(imgData.data, canvas.current.width);
        // const AAImgData = new ImageData(data, canvas.current.width, canvas.current.height);

        ctx.putImageData(imgData, 0, 0);
        pica.resize(canvas.current, canvas1.current, {
            alpha: true,
            unsharpAmount: 80,
            unsharpRadius: 0.6,
            unsharpThreshold: 2
        })
            .then(result => console.log('resize done!'));
    };

    const antialiasing = (pixels, width) => {
        let img = convert(pixels, width);
        const result = [];
        for (let i = 0; i < width; i++) {

            let length = img[i].length;
            for (let j = 0; j < length; j++) {

                let red = 0;
                let green = 0;
                let blue = 0;
                let alpha = 0;

                let counter = 0;

                for (let k = -1; k < 2; k++) {
                    for (let l = -1; l < 2; l++) {
                        try {
                            red += img[i + k][j + l].getR();
                            green += img[i + k][j + l].getG();
                            blue += img[i + k][j + l].getB();
                            alpha += img[i + k][j + l].getA();
                            counter++;
                        } catch (e) {
                        }
                    }
                }

                result.push(red / counter);
                result.push(green / counter);
                result.push(blue / counter);
                result.push(alpha / counter);
            }
        }

        return Uint8ClampedArray.from(result);
    }


    const isContain = (x, y, a, b, n) => {
        return Math.pow(Math.abs(x / a), n) + Math.pow(Math.abs(y / b), n) <= 1;
    };

    const onDownloadClick = () => {
        let link = document.createElement('a');
        link.download = 'Squircle.png';
        link.href = canvas1.current.toDataURL()
        link.click();
    };


    return (
        <div className="App">
            <input type={"file"} accept="image/*" onChange={onChange}/>
            <canvas ref={canvas} height={size[0]} width={size[0]}/>
            <button onClick={onDownloadClick}>
                Download
            </button>
            <canvas ref={canvas1} height={150} width={150} />
        </div>
    );
}

export default App;
