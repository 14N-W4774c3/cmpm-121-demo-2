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
interface drawable {
    xCoords: number[],
    yCoords: number[],
    lineWidth: number,
    type: string,
    isDisplayed: boolean,
    draw: (ctx: CanvasRenderingContext2D) => void,
    drag: (x: number, y: number) => void
};

function createDrawable(xCoord: number, yCoord: number, width: number = 3, type: string = "pen", display: boolean = true): drawable{
    return {
        xCoords: [xCoord],
        yCoords: [yCoord],
        lineWidth: width,
        type: type,
        isDisplayed: display,
        draw(ctx: CanvasRenderingContext2D){
            if (this.isDisplayed){
                if (type === "pen"){
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
                else {
                    ctx.font = "48px serif";
                    switch (this.type){
                        case "pumpkin":
                            ctx.fillText("🎃", this.xCoords[0], this.yCoords[0]);
                            break;
                        case "skull":
                            ctx.fillText("💀", this.xCoords[0], this.yCoords[0]);
                            break;
                        case "broom":
                            ctx.fillText("🧹", this.xCoords[0], this.yCoords[0]);
                            break;
                    }
                }
            }
        },
        drag(x: number, y: number){
            if (this.isDisplayed){
                if (type === "pen"){
                    this.xCoords.push(x);
                    this.yCoords.push(y);
                }
                else {
                    this.xCoords[0] = x;
                    this.yCoords[0] = y;
                }
            }
        }
    };
} 
/*
type line = {
    xCoords: number[], 
    yCoords: number[], 
    lineWidth: number,
    type: string,
    draw: (ctx: CanvasRenderingContext2D) => void,
    drag: (x: number, y: number) => void
};
function createLine(xCoord: number, yCoord: number, width: number = 3): line{
    return {
        xCoords: [xCoord],
        yCoords: [yCoord],
        lineWidth: width,
        type: "pen",
        draw(ctx: CanvasRenderingContext2D){
            ctx.beginPath();
            ctx.moveTo(this.xCoords[0], this.yCoords[0]);
            for (let i = 1; i < this.xCoords.length; i++) {
                ctx.lineTo(this.xCoords[i], this.yCoords[i]);
            }
            if (this.lineWidth){
                ctx.lineWidth = this.lineWidth;
            }
            ctx.stroke();
        },
        drag(x: number, y: number){
            this.xCoords.push(x);
            this.yCoords.push(y);
        }
    };
};

type sticker = {
    x: number,
    y: number,
    type: string,
    draw: (ctx: CanvasRenderingContext2D) => void,
    drag: (x: number, y: number) => void
};
function createSticker(x: number, y: number, type: string): sticker{
    return {
        x: x,
        y: y,
        type: type,
        draw(ctx: CanvasRenderingContext2D){
            ctx.font = "48px serif";
            switch (this.type){
                case "pumpkin":
                    ctx.fillText("🎃", this.x, this.y);
                    break;
                case "skull":
                    ctx.fillText("💀", this.x, this.y);
                    break;
                case "broom":
                    ctx.fillText("🧹", this.x, this.y);
                    break;
            }
        },
        drag(x: number, y: number){
            this.x = x;
            this.y = y;
        }
    };
};

const displayedLines: Array<line | sticker> = [];
const redoStack: Array<line | sticker> = [];
*/
const displayedLines: Array<drawable> = [];
const redoStack: Array<drawable> = [];

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
};

function checkStickers(displayArray: Array<drawable>, coordX: number, coordY: number): drawable | null{
    for (let i = displayArray.length - 1; i >= 0; i--){
        if (displayArray[i].type !== "pen"){
            if (coordX >= displayArray[i].xCoords[0] - 24 && coordX <= displayArray[i].xCoords[0] + 24 && coordY >= displayArray[i].yCoords[0] - 24 && coordY <= displayArray[i].yCoords[0] + 24){
                return displayArray[i];
            }
        }
    }
    return null;
}

if (pen){
    let drawing: boolean = false;
    // If mouse is down AND the previewType is pen, then start drawing a line, 
    // otherwise if clicking a sticker, start dragging it, 
    // otherwise place a sticker
    stickerCanvas.addEventListener("mousedown", (lineStart) => {
        if (previewType !== "pen"){
            if (displayedLines.length === 0){
                displayedLines.push(createDrawable(lineStart.offsetX, lineStart.offsetY, lineWidth, previewType));
            } else {
                const lastLine = checkStickers(displayedLines, lineStart.offsetX, lineStart.offsetY);
                if (lastLine){
                    lastLine.isDisplayed = false;
                    displayedLines.push(createDrawable(lineStart.offsetX, lineStart.offsetY, lineWidth, previewType));
                    stickerCanvas.dispatchEvent(new Event("drawing-changed"));
                }
            }
            stickerCanvas.dispatchEvent(new CustomEvent("tool-moved", {detail: {x: lineStart.offsetX, y: lineStart.offsetY}}));
        } else {
            drawing = true;
            displayedLines.push(createDrawable(lineStart.offsetX, lineStart.offsetY, lineWidth));
        }
    });

    // If mouse is down and drawing, continue drawing the line, 
    // otherwise if dragging a sticker, continue dragging it,
    // otherwise display the preview
    stickerCanvas.addEventListener("mousemove", (nextPoint) => {
        if (drawing) {
            displayedLines[displayedLines.length - 1].drag(nextPoint.offsetX, nextPoint.offsetY);         
            stickerCanvas.dispatchEvent(new Event("drawing-changed"));
        } else {
            stickerCanvas.dispatchEvent(new CustomEvent("tool-moved", {detail: {x: nextPoint.offsetX, y: nextPoint.offsetY}}));
        }
    });

    // If mouse is up and drawing, stop drawing the line,
    // otherwise if dragging a sticker, stop dragging it
    // otherwise HOW DID YOU GET HERE?
    stickerCanvas.addEventListener("mouseup", (stickerPoint) => {
        if (drawing) {
            drawing = false;
        } else {
            const placedSticker = createDrawable(stickerPoint.offsetX, stickerPoint.offsetY, lineWidth, previewType);
            displayedLines.push(placedSticker);
            displayedLines[displayedLines.length - 1].draw(pen);
            stickerCanvas.dispatchEvent(new CustomEvent("tool-moved", {detail: {x: stickerPoint.offsetX, y: stickerPoint.offsetY}}));
        }
    });
    
    stickerCanvas.addEventListener("drawing-changed", () => {
        pen.clearRect(0, 0, stickerCanvas.width, stickerCanvas.height);
        displayedLines.forEach(line => line.draw(pen));
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