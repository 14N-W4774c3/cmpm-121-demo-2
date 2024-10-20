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

let drawing: boolean = false;
stickerCanvas.addEventListener("mousedown", (e) => {
    drawing = true;
    console.log("mousedown", e);
    });

stickerCanvas.addEventListener("mousemove", (e) => {
    if (drawing) {
        console.log("mousemove", e);
        }
    });

stickerCanvas.addEventListener("mouseup", (e) => {
    drawing = false;
    console.log("mouseup", e);
    });

