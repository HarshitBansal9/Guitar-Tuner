import React from 'react'
import acoustic from './acoustic.png';
import electric from './electric.png';
import bass from './bass.png';
import ukulele from './ukulele.png'

function instrument(props) {
    if (props.type == 0){
        return (
            <div>
                <div className='h-[200px] w-[40px] rounded-full absolute top-24 left-[83px] flex flex-col justify-evenly hover:cursor-pointer items-center text-xl font-bold'>
                    <div className='h-[40px] w-[40px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>D</div>
                    <div className='h-[40px] w-[40px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>A</div>
                    <div className='h-[40px] w-[40px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>E</div>
                </div>
                <img  className="h-[370px]  absolute bottom-0 left-36" src={acoustic} alt="acoustic guitar" />
                <div className='h-[200px] w-[40px] rounded-full absolute top-24 left-[350px] flex flex-col justify-evenly hover:cursor-pointer items-center text-xl font-bold'>
                    <div className='h-[40px] w-[40px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>G</div>
                    <div className='h-[40px] w-[40px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>B</div>
                    <div className='h-[40px] w-[40px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>E</div>
                </div>
            </div>
        
        )
    }
    if (props.type == 1){
        return(
            <div>
                <div className='rotate-[15deg] h-[300px] w-[50px] rounded-full absolute bottom-20 left-[145px] flex flex-col justify-evenly hover:cursor-pointer items-center text-xl font-bold'>
                    <div className='h-[50px] w-[50px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>G</div>
                    <div className='h-[50px] w-[50px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>D</div>
                    <div className='h-[50px] w-[50px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>A</div>
                    <div className='h-[50px] w-[50px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>E</div>
                </div>
                <img  className="h-[370px]  absolute bottom-0 left-36" src={bass} alt="acoustic guitar" />
            </div>
        )
    }
    if (props.type == 2){
        return(
            <div>
                <div className='h-[200px] w-[50px] rounded-full absolute bottom-[128px] left-[135px] flex flex-col justify-evenly hover:cursor-pointer items-center text-xl font-bold'>
                    <div className='h-[50px] w-[50px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>C</div>
                    <div className='h-[50px] w-[50px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>G</div>
                </div>
                <img  className="h-[370px]  absolute bottom-0 left-24" src={ukulele} alt="acoustic guitar" />
                <div className='h-[200px] w-[50px] rounded-full absolute bottom-[128px] left-[375px] flex flex-col justify-evenly hover:cursor-pointer items-center text-xl font-bold'>
                    <div className='h-[50px] w-[50px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>E</div>
                    <div className='h-[50px] w-[50px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>A</div>
                </div>
            </div>
        )
    }
    if (props.type == 3){
        return(
            <div>
                <div className='rotate-[19deg] h-[300px] w-[35px] rounded-full absolute bottom-24 left-[160px] flex flex-col justify-evenly hover:cursor-pointer items-center text-xl font-bold'>
                    <div className='h-[35px] w-[35px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>E</div>
                    <div className='h-[35px] w-[35px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>B</div>
                    <div className='h-[35px] w-[35px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>G</div>
                    <div className='h-[35px] w-[35px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>D</div>
                    <div className='h-[35px] w-[35px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>A</div>
                    <div className='h-[35px] w-[35px] bg-gray-200 hover:bg-gray-100 rounded-full flex justify-center items-center font-bold drop-shadow-2xl'>E</div>
                </div>
                <img  className="h-[370px]  absolute bottom-0 left-36" src={electric} alt="acoustic guitar" />
            </div>
        )
    }
}

export default instrument
