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
/*
const xCoords: number[] = [];
const yCoords: number[] = [];
const redoXCoords: number[] = [];
const redoYCoords: number[] = [];
const line = {
    xCoords: number[], 
    yCoords: number[], 
    function line(xCoord: number, yCoord: number){
        this.xCoords.push(xCoord);
        this.yCoords.push(yCoord);
    },
    display(ctx: CanvasRenderingContext2D){
        ctx.beginPath();
        ctx.moveTo(this.xCoords[0], this.yCoords[0]);
        for (let i = 1; i < this.xCoords.length; i++) {
            ctx.lineTo(this.xCoords[i], this.yCoords[i]);
        }
        ctx.stroke();
    }
};
*/

type line = {
    xCoords: number[], 
    yCoords: number[], 
    display: (ctx: CanvasRenderingContext2D) => void
};
function createLine(xCoord: number, yCoord: number): line{
    return {
        xCoords: [xCoord],
        yCoords: [yCoord],
        display(ctx: CanvasRenderingContext2D){
            ctx.beginPath();
            ctx.moveTo(this.xCoords[0], this.yCoords[0]);
            for (let i = 1; i < this.xCoords.length; i++) {
                ctx.lineTo(this.xCoords[i], this.yCoords[i]);
            }
            ctx.stroke();
        }
    };
}
const displayedLines: line[] = [];
const redoStack: line[] = [];

if (pen){
    let drawing: boolean = false;
    stickerCanvas.addEventListener("mousedown", (e) => {
        drawing = true;
        /*
        xCoords.push(e.offsetX);
        yCoords.push(e.offsetY);
        */
        displayedLines.push(createLine(e.offsetX, e.offsetY));
    });

    stickerCanvas.addEventListener("mousemove", (e) => {
        if (drawing) {
            /*
            xCoords.push(e.offsetX);
            yCoords.push(e.offsetY);
            */
            displayedLines[displayedLines.length - 1].xCoords.push(e.offsetX);
            displayedLines[displayedLines.length - 1].yCoords.push(e.offsetY);           
            stickerCanvas.dispatchEvent(new Event("drawing-changed"));
            }
    });

    stickerCanvas.addEventListener("mouseup", () => {
        drawing = false;
    });
    
    stickerCanvas.addEventListener("drawing-changed", () => {
        pen.clearRect(0, 0, stickerCanvas.width, stickerCanvas.height);
        /*
        pen.beginPath();
        pen.moveTo(xCoords[0], yCoords[0]);
        for (let i = 1; i < xCoords.length; i++) {
            pen.lineTo(xCoords[i], yCoords[i]);
        }
        pen.stroke();
        */
        displayedLines.forEach(line => line.display(pen));
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

const undoButton = document.createElement("button");
undoButton.textContent = "Undo";
document.body.appendChild(undoButton);
undoButton.addEventListener("click", () => {
    /*
    if (pen && xCoords.length > 0 && yCoords.length > 0) {
        redoXCoords.push(xCoords.pop()!);
        redoYCoords.push(yCoords.pop()!);
        stickerCanvas.dispatchEvent(new Event("drawing-changed"));
    }
    */
    if (pen && displayedLines.length > 0) {
        redoStack.push(displayedLines.pop()!);
        stickerCanvas.dispatchEvent(new Event("drawing-changed"));
    }
    else {
        console.error("Could not get 2D context from canvas");
    }
});

const redoButton = document.createElement("button");
redoButton.textContent = "Redo";
document.body.appendChild(redoButton);
redoButton.addEventListener("click", () => {
    /*
    if (pen && redoXCoords.length > 0 && redoYCoords.length > 0) {
        xCoords.push(redoXCoords.pop()!);
        yCoords.push(redoYCoords.pop()!);
        stickerCanvas.dispatchEvent(new Event("drawing-changed"));
    }
    */
    if (pen && redoStack.length > 0) {
        displayedLines.push(redoStack.pop()!);
        stickerCanvas.dispatchEvent(new Event("drawing-changed"));
    }
    else {
        console.error("Could not get 2D context from canvas");
    }
});
