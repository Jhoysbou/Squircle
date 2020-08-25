import Pixel from "./Pixel";

export const convert = (array, width) => {

    let pixels = [[]];
    let j = 0;
    for (let i = 0; i < array.length; i += 4) {
        pixels[j].push(new Pixel(
            array[i],
            array[i + 1],
            array[i + 2],
            array[i + 3]
        ))

        if (i !== 0 && ((i / 4) + 1) % width === 0) {
            j++;
            pixels.push([]);
        }
    }

    pixels = pixels.slice(0, pixels.length-1);

    return pixels;
}

