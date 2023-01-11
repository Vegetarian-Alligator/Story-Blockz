let discardedIndices = [];

//Pop and Push to use old, discarded indices again!

function* indexer() {

                let i=0;

                while (true){

                                yield i;

                                i=i+1;

                }

}

const Index=indexer();

console.log("generator: ");

console.log(Index);

 

 

 

class Object {

                constructor(myindex){

                                this.index=myindex;

                                this.upObject=null;

                                this.downObject=null;

                                this.box = document.createElement("div");

                                this.box.className="dragger";

                                this.headerBox = document.createElement("div");

                                this.headerBox.className = "draggerheader";

                                this.box.appendChild(this.headerBox);

                                //this.box.onclick=function(){clickElement(event,this);};

                                this.upObject=null;

                                this.downObject=null;

                                //The above passes the box to clickElement

                                //e.srcElement will be the child element clicked

                                //but box will catch the subroutine

                                this.implementType();

                                this.closer = document.createElement("h2");

                                this.closer.style.color = "red";

                                this.closer.style.right = "4vw";

                                this.closer.style.top = "-1.8vh";

                               this.closer.style.position = "absolute";

                                this.closer.id = this.index + "closer";

                                this.closer.innerHTML = "X";

                                this.headerBox.appendChild(this.closer);

                                //dragElement.bind(this);

                                dragElement(this);

                }

 

                implementType(){

                                console.log("implementType returns null.");

                                return null;

                } //This is where all the specific stuff goes for inherited classes

                  //Doing it this way allows us to do all of it before we add the closer button;

 

                propogateDown(){

                               if (this.downobject!=null){

                               this.downobject.moveBelow();

                               }

                }

 

                moveBelow(z="2"){

                                this.box.style.zIndex=z;

                                //console.log(this.downObject.index);

                                //console.log(this.upObject.index);

                                if (this.downObject!=null)

                                {

                          this.downObject.box.style.top=(parseFloat(this.box.style.top)+this.box.getBoundingClientRect().height)+"px";//-this.upobject.box.getBoundingClientRect().height;

                                        this.downObject.box.style.left=this.box.style.left;

                                        this.propogateDown();

                                }

                }

 

                insertBelow(newdown) {

                    this.downObject=newdown;

        }

               

                insertAbove(upObject){

                                let oldUp=this.upObject;

                                let oldDown=this.downObject;

                                let upObjectParent=this.upObject;

                                let upObjectChild=upObject.downObject;

                                this.upObject=upObject;

                                this.upObject.insertBelow(this);

                                this.box.style.left=upObject.box.style.left;

                                this.upObject.box.style.top=(parseFloat(this.box.style.top)-(this.upObject.box.getBoundingClientRect().height+this.headerBox.getBoundingClientRect().height))+"px";

                                if (parseFloat(this.upObject.box.style.top) < 0) {

                                        this.upObject.box.style.top = 15+"px";

                                        this.upObject.moveBelow();

                                } //Since the top object moves to the bottom object, checks if the top

                                  //object has moved of the screen

                                let topOfStack=this.returnTop()

                                topOfStack.moveBelow();

                                if (upObjectChild != null) {

                                                let thisBottom=this.returnBottom();

                                                upObjectChild.insertAbove(thisBottom);

                                } //If the original parent had any children insert

                                  //them below this stack

                }

               

                returnTop(){

                                if (this.upObject==null) return this;

                                else return this.upObject.returnTop();

                }

 

                returnBottom(){

                                console.log("returning bottom");

                                console.log(this);

                                if (this.downObject==null) return this;

                                else return this.downObject.returnBottom();

                }

 

                removeChild(){

                                this.downobject=null;

                }

 

 

                severTop(){

                                if (this.upObject!=null) this.upObject.removeChild();

                                this.upObject=null;

                }

 

                suicide() {

                                let oldTopObject=this.upobject;

                                let oldDownObject=this.downobject;

                                this.severTop();

                                this.box.remove();

                                objects.delete(this.index);

                                if (oldDownObject!=null) if (oldTopObject!=null) oldDownObject.insertAbove(oldTopObject);

                }

 

}

 

class display extends Object {

                constructor(myindex){

                                super(myindex);

                }

 

                implementType(){

                                this.Header = document.createElement("h2");

                                this.Header.innerHTML = "DISPLAY";

                                this.Header.style.top = "-1.7vh";

                                this.Header.style.left = "14vw";

                                this.Header.id = this.index + "displayheader";

                                this.Header.style.position = "absolute";

                                this.headerBox.appendChild(this.Header);

                                this.textbox = document.createElement("textarea");

                                this.textbox.style.left = 5 + "%";

                                this.textbox.style.height = 65 + "%";

                                this.textbox.style.width = 90 + "%";

                                this.textbox.id = "displaystring";

                                this.box.appendChild(this.textbox);

                                this.box.id = this.index + "display";

                                this.headerBox.id=this.index + "header";

                }

}

 

let displaytest = new display(1);

openTab(null, 'Game Editor');

let objects = new Map();

console.log("---");

function newDisplay()

{

  let myIndex=Index.next().value;

  console.log(myIndex);

  objects.set(myIndex,new display(myIndex));

  document.getElementById('Game Editor').appendChild(objects.get(myIndex).box);

}

function newSub()

{

  let sampledisplay=new my_command("sub");

  objects.set(currentIndex-1,sampledisplay);

  //console.log(sampledisplay);

  document.getElementById('Game Editor').appendChild(sampledisplay.box);

}

function newIf()

{

  let sampledisplay=new my_command("if");

  objects.set(currentIndex-1,sampledisplay);

  document.getElementById('Game Editor').appendChild(sampledisplay.box);

}

document.addEventListener('mouseup',allMouseUp);

 

//new my_command("sub");

 

//WHY DOESN'T THE NAME GO INTO EFFECT UNTIL THE CHILD OBJECT IS APPENDED

function clickcloser() {

console.log("clicked a closer");

}

 

//OnMouseUp doesn't trigger if the mouse is away from the calling object!

 

function releaseMouse(e,callingObject){

   

}

 

 

function clickElement(e,callingObject) {

    let parent=null;

    for (let key of objects.keys()) {

                if (objects.get(key).box.id==callingObject.id){

                                parent=objects.get(key);

                }

    }

    if (e.srcElement.id=="subname"){

        e.srcElement.focus();

    }

    if (e.srcElement.id=="displaystring"){

        e.srcElement.focus();

    }

    if (e.srcElement.id.includes("closer")){

                //Do Nothing

                //console.log("Element Closed");

                //console.log(parent);

        if (parent==null) console.log("ERROR CLOSING NULL PARENT");

                parent.suicide();

    }

    ///HOW DO WE MOVE THE CARROT TO THE TEXT

}

 

//This might mess with the interface of the preview tab

 

function dragElement(movedObject) {

  console.log("dragElement Assignment Being Made");

  console.log(movedObject);

  console.log(movedObject.index);          

  let elmnt=movedObject.headerBox;

  let ref=null;

  //NOTE: figure out why "let" is required for this variable

  //to inherit the

  if (elmnt.id.includes("header")) ref=elmnt.parentElement;

  else ref=elmnt;

  console.log("elmnt");

  console.log(elmnt);

  console.log("ref");

  console.log(ref);

  //NOTE: To handle objects without a header, you would simpl

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    elmnt.onmousedown = dragMouseDown;

    //console.log("plainelement mousedown " + elmnt.id);

 

  function dragMouseDown(e) {

    e = e || window.event;

    e.preventDefault();

    pos3 = e.clientX;

    pos4 = e.clientY;

    for (let key of objects.keys()) {

            objects.get(key).box.style.zIndex="1";

    }

    movedObject.box.style.zIndex="2";

    document.onmouseup = closeDragElement;

    document.onmousemove = elementDrag;

  }

 

  function elementDrag(e) {

    e = e || window.event;

    e.preventDefault();

    // calculate the new cursor position:

    pos1 = pos3 - e.clientX;

    pos2 = pos4 - e.clientY;

    pos3 = e.clientX;

    pos4 = e.clientY;

    let myobj=document.getElementById('tabs');

    //NOTE: Might be better to refer to the actual object instead of this header hack

            //ITERATE TO ALL TOPOBJECTS AND MAKE THE SAME CHANGE

            //ITERATE TO ALL BOTTOMOBJECTS AND MAKE THE SAME CHANGE

            console.log("dragging");

                    //console.log(ref);

                    //How is REF the only variable that stays obsolete!?!?

                    //console.log(elmnt);

                    //console.log(elmnt.parentElement);

                    //console.log(movedObject);

                    //if (elmnt.id.includes("header")) ref=elmnt.parentElement;

            if ((ref.offsetTop - pos2) > 0) {

                ref.style.top = (ref.offsetTop - pos2) + "px";

                movedObject.moveBelow();

            }

            if ((ref.offsetLeft - pos1) > 0) {

                ref.style.left = (ref.offsetLeft - pos1) + "px"; 

                                movedObject.moveBelow();

            }

   }

 

  function closeDragElement(e) {

    /* stop moving when mouse button is released:*/

    document.onmouseup = null;

    document.onmousemove = null;

    if (e.srcElement.id.includes("closer") != true) movedObject.severTop();

    //NOTE: Always sever the top - we just remake it if it's still in position

        let targetArea=ref.getBoundingClientRect();

            for (let key of objects.keys()) {

                if (objects.get(key)!=movedObject) {

                    let checkarea=objects.get(key).box.getBoundingClientRect();

                    if (targetArea.top <= checkarea.bottom-5)

                    if (targetArea.top >= checkarea.bottom-20)

                    if (targetArea.left < checkarea.right)

                    if (targetArea.right > checkarea.left)

                    {

                        console.log("true collision");

                        //console.log(movedObject);

                                                debugger;

                        movedObject.insertAbove(objects.get(key));

                        break; //Fixes bug where we get more than one set to drag around!

                    }

                }

            }

  }

}

 

function allMouseUp(){

 

}

 

let xCoords=null;

let yCoords=null;

 

function showCoords(event) {

  xCoords = event.clientX;

  yCoords = event.clientY;

  //var coor = "X coords: " + x + ", Y coords: " + y;

}

 

function logCoords(){

                console.log("X: " + xCoords);

                console.log("Y: " + yCoords);

}

 

function openTab(evt, tabName) {

  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");

  for (i = 0; i < tabcontent.length; i++) {

    tabcontent[i].style.display = "none";

  }

  tablinks = document.getElementsByClassName("tablinks");

  for (i = 0; i < tablinks.length; i++) {

    tablinks[i].className = tablinks[i].className.replace(" active", "");

  }

  document.getElementById(tabName).style.display = "block";

  if (evt != null) evt.currentTarget.className += " active";

  else document.getElementById('Game Editor').className += " active";

}
