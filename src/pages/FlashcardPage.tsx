import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '@/constants'
import LoadingPage from '@/components/LoadingPage'
import { CircleArrowLeft, CircleArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const COLORS = [
    "#EFD1D7",
    "#D6E0EB",
    "#FFE299",
    "#DAFFEF",
    "#A9DEA6"
]

const FlashcardPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [flashCards, setFlashCards] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const [loadingValue, setLoadingValue] = useState(0)
    const [index, setIndex] = useState(0)

    useEffect(() => {
        document.title = 'Flashcards'
        setLoadingValue(50)
        axios.get(`${API_URL}/api/flash_cards/${id}`).then((res) => {
            setLoadingValue(100)
            setFlashCards(res.data.flash_cards)
            setLoading(false)
        })
    }, [id])

    const handlePrevious = () => {
        setIndex((prevIndex) => (prevIndex === 0 ? flashCards.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setIndex((prevIndex) => (prevIndex === flashCards.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        loading ? <LoadingPage value={loadingValue} /> : <div className='pt-20 p-5 flex flex-col w-full bg-gray-100 min-h-[100vh] selection:bg-gray-600 selection:text-white'>

            <div className='text-2xl font-semibold'>Flashcards</div>

            <div className="flex flex-col self-center relative mt-10">
                <div className="flex flex-col p-10 rounded-md max-w-[90%] lg:max-w-[55%] self-center mt-5 shadow-lg" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                    <div className="flex flex-col">
                        <div className="text-xl font-semibold text-gray-800">{flashCards[index].question}</div>
                    </div>

                    <div className="flex flex-col mt-10">
                        <div className="text-base text-gray-600 font-semibold">Answer</div>
                        <div className="text-base font-semibold mt-2">{flashCards[index].answer}</div>
                    </div>

                    <div className="flex flex-col mt-5">
                        <div className="text-base text-gray-600 font-semibold">Explanation</div>
                        <div className="text-base font-semibold mt-2">{flashCards[index].explanation}</div>
                    </div>
                </div>

                <div className="flex justify-center mt-10">
                    <CircleArrowLeft size={50} onClick={handlePrevious}/>
                    <CircleArrowRight size={50} className='ml-20' onClick={handleNext}/>
                </div>
            </div>
        </div>
    )
}

export default FlashcardPage