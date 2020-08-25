import React, {createRef, useEffect, useState} from 'react';
import './App.css';


function App(props) {
    const [img, setImg] = useState();
    const [n, setN] = useState(4);
    const canvas = createRef();
    const canvas1 = createRef();
    const pica = require('pica')();

    const onFileChange = e => {
        const imgFile = e.target.files[0];
        let image = new Image();
        image.src = URL.createObjectURL(imgFile);
        setImg(image);
    };

    const onSliderChange = e => {
        setN(e.target.value);
    };

    useEffect(() => {
        const ctx = canvas.current.getContext('2d');

        if (img !== undefined) {
            if (img.complete) {
                processImage(ctx);
            } else {
                img.onload = () => processImage(ctx);
            }

        }

    });

    const processImage = (ctx) => {
        canvas.current.width = img.width;
        canvas.current.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height,     // source rectangle
            0, 0, canvas.current.width, canvas.current.height);

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

        ctx.putImageData(imgData, 0, 0);

        pica.resize(canvas.current, canvas1.current, {
            alpha: true,
            unsharpAmount: 0,
            unsharpRadius: 0.3,
            unsharpThreshold: 0
        });
    };

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
            <input type={"file"}
                   accept="image/*"
                   onChange={onFileChange}/>
            <input type={"range"}
                   min={0}
                   max={10}
                   onChange={onSliderChange}
                   step={0.1}/>
            <canvas style={{display: "none"}}
                    ref={canvas}
                    height={500}
                    width={500}/>
            <button onClick={onDownloadClick}>
                Download
            </button>
            <canvas ref={canvas1} height={150} width={150}/>
        </div>
    );
}

export default App;
