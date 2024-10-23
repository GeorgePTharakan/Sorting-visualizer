// const visualizer=document.getElementById("visualizer");
// const number=document.getElementById("numbers");
// const regenerate=document.getElementById("regenerate-btn");
// const sortBtn=document.getElementById("sort-btn");
// const speed=document.getElementById("speed");
// const speedValue=document.getElementById("speedValue");
// const numberValue=document.getElementById("numberValue");
// const pauseBtn=document.getElementById("pause-btn");


// generateBars(10);
// let isPaused=false;
// const numBars=number.value;
// sortBtn.addEventListener('click',()=>{
//     const numBars=number.value;
//     bubbleSort(numBars)});
// document.addEventListener('DOMContentLoaded', () => {
    
//     regenerate.addEventListener('click',()=>{
//         const numBars=number.value;
//         generateBars(numBars);
//     });
//     number.addEventListener('input',()=>{
//         const numBars=number.value;
//         numberValue.textContent=numBars;
//         generateBars(numBars);
//     });
//     speed.addEventListener('input',()=>{
//         const spd=speed.value;
//         const val=1000-spd+50;
//         speedValue.textContent=`${val} ms`;
//     });
//     pauseBtn.addEventListener('click',()=>{
//         isPaused=!isPaused;
//         pauseBtn.textContent=isPaused?"resume":"pause";
//     })
// });



// function generateBars(numBars){
//     visualizer.innerHTML="";
//     for(let i=0;i<numBars;i++){
        
//         const bar= document.createElement("div");
//         const heightLabel=document.createElement("span");
//         bar.classList.add("bar");
//         heightLabel.classList.add("height-label");
//         const height=Math.floor(Math.random()*300)+20;
//         bar.style.height=`${height}px`;
//         heightLabel.textContent=height;
        
//         visualizer.appendChild(bar);
//         bar.appendChild(heightLabel);
//         console.log(height);

//     }   
// }
// async function bubbleSort(numBars){
//     const bars=document.querySelectorAll(".bar");
//     const heightlabels=document.querySelectorAll(".height-label");
//     for(let i=0;i<numBars-1;i++){
//         for(let j=0;j<numBars-i-1;j++){
//             bars[j].style.backgroundColor = "red";
//             bars[j + 1].style.backgroundColor = "red";
//             while (isPaused) {
//                 await new Promise(resolve => setTimeout(resolve, 100)); 
//             }
//             if(parseInt(bars[j].style.height)>parseInt(bars[j+1].style.height)){
//                 let temp=bars[j].style.height;
//                 heightlabels[j].textContent=parseInt(bars[j+1].style.height);
//                 bars[j].style.height=bars[j+1].style.height;
//                 bars[j+1].style.height=temp;
//                 heightlabels[j+1].textContent=parseInt(temp);
               
//             }
//             await new Promise(resolve=>setTimeout(resolve,(1000-(parseInt(document.getElementById("speed").value))+50)));
//             bars[j].style.backgroundColor = "#4CAF50";
//             bars[j + 1].style.backgroundColor = "#4CAF50";
//         }
//     }
// }



const visualizer = document.getElementById("visualizer");
const number = document.getElementById("numbers");
const regenerate = document.getElementById("regenerate-btn");
const sortBtn = document.getElementById("sort-btn");
const speed = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");
const pauseBtn = document.getElementById("pause-btn");
const stopBtn = document.getElementById("stop-btn");

let isPaused = false;
let isStopped = false;
let arr = [];

// Initialize the bars
generateArray(10);
generateBars(arr);

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    regenerate.addEventListener('click', () => {
        generateArray(number.value);
        generateBars(arr);
    });

    number.addEventListener('input', () => {
        generateArray(number.value);
        generateBars(arr);
    });

    speed.addEventListener('input', () => {
        const spd = speed.value;
        const val = 1000 - spd + 50;
        speedValue.textContent = `${val} ms`;
    });

    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? "Resume" : "Pause";
        if (!isPaused) {
            bubbleSort(); // Resume sorting
        }
    });

    stopBtn.addEventListener('click', () => {
        isStopped = true;
        pauseBtn.textContent = "Pause";
        isPaused = false;
        generateBars(arr); // Reset bars to initial state
    });

    sortBtn.addEventListener('click', () => {
        isStopped = false;
        bubbleSort();
    });
});

// Generate an array of random heights
function generateArray(numBars) {
    arr = [];
    for (let i = 0; i < numBars; i++) {
        arr.push(Math.floor(Math.random() * 300) + 20);
    }
}

// Generate bars based on the array
function generateBars(arr) {
    visualizer.innerHTML = "";
    arr.forEach(height => {
        const bar = document.createElement("div");
        const heightLabel = document.createElement("span");
        bar.classList.add("bar");
        heightLabel.classList.add("height-label");
        bar.style.height = `${height}px`;
        heightLabel.textContent = height;
        
        visualizer.appendChild(bar);
        bar.appendChild(heightLabel);
    });
}

// Bubble sort implementation
async function bubbleSort() {
    const numBars = arr.length;
    const bars = document.querySelectorAll(".bar");
    const heightLabels = document.querySelectorAll(".height-label");

    for (let i = 0; i < numBars - 1; i++) {
        for (let j = 0; j < numBars - i - 1; j++) {
            if (isStopped) return; // Exit if sorting is stopped

            bars[j].style.backgroundColor = "red";
            bars[j + 1].style.backgroundColor = "red";

            // Use requestAnimationFrame for smoother updates
            while (isPaused) {
                await new Promise(resolve => {
                    const checkPaused = () => {
                        if (!isPaused) resolve(); // Resolve the promise when resumed
                        else requestAnimationFrame(checkPaused); // Keep checking
                    };
                    requestAnimationFrame(checkPaused); // Start checking
                });
            }

            if (arr[j] > arr[j + 1]) {
                // Swap in the array
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                heightLabels[j].textContent = arr[j];
                heightLabels[j + 1].textContent = arr[j + 1];
                
                // Update the bars
                bars[j].style.height = `${arr[j]}px`;
                bars[j + 1].style.height = `${arr[j + 1]}px`;
            }

            // Use requestAnimationFrame to create a delay
            await new Promise(resolve => {
                const duration = (1000 - parseInt(speed.value) + 50);
                const startTime = performance.now();

                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    if (elapsed >= duration) {
                        resolve(); // Resolve the promise when the duration has passed
                    } else {
                        requestAnimationFrame(animate); // Keep animating
                    }
                };
                requestAnimationFrame(animate); // Start the animation
            });

            bars[j].style.backgroundColor = "#4CAF50";
            bars[j + 1].style.backgroundColor = "#4CAF50";
        }
    }
}


























