import React, {createRef, useEffect, useState} from 'react';
import Service from "./service/Service";


function App(props) {
    const [img, setImg] = useState();
    const [n, setN] = useState(4);
    const canvas = createRef();
    const extraCanvas = createRef();
    const service = new Service(canvas, extraCanvas)

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
                service.processImage(ctx, img, n);
            } else {
                img.onload = () => service.processImage(ctx, img, n);
            }
        }
    });

    const onDownloadClick = () => {
        let link = document.createElement('a');
        link.download = 'Squircle.png';
        link.href = extraCanvas.current.toDataURL()
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
                   defaultValue={4}
                   onChange={onSliderChange}
                   step={0.1}/>
            <canvas style={{display: "none"}}
                    ref={canvas}
                    height={500}
                    width={500}/>
            <button onClick={onDownloadClick}>
                Download
            </button>
            <div>{n}</div>
            <canvas ref={extraCanvas} height={1000} width={1000}/>
        </div>
    );
}

export default App;
