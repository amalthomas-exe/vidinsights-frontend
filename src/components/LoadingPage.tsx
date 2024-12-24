import React, { useEffect, useState } from "react";
import AnimatedCircularProgressBar from "@/components/ui/animated-circular-progress-bar";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import WordRotate from "@/components/ui/word-rotate";

interface LoadingPageProps {
    value: number
}


const LoadingPage: React.FC<LoadingPageProps> = ({ value }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
            <AnimatedCircularProgressBar
                max={100}
                min={0}
                value={value}
                gaugePrimaryColor="rgb(17 24 39)"
                gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
                className="z-10"
            />
            <WordRotate
                className="lg:mx-3 text-xl text-center mt-10 font-semibold text-gray-800 dark:text-white "
                words={[
                    //Strings which tell the user to wait while the video is being processed. the strings must be general and not specific to the project
                    "Crunching those sentences",
                    "Hang tight, we're working on it",
                    "Shoutout to all the servers working hard",
                    "Shouldn't be long now",
                    "Just a few more seconds",
                    "Almost there",
                ]}
                duration={4000}
            />


            <DotPattern
                className={cn(
                    "[mask-image:radial-gradient(1500px_circle_at_center,white,transparent)]",
                )}
            />
        </div>
    )
}

export default LoadingPage