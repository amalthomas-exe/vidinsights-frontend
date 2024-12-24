import React, { useEffect } from "react";

interface VideoTranscriptProps {
    timedTranscript: Array<{
        startTime: number,
        endTime: number,
        text: string
    }>

    seekTo: any
    vidProgress: number
}

const convertSecondsMMSS = (seconds: number) => {
    let minutes = Math.floor(seconds / 60)
    let minutesString = ""
    let remainingSecondsString = ""

    if (minutes < 10) {
        minutesString = `0${minutes}`
    }
    else{
        minutesString = `${minutes}`
    }

    let remainingSeconds = seconds % 60
    if (remainingSeconds < 10) {
        remainingSecondsString = `0${remainingSeconds}`
    }
    else{
        remainingSecondsString = `${remainingSeconds}`
    }
    
    return `${minutesString}:${remainingSecondsString}`
}



const VideoTranscript: React.FC<VideoTranscriptProps> = ({ timedTranscript,seekTo,vidProgress }) => {

    useEffect(() => {
        document.getElementById(`video-transcript-${vidProgress}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest',inline:"start" })
    }, [vidProgress])
    return (
        <>
            <div className="font-semibold mt-10 bg-gray-200 p-3 pt-5 rounded-md rounded-br-none rounded-bl-none">
                Video Transcript
            </div>
            <div className='h-[43vh] overflow-y-scroll p-3 bg-gray-200 rounded-md rounded-tr-none rounded-tl-none'>
                {
                    timedTranscript.map((transcript: any, index: number) => (
                        <div key={index} id={`video-transcript-${transcript.start}`} onClick={() => { seekTo(transcript.start) }} className={`mb-3 text-left bg-gray-300 ${
                            vidProgress >= transcript.start && vidProgress < transcript.end ? ' border-gray-500 border-2' : ''
                        } p-3 flex-col rounded-sm hover:cursor-pointer`}>
                            <div className="flex flex-row font-semibold text-gray-700">

                                <div>
                                    {convertSecondsMMSS(transcript.start)}
                                </div>

                                <div className='font-semibold mx-1'>
                                    -
                                </div>
                                <div>
                                    {(convertSecondsMMSS(transcript.end))}
                                </div>
                            </div>

                            <div className="text-sm">
                                {transcript.text}
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    );
}

export default VideoTranscript;