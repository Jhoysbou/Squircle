import React, {createRef, useEffect, useState} from 'react';
import Service from "./service/Service";
import s from './style/app.module.css';
import CardFragment from "./fragments/CardFragment";

function App(props) {
    const [imgName, setImgName] = useState("example.png")
    const [img, setImg] = useState();
    const [n, setN] = useState(4);
    const canvas = createRef();
    const extraCanvas = createRef();
    const service = new Service(canvas, extraCanvas)

    const onFileChange = e => {
        const imgFile = e.target.files[0];
        setImgName(imgFile.name);
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
        <div className={s.app}>
            <section className={s.preview}>
                <div>This is your <span>squircle</span>!</div>
                <canvas ref={extraCanvas} height={1000} width={1000}/>
            </section>
            <section className={s.controls}>
                <CardFragment>
                    <div className={s.aligned_text}>
                        <div className={s.card_title}>Choose a pic</div>
                        <div className={s.card_text}>It is better to choose a bigger picture to save quality</div>
                    </div>
                    <label className={s.file_input_label}>
                        <input className={s.file_input} type={"file"}
                               accept="image/*"
                               onChange={onFileChange}/>

                        <div>Upload photo</div>
                    </label>
                    <div className={`${s.file_name} ${s.aligned_text}`}>{imgName}</div>
                </CardFragment>
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
            </section>
            <div>{n}</div>
        </div>
    );
}

export default App;
