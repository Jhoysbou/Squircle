import React, {createRef, useState} from 'react';
import './App.css';


function App(props) {
    const [size, setSize] = useState([150, 150]);
    const canvas = createRef();
    const n = 4;


    const onChange = (e) => {
        const imgFile = e.target.files[0];
        let img = new Image();
        img.src = URL.createObjectURL(imgFile);
        const ctx = canvas.current.getContext('2d');
        ctx.imageSmoothingEnabled = false;


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
        const data = imgData.data;

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
    };

    const isContain = (x, y, a, b, n) => {
        return Math.pow(Math.abs(x / a), n) + Math.pow(Math.abs(y / b), n) <= 1;
    };

    const onDownloadClick = () => {
        let link = document.createElement('a');
        link.download = 'Squircle.png';
        link.href = canvas.current.toDataURL()
        link.click();
    };


    return (
        <div className="App">
            <input type={"file"} accept="image/*" onChange={onChange}/>
            <canvas ref={canvas} height={size[0]} width={size[0]}/>
            <button onClick={onDownloadClick}>
                Download
            </button>
        </div>
    );
}

export default App;
