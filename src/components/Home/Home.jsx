import acoustic from './acoustic.png';
import React from 'react';
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useState } from 'react';
import Instrument from '../Instrument/instrument.jsx';
import Frequencyranges from './Frequencyranges.json';
import GaugeComponent from 'react-gauge-component';
const defaultTimes = [];
for (let i = 1; i <= 2048; i++) {
  defaultTimes.push(i);
}
let prev = 0;
let count = 0;
let silencecnt = 0;

function Home() {
  const [show,setShow] = useState(false);
  const [time, setTime] = useState(defaultTimes);
  const [amp, setAmp] = useState([...defaultTimes]);
  const [freq, setFreq] = useState(null);
  const [note, setNote] = useState(null);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [type,setType] = useState(0);
  //Gets the time domain data from the ansalyser node
  function getAudio(analyser, dataArray) {
    var lowestFreq = [];
    //Data array stores the amplitude of sound for time instances
    analyser.getFloatTimeDomainData(dataArray);
    let sum = 0;
    let flag = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += (dataArray[i] * dataArray[i])
    }
    if ((sum ** (0.5)) < 0.1) {
      flag = 1;
    }
    if (flag == 0) {
      //setAmp(Array.from(dataArray));
    } else {
      //setAmp(Array(dataArray.length).fill(0))
    }

    //finding more accurate range for the sample size
    let SIZE = dataArray.length;
    var c1 = 0;
    var c2 = SIZE - 1;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(dataArray[i]) < 0.2) {
        c1 = i;
        break;
      }
    }
    for (var i = 1; i < SIZE / 2; i++) {
      if (Math.abs(dataArray[SIZE - i]) < 0.2) {
        c2 = SIZE - i;
        break;
      }
    }
    //offset the dataArray in order to get the frequency
    const slicedDataArray = dataArray;
    SIZE = slicedDataArray.length;
    let newArray = new Array(SIZE).fill(0);
    for (let offset = 0; offset < SIZE; offset++) {
      for (let j = 0; j < SIZE - offset; j++) {
        newArray[offset] = newArray[offset] + slicedDataArray[j] * slicedDataArray[j + offset]
      }
    }
    setAmp([...newArray].reverse());
    // Find the last index where that value is greater than the next one (the dip)
    var dip = 0;
    while (newArray[dip] > newArray[dip + 1]) {
      dip++;
    }
    var revdip = newArray.length - 1;
    while (newArray[revdip] > newArray[revdip - 1]) {
      revdip--;
    }
    //Sorting different frequency ranges into "buckets"
    for (let i = dip; i < revdip; i++) {
      let f = (48000 / i);
      for (let j = 0; j < Frequencyranges.length; j++) {
        if (f >= Frequencyranges[j].range.min && f <= Frequencyranges[j].range.max) {
          //adding product of offsetsum and frequency
          Frequencyranges[j].weightedAverage += (newArray[i] * f);
          //finding sum of all the offsets
          Frequencyranges[j].offsetSum += newArray[i];
          //adding each offset to an array
          Frequencyranges[j].offsets.push(newArray[i]);

          Frequencyranges[j].frequencies.push(f);
          break;
        }
      }
    }
    for (let i = 0; i < Frequencyranges.length; i++) {
      if (Frequencyranges[i].offsetSum == 0) { continue };
      Frequencyranges[i].weightedAverage /= Frequencyranges[i].offsetSum;
    };
    for (let i = 0; i < Frequencyranges.length; i++) {
      //finding the max value and storing it in offsetsum variable
      //sorting the offset array
      let copy = [...Frequencyranges[i].offsets]
      copy.sort();
      Frequencyranges[i].offsetSum = copy[copy.length - 1]
    };
    //Sorting this frequencyranges array to get the two highest offsetsum frequencies
    Frequencyranges.sort((a, b) => {
      return b.offsetSum - a.offsetSum;
    });
    if (flag == 0) {
      let minRange = Frequencyranges[0]
      const minOffset = Math.max(...minRange.offsets);
      const f = Math.round(minRange.frequencies[minRange.offsets.findIndex(s => s === minOffset)] * 100) / 100

      if (Math.abs(f - prev) >= 20 && count >= 3) {
        setFreq(prev);
        count--
      } else {
        setMin(minRange.range.min);
        setMax(minRange.range.max);
        setFreq(f);
        setNote(minRange.note);
        prev = f;
        if (count <= 10) {
          count++;
        };
      }
    } else {
      if (silencecnt >= 20) {
        setFreq(0);
        silencecnt = 0;
      } else {
        setFreq(prev);
        silencecnt++;
      }
    }
    //console.log(Frequencyranges[0].offsets, Frequencyranges[1].offsets);
    for (let i = 0; i < Frequencyranges.length; i++) {
      Frequencyranges[i].weightedAverage = 0;
      Frequencyranges[i].offsetSum = 0;
      Frequencyranges[i].frequencies = [];
      Frequencyranges[i].offsets = [];

    };
    requestAnimationFrame(() => { getAudio(analyser, dataArray) });
  }
  return (
    <div className='h-[1000px] w-full bg-background flex justify-center'>
        <div className='h-[450px] w-[900px] bg-container  rounded-xl drop-shadow-xl absolute top-32 flex flex-col'>
            <div className='w-full flex flex-row h-[65px] justify-evenly'>
                <div onClick={()=>{setType(0)}} className='text-white text-xl mt-4 hover:text-gray-500 hover:cursor-pointer'>Guitar (Acoustic)</div>
                <div onClick={()=>{setType(1)}} className='text-white text-xl mt-4 hover:text-gray-500 hover:cursor-pointer'>Bass</div>
                <div onClick={()=>{setType(2)}} className='text-white text-xl mt-4 hover:text-gray-500 hover:cursor-pointer'>Ukulele</div>
                <div onClick={()=>{setType(3)}} className='text-white text-xl mt-4 hover:text-gray-500 hover:cursor-pointer'>Guitar (Electric)</div>
            </div>
            <Instrument type={type}/>
            <div className='h-[200px] w-[200px] absolute right-[150px] top-24'>
              <GaugeComponent
                type="semicircle"
                arc={{
                  colorArray: ['#00FF15', '#FF2121'],
                  padding: 0.02,
                  colorArray: ["#ff0000", "#ff4800", "#ff6600", "#ffc800", "#e1ff00", "#88ff00", "#e1ff00", "#ffc800", "#ff6600", "#ff4800", "#ff0000"],
                  subArcs: [{ length: 0.03 }, { length: 0.04 }, { length: 0.05 }, { length: 0.08 }, { length: 0.15 }, { length: 0.30 }, { length: 0.15 }, { length: 0.08 }, { length: 0.05 }, { length: 0.04 }, { length: 0.03 }]
                }}
                minValue={min}
                maxValue={max}
                pointer={{ type: "blob", animationDelay: 100 }}
                value={freq}
              />
            </div>
            <button  onClick={()=>{
                //Gets user audio permission
            navigator.mediaDevices.getUserMedia({
              audio: true,
              video: false
            }).then(stream => {
              //creating an audio context
              const context = new AudioContext()

              //creates a node whose value is obtained from getUserMedia
              const AudioCtX = context.createMediaStreamSource(stream);


              //creates analyser node to visualize audio time and frequency
              const analyser = context.createAnalyser();

              AudioCtX.connect(analyser);
              const bufferLength = analyser.fftSize;
              const dataArray = new Float32Array(bufferLength);

              //gets the audio from the mic at an interval of 250 milliseconds
              requestAnimationFrame(() => { getAudio(analyser, dataArray) })
            }).catch(console.error);
            }} className='text-md rounded-lg text-gray-300 font-bold hover:bg-gray-700 bg-background w-[150px] h-[30px] absolute right-[170px] bottom-[135px]'>Start Tuning</button>
            <div className="absolute bottom-[60px] right-[100px]" id="dropdownButton">
              <button onClick={()=>{setShow(!show)}} className="w-[300px] h-[50px] hover:cursor-pointer hover:bg-gray-700 active:bg-gray-500 bg-background flex items-center rounded font-bold text-gray-300"><div className="absolute left-5">Tunings:</div></button>
              { show && 
                <div id="dropdown" className="rounded bg-zinc-800 text-lg text-gray-300 font-bold absolute top-[50px] w-[300px] shadow-m">
                  <div className="cursor-pointer hover:bg-gray-600 p-4">Standard</div>
                  <div className="cursor-pointer hover:bg-gray-600 p-4">Drop D</div>
                  <div className="cursor-pointer hover:bg-gray-600 p-4">Drop C</div>
                  <div className="cursor-pointer hover:bg-gray-600 p-4">Open D</div>
                </div>
              }
            </div>
        </div>
    </div>
  )
}

export default Home

