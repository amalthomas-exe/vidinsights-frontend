import React, { useEffect, useState } from "react";
import WordRotate from "@/components/ui/word-rotate";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import ShimmerButton from "@/components/ui/shimmer-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [videoURL, setVideoURL] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoURL
            .match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
            alert("Please enter a valid youtube video link");
            return;
        }

        let id = videoURL.split("v=")[1];
        navigate(`/${id}`);
    };

    useEffect(() => {
        document.title = "Get Summary, Quiz, Notes, Flashcards from any video";
    }, []);


    return (
        <section className="p-5 items-center justify-center flex flex-col w-full h-screen bg-gray-100">
            <div className="z-10 w-full items-center justify-center flex flex-col">
                <div className="lg:flex sm:flex-col lg:flex-row  items-center">

                    <h1 className="text-4xl text-center lg:text-left">
                        Get
                    </h1>
                    <WordRotate
                        className="lg:mx-3 text-4xl text-center lg:text-left font-bold text-black dark:text-white"
                        words={["Video Summary", "Quiz", "Short Notes", "Flashcards", "Transcript", "Important Points"]}
                    />
                    <h1 className="text-4xl sm:text-center">
                        from any video
                    </h1>
                </div>

                <div className="flex row items-center my-10 lg:w-3/5 w-11/12">
                    <form className="lg:flex lg:flex-row flex-col w-full items-center" onSubmit={handleSubmit}>
                        <input
                            value={videoURL}
                            onChange={(e) => setVideoURL(e.target.value)}
                            type="text"
                            placeholder="Paste your video link here"
                            className="px-5 py-2 m-2 border border-gray-300 shadow-sm rounded-2xl bg-white h-14 w-full text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        <ShimmerButton className="w-full lg:w-auto lg:h-12 mt-5 lg:mt-0" shimmerSize="0.1em" type="submit">
                            <span className="whitespace-pre-wrap text-center text-sm leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-xl font-semibold">
                                Generate
                            </span>
                        </ShimmerButton>
                    </form>
                </div>
            </div>

            <DotPattern
                className={cn(
                    "[mask-image:radial-gradient(1500px_circle_at_center,white,transparent)]",
                )}
            />
        </section>
    );
};

export default Home;