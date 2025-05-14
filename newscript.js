
let apiKey = "74fc4dbf12e9472ca9791217253103"
// Handles the opening and closing of card views - Your original logic with fixes
function openCard() {
  var allelems = document.querySelectorAll(".elem");
  var allFullElem = document.querySelectorAll(".fullElem");
  var allFullElemBackBtn = document.querySelectorAll(".fullElem .back");

  allelems.forEach(function (elem) {
    elem.addEventListener("click", function () {
      // Hide all full elements first
      allFullElem.forEach(function(fullElem) {
        fullElem.style.display = "none";
      });
      // Show the selected one
      allFullElem[elem.id].style.display = "block";
      
      // Special handling for motivation section to ensure proper centering
      if(elem.id === "2") {
        const motivationWrapper = document.querySelector(".motivation-wrapper");
        motivationWrapper.style.display = "flex";
        motivationWrapper.style.justifyContent = "center";
        motivationWrapper.style.alignItems = "center";
        motivationWrapper.style.flexDirection = "column";
      }
    });
  });

  allFullElemBackBtn.forEach(function (back) {
    back.addEventListener("click", function (e) {
      e.stopPropagation();
      allFullElem[back.id].style.display = "none";
    });
  });
}

openCard();

// Handles task management logic - Your original version with minor improvements
// Handles task management logic - Fixed version
// Updated todoList function with description display
function todoList() {
  let form = document.querySelector(".addtask form");
  let taskdetailsinput = document.querySelector(".addtask form textarea");
  let taskInput = document.querySelector(".addtask form #task-input");
  let taskCheckbox = document.querySelector(".addtask form #check-box");
  let currenttask = JSON.parse(localStorage.getItem("currenttask")) || [];

  function renderTask() {
    localStorage.setItem("currenttask", JSON.stringify(currenttask));
    let allTask = document.querySelector(".allTask");
    let sum = "";

    currenttask.forEach(function (elem, idx) {
      // Only show "imp" if task is actually important
      const impTag = elem.important ? '<span class="true">imp</span>' : '';
      
      // Show description if it exists
      const description = elem.details ? 
        `<div class="task-description">${elem.details}</div>` : 
        '';
      
      sum += `<div class="task" data-id="${idx}">
                <div class="task-header">
                  <h5>${elem.task} ${impTag}</h5>
                  <button id="${idx}">Mark as completed</button>
                </div>
                ${description}
              </div>`;
    });

    allTask.innerHTML = sum;

    var markCompletedBtn = document.querySelectorAll(".task button");
    markCompletedBtn.forEach(function (btn) {
      btn.addEventListener("click", function () {
        currenttask.splice(btn.id, 1);
        renderTask();
        localStorage.setItem("currenttask", JSON.stringify(currenttask));
      });
    });
  }

  renderTask();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if(!taskInput.value.trim()) return;
    
    currenttask.push({
      task: taskInput.value.trim(),
      details: taskdetailsinput.value.trim(),
      important: taskCheckbox.checked
    });

    renderTask();
    taskInput.value = "";
    taskdetailsinput.value = "";
    taskCheckbox.checked = false;
  });
}

todoList();

// Daily planner function - Your original version
function dailyPlanner(){
  var dayplanData = JSON.parse(localStorage.getItem("dayplanData")) || {};
  var dailyplanner = document.querySelector(".daily-planner");
  var hours = Array.from({ length: 18 }, (elem, idx) => `${6 + idx}:00-${7 + idx}:00`);

  var wholedaysum = "";
  hours.forEach(function (elem, idex) {
    var savedData = dayplanData[idex]||'';
    wholedaysum += `<div class="daily-plans">
      <h2>${elem}</h2>
      <input id="${idex}" type="text" name="" value="${savedData}">
    </div>`;
  });

  dailyplanner.innerHTML = wholedaysum;
  var dailyplannerInput = document.querySelectorAll(".daily-planner input");
  dailyplannerInput.forEach(function (elem) {
    elem.addEventListener("input", function () {
      dayplanData[elem.id] = elem.value;
      localStorage.setItem("dayplanData", JSON.stringify(dayplanData));
    });
  });
}

dailyPlanner();

// Motivational quotes api - Fixed version with proper centering
let motivationContainer = document.querySelector(".motivation-container .motivation-wrapper");

function fetchApi() {
  return fetch('https://api.realinspire.live/v1/quotes/random?minLength=100&maxLength=200')
    .then(res => res.json());
}

function renderData(data) {
  const quote = data[0];
  motivationContainer.innerHTML = `
    <h2 class="quote-heading">Quote of the Day</h2>
    <p class="quote-text">"${quote.content}"</p>
    <p class="quote-author">— ${quote.author}</p>
  `;
  
  // Ensure proper centering
  motivationContainer.style.display = "flex";
  motivationContainer.style.flexDirection = "column";
  motivationContainer.style.justifyContent = "center";
  motivationContainer.style.alignItems = "center";
  motivationContainer.style.textAlign = "center";
  motivationContainer.style.height = "100%";
}

// Initial load and whenever motivation section is opened
function initMotivation() {
  motivationContainer.style.display = "flex";
  motivationContainer.style.flexDirection = "column";
  motivationContainer.style.justifyContent = "center";
  motivationContainer.style.alignItems = "center";
  motivationContainer.style.textAlign = "center";
  motivationContainer.style.height = "100%";
  
  fetchApi()
    .then(data => renderData(data))
    .catch(error => {
      console.error("Error fetching quote:", error);
      motivationContainer.innerHTML = `
        <h2 class="quote-heading">Daily Inspiration</h2>
        <p class="quote-text">"The secret of getting ahead is getting started."</p>
        <p class="quote-author">— Mark Twain</p>
      `;
    });
}

initMotivation();


function pomodoroTimer(){

  
let timer = document.querySelector(".pomo-timer h2");
let TotalTime = 25*60;
let isRunning = false
let timerinterval
let isWorkSession = true
function updateDisplay(){     //pehle data ko display krenge tab na code likhenge baki ka 
let minutes = Math.floor(TotalTime/60).toString().padStart(2,'0');
let seconds = Math.floor(TotalTime%60).toString().padStart(2,'0');

timer.innerHTML = `${minutes}:${seconds}`
}

let work = document.querySelector(".pomodoro-fullpage .session"); 
let start = document.querySelector(".Start-timer");
let pause = document.querySelector(".Pause-timer");
let reset = document.querySelector(".Reset-timer");

function StartSession(){
  if(isRunning) return
  isRunning=true;
  timerinterval = setInterval(function(){
   

    if(TotalTime>0){
      TotalTime--;
      updateDisplay();

    }
    else{
      clearInterval(timerinterval);
      isRunning = false;

      isWorkSession = !isWorkSession;

      TotalTime  =  isWorkSession?25*60 : 5*60;
      updateDisplay()
      work.innerHTML = isWorkSession ? "Work Session" : "Break Session";
       alert(isWorkSession ? "Break over! Time to work!" : "Great job! Time for a 5-minute break!");
    }


  },1000)


}
start.addEventListener("click",StartSession);

pause.addEventListener("click",function(){
  clearInterval(timerinterval)
  isRunning = false;

});

reset.addEventListener("click",function(){
  clearInterval(timerinterval);
  isRunning = false;
  isWorkSession = true
  TotalTime = 25*60;
  updateDisplay();
})

updateDisplay()




}

pomodoroTimer();

var city = "kolkata";
var header1Date = document.querySelector(".header1 h1");
var header1day = document.querySelector(".header1 h4");
const header = document.querySelector('.header1');
const secondH4 = header.children[2]

const header2 = document.querySelector('.header2');
const temperature = header2.children[0];
const precipitation = header2.children[1];
const humidity = header2.children[2];
const wind = header2.children[3];
const weather = header2.children[4];




async function weatherApiCall(){
   var response = await fetch(`http://api.weatherapi.com/v1//current.json?key=${apiKey}&q=${city}`)

  var data  = await response.json();
   console.log(data)
secondH4.innerHTML = `${data.location.name}(${data.location.region})`;


temperature.innerHTML = `${data.current.temp_c}°C`;
precipitation.innerHTML = `precipitation:${data.current.precip_mm}mm`;
humidity.innerHTML = `humidity:${data.current.humidity}%`;
wind.innerHTML = `wind:${data.current.wind_kph}km/h`;
weather.innerHTML = `${data.current.condition.text}`;

}

weatherApiCall()






function timedate(){
  let arr  =  ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var date = new Date();
  var day = arr[date.getDay()]
header1Date.innerHTML =`${day}, ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}:${date.getSeconds().toString().padStart(2,'0')}`;

let montharr = ["January","February","March","April","May","June","July","August","September","October","November","December"];

header1day.innerHTML = `${date.getDate()}-${montharr[date.getMonth()]} ${date.getFullYear()}`
}

setInterval(timedate,1000)



