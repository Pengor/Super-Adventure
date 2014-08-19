
var i = 0; // Counter used for naming <div> elements
var currentRoom;
var inventory = new Array();

// Appends the text shown to the user in a new <div>
function appendOut(appendText) {
  i++;
  document.getElementById("output").innerHTML += '<div id="outputAppend' + i + '">' + appendText + '</div>';
}

// Scrolls to bottom of output, clears input box, & returns focus to input box
function prepForInput() {
  window.scrollTo(0, document.body.scrollHeight);
  document.userInputForm.userInput.value = '';
  document.userInputForm.userInput.focus();
  return true;
}

//Changes behavior of the Enter key upon press - triggered in io.html <head>
function stopRKey(evt) {
  var evt  = (evt) ? evt : ((event) ? event : null);
  var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
  if (evt.keyCode == 13) {
    processForm();
    return false;
  }
}

// Contains initial text shown to the user upon page load - triggered in io.html
function firstLoad() {
  appendOut("Hi there, we're in development!");
  currentRoom = dupShop;
}

// Handles user interaction - calls various other functions
function processForm() {
  i++;
  var input = document.userInputForm.userInput.value;
  var listed = '<div id="item' + i + '">-> ' + input + '</div>';
  document.getElementById("output").innerHTML += listed;
  
  // Regular expressions for input recognition
  var helpRegExp=/help/i;
  var lookRegExp=/look/i;
  var goRegExp=/go/i;
  var takeRegExp=/take/i;
  var useRegExp=/use/i;
  var inventRegExp=/inventory/i;
  var examRegExp=/examine/i;
  
  // If/else statements determine which function to call
  if (input === "");
  else if(helpRegExp.test(input))
    helpText();
  else if(lookRegExp.test(input))
    lookText();
  else if(goRegExp.test(input))
    goText(input);
  else if(takeRegExp.test(input))
    takeText(input);
  else if(useRegExp.test(input))
    useText();
  else if(inventRegExp.test(input))
    inventoryText();
  else if(examRegExp.test(input))
    examineText(input);
  else if(ee1RegExp.test(input))
    ee1Text();
  else
    appendOut("I don't understand that command! Try again or type \"help\" to see available commands!");
  
  prepForInput(); // Readies input bar for next use
}

// The text output when the help command is called, lists commands
function helpText() {
  appendOut("Available commands:");
  appendOut("&nbsp;&nbsp;&nbsp;help &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&#62; displays this information");
  appendOut("&nbsp;&nbsp;&nbsp;look &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&#62; inspect your surroundings");
  appendOut("&nbsp;&nbsp;&nbsp;go &#60;direction&#62; -&#62; move north, east, west, south, up, or down");
  appendOut("&nbsp;&nbsp;&nbsp;inventory &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&#62; lists the items you are carrying");
  appendOut("&nbsp;&nbsp;&nbsp;take &#60;item&#62; &nbsp;&nbsp;&nbsp;-&#62; picks up a specified item");
  appendOut("&nbsp;&nbsp;&nbsp;examine &#60;item&#62; -&#62; look at an item in your inventory");
  appendOut("&nbsp;&nbsp;&nbsp;use &#60;item&#62; &nbsp;&nbsp;&nbsp;&nbsp;-&#62; use a specific item with your surroundings");
}

// Handles text output for look command
function lookText() {
  appendOut(currentRoom.desc);
}

// Handles text output for go <direction> command
function goText(input) {
  var direc = input.substring(input.indexOf(" ") + 1, input.length);
  if (direc === "north" || direc === "south" || direc === "east" || direc === "west" || direc === "up" || direc === "down") {
    if (currentRoom.adjacentTo.indexOf(direc) !== -1) {
	  currentRoom = currentRoom.adjacentTo[currentRoom.adjacentTo.indexOf(direc) - 1];
	  appendOut("Welcome to: " + currentRoom.name);
	}
	else
	  appendOut("Kraig doesn't see any connecting rooms in that direction!");
  }
  else
    appendOut("Kraig doesn't recognize that direction!");
}

// Handles text ouput for take <item> command
function takeText(input) {
  var itemToTake = input.substring(input.indexOf(" ") + 1, input.length);
  if (currentRoom.contains.indexOf(itemToTake) !== -1) {
	  inventory.push(currentRoom.contains[currentRoom.contains.indexOf(itemToTake) - 1]);
	  removeItemRoom(itemToTake, currentRoom);
	  appendOut("You've acquired: " + itemToTake);
	}
	else
	  appendOut("Kraig doesn't see that item here!");
}

// Handles text ouput for use <item> command
function useText() {
  appendOut("use ouput placeholder - not yet implemented");
}

// Handles text output for inventory command
function inventoryText() {
  if (inventory.length > 0) {
    appendOut("Kraig is carrying:");
	appendOut(inventory.toString());
  }
  else
    appendOut("Oh no! Kraig's pockets are empty!");
}

// Handles text output for examine <item> command
function examineText(input) {
  var itemToExam = input.substring(input.indexOf(" ") + 1, input.length);
  if (inventory.indexOf(itemToExam) !== -1) {
    appendOut(inventory[inventory.indexOf(itemToExam) - 1].desc);
  }
  else if (currentRoom.contains.indexOf(itemToExam) !== -1) {
    appendOut(currentRoom.contains[currentRoom.contains.indexOf(itemToExam) - 1].desc);
  }
  else
    appendOut("Kraig can't find that item!");
}

// Defintely NOT an easter egg
function ee1Text() {
  appendOut("Normally you WOULD call Travis in a dire situation such as this, but he's on the staff retreat today. Maybe you should check his desk.");
}
  

  

// Room Template object - has a name, a description, adjacent rooms, and items contained within
var RoomObject = function(name, desc) {
  this.name = name;
  this.desc = desc;
  this.adjacentTo = [];
  this.contains = [];
}

RoomObject.prototype.toString = function toString() {
  return this.name
}

// Connects two rooms with specific linkage
function connectRooms(room1, direc1, room2, direc2) {
  room1.adjacentTo.push(room2);
  room1.adjacentTo.push(direc1);
  room2.adjacentTo.push(room1);
  room2.adjacentTo.push(direc2);
}

// Item Template object - has a name, description, and array of rooms usable in.
var ItemObject = function(name, desc) {
  this.name = name;
  this.desc = desc;
  this.usableIn = [];
  this.inInventory = false;
}

ItemObject.prototype.toString = function toString() {
  return this.name
}

// Adds an item to a room
function addItemToRoom(item, room) {
  room.contains.push(item);
  room.contains.push(item.name);
}

// Removes an item from a room
function removeItemRoom(itemName, room) {
  itemIndex = room.contains.indexOf(itemName)
  if (itemIndex !== -1) {
    room.contains.splice(itemIndex - 1, 2);
  }
}

// Adds item usability to a room
function addItemUse(item, room) {
  item.usableIn.push(room);
}

// Rooms
var dupShop = new RoomObject("The Dup Shop", "Oh my, there's a giant hole in the wall! Amy's not going to be happy. Plus Drew's dead! And Josh and Shaun don't look too hot right now either!");
var iTechDesk = new RoomObject("The iTech Desk", "The desk has a lot of drawers and cabinets. You also see a first aid kit, how handy!");
var btwnLibrAdmn = new RoomObject("Between the Library and Admin", "There are some trees and some paths here. I can get to Admin, the Library (via hole in the wall), or Xavier!");
var xavrLobby = new RoomObject("Xavier Lobby", "Just outside XAVR 201, there's a lecture of some sort going on in there, I'd better not go in there right now. Ooh, they put scones out though!");
var iTechOffice = new RoomObject("The iTech Offices", "Nothing seems out of the ordinary, wait...Travis left a note on his desk!");

// Room Connections
connectRooms(dupShop, "east", iTechDesk, "west");
connectRooms(dupShop, "west", btwnLibrAdmn, "east");
connectRooms(btwnLibrAdmn, "south", xavrLobby, "north");
connectRooms(iTechOffice, "south", iTechDesk, "north");

// Items
var travisNote = new ItemObject("note", "The note reads: 'Plans for a panda-proof 2-way audio setup. Requires: SM57, Amp, Monitor, Mixer, 2 XLR cables, 1 Spk-On, 1oz. Plutonium");
var firstAid = new ItemObject("first aid kit", "This has all sorts of neat medical junk in it!");
var scone = new ItemObject("scone", "It's a scone! Made with love by catering. You can practically reach nirvana with one of these.");

// Item placement
addItemToRoom(travisNote, iTechOffice);
addItemToRoom(firstAid, iTechDesk);
addItemToRoom(scone, xavrLobby);


// Item functionality
//TODO

