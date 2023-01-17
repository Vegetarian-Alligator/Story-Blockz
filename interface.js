let discardedIndices = [];
//Pop and Push to use old, discarded indices again!
function* indexer()
{
  let i = 0;
  while (true)
  {
    yield i;
    i = i + 1;
  }
}

function* colorPicker(){
	while (true){
		yield "Gainsboro";
		yield "LightGray";
		yield "Silver";
		yield "DarkGray";
		yield "DimGray";
		yield "Gray";
		yield "LightSlateGray";
		yield "SlateGray";
		yield "DarkSlateGray";
		yield "Black";
	}
}
const Index = indexer();
const pickColor = colorPicker();
//console.log("generator: ");
//console.log(Index);
class Object
{
  constructor(myindex = -1, nodeHeader = "UNSPECIFIED NODE")
  {
    this.groupParent=null; //If this has a value, you are at the end of a group
    this.groupChildren=false; //If this has a value, yo are at the start of a populated group NOT CURRENTLY USED
    this.index = myindex;
    this.upObject = null;
    this.downObject = null;
    this.box = document.createElement("div");
    this.box.className = "dragger";
    this.headerBox = document.createElement("div");
    this.headerBox.className = "draggerheader";
    this.box.appendChild(this.headerBox);
    this.box.onclick = clickElement.bind(this);
    this.upObject = null;
    this.downObject = null;
    //The above passes the box to clickElement
    //e.srcElement will be the child element clicked
    //but box will catch the subroutine
    this.implementType();
    this.Header = document.createElement("h2");
    this.Header.innerHTML = nodeHeader; //"DISPLAY";
    this.Header.style.top = "-1.7vh";
    this.Header.style.left = "14vw";
    this.Header.id = this.index + nodeHeader + "headerCaption";
    this.Header.style.position = "absolute";
    this.headerBox.appendChild(this.Header);
    //
    this.box.id = this.index + nodeHeader;
    this.headerBox.id = this.index + nodeHeader + "header";
    this.closer = document.createElement("h2");
    //                            this.closer
    this.closer.style.color = "red";
    this.closer.style.right = "4vw";
    this.closer.style.top = "-1.8vh";
    this.closer.style.position = "absolute";
    this.closer.id = this.index + "closer";
    this.closer.innerHTML = "X";
    this.headerBox.appendChild(this.closer);
    dragElement(this);
  }
  countGroupObjectsBelow(){
	if (this.downObject!=null) return 0+this.downObject.countGroupObjectsBelow();
	else return 0;
  }
  suicide(endBlock=false)
  {
    //console.log("starting to close");
    let oldTopObject = this.upObject;
    let oldDownObject = this.downObject;
    this.severTop(endBlock);
    this.box.remove();
    objects.delete(this.index);
    if (oldDownObject != null)
      if (oldTopObject != null) oldDownObject.insertAbove(oldTopObject,endBlock);
    console.log(this);
  }


  implementType(nodeType = "UNSPECIFIED NODE TYPE")
  {
    //console.log("implementType returns null.");
  } //This is where all the specific stuff goes for inherited classes
  //Doing it this way allows us to do all of it before we add the closer button;
  propogateDown(originalCaller)
  {
   
	if (this.downObject!=null) this.downObject.moveBelow(); 
	 //This block ends a group; we need to make sure we are above it's parent.
	       //or else we ARE the parent.  Beyond this, we sever ourselves here.
	       //NOTE: INsert error handling code in case someone manages to drag an error block?
  
  }
  moveBelow(z = "2",originalCaller=this)
  {
//    console.log("calling moveBelow, with this: " + this);
    this.box.style.zIndex = z;
    if (this.downObject != null)
    {
      this.downObject.box.style.top = (parseFloat(this.box.style.top) + this.box.getBoundingClientRect().height) + "px"; //-this.upobject.box.getBoundingClientRect().height;
      this.downObject.box.style.left = this.box.style.left;
      this.propogateDown(originalCaller);
    }
  }
  insertBelow(newdown,blockEnd=false)
  {
    this.downObject = newdown;

    if (blockEnd==false) this.handleFooter();
  }
  //insertBelow
  //severTop
  insertAbove(upObject,blockEnd=false)
  {
    let oldUp = this.upObject;
    let oldDown = this.downObject;
    let upObjectChild = upObject.downObject;
    this.upObject = upObject;
    //console.trace();
    //console.log(this.upObject);
    this.upObject.insertBelow(this,blockEnd);
    this.box.style.left = upObject.box.style.left;
    if (this.headerBox!=null){
    	this.upObject.box.style.top = (parseFloat(this.box.style.top) - (this.upObject.box.getBoundingClientRect().height + this.headerBox.getBoundingClientRect().height)) + "px";
    } else {
	this.upObject.box.style.top = (parseFloat(this.box.style.top) - (this.upObject.box.getBoundingClientRect().height)) + "px";
    }
    if (parseFloat(this.upObject.box.style.top) < 0)
    {
      this.upObject.box.style.top = 15 + "px";
      this.upObject.moveBelow();
    } //Since the top object moves to the bottom object, checks if the top
    //object has moved of the screen
    if (upObjectChild != null)
    {
      let thisBottom = this.returnBottom();
      upObjectChild.insertAbove(thisBottom);
    }
    let topOfStack = this.returnTop() //Does this work above the line?
    topOfStack.moveBelow();
    this.propogateUp(blockEnd);
  }
  handleFooter()
  {
    return null;
  }
  suicideFooter(){
    return null;
  }
  returnTop()
  {
    if (this.upObject == null) return this;
    else return this.upObject.returnTop();
  }
  returnNextGroupDown(){
    if (this.downObject == null) return this;
    else {
	if (this.groupParent!=null) return this;
        return this.downObject.returnNextGroupDown();
     }
  }
  returnBottom()
  {
    if (this.downObject == null) return this;
    else return this.downObject.returnBottom();
  }
  returnStackHeight(height=0){
    let totalHeight=height+this.box.getBoundingClientRect().height;
    if (this.downObject == null) return totalHeight;
    else return this.downObject.returnStackHeight(totalHeight);
  }
  removeChild(endBlock=false)
  {
    let oldDown=this.downObject;
    this.downObject = null;
    if (endBlock==false) this.handleFooter();
    //if (oldDown!= null) oldDown.propogateUp();
  }
  propogateUp(blockEnd=false){
     //console.log("handling the footer in propUp");
     //console.trace();
     if (blockEnd==false) this.handleFooter();
     if (this.upObject!=null) this.upObject.propogateUp(blockEnd);
  }
  severTop(endBlock=false)
  {
    let oldUp = this.upObject;
    if (this.upObject != null) this.upObject.removeChild(endBlock);
    this.upObject = null;
    if (oldUp != null) oldUp.propogateUp(endBlock);
      
}
  suicide(endBlock=false)
  {
    let oldTopObject = this.upObject;
    let oldDownObject = this.downObject;
    this.severTop(endBlock);
    this.box.remove();
    if (oldDownObject != null)
      if (oldTopObject != null)
      {
        oldDownObject.insertAbove(oldTopObject);
        oldTopObject.moveBelow(); //Why didn't I move this before?
      }
    objects.delete(this.index);
    this.suicideFooter();
  }
   
}


class display extends Object
{
  constructor(myindex, nodeCaption = "DISPLAY")
  {
    super(myindex, nodeCaption);
    this.name = "display";
    this.name = "";
  }
  implementType(nodeType = "DISPLAY")
  {
    this.textbox = document.createElement("textarea");
    this.textbox.style.left = 5 + "%";
    this.textbox.style.height = 65 + "%";
    this.textbox.style.width = 90 + "%";
    this.textbox.id = "displaystring";
    this.box.appendChild(this.textbox);
  }
}


class groupEnder extends Object{
	constructor(myindex,color,parent){
		super(myindex,"NONSPECIFIC GROUP ENDER");
		this.headerBox.remove();
		this.headerBox=null;
		this.color=color;
		this.box.style.backgroundColor=this.color;
		this.groupParent=parent;
	}

 	implementType(){
		let label=document.createElement("h2");
		label.innerHTML="NONSPECIFIC GROUP NODE ENDER";
 	}

	findParent(bookEnd){
		let current=this;
		if (bookEnd==this.groupParent) return true;
		while (current.upObject != bookEnd)
		{
			if (current==this.groupParent){//IF PARENT BLOCK IS BEING MOVED
				//this.downObject.moveBelow();
				return true;
			}
			current=current.upObject;
            if (current==null) break;
		}
		return false;
	}

    propogateDown(originalCaller){
		if (this.downObject==null) return;
		if (this.findParent(originalCaller)==true) 
        {this.downObject.moveBelow();} else{
			this.severTop();
			this.reconcile();
		}
		//originalCaller.reconcile();
	}

	reconcile(){
		console.log("ordered to reconcile");
		//this.suicide();
		//this.groupParent.endBlock=null;
		//this.groupParent.handleFooter();
	//Goodbye.....
  	}

	//returnBottom(){
		//if (this.upObject==null) {
		//	console.log("Error: Ender with no object above");
		//	return null;
		//}
		//*IF* the object is ABOVE the if statement... we want to continue down the stack as usual
		//If the object is BELOW the if statement... we need to end it here
		//Case 1: adding an if statement inside of an group statement should end the block inside the old one
		//Case 2: An object drug from inside the group statement should take it's children out of the group; an object from above the statement is supposed to take it's
		//children with it, including the group statement. 
		//return this.upObject;
	//}
}


class groupHeader extends Object
{
  constructor(myindex)
  {
    super(myindex, "NONSPECIFIC GROUP NODE");
    this.footer = null;
    this.headerBox.style.color = "coral";
  }
  countGroupObjectsBelow(){
	if (this.downObject!=null) return 1+this.downObject.countGroupObjectsBelow();
	else return 1;
  }
  implementType()
  {
    this.box.style.backgroundColor = "blue";
  }

  handleFooter()
  {
    //                            this.box.height=
    //                            Use calc to set height to the headerBox + a token box size
    
    //console.log("I am " + this.countGroupObjectsBelow() + " in the stack.");
    console.trace();
	//debugger;
	if (this.footer!=null) this.footer.remove();
    this.footer=null;
	if (this.endBlock !=null) {
		this.endBlock.suicide(true);
		this.endBlock=null;
	}
    if (this.downObject==null){
        this.groupChildren=false;
        return;
    }
    this.groupChildren=true;
    //console.log("Handling the footer");
    let bottomTarget = this.returnBottom().box.getBoundingClientRect().bottom;
    //console.log("bottomTarget: " + bottomTarget);
    this.footer = document.createElement("div");
    this.footer.style.position="absolute";
    this.footer.style.width = "2vw";
    //this.footer.style.left="0px";
    let footerOffset=this.countGroupObjectsBelow()*2;
    //console.log("calc(0px - " + parseInt(footerOffset)+"vw)");
    this.footer.style.left = "calc(0px - " + parseInt(footerOffset)+"vw)";//parseFloat(this.box.getBoundingClientRect().left)+"px";
    //                            Needs to be moved a little to the right
    let pixHeight = parseFloat(this.returnStackHeight())+"px";// - this.box.getBoundingClientRect().top)+"px";
    console.log("pixHeight: " + pixHeight);
    this.footer.style.height = pixHeight;
    this.barColor=pickColor.next().value;
    this.footer.style.backgroundColor = this.barColor;
    this.footer.style.zIndex = "10";
    //debugger;
    this.box.appendChild(this.footer);
    this.footer.style.top = "0px";//"-" + parseFloat(this.headerBox.getBoundingClientRect().height)+"px";
    this.handleEndBlock();
 }

  handleEndBlock(){
    console.log("Handling the end block");
	this.endBlock=new groupEnder(-1,this.barColor,this);
	//this.endBlock.insertAbove(this.returnNextGroupDown());
	let myBottom=this.returnNextGroupDown();
	//debugger;
	document.getElementById('Game Editor').appendChild(this.endBlock.box);
        if (myBottom.groupParent==null) this.endBlock.insertAbove(myBottom,true);
	else myBottom.insertAbove(this.endBlock,true);
  }

  suicideFooter(){
	if (this.endBlock != null) this.endBlock.suicide();
  }

}
//TO BE IMPLEMENTED
//class groupFooter extends Object{
//}
let displaytest = new display(1);
openTab(null, 'Game Editor');
let objects = new Map();
console.log("---");

function newDisplay()
{
  let myIndex = Index.next().value;
  console.log(myIndex);
  objects.set(myIndex, new display(myIndex));
  document.getElementById('Game Editor').appendChild(objects.get(myIndex).box);
}

function newSub()
{
  let sampledisplay = new my_command("sub");
  objects.set(currentIndex - 1, sampledisplay);
  //console.log(sampledisplay);
  document.getElementById('Game Editor').appendChild(sampledisplay.box);
}

function newIf()
{
  let myIndex = Index.next().value;
  console.log(myIndex);
  objects.set(myIndex, new groupHeader(myIndex));
  document.getElementById('Game Editor').appendChild(objects.get(myIndex).box);
}
//document.addEventListener('mouseup',allMouseUp);
//OnMouseUp doesn't trigger if the mouse is away from the calling object!
function releaseMouse(e, callingObject)
{}

function clickElement(e)
{
  //            console.log("click registered");
  //            console.log(this);
  //            console.log(e.srcElement);
  if (e.srcElement.id == this.closer.id)
  {
    this.suicide();
  }
}

//This might mess with the interface of the preview tab
function dragElement(movedObject)
{
  let elmnt = movedObject.headerBox;
  let ref = null;
  //NOTE: figure out why "let" is required for this variable
  //to inherit the
  if (elmnt.id.includes("header")) ref = elmnt.parentElement;
  else ref = elmnt;
  //NOTE: To handle objects without a header, you would simpl
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  elmnt.onmousedown = dragMouseDown;
  //console.log("plainelement mousedown " + elmnt.id);
  function dragMouseDown(e)
  {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    for (let key of objects.keys())
    {
      objects.get(key).box.style.zIndex = "1";
    }
    movedObject.box.style.zIndex = "2";
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e)
  {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    let myobj = document.getElementById('tabs');
    //NOTE: Might be better to refer to the actual object instead of this header hack
    //ITERATE TO ALL TOPOBJECTS AND MAKE THE SAME CHANGE
    //ITERATE TO ALL BOTTOMOBJECTS AND MAKE THE SAME CHANGE
    //How is REF the only variable that stays obsolete!?!?
    //if (elmnt.id.includes("header")) ref=elmnt.parentElement;
    if ((ref.offsetTop - pos2) > 0)
    {
      ref.style.top = (ref.offsetTop - pos2) + "px";
      movedObject.moveBelow();
    }
    if ((ref.offsetLeft - pos1) > 0)
    {
      ref.style.left = (ref.offsetLeft - pos1) + "px";
      movedObject.moveBelow();
    }
  }

  function closeDragElement(e)
  {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
    if (e.srcElement.id.includes("closer") != true) movedObject.severTop();
    //NOTE: Always sever the top - we just remake it if it's still in position
    let targetArea = ref.getBoundingClientRect();
    for (let key of objects.keys())
    {
      if (objects.get(key) != movedObject)
      {
        let checkarea = objects.get(key).box.getBoundingClientRect();
        if (targetArea.top <= checkarea.bottom - 5)
          if (targetArea.top >= checkarea.bottom - 20)
            if (targetArea.left < checkarea.right)
              if (targetArea.right > checkarea.left)
              {
                //console.log("true collision");
                //console.log(movedObject);
                //debugger;
                movedObject.insertAbove(objects.get(key));
                break; //Fixes bug where we get more than one set to drag around!
              }
      }
}
  }
}

function allMouseUp()
{}
let xCoords = null;
let yCoords = null;

function showCoords(event)
{
  xCoords = event.clientX;
  yCoords = event.clientY;
  //var coor = "X coords: " + x + ", Y coords: " + y;
}

function logCoords()
{
  console.log("X: " + xCoords);
  console.log("Y: " + yCoords);
}

function openTab(evt, tabName)
{
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++)
  {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++)
  {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  if (evt != null) evt.currentTarget.className += " active";
  else document.getElementById('Game Editor').className += " active";
}