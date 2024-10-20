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
const cursor = {x: 0, y: 0};

if (pen){
    let drawing: boolean = false;
    stickerCanvas.addEventListener("mousedown", (e) => {
        drawing = true;
        cursor.x = e.offsetX;
        cursor.y = e.offsetY;
        
    });

    stickerCanvas.addEventListener("mousemove", (e) => {
        if (drawing) {
            pen.beginPath();
            pen.moveTo(cursor.x, cursor.y);
            pen.lineTo(e.offsetX, e.offsetY);
            pen.stroke();
            cursor.x = e.offsetX;
            cursor.y = e.offsetY;
            }
    });

    stickerCanvas.addEventListener("mouseup", (e) => {
        drawing = false;
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
