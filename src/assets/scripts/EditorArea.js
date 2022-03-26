export default class MyCanvas {  
  constructor(canvas, onClickRegion){
    this.canvas = canvas

     // Drive canvas
    this.rect = canvas.getBoundingClientRect();
    this.ctx = canvas.getContext('2d');

    //clear
    this.ctx.fillStyle = 'white';
    this.ctx.rect(0, 0, 1000, 1000);
    this.ctx.fill();

    //reset fill
    this.ctx.fillStyle = 'black';

    //set radius
    this.radius = 10;

    this.onClickRegion = onClickRegion;

    //set handlers
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e), false);
    this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e), false);
    this.canvas.addEventListener('mousemove', (e) => this.handleDraw(e), false);
    this.canvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e), false);

  }

  //Public functions--------------------------------------------------------------

  /* Selects which tool to use for drawing */
  switchTool(tool){
    //switch away from linking if we have to
    if(this.selectMode && tool != 'link'){
      this.switchToDraw();
    }
    
    switch(tool){
      case 'draw':
          this.handlePaintTool();
        break;
      case 'erase':
          this.handleEraseTool();
        break;
      case 'link':
        this.switchToLink();
        break;
    }
  }

  /* Clears and resets drawing canvas */

  //Event handlers----------------------------------------------------------------

  /* Recieves all mouse down events */
  handleMouseDown(e){
    if(!this.selectMode){
      const point = this.getPointTransform(e);
      this.clicked = true;

      this.drawPoint(point[0], point[1]);
    }
  }

  /* Recieves all mouse up events */
  handleMouseUp(e){
    this.clicked = false;
    this.lastPoint = null;
    
    if(this.selectMode){
      let foundMatch = false;
      if(this.selectedRect.length > 0){
        for(let i = 0; i < this.foundActions.length; i++){
          let found = false;
          for(let j = 0; j < this.foundActions[i].rect.length; j++){
            if(this.foundActions[i].rect[j] == this.selectedRect[j]) found = true;
            else found = false;
          }
          if(found){
            this.foundActions.splice(i, 1);
            foundMatch = true;
            break;
          }
        }
        if(!foundMatch){
          //this.foundActions.push({key: keyCounter, rect: selectedRect});
          //this.keyCounter++;
          const popupX = this.selectedRect[0] + this.selectedRect[2] + this.rect.left;
          const popupY = this.selectedRect[1] + this.selectedRect[3] + this.rect.top;
          this.onClickRegion(popupX, popupY); //patch in x, y
        }
      }
    }
  }

  /* Recieves all mouse movement events */
  handleDraw(e){
    this.pointCache = this.getPointTransform(e);
    
    if(!this.selectMode){
      if(this.clicked){
      //get current point

      //refactor: can use local here?
      this.currentPoint = this.getPointTransform(e);

      if(this.lastPoint === null){
        this.lastPoint = this.currentPoint;
      }

      if(this.lastPoint != null){
        //compute
        const mag = this.dist(this.currentPoint, this.lastPoint);
        const v1 = (this.lastPoint[0] - this.currentPoint[0]) / mag;
        const v2 = (this.lastPoint[1] - this.currentPoint[1]) / mag;

        for(let t = 0; t < mag; t += 2.5){
          const su = this.currentPoint[0] + (t * v1);
          const sv = this.currentPoint[1] + (t * v2);
  
          this.drawPoint(su, sv);
        }
      } else {
        this.drawPoint(this.currentPoint[0], this.currentPoint[1]);
      }
    
      //cache point
      this.lastPoint = this.currentPoint;
      }
    } 
  }

  /* Clears canvas and resets drawing */
  handleClear(){
    clearInterval(this.interval);

    this.foundEdges = [];
    this.foundActions = [];
    this.selectMode = false;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'white';
     this.ctx.rect(0, 0, 1000, 1000);
     this.ctx.fill();
     this.ctx.fillStyle = 'black';
  }

  /* Compresses canvas and saves as image */
  getContent(){
    return this.canvas.toDataURL("image/png");
  }

  /* Gets compressed image and paints it into canvas */
  putContent(dataString){

    const img = new Image();
    img.onload = () => {
      console.log(img);
      this.ctx.drawImage(img, 0, 0);
    }
    img.src = dataString;
  }

  //Helper functions--------------------------------------------------------------

  /* Returns distance between two points, defined as arrays with a length of 2 */
  dist(p1, p2){
    return Math.sqrt(((p1[0] - p2[0]) * (p1[0] - p2[0])) + ((p1[1] - p2[1]) * (p1[1] - p2[1])))
  }

  /* Gets mouse location relative to canvas */
  getPointTransform(e){
    const x = (e.clientX - this.rect.left) - (this.radius / 2);
    const y = (e.clientY - this.rect.top) - (this.radius / 2);

    return [x, y];
  }

  /* Draws point on canvas */
  drawPoint(x, y){
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI, false);
    
    this.ctx.fill();
  }

  /* Called when switching painting mode to painting */
  handlePaintTool(){
    this.ctx.fillStyle = 'black';
    this.ctx.globalCompositeOperation = 'source-over'
  }

  /* Called when switching painting mode to erase */
  handleEraseTool(){
    this.ctx.globalCompositeOperation = 'destination-out'
  }

  /* Checks if 2d point is within bounding rectangle defined as [x, y, w, h] */
  objInBounds(point, rect){
    if(point[0] >= rect[0] && 
           point[1] >= rect[1] && 
           point[0] <= rect[0] + rect[2] &&
           point[1] <= rect[1] + rect[3]){
              return true;
           }
    return false;
  }

  /* Removes watcher for select mode */
  switchToDraw(){
    this.selectMode = false;
    clearInterval(this.interval);
  }

  /* Runs processing code for current view and switches to select mode */
  switchToLink(){
    this.selectMode = true;
    this.runExport();
  }

  //Select (link) mode core----------------------------------------------------------

  /* Exports scene grapb */
   runExport(){

  let contours = FindBounds(this.ctx, 1000, 1000) ;
  this.foundEdges = [];
     this.foundActions = [];
    
  for(let i = 0; i < contours.length; i++){
    let rect = contours[i];

    //prune here
    let dup = false;

    for(let j = 0; j < contours.length; j++){
      if(j != i){
        let rect2 = contours[j]
        let mx = ((rect.x + this.radius*2) - rect2.x);
        let my = ((rect.y + this.radius*2) - rect2.y);
        if(mx <= 2 && mx >=-2 && my <= 2 && my >= -2){
          dup = true;
          break;
        }
      }
    }

    if(dup) continue;
    this.foundEdges.push([rect[0], rect[1], rect[2], rect[3]]);
  }

     console.log('dog')
     console.log(this.foundEdges);
    
    this.original = this.ctx.getImageData(0,0,1000,1000);

    this.interval = setInterval(() => this.gameLoop(), 10);
    this.selectMode = true;
}

  /* runs code to watch mouse position and drive selection logic */
  gameLoop(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.putImageData(this.original, 0, 0);
    this.selectedRect = [];

    //foundActions.length unknown
    //clearRect not working :(

    for(let i = 0; i < this.foundActions.length; i++){
      this.ctx.beginPath();
      this.ctx.rect(this.foundActions[i].rect[0], this.foundActions[i].rect[1], this.foundActions[i].rect[2], this.foundActions[i].rect[3]);
      this.ctx.strokeStyle = 'blue';
      this.ctx.strokeWidth = 5;
      this.ctx.stroke();

      this.ctx.font = '48px serif';
      this.ctx.fillText(this.foundActions[i].key, this.foundActions[i].rect[0] + this.foundActions[i].rect[2], this.foundActions[i].rect[1] + 1);
    }

    //v2: need to find closest shape edge to cursor
    for(let i = 0; i < this.foundEdges.length; i++){
      if(this.objInBounds(this.pointCache, this.foundEdges[i])){
        this.ctx.beginPath();
        this.ctx.rect(this.foundEdges[i][0], this.foundEdges[i][1], this.foundEdges[i][2], this.foundEdges[i][3]);

        this.selectedRect = this.foundEdges[i];
      
        this.ctx.fillStyle = 'blue';
        this.ctx.globalAlpha = 0.1;
        //this.ctx.fill();
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
        
        //break;
      }
    }
  }
}

export function FindBounds(ctx, width, height){
  //port drawing to 2d array of 1px 1px
  let imageData = ctx.getImageData(0, 0, width, height);
  //flatten out to 1px*1px
  let newImageData = new Fast2DArray(width, height);
  for(let i = 0; i < imageData.data.length; i += 4){
    if(imageData.data[i] == 0 && imageData.data[i+1] == 0 && imageData.data[i+2] == 0 && imageData.data[i+3] > 0){
      newImageData.setValueDirect(i / 4, 1);
    }
  }
  
  let [contours, parent, borderType] = rasterScan(newImageData)
  console.log(contours);
  
  //get bounding rects
  let rects = []
  for(let i = 0; i < contours.length; i++){
    //find min/max points
    let minX = width;
    let minY = height;

    let maxX = 0;
    let maxY = 0;
    for(let j = 0; j < contours[i].length; j++){
      if(contours[i][j][0] > maxX){
        maxX = contours[i][j][0];
      }

      if(contours[i][j][0] < minX){
        minX = contours[i][j][0]
      }

      if(contours[i][j][1] > maxY){
        maxY = contours[i][j][1]
      }

      if(contours[i][j][1] < minY){
        minY = contours[i][j][1]
      }
    }
    
    rects.push([minX, minY, maxX - minX, maxY - minY]);
  }

  return rects;
}


class Fast2DArray{
  constructor(width, height){
    this.width = width;
    this.height = height;
    this.arr = new Int8Array(this.width * this.height);
  }

  getValue(i, j){
    return this.arr[i + (j * this.width)];
  }

  getPos(pos){
    return this.getValue(pos[0], pos[1]);
  }

  setValue(i, j, value){
   this.arr[i + (j * this.width)] = value;
  }

  setValueDirect(x, value){
    this.arr[x] = value;
  }

  show(){
    let outerValues = "";
    for(let i = 0; i < this.height; i++){
      let values = "";
      for(let j = 0; j < this.width; j++){
        values += this.getValue(j, i); + ","
      }
      outerValues += values + "\n";
    }
  }

  //assumes data is correct size fwiw
  loadData(data){
    for(let i = 0; i < data.length; i++){
      for(let j = 0; j < data[i].length; j++){
        this.setValue(j, i, data[i][j]);
      }
    }
  }

  //used to load from other int8arrays
  loadDataRaw(data){
    this.arr = data;
  }
}

//if you know, you know
function arraysEqual(a, b) {
  a = Array.isArray(a) ? a : [];
  b = Array.isArray(b) ? b : [];
  return a.length === b.length && a.every((el, ix) => el === b[ix]);
}

function nextCell(pixel, dir){
  let i = pixel[0];
  let j = pixel[1];
  let r, c, newDir, save

  switch(dir){
    case 0:
      r = i - 1;
      c = j
      newDir = 1;
      save = [i, j+1]
      break;
    case 1:
      r = i
      c = j-1
      newDir = 2
      break;
    case 2:
      r = i+1
      c = j
      newDir = 3
      break;
    case 3:
      r = i
      c = j+1
      newDir = 0
      break;
  }

  return [r, c, newDir, save]
}

function borderFollow(data, start, prev, direction, NBD){
  //fwiw all lists should be dereferenced/deep copied at = sign
  let curr = [...start];
  let exam = [...prev];
  let save;
  let save2 = [...exam];
  let contour = [];
  let savePixel;
  contour.push([...curr]);

  while(data.getPos(exam) == 0){
    [exam[0], exam[1], direction, savePixel] = nextCell(curr, direction)
    if(savePixel){
      save = [...savePixel]
    }
    if(arraysEqual(save2, exam)){
      data.setValue(curr[0], curr[1], -NBD)
      return contour
    }
  }

  if(save != null){
    data.setValue(curr[0], curr[1], -NBD)
    save = null;
  } else if(
    (!save || (save && data.getValue(save) != 0)) &&
    (data.getPos(curr) == 1)){
      data.setValue(curr, NBD);
    }

  prev = [...curr];
  curr = [...exam];
  contour.push([...curr]);
  if(direction >= 2){
    direction = direction - 2;
  } else {
    direction = direction + 2;
  }
  let flag = false;
  let startNext = [...curr];

  while(true){
    //only prev and curr will be set!
    if(!(arraysEqual(curr, startNext) && arraysEqual(prev, start) && flag)){
      flag = true;

      [exam[0], exam[1], direction, savePixel] = nextCell(curr, direction)

      if(savePixel){
        save = [...savePixel]
      }

      while(data.getPos(exam) == 0){
        [exam[0], exam[1], direction, savePixel] = nextCell(curr, direction)
        if(savePixel){
          save=[...savePixel]
        }
      }

      if(save && data.getPos(save) == 0){
        data.setValue(curr[0], curr[1], -NBD)
        save = null;
      } else if ((!save || (save && data.getPos(save) != 0)) && 
        data.getPos(curr) == 1){
        data.setValue(curr[0], curr[1], NBD);
      }

      prev = [...curr]
      curr = [...exam]
      contour.push([...curr])

      if(direction >= 2){
        direction = direction - 2;
      } else {
        direction = direction + 2;
      }
    }
    else {
      break;
    }
  }

  return contour;
}

function rasterScan(data){
  let LNBD = 1;
  let NBD = 1;
  let contours = [];
  let parent = [];
  let borderType = [];

  parent.push(-1);
  borderType.push(0);

  for(let i = 1; i < data.height - 1; i++){
    LNBD = 1;
    for(let j = 1; j < data.width - 1; j++){
      if(data.getValue(i, j) == 1 && data.getValue(i, j-1) == 0){
        NBD++;
        let direction = 2;
        parent.push(LNBD)
        const contour = borderFollow(data, [i, j], [i, j-1], direction, NBD);
        contours.push(contour)
        borderType.push(1)
        if(borderType[NBD-2] == 1){
          parent.push(parent[NBD-2])
        } else {
          if(data.getValue(i, j) != 1){
            LNBD = Math.abs(data.getValue(i, j))
          }
        }
      }
      else if(data.getValue(i, j) >= 1 && data.getValue(i, j+1) == 0){
        NBD++;
        let direction = 0;
        if(data.getValue(i, j) > 1){
          LNBD = data.getValue(i, j);
        }
        parent.push(LNBD)
        const contour = borderFollow(data, [i, j], [i, j+1], direction, NBD)
        contours.push(contour);
        borderType.push(0)
        if(borderType[NBD-2] == 0){
          parent.push(parent[NBD - 2])
        } else {
          if(data.getValue(i, j) != 1){
            LNBD = Math.abs(data.getValue(i, j))
          }
        }
      }
    }
  }

  return [contours, parent, borderType]
}












