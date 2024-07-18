const events = [{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017"
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018"
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019"
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017"
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018"
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019"
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017"
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018"
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019"
  },
];

buildDropDown();

//Main entry point into our app.
//Load the data from the events constant or local storage.
function buildDropDown(){
    //Grab the dropdown information we want to add city names to.
    let eventDD = document.getElementById("eventDropDown");
    //reset it.
    eventDD.innerHTML ="";

    //Pull the events from the local storage if it exists.
    let currentEvents = JSON.parse(localStorage.getItem("eventData"));
    if(currentEvents == null){
      currentEvents =events;
      localStorage.setItem("eventData", JSON.stringify(currentEvents));
    }

    let statsHeader = document.getElementById("statsHeader");
    statsHeader.innerHTML = "Stats For All Events";

    //Distinct set of city names.
    //let distinctCities = [... new Set(currentEvents.map((e) => e.city))];
    let distinctCities = getDistinctCities(currentEvents);

     let menuItem = `<li><a class="dropdown-item" onclick="getEvents(this)" data-city="All">All</a></li>`;
     eventDD.innerHTML += menuItem;

    for (let index = 0; index < distinctCities.length; index++){
        let menuItem = `<li><a class="dropdown-item" onclick="getEvents(this)" data-city="${distinctCities[index]}">${distinctCities[index]}</a></li>`;
        eventDD.innerHTML += menuItem;
    }

    displayStats(currentEvents);
    displayData(currentEvents);
    

}

function getDistinctCities(currentEvents){

    let distinctCities= [];
    
    for(let index=0; index < currentEvents.length; index++ ){
        let eventObj = currentEvents[index];
        let city = eventObj.city;
        let foundCity = distinctCities.find((dc) => dc == city);
        //Search the array for the current name.
        //if not found add it to the array.
        if(foundCity == undefined){
            distinctCities.push(city);            
        }
    }

    return distinctCities;

}

//Display the stats for the selected city
function displayStats(events){
    let total = 0;
    let average = 0;
    let most = 0;
    let least = events[0].attendance;
    let currentAttendance = 0;
    let averageAttendance = 0;
    //Display the total attendance.
    for(let index=0; index < events.length; index++){
        //Calculate Total 
        currentAttendance = events[index].attendance;
        total += currentAttendance;        
        
        //Calculate Most
        if(currentAttendance > most){
            most = currentAttendance;
        }
        //Calculate Least
        if(currentAttendance < least){
            least = currentAttendance;
        }
    }
    //Calculate Average       
        average = total / events.length;
        average = Math.round(average);

    document.getElementById("total").innerHTML = total.toLocaleString();
    document.getElementById("average").innerHTML = average.toLocaleString();
    document.getElementById("most").innerHTML = most.toLocaleString();
    document.getElementById("least").innerHTML = least.toLocaleString();

}

//get events for a given city
//Get events from the dropdown
function getEvents(element) {
    let selectedCity = element.getAttribute("data-city");
    let filteredEvents = [];

    let statsHeader = document.getElementById("statsHeader");
    statsHeader.innerHTML = `Stats For ${selectedCity} Events`;

    let currentEvents = JSON.parse(localStorage.getItem("eventData")) || events;

    if(selectedCity == `All`){
        filteredEvents = currentEvents
    } else{
    filteredEvents = currentEvents.filter (function (item) {
        if (item.city == selectedCity){
            return item;
            }
        });
    }

    displayStats(filteredEvents);
    displayData(filteredEvents);

}

//Save a new event from the add data form.
function saveEventData(){
  //Grab the current events from the form and then save it.
  let currentEvents = JSON.parse(localStorage.getItem("eventData")) || events;

  let eventObj = {};
  eventObj["event"] = document.getElementById("newEventName").value;
  eventObj["city"] = document.getElementById("newEventCity").value;
  //Get the selected state from the select control (dropdown)
  let stateSelect = document.getElementById("newEventState");
  eventObj["state"] = stateSelect.options[stateSelect.selectedIndex].text;

  eventObj["attendance"] = parseInt(document.getElementById("newEventAttendance").value);

  let eventDate = document.getElementById("newEventDate").value;
  let eventDate2 = `${eventDate} 00:00`;
  eventObj["date"] = new Date(eventDate2).toLocaleDateString();

  currentEvents.push(eventObj);

  //Save the array back to local storage.
  localStorage.setItem("eventData", JSON.stringify(currentEvents));

  buildDropDown();
}

//Display a grid of event data
function displayData(events){
  let template = document.getElementById("eventData-template");
  let eventBody = document.getElementById("eventBody");
  //Clear the table data first.
  eventBody.innerHTML = "";

  //Loop over the events and display them.
  for(let index=0; index < events.length; index ++){
    let curEvent = events[index];

    //Get a document fragment from the template.
    let eventRow = document.importNode(template.content, true);

    //Select the td based on an attribute.
    eventRow.querySelector("[data-event]").textContent = curEvent.event;
    eventRow.querySelector("[data-city]").textContent = curEvent.city;
    eventRow.querySelector("[data-state]").textContent = curEvent.state;
    eventRow.querySelector("[data-attendance]").textContent = curEvent.attendance;
    eventRow.querySelector("[data-date]").textContent = new Date(curEvent.date).toLocaleDateString();

    eventBody.appendChild(eventRow);
  }
}