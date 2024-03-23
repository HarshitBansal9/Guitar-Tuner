import React from 'react';
import './App.css';
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useState } from 'react';

const defaultTimes = [];
for (let i = 1; i <= 2048; i++) {
  defaultTimes.push(i);
}
function App() {
  const [time, setTime] = useState(defaultTimes);
  const [amp, setAmp] = useState([...defaultTimes]);
  const [freq, setFreq] = useState(null);
  //Gets the time domain data from the ansalyser node
  function getAudio(analyser, dataArray) {
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
      setAmp(Array.from(dataArray));
    } else {
      setAmp(Array(dataArray.length).fill(0))
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

    // Find the last index where that value is greater than the next one (the dip)
    var dip = 0;
    while (newArray[dip] > newArray[dip + 1]) {
      dip++;
    }
    var revdip = newArray.length - 1;
    while (newArray[revdip] > newArray[revdip - 1]) {
      revdip--;
    }
    // Calculate the offset with the highest value
    var maxValue = -1;
    var bestOffset = -1;
    for (var i = dip; i < revdip; i++) {
      if (newArray[i] > maxValue) {
        maxValue = newArray[i];
        bestOffset = i;
      }
    }

    console.log(revdip, bestOffset)
    if (flag == 0) {
      setFreq(Math.round((48000 / bestOffset) * 10) / 10);
    } else {
      setFreq(0);
    }
    requestAnimationFrame(() => { getAudio(analyser, dataArray) });
  }
  return (
    <div className="App">
      <div className='content'>
        <h1>App Component</h1>
        <h3>{freq}</h3>
        <button onClick={() => {
          //Gets user audio permission
          navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
          }).then(stream => {
            //creating an audio context
            const context = new AudioContext()

            console.log(stream)
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
        }} >Click Me</button>
        <Line
          data={{
            labels: time,
            datasets: [
              {
                label: "Amplitude",
                data: amp,
                borderColor: "black",
                borderWidth: 2,
                pointBorderWidth: 0,
                tension: 0
              }
            ]
          }} />

      </div>
    </div>
  );
}

export default App;
