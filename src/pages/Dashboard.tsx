import React, { useEffect,useState } from "react";
import axios from "axios";
import { API_URL } from "@/constants";
import LoadingPage from "@/components/LoadingPage";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingValue, setLoadingValue] = useState<number>(0);
    const navigate = useNavigate();
    const [data, setData] = useState<any>();

    useEffect(() => {
        document.title = "Get Summary, Quiz, Notes, Flashcards from any video";

        axios.get(`${API_URL}/api/dashboard`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("VI_token")}`
            }
        }).then((res) => {
            console.log(res.data);
            setLoadingValue(100);
            setData(res.data.videos);
            setLoading(false);
        }
        ).catch((err) => {
            console.log(err);
        });

    }, []);


    return (
       loading ? <LoadingPage value={loadingValue} /> : <section className="pt-20 p-5 flex flex-col lg:flex-row w-full min-h-screen bg-gray-100 selection:bg-gray-600 selection:text-white">
            <div className="w-full">
                <h1 className="text-xl font-semibold">Your videos</h1>
                <div className="mt-5 flex flex-col lg:flex-row ">
                    {data?.map((video: any, index: number) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm mb-5  w-full lg:w-[20%] m-2 hover:shadow-xl transition duration-300 cursor-pointer" onClick={() => navigate(`/${video.video_id}`)}>
                            <img src={video.thumbnail_url} alt="thumbnail" className="rounded-t-lg w-full aspect-video" />

                            <div className="p-5">
                                <h1 className="text-lg font-semibold">{video.title}</h1>
                                <p className="text-sm text-gray-600">{video.author}</p>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Dashboard;