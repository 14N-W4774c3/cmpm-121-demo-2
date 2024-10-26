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
    type: string,
    display: (ctx: CanvasRenderingContext2D) => void
};
function createLine(xCoord: number, yCoord: number, width: number = 3, type: string = "pen"): line{
    return {
        xCoords: [xCoord],
        yCoords: [yCoord],
        lineWidth: width,
        type: type,
        display(ctx: CanvasRenderingContext2D){
            if (this.type === "pen"){
                ctx.beginPath();
                ctx.moveTo(this.xCoords[0], this.yCoords[0]);
                for (let i = 1; i < this.xCoords.length; i++) {
                    ctx.lineTo(this.xCoords[i], this.yCoords[i]);
                }
                if (this.lineWidth){
                    ctx.lineWidth = this.lineWidth;
                }
                ctx.stroke();
            } else {
                ctx.font = "40px serif";
                ctx.textBaseline = "middle";
                ctx.fillText(this.type, this.xCoords[0], this.yCoords[0]);
            }
            
        }
    };
};
const displayedLines: line[] = [];
const redoStack: line[] = [];

let previewType: string = "pen";
type preview = {
    x: number,
    y: number,
    width: number,
    type: string,
    draw: (ctx: CanvasRenderingContext2D) => void
};
function createPreview(x: number, y: number, width: number, type: string): preview{
    return {
        x: x,
        y: y,
        width: width,
        type: type,
        draw(ctx: CanvasRenderingContext2D){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
            ctx.stroke();
        }
    };
};

function errorMessage(){
    console.error("Could not get 2D context from canvas");
}

if (pen){
    let drawing: boolean = false;
    stickerCanvas.addEventListener("mousedown", (lineStart) => {
        if (previewType !== "pen"){
            stickerCanvas.dispatchEvent(new CustomEvent("tool-moved", {detail: {x: lineStart.offsetX, y: lineStart.offsetY}}));
        } else {
            drawing = true;
            displayedLines.push(createLine(lineStart.offsetX, lineStart.offsetY, lineWidth));
        }
    });

    stickerCanvas.addEventListener("mousemove", (nextPoint) => {
        if (drawing) {
            displayedLines[displayedLines.length - 1].xCoords.push(nextPoint.offsetX);
            displayedLines[displayedLines.length - 1].yCoords.push(nextPoint.offsetY);           
            stickerCanvas.dispatchEvent(new Event("drawing-changed"));
        } else {
            stickerCanvas.dispatchEvent(new CustomEvent("tool-moved", {detail: {x: nextPoint.offsetX, y: nextPoint.offsetY}}));
        }
    });

    stickerCanvas.addEventListener("mouseup", () => {
        drawing = false;
    });
    
    stickerCanvas.addEventListener("drawing-changed", () => {
        pen.clearRect(0, 0, stickerCanvas.width, stickerCanvas.height);
        displayedLines.forEach(line => line.display(pen));
    });

    stickerCanvas.addEventListener("tool-moved", (cursorEvent) => {
        const cursor = cursorEvent as CustomEvent<{x: number, y: number}>;
        createPreview(cursor.detail.x, cursor.detail.y, lineWidth, previewType).draw(pen)
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
thinPenButton.addEventListener("click", () => {
    lineWidth = 3;
    previewType = "pen";
});

const thickPenButton = document.createElement("button");
thickPenButton.textContent = "Thick Pen";
document.body.appendChild(thickPenButton);
thickPenButton.addEventListener("click", () => {
    lineWidth = 6;
    previewType = "pen";
});

const pumpkinButton = document.createElement("button");
pumpkinButton.textContent = "🎃";
document.body.appendChild(pumpkinButton);
pumpkinButton.addEventListener("click", () => {
    previewType = "pumpkin";
    stickerCanvas.dispatchEvent(new CustomEvent("tool-moved", {detail: {x: 128, y: 128}}));
});

const skullButton = document.createElement("button");
skullButton.textContent = "💀";
document.body.appendChild(skullButton);
skullButton.addEventListener("click", () => {
    previewType = "skull";
    stickerCanvas.dispatchEvent(new CustomEvent("tool-moved", {detail: {x: 128, y: 128}}));
});

const broomButton = document.createElement("button");
broomButton.textContent = "🧹";
document.body.appendChild(broomButton);
broomButton.addEventListener("click", () => {
    previewType = "broom";
    stickerCanvas.dispatchEvent(new CustomEvent("tool-moved", {detail: {x: 128, y: 128}}));
});