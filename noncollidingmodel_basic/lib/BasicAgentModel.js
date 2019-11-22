//Jake Patch 2 13/11 9am
var WINDOWBORDERSIZE = 10;
var HUGE = 999999; //Sometimes useful when testing for big or small numbers
var animationDelay = 200; //controls simulation and transition speed
var isRunning = false; // used in simStep and toggleSimStep
var surface; // Set in the redrawWindow function. It is the D3 selection of the svg drawing surface
var simTimer; // Set in the initialization function

//The drawing surface will be divided into logical cells
var maxCols = 40;

var cellWidth; //cellWidth is calculated in the redrawWindow function
var cellHeight; //cellHeight is calculated in the redrawWindow function

//You are free to change images to suit your purpose. These images came from icons-land.com.
// The copyright rules for icons-land.com require a backlink on any page where they appear.
// See the credits element on the html page for an example of how to comply with this rule.
const urlPatientA = "images/People-Patient-Female-icon.png";
const urlPatientB = "images/People-Patient-Male-icon.png";

/// ALternative patient types
const urlMario = "images/mario-icon.png";
const urlLuigi = "images/luigi-icon.png";
const urlPrincessPeach = "images/princesspeach-icon.png";
const urlBowser = "images/bowser-icon.png";
const urlToad = "images/toad-icon.png";

var characters = ["mario","luigi","princessPeach","toad","bowser"];
///

const urlDoctor1 = "images/Doctor_Female.png";
const urlDoctor2 = "images/Doctor_Male.png";
const urlReceptionist ="images/door.png"
const urlChair = "images/Chair-icon.png";

////////////////
const table = "images/Table.png";
const drinksdispenser = "images/drink_dispenser.png";
const customers = "images/patient-icon.png"
const door = "images/door.png"
const chair = "images/chair.png";
const pooltable = "images/pooltable.png";

///////////////
//Initializing all the locations for the tables
var tableRow_1 = 5.5;
var tableCol_1 = 10;

var tableRow_2 = 5.5;
var tableCol_2 = 20;

var tableRow_3 = 5.5;
var tableCol_3 = 30;

var tableRow_4 = 10;
var tableCol_4 = 10;

var tableRow_5 = 10;
var tableCol_5 = 20;

var tableRow_6 = 10;
var tableCol_6 = 30;

///////////////

///////////////
//Positioning of the seats (4 seats per table)

var chairRow_1a = 4.5;
var chairCol_1a = 10.5;
var chairRow_1b = 7.5;
var chairCol_1b = 10.5;
var chairRow_1c = 6;
var chairCol_1c = 9;
var chairRow_1d = 6;
var chairCol_1d = 12;

var chairRow_2a = 4.5;
var chairCol_2a = 20.5;
var chairRow_2b = 7.5;
var chairCol_2b = 20.5;
var chairRow_2c = 6;
var chairCol_2c = 19;
var chairRow_2d = 6;
var chairCol_2d = 22;

var chairRow_3a = 4.5;
var chairCol_3a = 30.5;
var chairRow_3b = 7.5;
var chairCol_3b = 30.5;
var chairRow_3c = 6;
var chairCol_3c = 29;
var chairRow_3d = 6;
var chairCol_3d = 32;

var chairRow_4a = 9;
var chairCol_4a = 10.5;
var chairRow_4b = 12;
var chairCol_4b = 10.5;
var chairRow_4c = 10.5;
var chairCol_4c = 9;
var chairRow_4d = 10.5;
var chairCol_4d = 12;

var chairRow_5a = 9;
var chairCol_5a = 20.5;
var chairRow_5b = 12;
var chairCol_5b = 20.5;
var chairRow_5c = 10.5;
var chairCol_5c = 19;
var chairRow_5d = 10.5;
var chairCol_5d = 22;

var chairRow_6a = 9;
var chairCol_6a = 30.5;
var chairRow_6b = 12;
var chairCol_6b = 30.5;
var chairRow_6c = 10.5;
var chairCol_6c = 29;
var chairRow_6d = 10.5;
var chairCol_6d = 32;

///////////////
//Positioning of the Doctor and receptionist
var doctorRow = 17;
var doctorCol = 36;
var receptionistRow = 18;
var receptionistCol = 20;

//////////////
//Positioning of the cashier, entrance, drinks machine
var cashierRow = 17;
var cashierCol = 36;

var doorRow = 18;
var doorCol = 20;

var drinkdispenserRow = 15;
var drinkdispenserCol = 36;

var pooltableRow = 13;
var pooltableCol = 3;

/////////////


//a patient enters the hospital UNTREATED; he or she then is QUEUEING to be treated by a doctor;
// then INTREATMENT with the doctor; then TREATED;
// When the patient is DISCHARGED he or she leaves the clinic immediately at that point.
const UNORDERED=0;
const WAITING=1;
const STAGING=2;
const ORDERING =3;
const ORDERED=4;
const DISCHARGED=5;
const EXITED = 6;

// The doctor can be either BUSY treating a patient, or IDLE, waiting for a patient
const IDLE = 0;
const BUSY = 1;

// There are two types of caregivers in our system: doctors and receptionists
const CASHIER = 0;
const RECEPTIONIST = 1;
const DRINKMACHINE = 2;
const ENTRANCE = 3;

// patients is a dynamic list, initially empty
var patients = [];
// caregivers is a static list, populated with a receptionist and a doctor
var caregivers = [
  {"type":CASHIER,"label":"Cashier Linda","location":{"row":cashierRow,"col":cashierCol},"state":IDLE},
	/////{"type":RECEPTIONIST,"label":"Ca$hier","location":{"row":cashierRow,"col":cashierCol},"state":IDLE},
  {"type":DRINKMACHINE,"label":"Drink dispenser","location":{"row":drinkdispenserRow,"col":drinkdispenserCol},"state":IDLE},
  {"type":RECEPTIONIST,"label":"Entrance","location":{"row":receptionistRow,"col":receptionistCol},"state":IDLE}
];
var cashier = caregivers[0]; // the doctor is the first element of the caregivers list.

// We can section our screen into different areas. In this model, the waiting area and the staging area are separate.
var areas =[
 {"label":"Waiting Area","startRow":17,"numRows":1,"startCol":27,"numCols":8,"color":"pink"},
 {"label":"Staging Area","startRow":cashierRow,"numRows":1,"startCol":cashierCol-1,"numCols":1,"color":"red"},
 {"label":"Drinks Area","startRow":drinkdispenserRow,"numRows":1,"startCol":drinkdispenserCol-5,"numCols":5,"color":"blue"}
]
var waitingRoom = areas[0]; // the waiting room is the first element of the areas array
var waitingdrinks = areas[2];

var currentTime = 0;
var statistics = [
{"name":"Average time spent in CrookedCook, Students: ","location":{"row":16,"col":1},"cumulativeValue":0,"count":0},
{"name":"Average time spent in CrookedCook, Faculty: ","location":{"row":17,"col":1},"cumulativeValue":0,"count":0},
{"name":"Number of Customers missed: ","location":{"row":18,"col":1},"cumulativeValue":0,"count":0}
];

// There are 6 tables
const TABLE1 = 0;
const TABLE2 = 1;
const TABLE3 = 2;
const TABLE4 = 3;
const TABLE5 = 4;
const TABLE6 = 5;
// create all the tables in a list
var tablesIN = [
  {"type":TABLE1,"label":"Table1","location":{"row":tableRow_1,"col":tableCol_1},"state":IDLE},
	{"type":TABLE2,"label":"Table2","location":{"row":tableRow_2,"col":tableCol_2},"state":IDLE},
  {"type":TABLE3,"label":"Table3","location":{"row":tableRow_3,"col":tableCol_3},"state":IDLE},
  {"type":TABLE4,"label":"Table4","location":{"row":tableRow_4,"col":tableCol_4},"state":IDLE},
  {"type":TABLE5,"label":"Table5","location":{"row":tableRow_5,"col":tableCol_5},"state":IDLE},
  {"type":TABLE6,"label":"Table6","location":{"row":tableRow_6,"col":tableCol_6},"state":IDLE},
];

var Table1 = tablesIN[0]; //the first table is the first thing in the table list
var Table2 = tablesIN[1];
var Table3 = tablesIN[2];
var Table4 = tablesIN[3];
var Table5 = tablesIN[4];
var Table6 = tablesIN[5];

// There are 6 x 4 = 24 chairs
const CHAIR1a = 0;
const CHAIR1b = 1;
const CHAIR1c = 2;
const CHAIR1d = 3;
const CHAIR2a = 4;
const CHAIR2b = 5;
const CHAIR2c = 6;
const CHAIR2d = 7;
const CHAIR3a = 8;
const CHAIR3b = 9;
const CHAIR3c = 10;
const CHAIR3d = 11;
const CHAIR4a = 12;
const CHAIR4b = 13;
const CHAIR4c = 14;
const CHAIR4d = 15;
const CHAIR5a = 16;
const CHAIR5b = 17;
const CHAIR5c = 18;
const CHAIR5d = 19;
const CHAIR6a = 20;
const CHAIR6b = 21;
const CHAIR6c = 22;
const CHAIR6d = 23;

//Creating a list for all the chairs
var chairsIN = [
  {"type":CHAIR1a,"label":"Chair1a","location":{"row":chairRow_1a,"col":chairCol_1a},"state":IDLE},
  {"type":CHAIR1b,"label":"Chair1b","location":{"row":chairRow_1b,"col":chairCol_1b},"state":IDLE},
  {"type":CHAIR1c,"label":"Chair1c","location":{"row":chairRow_1c,"col":chairCol_1c},"state":IDLE},
  {"type":CHAIR1d,"label":"Chair1d","location":{"row":chairRow_1d,"col":chairCol_1d},"state":IDLE},
  {"type":CHAIR2a,"label":"Chair2a","location":{"row":chairRow_2a,"col":chairCol_2a},"state":IDLE},
  {"type":CHAIR2b,"label":"Chair2b","location":{"row":chairRow_2b,"col":chairCol_2b},"state":IDLE},
  {"type":CHAIR2c,"label":"Chair2c","location":{"row":chairRow_2c,"col":chairCol_2c},"state":IDLE},
  {"type":CHAIR2d,"label":"Chair2d","location":{"row":chairRow_2d,"col":chairCol_2d},"state":IDLE},
  {"type":CHAIR3a,"label":"Chair3a","location":{"row":chairRow_3a,"col":chairCol_3a},"state":IDLE},
  {"type":CHAIR3b,"label":"Chair3b","location":{"row":chairRow_3b,"col":chairCol_3b},"state":IDLE},
  {"type":CHAIR3c,"label":"Chair3c","location":{"row":chairRow_3c,"col":chairCol_3c},"state":IDLE},
  {"type":CHAIR3d,"label":"Chair3d","location":{"row":chairRow_3d,"col":chairCol_3d},"state":IDLE},
  {"type":CHAIR4a,"label":"Chair4a","location":{"row":chairRow_4a,"col":chairCol_4a},"state":IDLE},
  {"type":CHAIR4b,"label":"Chair4b","location":{"row":chairRow_4b,"col":chairCol_4b},"state":IDLE},
  {"type":CHAIR4c,"label":"Chair4c","location":{"row":chairRow_4c,"col":chairCol_4c},"state":IDLE},
  {"type":CHAIR4d,"label":"Chair4d","location":{"row":chairRow_4d,"col":chairCol_4d},"state":IDLE},
  {"type":CHAIR5a,"label":"Chair5a","location":{"row":chairRow_5a,"col":chairCol_5a},"state":IDLE},
  {"type":CHAIR5b,"label":"Chair5b","location":{"row":chairRow_5b,"col":chairCol_5b},"state":IDLE},
  {"type":CHAIR5c,"label":"Chair5c","location":{"row":chairRow_5c,"col":chairCol_5c},"state":IDLE},
  {"type":CHAIR5d,"label":"Chair5d","location":{"row":chairRow_5d,"col":chairCol_5d},"state":IDLE},
  {"type":CHAIR6a,"label":"Chair6a","location":{"row":chairRow_6a,"col":chairCol_6a},"state":IDLE},
  {"type":CHAIR6b,"label":"Chair6b","location":{"row":chairRow_6b,"col":chairCol_6b},"state":IDLE},
  {"type":CHAIR6c,"label":"Chair6c","location":{"row":chairRow_6c,"col":chairCol_6c},"state":IDLE},
  {"type":CHAIR6d,"label":"Chair6d","location":{"row":chairRow_6d,"col":chairCol_6d},"state":IDLE},
];

var Chair1a = chairsIN[0]; //Add in all the other chairs
var Chair1b = chairsIN[1];

// The probability of a patient arrival needs to be less than the probability of a departure, else an infinite queue will build.
// You also need to allow travel time for patients to move from their seat in the waiting room to get close to the doctor.
// So don't set probDeparture too close to probArrival.

//probability that a customer arrives at our restaurant
var probArrival = 0.5;
var probDeparture = 0.1;
var probchoosedrink = 0.4
var probDrinkDeparture = 0.7;

// We can have different types of patients (A and B) according to a probability, probTypeA.
// This version of the simulation makes no difference between A and B patients except for the display image
// Later assignments can build on this basic structure.
var probTypeA = 1.0;

// To manage the queues, we need to keep track of patientIDs.
var nextPatientID_A = 0; // increment this and assign it to the next admitted patient of type A
var nextPatientID_B = 0; // increment this and assign it to the next admitted patient of type B
var nextTreatedPatientID_A =1; //this is the id of the next patient of type A to be treated by the doctor
var nextTreatedPatientID_B =1; //this is the id of the next patient of type B to be treated by the doctor


// declarations of waiting room
var EMPTY = 0;
var OCCUPIED = 1;



var seatCount = 8;
var seatCount2 = 8;
//////////////////////////////////

var tableseatcount = 24;

///////////////////////////////////

// This next function is executed when the script is loaded. It contains the page initialization code.
(function() {
	// Your page initialization code goes here
	// All elements of the DOM will be available here
	window.addEventListener("resize", redrawWindow); //Redraw whenever the window is resized
	simTimer = window.setInterval(simStep, animationDelay); // call the function simStep every animationDelay milliseconds
	document.getElementById("title").textContent = "Crooked Cooks Simulation";
	redrawWindow();
})();

// We need a function to start and pause the the simulation.
function toggleSimStep(){
	//this function is called by a click event on the html page.
	// Search BasicAgentModel.html to find where it is called.
	isRunning = !isRunning;
	console.log("isRunning: "+isRunning);
}

function redrawWindow(){
	isRunning = false; // used by simStep
	window.clearInterval(simTimer); // clear the Timer
	animationDelay = 550 - document.getElementById("slider1").value;
	simTimer = window.setInterval(simStep, animationDelay); // call the function simStep every animationDelay milliseconds

	// Re-initialize simulation variables

	nextPatientID_A = 0; // increment this and assign it to the next entering patient of type A
	nextPatientID_B = 0; // increment this and assign it to the next entering patient of type B
	nextTreatedPatientID_A =1; //this is the id of the next patient of type A to be treated by the doctor
	nextTreatedPatientID_B =1; //this is the id of the next patient of type B to be treated by the doctor
	currentTime = 0;
	cashier.state=IDLE;
	statistics[0].cumulativeValue=0;
	statistics[0].count=0;
	statistics[1].cumulativeValue=0;
	statistics[1].count=0;
	statistics[2].cumulativeValue=0;
	statistics[2].count=0;
	patients = [];


	//resize the drawing surface; remove all its contents;
	var drawsurface = document.getElementById("surface");
	var creditselement = document.getElementById("credits");
	var w = window.innerWidth;
	var h = window.innerHeight;
	var surfaceWidth =(w - 3*WINDOWBORDERSIZE);
	var surfaceHeight= (h-creditselement.offsetHeight - 3*WINDOWBORDERSIZE);


	drawsurface.style.width = surfaceWidth+"px";
	drawsurface.style.height = surfaceHeight+"px";
	drawsurface.style.left = WINDOWBORDERSIZE/2+'px';
	drawsurface.style.top = WINDOWBORDERSIZE/2+'px';
	drawsurface.style.border = "thick solid #0000FF"; //The border is mainly for debugging; okay to remove it
	drawsurface.innerHTML = ''; //This empties the contents of the drawing surface, like jQuery erase().

	// Compute the cellWidth and cellHeight, given the size of the drawing surface
	numCols = maxCols;
	cellWidth = surfaceWidth/numCols;
	numRows = Math.ceil(surfaceHeight/cellWidth);
	cellHeight = surfaceHeight/numRows;

  ////for Cashier

	waitingSeats1 = []
	waitingSeats1 = Array.apply(null,{length:seatCount}).map(Function.call,Number);
	//Now use the map function to replace each element of waitingSeats with an object identifying the row, column and state of the seat
	waitingSeats1 = waitingSeats1.map(function(d,i){var state = EMPTY;
		var row = waitingRoom.startRow+Math.floor(i/waitingRoom.numCols);
		var col = waitingRoom.startCol + i - (row-waitingRoom.startRow)*waitingRoom.numCols;
		return {"row":row, "col":col,"state":state};
	});

  ///for drinks

  waitingseats2 = []
  waitingseats2 = Array.apply(null,{length:seatCount2}).map(Function.call,Number);
  waitingSeats1 = waitingSeats1.map(function(d,i){var state = EMPTY;
		var row = waitingdrinks.startRow+Math.floor(i/waitingdrinks.numCols);
		var col = waitingdrinks.startCol + i - (row-waitingdrinks.startRow)*waitingdrinks.numCols;
		return {"row":row, "col":col,"state":state};
  });

  //////////////////////////////
  //////////////////////////////

  //building a function that is supposed to assign a random seat to a customer upon entering.
  tableSeats = []
	tableSeats = Array.apply(null,{length:tableseatcount}).map(Function.call,Number);
	tableSeats = chairsIN.map(function(d,i){var state = EMPTY;
		var row = function(d){var cell= getLocationCell(d.location);return cell.x;}
    var col = function(d){var cell= getLocationCell(d.location);return cell.y;}
		return {"row":row, "col":col,"state":state};
	});
  //////////////////////////////
  //////////////////////////////


	// In other functions we will access the drawing surface using the d3 library.
	//Here we set the global variable, surface, equal to the d3 selection of the drawing surface
	surface = d3.select('#surface');
	surface.selectAll('*').remove(); // we added this because setting the inner html to blank may not remove all svg elements
	surface.style("font-size","100%");
	// rebuild contents of the drawing surface
	updateSurface();
};

// The window is resizable, so we need to translate row and column coordinates into screen coordinates x and y
function getLocationCell(location){
	var row = location.row;
	var col = location.col;
	var x = (col-1)*cellWidth; //cellWidth is set in the redrawWindow function
	var y = (row-1)*cellHeight; //cellHeight is set in the redrawWindow function
	return {"x":x,"y":y};
}

function updateSurface(){
	// This function is used to create or update most of the svg elements on the drawing surface.
	// See the function removeDynamicAgents() for how we remove svg elements

	//Select all svg elements of class "patient" and map it to the data list called patients
	var allpatients = surface.selectAll(".patient").data(patients);

	// If the list of svg elements is longer than the data list, the excess elements are in the .exit() list
	// Excess elements need to be removed:
	allpatients.exit().remove(); //remove all svg elements associated with entries that are no longer in the data list
	// (This remove function is needed when we resize the window and re-initialize the patients array)

	// If the list of svg elements is shorter than the data list, the new elements are in the .enter() list.
	// The first time this is called, all the elements of data will be in the .enter() list.
	// Create an svg group ("g") for each new entry in the data list; give it class "patient"
	var newpatients = allpatients.enter().append("g").attr("class","patient");
	//Append an image element to each new patient svg group, position it according to the location data, and size it to fill a cell
	// Also note that we can choose a different image to represent the patient based on the patient type
	newpatients.append("svg:image")
	 .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
	 .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
	 .attr("width", Math.min(cellWidth,cellHeight)+"px")
	 .attr("height", Math.min(cellWidth,cellHeight)+"px")
	 .attr("xlink:href",function(d){if (d.character=="mario") return urlMario; else if (d.character == "luigi") return urlLuigi; else if (d.character == 'bowser') return urlBowser; else if (d.character == 'toad') return urlToad; else return urlPrincessPeach });

	// For the existing patients, we want to update their location on the screen
	// but we would like to do it with a smooth transition from their previous position.
	// D3 provides a very nice transition function allowing us to animate transformations of our svg elements.

	//First, we select the image elements in the allpatients list
	var images = allpatients.selectAll("image");
	// Next we define a transition for each of these image elements.
	// Note that we only need to update the attributes of the image element which change
	images.transition()
	 .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
	 .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
	 .duration(animationDelay).ease('linear'); // This specifies the speed and type of transition we want.

	// Patients will leave the clinic when they have been discharged.
	// That will be handled by a different function: removeDynamicAgents

	//Select all svg elements of class "caregiver" and map it to the data list called caregivers
	var allcaregivers = surface.selectAll(".caregiver").data(caregivers);
	//This is not a dynamic class of agents so we only need to set the svg elements for the entering data elements.
	// We don't need to worry about updating these agents or removing them
	// Create an svg group ("g") for each new entry in the data list; give it class "caregiver"
	var newcaregivers = allcaregivers.enter().append("g").attr("class","caregiver");
	newcaregivers.append("svg:image")
	 .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
	 .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
	 .attr("width", Math.min(cellWidth,cellHeight)+"px")
	 .attr("height", Math.min(cellWidth,cellHeight)+"px")
	 .attr("xlink:href",function(d){if (d.type==CASHIER) return urlDoctor1; if (d.type==DRINKMACHINE) return drinksdispenser; if (d.type == ENTRANCE) return door; else return urlReceptionist;});

	// It would be nice to label the caregivers, so we add a text element to each new caregiver group
	newcaregivers.append("text")
    .attr("x", function(d) { var cell= getLocationCell(d.location); return (cell.x+cellWidth)+"px"; })
    .attr("y", function(d) { var cell= getLocationCell(d.location); return (cell.y+cellHeight/2)+"px"; })
    .attr("dy", ".35em")
    .text(function(d) { return d.label; });

	// The simulation should serve some purpose
	// so we will compute and display the average length of stay of each patient type.
	// We created the array "statistics" for this purpose.
	// Here we will create a group for each element of the statistics array (two elements)
	var allstatistics = surface.selectAll(".statistics").data(statistics);
	var newstatistics = allstatistics.enter().append("g").attr("class","statistics");
	// For each new statistic group created we append a text label
	newstatistics.append("text")
	.attr("x", function(d) { var cell= getLocationCell(d.location); return (cell.x+cellWidth)+"px"; })
    .attr("y", function(d) { var cell= getLocationCell(d.location); return (cell.y+cellHeight/2)+"px"; })
    .attr("dy", ".35em")
    .text("");

	// The data in the statistics array are always being updated.
	// So, here we update the text in the labels with the updated information.
	allstatistics.selectAll("text").text(function(d) {
		var avgLengthOfStay = d.cumulativeValue/(Math.max(1,d.count)); // cumulativeValue and count for each statistic are always changing
		return d.name+avgLengthOfStay.toFixed(1); }); //The toFixed() function sets the number of decimal places to display

	// Finally, we would like to draw boxes around the different areas of our system. We can use d3 to do that too.
	var allareas = surface.selectAll(".areas").data(areas);
	var newareas = allareas.enter().append("g").attr("class","areas");
	// For each new area, append a rectangle to the group
	newareas.append("rect")
	.attr("x", function(d){return (d.startCol-1)*cellWidth;})
	.attr("y",  function(d){return (d.startRow-1)*cellHeight;})
	.attr("width",  function(d){return d.numCols*cellWidth;})
	.attr("height",  function(d){return d.numRows*cellWidth;})
	.style("fill", function(d) { return d.color; })
	.style("stroke","black")
	.style("stroke-width",1);

	//For this simulation we will display an empty seat for each cell in the waiting area
	var allseats = surface.selectAll(".seats").data(waitingSeats1);
	var newseats = allseats.enter().append("g").attr("class","seats");
	//For each new seat, append a chair image
	newseats.append("svg:image")
	.attr("x",function(d){var cell = getLocationCell(d); return cell.x+"px"})
	.attr("y",function(d){var cell = getLocationCell(d); return cell.y+"px"})
	.attr("width",Math.min(cellWidth,cellHeight)+"px")
	.attr("height",Math.min(cellWidth,cellHeight)+"px")
	.attr("xlink:href",urlChair);

  //////////////  Tables
	var alltables = surface.selectAll(".tables").data(tablesIN);
 	//This is not a dynamic class of agents so we only need to set the svg elements for the entering data elements.
 	// We don't need to worry about updating these agents or removing them
 	// Create an svg group ("g") for each new entry in the data list; give it class "caregiver"
 	var newtables = alltables.enter().append("g").attr("class","tables");

 	newtables.append("svg:image")
 	 .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
 	 .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
 	 .attr("width", Math.min(cellWidth*2,cellHeight*2)+"px")
 	 .attr("height", Math.min(cellWidth*2,cellHeight*2)+"px")
 	 .attr("xlink:href",function(d){return table});

   ////////////// Chairs
  var allchairs = surface.selectAll(".chairs").data(chairsIN);
 	var newchairs = allchairs.enter().append("g").attr("class","chairs");

 	newchairs.append("svg:image")
 	 .attr("x",function(d){var cell= getLocationCell(d.location); return cell.x+"px";})
 	 .attr("y",function(d){var cell= getLocationCell(d.location); return cell.y+"px";})
 	 .attr("width", Math.min(cellWidth,cellHeight)+"px")
 	 .attr("height", Math.min(cellWidth,cellHeight)+"px")
 	 .attr("xlink:href",chair);

}


function addDynamicAgents(){
	// Patients are dynamic agents: they enter the clinic, wait, get treated, and then leave
	// We have entering patients of two types "A" and "B"
	// We could specify their probabilities of arrival in any simulation step separately
	// Or we could specify a probability of arrival of all patients and then specify the probability of a Type A arrival.
	// We have done the latter. probArrival is probability of arrival a patient and probTypeA is the probability of a type A patient who arrives.
	// First see if a patient arrives in this sim step.
	if (Math.random()< probArrival){
		var newpatient = {"id":1,"type":"A","location":{"row":25,"col":20}, "character":"mario",
		"target":{"row":doorRow,"col":doorCol},"state":UNORDERED,"timeAdmitted":0};
		if (Math.random()<probTypeA) newpatient.type = "A";
		else newpatient.type = "B";

    var characterNum = Math.floor(Math.random() * characters.length);
		newpatient.character = characters[characterNum];

		patients.push(newpatient);
	}

}

function updatePatient(patientIndex){
	//patientIndex is an index into the patients data array
	patientIndex = Number(patientIndex); //it seems patientIndex was coming in as a string
	var patient = patients[patientIndex];
	// get the current location of the patient
	var row = patient.location.row;
	var col = patient.location.col;
	var type = patient.type;
	var state = patient.state;


	// determine if patient has arrived at destination
	var hasArrived = (Math.abs(patient.target.row-row)+Math.abs(patient.target.col-col))==0;

	// Behavior of patient depends on his or her state
	switch(state){
		case UNORDERED:
			if (hasArrived){
				patient.timeAdmitted = currentTime;
				statistics[0].count++; // number of patients who have arrived at receptionist

        var currentpax = patients.length
        var emptySeats = waitingSeats1.filter(function(d){return d.state==EMPTY;});

        if (currentpax < tableseatcount){
          patient.state = WAITING;
          var emptySeat = emptySeats[Math.floor(Math.random()*emptySeats.length)];
  				emptySeat.state = OCCUPIED;
  				patient.target.row = emptySeat.row;
  				patient.target.col = emptySeat.col;

          if(cashier.state==IDLE){
  					patient.state = ORDERING;
  					cashier.state = BUSY;
  					//right after the pink box right infront of linda
  					//moves to the staging area
  					patient.target.row = cashierRow
  					patient.target.col = cashierCol-1
  				}
  			}else {
  				patient.state = DISCHARGED;
  				patient.target.row = 20;
  				patient.target.col = 17;
  				statistics[2].cumulativeValue =(statistics[2].cumulativeValue + 1);
        }
  			//if (emptySeats.length>0){
  				//There is at least one empty seat
  				//patient.state = WAITING;
  				//var emptySeat = emptySeats[Math.floor(Math.random()*emptySeats.length)];
  				//emptySeat.state=OCCUPIED;
  				//patient.target.row = emptySeat.row;
  				//patient.target.col = emptySeat.col;
  				// receptionist assigns a sequence number to each admitted patient to govern order of treatment
  				//if (patient.type=="A") patient.id = ++nextPatientID_A;
  				//else patient.id = ++nextPatientID_B;
  			//} else {
  				// There are no empty seats. We must reject this patient.
  				//patient.state = DISCHARGED;
  				//patient.target.row = 20;
  				//patient.target.col = 17;
  				//statistics[2].cumulativeValue =(statistics[2].cumulativeValue + 1); // count of rejected patients in percentage terms
			}
		break;

		case WAITING:
			var emptySeatRow = 0;
			var emptySeatCol = 0;
			switch (type){

				case "A":
					if (patient.id == nextTreatedPatientID_A){
						emptySeatRow = patient.target.row
						emptySeatCol = patient.target.col
						patient.target.row = doctorRow;
						patient.target.col = doctorCol-1;
						patient.state = STAGING;
					}
					if (patient.id == nextTreatedPatientID_A+1){
						emptySeatRow = patient.target.row
						emptySeatCol = patient.target.col
						patient.target.row = doctorRow;
						patient.target.col = doctorCol-2;
					}
				break;
				case "B":
					if (patient.id == nextTreatedPatientID_B){
						emptySeatRow = patient.target.row
						emptySeatCol = patient.target.col
						patient.target.row = doctorRow;
						patient.target.col = doctorCol-1;
						patient.state = STAGING;
					}
					if (patient.id == nextTreatedPatientID_B+1){
						emptySeatRow = patient.target.row
						emptySeatCol = patient.target.col
						patient.target.row = doctorRow;
						patient.target.col = doctorCol-2;
					}
				break;
				}
				//create
				var newEmptySeat = waitingSeats1.filter(function(d){return d.row == emptySeatRow && d.col == emptySeatCol})
				if (newEmptySeat.length >0) newEmptySeat[0].state = EMPTY;

		break;
		case STAGING:
			// Queueing behavior depends on the patient priority
			// For this model we will give access to the doctor on a first come, first served basis
			if (hasArrived){
				//The patient is staged right next to the doctor
				if (cashier.state == IDLE){
					// the doctor is IDLE so this patient is the first to get access
					cashier.state = BUSY;
					patient.state = ORDERING;
					patient.target.row = cashierRow;
					patient.target.col = cashierCol;
					if (patient.type == "A") nextTreatedPatientID_A++; else nextTreatedPatientID_B++;
				}
			}
		break;
		case ORDERING:
			// Complete treatment randomly according to the probability of departure
			if (Math.random()< probDeparture){
				patient.state = ORDERED;
				cashier.state = IDLE;

        var availableseats = chairsIN.filter(function(d){return d.state==IDLE});
				var chairNum = Math.floor(Math.random() * availableseats.length);

        patient.target.row = availableseats[chairNum].location.row;
				patient.target.col = availableseats[chairNum].location.col;

        var chairType = availableseats[chairNum].type;
        chairsIN[chairType].state = BUSY;
				patient.seatNum = chairType;
			}
		break;

		case ORDERED:
			if (hasArrived){
				patient.state = DISCHARGED;
				patient.target.row = 18;
				patient.target.col = 20;
				// compute statistics for discharged patient
				var timeInClinic = currentTime - patient.timeAdmitted;
				var stats;
				if (patient.type=="A"){
					stats = statistics[0];
				}else{
					stats = statistics[1];
				}
				stats.cumulativeValue = stats.cumulativeValue+timeInClinic;
				stats.count = stats.count + 1;
			}
		break;
		case DISCHARGED:
			if (hasArrived){
				patient.state = EXITED;
			}
		break;
		default:
		break;
	}
	// set the destination row and column
	var targetRow = patient.target.row;
	var targetCol = patient.target.col;
	// compute the distance to the target destination
	var rowsToGo = targetRow - row;
	var colsToGo = targetCol - col;
	// set the speed
	var cellsPerStep = 1;
	// compute the cell to move to
	var newRow = row + Math.min(Math.abs(rowsToGo),cellsPerStep)*Math.sign(rowsToGo);
	var newCol = col + Math.min(Math.abs(colsToGo),cellsPerStep)*Math.sign(colsToGo);
	// update the location of the patient
	patient.location.row = newRow;
	patient.location.col = newCol;

}

function removeDynamicAgents(){
	// We need to remove patients who have been discharged.
	//Select all svg elements of class "patient" and map it to the data list called patients
	var allpatients = surface.selectAll(".patient").data(patients);
	//Select all the svg groups of class "patient" whose state is EXITED
	var treatedpatients = allpatients.filter(function(d,i){return d.state==EXITED;});
	// Remove the svg groups of EXITED patients: they will disappear from the screen at this point
	treatedpatients.remove();

	// Remove the EXITED patients from the patients list using a filter command
	patients = patients.filter(function(d){return d.state!=EXITED;});
	// At this point the patients list should match the images on the screen one for one
	// and no patients should have state EXITED
}


function updateDynamicAgents(){
	// loop over all the agents and update their states
	for (var patientIndex in patients){
		updatePatient(patientIndex);
	}
	updateSurface();
}

function simStep(){
	//This function is called by a timer; if running, it executes one simulation step
	//The timing interval is set in the page initialization function near the top of this file
	if (isRunning){ //the isRunning variable is toggled by toggleSimStep
		// Increment current time (for computing statistics)
		currentTime++;
		// Sometimes new agents will be created in the following function
		addDynamicAgents();
		// In the next function we update each agent
		updateDynamicAgents();
		// Sometimes agents will be removed in the following function
		removeDynamicAgents();
	}
}
