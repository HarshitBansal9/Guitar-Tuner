import React from 'react';
import './App.css';
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useState } from 'react';
import Frequencyranges from './Frequencyranges.json'
const defaultTimes = [];
for (let i = 1; i <= 2048; i++) {
  defaultTimes.push(i);
}
let prev = 1;

function App() {
  const [time, setTime] = useState(defaultTimes);
  const [amp, setAmp] = useState([...defaultTimes]);
  const [freq, setFreq] = useState(null);
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
      //finding the median value and storing it in offsetsum variable
      //sorting the offset array
      let copy = [...Frequencyranges[i].offsets]
      copy.sort();
      Frequencyranges[i].offsetSum = copy[Math.ceil(copy.length / 2)]
    };
    //Sorting this frequencyranges array to get the two highest median offsetsum frequencies
    Frequencyranges.sort((a, b) => {
      return b.offsetSum - a.offsetSum;
    });
    if (flag == 0) {
      let minRange = Frequencyranges[0].weightedAverage <= Frequencyranges[1].weightedAverage ? Frequencyranges[0] : Frequencyranges[1]
      const minOffset = Math.max(...minRange.offsets);
      setFreq(Math.round(minRange.frequencies[minRange.offsets.findIndex(s => s === minOffset)] * 100) / 100)
    } else {
      setFreq(0);
    }
    //console.log(Frequencyranges[0].offsets, Frequencyranges[1].offsets);
    for (let i = 0; i < Frequencyranges.length; i++) {
      Frequencyranges[i].weightedAverage = 0;
      Frequencyranges[i].offsetSum = 0;
      Frequencyranges[i].frequencies = [];
      Frequencyranges[i].offsets = [];

    };



    /*
    // Calculate the offset with the highest value
    var maxValue = -1;
    var bestOffset = -1;
    for (var i = dip; i < revdip; i++) {
      if (newArray[i] > maxValue) {
        maxValue = newArray[i];
        bestOffset = i;
      }
    }
    //Finding highest offset sums and storing them in an array
    for (let i = dip; i < revdip; i++) {
      if (newArray[i + 1] < newArray[i]) {
        lowestFreq.push({
          OffsetSum: newArray[i],
          freq: (Math.round((48000 / i) * 10) / 10)
        })
      }
    }
    lowestFreq.sort((a, b) => {
      return b.OffsetSum - a.OffsetSum;
    });
    if (flag == 0) {
      if (lowestFreq[0].freq >= 160 && lowestFreq[0].freq <= 170) {
        //console.log(lowestFreq.slice(0, 1000))
      }
      setFreq(lowestFreq[0].freq);
    } else {
      setFreq(0)
    }
    /*let temp = ((Math.round((48000 / bestOffset) * 10) / 10))
    console.log((48000 / bestOffset))
    
    if (flag == 0) {
      if (Math.abs((temp / 2 - prev)) < 5) {
        prev = (temp)
        setFreq(temp / 2);
      } else if (Math.abs(temp / 3 - prev) < 5) {
        prev = (temp)
        setFreq(temp / 3);
      } else {
        setFreq(temp);
        prev = (temp);
      };
    } else {
      setFreq(0);
    }*/

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
            labels: amp.map((_, i) => 48000 / (amp.length - i - 1)),
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
