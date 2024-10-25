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
let lineWidth = 3;

type line = {
    xCoords: number[], 
    yCoords: number[], 
    lineWidth: number,
    display: (ctx: CanvasRenderingContext2D) => void
};
function createLine(xCoord: number, yCoord: number, width: number = 3): line{
    return {
        xCoords: [xCoord],
        yCoords: [yCoord],
        lineWidth: width,
        display(ctx: CanvasRenderingContext2D){
            ctx.beginPath();
            ctx.moveTo(this.xCoords[0], this.yCoords[0]);
            for (let i = 1; i < this.xCoords.length; i++) {
                ctx.lineTo(this.xCoords[i], this.yCoords[i]);
            }
            if (this.lineWidth){
                ctx.lineWidth = this.lineWidth;
            }
            ctx.stroke();
        }
    };
}
const displayedLines: line[] = [];
const redoStack: line[] = [];

function errorMessage(){
    console.error("Could not get 2D context from canvas");
}

if (pen){
    let drawing: boolean = false;
    stickerCanvas.addEventListener("mousedown", (lineStart) => {
        drawing = true;
        displayedLines.push(createLine(lineStart.offsetX, lineStart.offsetY, lineWidth));
    });

    stickerCanvas.addEventListener("mousemove", (nextPoint) => {
        if (drawing) {
            displayedLines[displayedLines.length - 1].xCoords.push(nextPoint.offsetX);
            displayedLines[displayedLines.length - 1].yCoords.push(nextPoint.offsetY);           
            stickerCanvas.dispatchEvent(new Event("drawing-changed"));
            }
    });

    stickerCanvas.addEventListener("mouseup", () => {
        drawing = false;
    });
    
    stickerCanvas.addEventListener("drawing-changed", () => {
        pen.clearRect(0, 0, stickerCanvas.width, stickerCanvas.height);
        displayedLines.forEach(line => line.display(pen));
    });
}
else {errorMessage();}

const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
document.body.appendChild(clearButton);
clearButton.addEventListener("click", () => {
    if (pen) {
        pen.clearRect(0, 0, stickerCanvas.width, stickerCanvas.height);
    }
    else {errorMessage();}
});

const undoButton = document.createElement("button");
undoButton.textContent = "Undo";
document.body.appendChild(undoButton);
undoButton.addEventListener("click", () => {
    if (pen && displayedLines.length > 0) {
        redoStack.push(displayedLines.pop()!);
        stickerCanvas.dispatchEvent(new Event("drawing-changed"));
    }
    else {errorMessage();}
});

const redoButton = document.createElement("button");
redoButton.textContent = "Redo";
document.body.appendChild(redoButton);
redoButton.addEventListener("click", () => {
    if (pen && redoStack.length > 0) {
        displayedLines.push(redoStack.pop()!);
        stickerCanvas.dispatchEvent(new Event("drawing-changed"));
    }
    else {errorMessage();}
});

const thinPenButton = document.createElement("button");
thinPenButton.textContent = "Thin Pen";
document.body.appendChild(thinPenButton);
thinPenButton.addEventListener("click", () => {lineWidth = 3;});

const thickPenButton = document.createElement("button");
thickPenButton.textContent = "Thick Pen";
document.body.appendChild(thickPenButton);
thickPenButton.addEventListener("click", () => {lineWidth = 6;});