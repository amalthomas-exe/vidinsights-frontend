import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from '@/lib/utils';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import YouTube, { YouTubeProps } from 'react-youtube'
import LoadingPage from '@/components/LoadingPage';
import axios from 'axios';
import { API_URL } from '@/constants';
import VideoTranscript from '../components/VideoTranscript';
import TableOfContents from '@/components/TableOfContents';
import Mindmap from '@/components/Mindmap';
import DetailedNotes from '@/components/DetailedNotes';
import Chat from '@/components/Chat';
import { GetRequest } from '@/services/API';



const Result: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [player, setPlayer] = useState<any>(null)

    const [loadingPage, setLoadingPage] = useState<boolean>(true)
    const [loadingValue, setLoadingValue] = useState<number>(0)
    const [timedTranscript, setTimedTranscript] = useState<any>([])
    const [summary, setSummary] = useState<string>("")
    const [tableOfContents, setTableOfContents] = useState<any>([])
    const [detailedNotes, setDetailedNotes] = useState<string>("")
    const [code, setCode] = useState<string>("")

    const [vidProgress, setVidProgress] = useState<number>(0)

    const [videoMetaData, setVideoMetaData] = useState<any>({})

    const navigate = useNavigate()

    useEffect(() => {
        if (player) {
            console.log(player.getCurrentTime())
        }
    }, [player])

    useEffect(() => {
        if (player) {
            const interval = setInterval(() => {
                setVidProgress(Math.floor(player.getCurrentTime()))
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [player])




    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const videoMetaDataRes = await GetRequest(`api/video_metadata/${id}`);
                if (isMounted) {
                    document.title = videoMetaDataRes.data.video_metadata.title;
                    setLoadingValue(20);
                    setVideoMetaData(videoMetaDataRes.data.video_metadata);
                }

                const timedTranscriptRes = await axios.get(`${API_URL}/api/transcript/timed/${id}`);
                if (isMounted) {
                    setLoadingValue(40);
                    setTimedTranscript(timedTranscriptRes.data.timed_transcript);
                }

                const summaryRes = await axios.get(`${API_URL}/api/summary/${id}`);
                if (isMounted) {
                    setLoadingValue(63);
                    setSummary(summaryRes.data.summary);
                }

                const tableOfContentsRes = await axios.get(`${API_URL}/api/table_of_contents/${id}`);
                if (isMounted) {
                    setLoadingValue(80);
                    setTableOfContents(tableOfContentsRes.data.table_of_contents);
                }

                const detailedNotesRes = await axios.get(`${API_URL}/api/detailed_notes/${id}`);
                if (isMounted) {
                    setDetailedNotes(detailedNotesRes.data.detailed_notes);
                    setLoadingValue(95);
                }

                const mindmapRes = await axios.get(`${API_URL}/api/mindmap/${id}`);
                if (isMounted) {
                    setCode(mindmapRes.data.mindmap);
                    setLoadingValue(100);
                    setLoadingPage(false);
                }
            } catch (err) {
                console.log(err);

                navigate('/');
                if (isMounted) {
                    setLoadingPage(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [id, navigate]);

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        // access to player in all event handlers via event.target
        setPlayer(event.target);
        event.target.pauseVideo();
    }

    const seekTo: any = (seconds: number) => {
        player.seekTo(seconds, true);
    }

    const opts: YouTubeProps['opts'] = {
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    return (
        loadingPage ? <LoadingPage value={loadingValue} /> : <>
            <section className="pt-20 p-5 flex flex-col lg:flex-row w-full min-h-screen bg-gray-100 selection:bg-gray-600 selection:text-white">
                <div className="flex flex-col w-full lg:w-1/3 h-full z-10">
                    <YouTube
                        videoId={id}
                        opts={opts}
                        onReady={onPlayerReady}
                        iframeClassName="rounded-md w-full h-96"
                    />

                    <VideoTranscript timedTranscript={timedTranscript} seekTo={seekTo} vidProgress={vidProgress} />
                </div>

                <div className='flex flex-col w-full lg:w-2/3 h-full z-10 ml-0 lg:ml-7 mt-10 lg:mt-0'>
                    <div className="flex flex-col w-full lg:w-[80%]">
                        <h1 className="text-3xl font-bold">{videoMetaData.title}</h1>
                        <p className="text-lg mt-2 font-semibold text-gray-600">{videoMetaData.author}</p>
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-xl font-semibold mt-5">Summary</h1>
                        <p className="text-md">{summary}</p>
                    </div>

                    <TableOfContents seekTo={seekTo} tableOfContents={tableOfContents} />


                </div>
                {/* <DotPattern
                    className={cn(
                        "[mask-image:radial-gradient(1500px_circle_at_center,white,transparent)] z-0",
                    )}
                /> */}
            </section>

            <section className="p-5 flex-col w-full bg-gray-100 selection:bg-gray-600 selection:text-white">
                <Tabs defaultValue="notes" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="notes" className='font-semibold text-lg text-gray-800'>Notes</TabsTrigger>
                        <TabsTrigger value="mindmap" className='font-semibold text-lg text-gray-800'>Mindmap</TabsTrigger>
                    </TabsList>
                    <TabsContent value="notes">
                        <DetailedNotes detailedNotes={detailedNotes} />
                    </TabsContent>
                    <TabsContent value="mindmap">
                        <Mindmap code={code} />
                    </TabsContent>
                </Tabs>
            </section>

            <section className='p-5 flex-col w-full items-center justify-center text-white bg-gray-100 selection:bg-gray-600 selection:text-white '>
                <div className="flex flex-col w-[90%] bg-gradient-to-r from-[#808080] to-[#3a393a] p-5 rounded-lg shadow-md">
                    <h1 className='text-2xl font-semibold'>Done reading?</h1>
                    <p className='text-base lg:text-lg  mt-2'>
                        Test out your knowledge by taking this curated quiz, or quickly brush up your memory using the flashcards.
                    </p>

                    <div className='flex flex-row mt-5'>
                        <Button onClick={()=>{
                            navigate(`/quiz/${id}`)
                        }}>Go to quiz</Button>

                        <Button variant="secondary" className='ml-5' onClick={()=>{
                            navigate(`/flashcards/${id}`)
                        }}>Flashcards</Button>
                    </div>
                </div>
            </section>

            <Chat />
        </>
    )
}

export default Result