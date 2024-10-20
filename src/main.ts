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
const ctx = stickerCanvas.getContext("2d");
const cursor = {x: 0, y: 0};

if (ctx){
    let drawing: boolean = false;
    stickerCanvas.addEventListener("mousedown", (e) => {
        drawing = true;
        console.log("mousedown", e);
        cursor.x = e.offsetX;
        cursor.y = e.offsetY;
        
    });

    stickerCanvas.addEventListener("mousemove", (e) => {
        if (drawing) {
            console.log("mousemove", e);
            ctx.beginPath();
            ctx.moveTo(cursor.x, cursor.y);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            cursor.x = e.offsetX;
            cursor.y = e.offsetY;
            }
    });

    stickerCanvas.addEventListener("mouseup", (e) => {
        drawing = false;
        console.log("mouseup", e);
    });
}
else {
    console.error("Could not get 2D context from canvas");
}
