import "./style.css";

const APP_NAME = "DenoPaint";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;
app.innerHTML = APP_NAME;

const appTitle = document.createElement("h1");
appTitle.textContent = APP_NAME;
document.body.appendChild(appTitle);
const stickerCanvas = document.createElement("canvas");
stickerCanvas.width = 256;
stickerCanvas.height = 256;
document.body.appendChild(stickerCanvas);
const pen = stickerCanvas.getContext("2d");

if (pen){
    let drawing: boolean = false;
    const xCoords: number[] = [];
    const yCoords: number[] = [];
    
    stickerCanvas.addEventListener("mousedown", (e) => {
        drawing = true;
        /*
        cursor.x = e.offsetX;
        cursor.y = e.offsetY;
        */
        xCoords.push(e.offsetX);
        yCoords.push(e.offsetY);
    });

    stickerCanvas.addEventListener("mousemove", (e) => {
        if (drawing) {
            /*
            pen.beginPath();
            pen.moveTo(cursor.x, cursor.y);
            pen.lineTo(e.offsetX, e.offsetY);
            pen.stroke();
            cursor.x = e.offsetX;
            cursor.y = e.offsetY;
            */
            xCoords.push(e.offsetX);
            yCoords.push(e.offsetY);
            stickerCanvas.dispatchEvent(new Event("drawing-changed"));
            }
    });

    stickerCanvas.addEventListener("mouseup", (e) => {
        drawing = false;
    });
    
    stickerCanvas.addEventListener("drawing-changed", (e) => {
        pen.clearRect(0, 0, stickerCanvas.width, stickerCanvas.height);
        pen.beginPath();
        pen.moveTo(xCoords[0], yCoords[0]);
        for (let i = 1; i < xCoords.length; i++) {
            pen.lineTo(xCoords[i], yCoords[i]);
        }
        pen.stroke();
    });
}
else {
    console.error("Could not get 2D context from canvas");
}

const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
document.body.appendChild(clearButton);
clearButton.addEventListener("click", () => {
    if (pen) {
        pen.clearRect(0, 0, stickerCanvas.width, stickerCanvas.height);
    }
    else {
        console.error("Could not get 2D context from canvas");
    }
});
