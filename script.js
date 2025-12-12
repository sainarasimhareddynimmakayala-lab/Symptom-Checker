// ---------------- TAB SWITCHING ----------------
document.querySelectorAll(".tab-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// ---------------- HEALTH CHECK ----------------
document.getElementById("healthForm").addEventListener("submit",e=>{
  e.preventDefault();
  let total=parseInt(document.getElementById("exercise").value)
            +parseInt(document.getElementById("diet").value)
            +parseInt(document.getElementById("sleep").value);
  let score=Math.round((total/15)*100);
  document.getElementById("healthResult").classList.remove("hidden");
  document.getElementById("healthBar").style.width=score+"%";
  let msg = score>80 ? "Excellent health." :
            score>60 ? "Good health." :
            score>40 ? "Moderate health." :
                       "High risk, consult doctor.";
  document.getElementById("healthText").innerText=msg;
});

// ---------------- BMI ----------------
function calcBMI(){
  let h=parseFloat(document.getElementById("height").value)/100;
  let w=parseFloat(document.getElementById("weight").value);
  if(!h||!w){alert("Enter valid data!");return;}
  let bmi=(w/(h*h)).toFixed(1);
  let status=bmi<18.5?"Underweight":bmi<25?"Healthy":bmi<30?"Overweight":"Obese";
  document.getElementById("bmiValue").innerText=bmi;
  document.getElementById("bmiStatus").innerText=status;
  document.getElementById("bmiResult").classList.remove("hidden");
}

// ---------------- STRESS ----------------
function analyzeStress(){
  let level=document.getElementById("stressSelect").value;
  let text=level==1?"Low stress":level==2?"Mild stress":level==3?"High stress":"Severe stress";
  document.getElementById("stressText").innerText=text;
  document.getElementById("stressResult").classList.remove("hidden");
}

// ---------------- VITALS & ECG ----------------
let vitalsChart, ecgChart;
function showVitalsChart(){
  let bp=document.getElementById("bp").value.split("/");
  let hr=parseInt(document.getElementById("hr").value);
  let temp=parseFloat(document.getElementById("temp").value);
  if(bp.length!=2 || !hr || !temp){alert("Enter valid vitals!"); return;}
  document.getElementById("vitalsChartContainer").classList.remove("hidden");
  const ctx=document.getElementById("vitalsChart").getContext("2d");
  if(vitalsChart) vitalsChart.destroy();

  // Vitals bar chart
  vitalsChart=new Chart(ctx,{
    type:'bar',
    data:{
      labels:['Systolic BP','Diastolic BP','Heart Rate','Temperature'],
      datasets:[{label:'Vitals',data:[parseInt(bp[0]),parseInt(bp[1]),hr,temp],backgroundColor:['#00f6ff','#005aff','#00f6ff','#005aff']}]
    },
    options:{scales:{y:{beginAtZero:true}}}
  });

  // ECG simulation overlay using line chart
  const ecgData=[];
  for(let i=0;i<100;i++){ecgData.push(Math.sin(i/5)*10+hr);}
  new Chart(ctx,{
    type:'line',
    data:{labels:Array.from({length:100},(_,i)=>i+1),datasets:[{label:'ECG Simulation',data:ecgData,borderColor:'#ff4d4d',fill:false,tension:0.2}]},
    options:{animation:{duration:2000}}
  });
}

// ---------------- DISEASE RISK ----------------
let diseaseChart;
function calculateDiseaseRisk(){
  const age=parseInt(document.getElementById("age").value);
  const gender=document.getElementById("gender").value;
  const cholesterol=parseInt(document.getElementById("cholesterol").value);
  const sugar=parseInt(document.getElementById("bloodSugar").value);
  const smoking=parseInt(document.getElementById("smoking").value);
  const alcohol=parseInt(document.getElementById("alcohol").value);
  const family=parseInt(document.getElementById("family").value);

  if(!age||!cholesterol||!sugar){alert("Enter valid data"); return;}

  // Realistic risk percentages
  let heart= Math.min(90, 5 + age*0.3 + cholesterol*0.05 + smoking*10 + alcohol*5 + family*8);
  let diabetes= Math.min(90, 3 + age*0.2 + sugar*0.05 + BMI_factor()*5 + family*10);
  let cancer= Math.min(90, 2 + age*0.25 + smoking*12 + family*15);

  document.getElementById("diseaseChartContainer").classList.remove("hidden");
  const ctx=document.getElementById("diseaseChart").getContext("2d");
  if(diseaseChart) diseaseChart.destroy();
  diseaseChart=new Chart(ctx,{
    type:'doughnut',
    data:{
      labels:['Heart Disease','Diabetes','Cancer'],
      datasets:[{data:[heart,diabetes,cancer],backgroundColor:['#ff4d4d','#ffcc00','#66ff66'] }]
    },
    options:{
      plugins:{
        legend:{labels:{color:'#f0f0f0'}},
        tooltip:{callbacks:{label:function(context){return `${context.label}: ${context.raw.toFixed(1)}% risk`;}}}
      }
    }
  });
}

function BMI_factor(){
  const h=parseFloat(document.getElementById("height")?.value)/100 || 1.7;
  const w=parseFloat(document.getElementById("weight")?.value) || 70;
  const bmi=w/(h*h);
  return bmi<18.5?0:bmi<25?1:bmi<30?2:3;
}
