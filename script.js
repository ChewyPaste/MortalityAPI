'use strict';
console.log('js loaded');


const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"
];

const availYears = [
  2017,
  2016,
  2015,
  2014,
  2013,
  2012,
  2011,
  2010,
  2009,
  2008,
  2007,
  2006,
  2005,
  2004,
  2003,
  2002,
  2001,
  2000,
  1999
];



//api id & key
const appToken = 'Makv8r9sxeet5wMNkZvDCGEl2';

// base api URL & dataset identifier
const baseURL = " https://data.cdc.gov/resource/bi63-dtpu.json?" ;
const dataTopCauses =  "bi63-dtpu";

// console.log(baseURL + "\n");
// console.log(dataTopCauses);
//window.decodeURIComponent()

// $.each(items, function (i, item) {
//   $('#mySelect').append($('<option>', { 
//       value: item.value,
//       text : item.text 
//   }));
// });

function createOptions() {
  for (let i = 0; i < usStates.length; i++) {
    $("#stateSelect").append(new Option(usStates[i], usStates[i]));
  };
  for (let i = 0; i < availYears.length; i++) {
    $("#yearSelect").append(new Option(availYears[i], availYears[i]));
  };
};

// watch button
function watchButton() {
  $("#stateSearchForm").on("submit", event => {
    event.preventDefault();
    // console.log(typeof(selectedState));
    $(".results").empty();
   getMortality();
  });
};

// get data and display
function getMortality() {

  const options = {
    headers: new Headers ({
      "X-App-Token": "Makv8r9sxeet5wMNkZvDCGEl2"
    })
  };


    let selectedState = $("#stateSelect").val();
    const selectedYear = $("#yearSelect").val();

    // function formatParam(param){
    //   return param;
    // }

    // let requestParam = formatParam(selectedState);
    
    fetch(`${baseURL}state=${selectedState}&year=${selectedYear}`, options)
    .then(response => {
    if (response.ok) {
        // console.log( response.json() );
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then( responseJson => {
      displayResults(responseJson, selectedState, selectedYear);
      console.log(responseJson);
    })


};

function displayResults(responseJson, selectedState, selectedYear){
  $(".css-results-wrapper").removeClass("hidden");
  const results = [];
  
  for (let i = 0; i < responseJson.length; i++){
    results.push(responseJson[i]);
  }
  results.sort((a, b) => parseInt(b.deaths) - parseInt(a.deaths));
  //alert(selectedState);
  $(".results").prepend(`
    <h3>In the year ${selectedYear}, there were ${results[0].deaths} deaths in ${selectedState}</h3>
    <p>The leading causes of death were:</p>
  `);

  //console.log(results);
  
  for( let i = 1; i< results.length; i++){
    $(".results").append(`<li>${results[i].cause_name} - ${results[i].deaths}</li>`);
  }
};

$(createOptions);
$(watchButton);