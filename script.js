'use strict';
console.log('js loaded');

var usStates =[
  ['Alabama', 'AL'],
  ['Alaska', 'AK'],
  ['Arizona', 'AZ'],
  ['Arkansas', 'AR'],
  ['California', 'CA'],
  ['Colorado', 'CO'],
  ['Connecticut', 'CT'],
  ['Delaware', 'DE'],
  ['District of Columbia', 'DC'],
  ['Florida', 'FL'],
  ['Georgia', 'GA'],
  ['Hawaii', 'HI'],
  ['Idaho', 'ID'],
  ['Illinois', 'IL'],
  ['Indiana', 'IN'],
  ['Iowa', 'IA'],
  ['Kansas', 'KS'],
  ['Kentucky', 'KY'],
  ['Louisiana', 'LA'],
  ['Maine', 'ME'],
  ['Maryland', 'MD'],
  ['Massachusetts', 'MA'],
  ['Michigan', 'MI'],
  ['Minnesota', 'MN'],
  ['Mississippi', 'MS'],
  ['Missouri', 'MO'],
  ['Montana', 'MT'],
  ['Nebraska', 'NE'],
  ['Nevada', 'NV'],
  ['New Hampshire', 'NH'],
  ['New Jersey', 'NJ'],
  ['New Mexico', 'NM'],
  ['New York', 'NY'],
  ['North Carolina', 'NC'],
  ['North Dakota', 'ND'],
  ['Ohio', 'OH'],
  ['Oklahoma', 'OK'],
  ['Oregon', 'OR'],
  ['Pennsylvania', 'PA'],
  ['Rhode Island', 'RI'],
  ['South Carolina', 'SC'],
  ['South Dakota', 'SD'],
  ['Tennessee', 'TN'],
  ['Texas', 'TX'],
  ['Utah', 'UT'],
  ['Vermont', 'VT'],
  ['Virginia', 'VA'],
  ['Washington', 'WA'],
  ['West Virginia', 'WV'],
  ['Wisconsin', 'WI'],
  ['Wyoming', 'WY'],
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

$(createOptions);
$(watchButton);

// const appToken = 'Makv8r9sxeet5wMNkZvDCGEl2';
// const baseURL = " https://data.cdc.gov/resource/bi63-dtpu.json?" ;
// const dataTopCauses =  "bi63-dtpu";

function createOptions() {
  for (let i = 0; i < usStates.length; i++) {
    $("#stateSelect").append(new Option(usStates[i][0], usStates[i][0]));
  };
  for (let i = 0; i < availYears.length; i++) {
    $("#yearSelect").append(new Option(availYears[i], availYears[i]));
  };
  //defaults
  $("#stateSelect").val("New York");
  $("#yearSelect").val(2017);
};


function watchButton() {
  $("#stateSearchForm").on("submit", event => {
    event.preventDefault();
    $(".results").empty();
   getMortality();
   //fetchCovid($("#stateSelect").val());
  });
};



const appToken = 'Makv8r9sxeet5wMNkZvDCGEl2';
const cdcBaseURL= " https://data.cdc.gov/resource/bi63-dtpu.json?" ;
const dataTopCauses =  "bi63-dtpu";
const covidBaseURL = "https://covidtracking.com/api/v1/states/";


function getMortality() {
  let selectedState = $("#stateSelect").val();
  let selectedYear = $("#yearSelect").val();
  const options = {
    headers: new Headers ({
      "X-App-Token": "Makv8r9sxeet5wMNkZvDCGEl2"
    })
  };

  //cdc fetch
  async function resultsTopDeaths(){
  let response = await fetch(`${cdcBaseURL}state=${selectedState}&year=${selectedYear}`, options);
  let responseJson = await response.json();
  //displayResults(responseJson,selectedState,selectedYear);
  return responseJson;
//  console.log(responseJson);
  
  }

  //displayResults(resultsTopDeaths(),selectedState,selectedYear);
  //covid fetch
  let abbr = getAbbr(selectedState);

  async function resultsCovid(){
    let response = await fetch(covidBaseURL + abbr + "/current.json" );
    let responseJson = await response.json();
    let covidDeaths = await responseJson.death;
    return covidDeaths;
  }

  async function displayCovidJson(){
    let result = await resultsCovid();
    return result;
  }

  Promise.all([resultsTopDeaths(),resultsCovid()])
  .then(response => {
    let holder = [];
    response.map(element => holder.push(element))
    console.log(holder);
    //return holder;
    displayResults(holder,selectedState,selectedYear);
  })
    //displayResults(responseJson,selectedState,selectedYear);



}
//console.log(displayCovidJson());
  //console.log(resultsCovid());
  // Promise.all([resultsTopDeaths(),resultsCovid()])
  // .then( files =>{
  //   //files.forEach(file=>{
  //     for(let i = 0; i< files.length; i++){
  //       console.log(files[i]);
  //     }
  //     //ProcessingInstruction( file.json() );
  //     //  })
  // })
  

function displayResults(responseJson, selectedState, selectedYear){
  //console.log(responseJson + ":inside displayresults function");
  const results = [];
  $(".css-results-wrapper").removeClass("hidden");
  for (let i = 0; i < responseJson[0].length; i++){
    console.log(i);
    
    //console.log(responseJson[0][i])
    results.push(responseJson[0][i]);
  };
  //console.log(results[1]);
  
  results.sort((a, b) => parseInt(b.deaths) - parseInt(a.deaths)).push(responseJson[1]);
  //console.log(results);
  $(".results").prepend(`
  <h3>In the year ${selectedYear}, there were ${Number(results[0].deaths).toLocaleString()} deaths in ${selectedState}; and just as a morbid comparison, so far, ${results[11].toLocaleString()} people have died to COVID-19 in this state</h3>
  <p>The leading causes of death were:</p>
  `);
  //console.log(results);
  for( let i = 1; i< results.length-1; i++){
    $(".results").append(`<li>${results[i].cause_name} - ${Number(results[i].deaths).toLocaleString()}</li>`);
  }
  // //console.log(results + "::inside displayresults::");
  
  //return results;
  //console.log(results);
  createChart(results);
};

function createChart(data){
  let selectedState = $("#stateSelect").val();
  let selectedYear = $("#yearSelect").val();
  let xChartData = [];
  let yChartData = [];
  //let covidData = fetchCovid(selectedState);
  for( let i = 1; i< data.length-1; i++){
    //console.log(data[i].cause_name);
    xChartData.push(data[i].cause_name);
    yChartData.push(data[i].deaths);
  }
  xChartData.push("COVID-19");
  yChartData.push(data[data.length-1]);
  //console.log(covidData);
  console.log(xChartData + "::xchartdata::\n" + yChartData + "::ychartdata::");
  chartWrapper(xChartData,yChartData,selectedState,selectedYear);
}

// function fetchCovid(selectedState){
//   let result= [];
//   let abbr = getAbbr(selectedState);
//   const baseURL = "https://covidtracking.com/api/v1/states/";
//   return fetch(baseURL + abbr + "/current.json" )
//   .then(response => response.json())
//   .then(responseJson => { 
//     //(Promise.resolve(responseJson.death));
//     responseJson.death;
//   });
//   //return result;
//   //console.log(jsonData);
//   //.then(responseJson => result.push((responseJson.death)));
// // .then(response => response.json());
// }


// async function fetchCovid(selectedState){

//   let abbr = getAbbr(selectedState);
//   const baseURL = "https://covidtracking.com/api/v1/states/";
//   let results = await fetch(baseURL + abbr + "/current.json" )
//      .then(response => response.json()).then(function giveResult(responseJson){
//        return responseJson
//      })
//     //  .then(responseJson => { 
//     //   //Promise.resolve(555);
//     //   return responseJson.death;
//     // })
//     .catch(err => console.error);
//     console.log(results);
    
//   //return results;
// }


function getAbbr(state) {
  const selectedState = usStates.find(s =>
    s.find(x => x.toLowerCase() === state.toLowerCase())
  )
  if (!selectedState) return null
     //return selectedState;
  return selectedState[1].toLocaleLowerCase();
  //  .filter(s => s.toLowerCase() !== state.toLowerCase());
}


function chartWrapper(xinput,yinput,state,year){

//testLabel.push('COVID-19');
//  let labelSet = xinput.push('COVID-19');
  let labelSet = xinput;

  //let ysetCovid = covidData;
  let yset = yinput;
  //console.log(yset + "::yset:: is coviddata included?---inside chartwrapper  ");
  
  //let stateName = state;
  //let dataYear = year;
  //let labelLegend = [`Leading Causes of Death in ${stateName} (${dataYear})`];
  //console.log(typeof(ysetCovid));
  const ctx = document.getElementById('myChart').getContext('2d');
  Chart.defaults.global.legend.display = false;
  const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labelSet,
          datasets: [{
                        // label: labelLegend,
                        data: yset,
                        backgroundColor: [
                        'rgba(91, 191, 227, 0.2)',
                        'rgba(91, 191, 227, 0.2)',
                        'rgba(91, 191, 227, 0.2)',
                        'rgba(91, 191, 227, 0.2)',
                        'rgba(91, 191, 227, 0.2)',
                        'rgba(91, 191, 227, 0.2)',
                        'rgba(91, 191, 227, 0.2)',
                        'rgba(91, 191, 227, 0.2)',
                        'rgba(91, 191, 227, 0.2)',
                        'rgba(91, 191, 227, 0.2)',
                        'rgba(227, 91, 191, 0.1)',
                        ],
                        borderColor: [
                          'rgba(134, 154, 160)',
                          'rgba(134, 154, 160)',
                          'rgba(134, 154, 160)',
                          'rgba(134, 154, 160)',
                          'rgba(134, 154, 160)',
                          'rgba(134, 154, 160)',
                          'rgba(134, 154, 160)',
                          'rgba(134, 154, 160)',
                          'rgba(134, 154, 160)',
                          'rgba(134, 154, 160)',
                          'rgba(134, 154, 160)',
                        ],
                        borderWidth: 1
                    }
                    // {
                    //     label: ['COVID-19 as of today'],
                    //     data: ysetCovid,
                    //     backgroundColor: [
                    //       'rgba(227, 91, 191, 0.1)',
                    //     ],
                    //     borderColor: [
                    //       'rgba(134, 154, 160)',
                    //     ],
                    //     borderWidth: 1 ,
                    // },
                    ],

      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
    }
  });
}

