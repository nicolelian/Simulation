

function updatePatient(patientIndex){
	//patientIndex is an index into the patients data array
	patientIndex = Number(patientIndex); //it seems patientIndex was coming in as a string
	var patient = patients[patientIndex];
	// get the current location of the patient
	var row = patient.location.row;
	var col = patient.location.col;
	var type = patient.type;
	var state = patient.state;


	var hasArrived = (Math.abs(patient.target.row-row)+Math.abs(patient.target.col-col))==0;


switch(state){
	case UNORDERED:
		if(hasArrived){
			patient.timeAdmitted = currentTime;
			statistics[0].count++;

			var currentpax = patients.length

			if( currentpax < 24){
				patient.state = WAITING_1;
				var emptySeat = emptySeats[Math.floor(Math.random()*emptySeats.length)];
				emptySeat.state = OCCUPIED;
				patient.target.row = emptySeat.row;
				patient.target.col = emptySeat.col;

				if(cashier.state==AVAILABLE){
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
				statistics[2].cumulativeValue =(statistics[2].cumulativeValue + 1); // count of rejected patients in percentage terms
			}
		}
		break;

		// when the user is at the cashier, how long do they spend at the cashier?
		case ORDERING:
			// Complete treatment randomly according to the probability of departure
			if (Math.random()< probDeparture){
				patient.state = ORDERED;
				cashier.state = IDLE;
				patient.target.row = receptionistRow;
				patient.target.col = receptionistCol;
			}
		break;

		case ORDERED:
		var emptySeats2 = waitingseats2.filter(function(d){return d.state==EMPTY;});
			// if the customer ordered a drink they will proceed to the waiting area
			if (Math.random()< probchoosedrink){
				patient.state = WAITING_2;
				var emptySeat2 = emptySeats2[Math.floor(Math.random()*emptySeats.length)];
				emptySeat2.state=OCCUPIED;
				patient.target.row = emptySeat2.row;
				patient.target.col = emptySeat2.col;
			}else {

			}


}
