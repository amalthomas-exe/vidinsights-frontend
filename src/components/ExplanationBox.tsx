import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { useParams } from "react-router-dom";
import { API_URL } from "@/constants";
import axios from "axios";

interface ExplanationBoxProps {
    position: Record<string, number>
    selectedText: string | null
}

const ExplanationBox: React.FC<ExplanationBoxProps> = ({ position, selectedText }) => {
    const { id } = useParams()
    const [explanation, setExplanation] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true;

        if (selectedText && explanation === null) {
            axios.get(`${API_URL}/api/explanation/${id}?item=${selectedText}`)
                .then((res) => {
                    if (isMounted) {
                        setExplanation(res.data.explanation);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        return () => {
            isMounted = false;
        }
    }, [selectedText, id]);

    return (
        <div id="explanation-box" className='z-20 rounded-sm p-3 flex flex-col absolute -top-10 -left-10 bg-white shadow-md w-[350px]' style={{
            display: selectedText ? 'block' : 'none',
            transform: `translate3d(${position?.x}px, ${position?.y + 100}px, 0)`
        }}>
            {explanation === null ? <><Skeleton className="w-[200px] h-[20px] rounded-full mb-2" />
                <Skeleton className="w-[300px] h-[20px] rounded-full mb-1" />
                <Skeleton className="w-[300px] h-[20px] rounded-full mb-1" />
                <Skeleton className="w-[230px] h-[20px] rounded-full" /></>
                :
                <div>
                    <div className="font-semibold text-gray-600 mb-1">Explanation</div>
                    <div className="text-sm">
                        {explanation}
                    </div>
                </div>
            }
        </div>
    )
}

export default ExplanationBox;