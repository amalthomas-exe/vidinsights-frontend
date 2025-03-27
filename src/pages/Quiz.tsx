import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '@/constants'
import LoadingPage from '@/components/LoadingPage'
import { CircleArrowLeft, CircleArrowRight } from 'lucide-react'


export const Quiz: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [quiz, setQuiz] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const [loadingValue, setLoadingValue] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    useEffect(() => {
        document.title = 'Quiz'
        setLoadingValue(20)
        axios.get(`${API_URL}/api/quiz/${id}`).then((res) => {
            setQuiz(res.data.quiz)
            setLoadingValue(100)
            setLoading(false)
        })
    }, [id])

    const handleOptionClick = (option: string) => {
        if (selectedOption) return; // Prevent re-selection
        setSelectedOption(option);
    };

    const handleNextQuestion = () => {
        setCurrentIndex(currentIndex < quiz.length - 1 ? currentIndex + 1 : quiz.length - 1);
        setSelectedOption(null); // Reset selection
    };

    const handlePreviousQuestion = () => {
        setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : 0);
        setSelectedOption(null); // Reset selection
    };

    return (
        loading ? <LoadingPage value={loadingValue} /> :<div className="flex flex-col w-full bg-gray-100 min-h-[100vh] selection:bg-gray-600 selection:text-white">
            <div className="pt-20 p-5 flex flex-col w-full bg-gray-100 min-h-[100vh] selection:bg-gray-600 selection:text-white">
                <div className="text-2xl font-semibold">Quiz</div>
                <div className="flex flex-col mt-10 items-center justify-center w-full">
                    <div className="flex flex-col w-fit">
                        <div className="bg-white shadow-lg rounded-lg p-5 w-[400px]">
                            <div className="text-lg font-semibold">{quiz[currentIndex]?.question}</div>
                            <div className="flex flex-col mt-5">
                                {quiz[currentIndex]?.options.map((option: string, index: number) => (
                                    <div
                                        key={index}
                                        className={`flex items-center px-5 py-2 rounded-sm mb-2 ${
                                            selectedOption
                                                ? option === quiz[currentIndex]?.answer
                                                    ? 'bg-green-200'
                                                    : option === selectedOption
                                                        ? 'bg-red-200'
                                                        : ''
                                                : ''
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            id={`option-${index}`}
                                            name="quiz"
                                            value={option}
                                            onClick={() => handleOptionClick(option)}
                                            disabled={!!selectedOption} // Disable input after selection
                                        />
                                        <label htmlFor={`option-${index}`} className="ml-2">{option}</label>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-5">
                                <button
                                    onClick={handlePreviousQuestion}
                                    disabled={currentIndex === 0}
                                    className={`bg-gray-300 text-gray-700 px-4 py-2 rounded ${currentIndex === 0 && 'cursor-not-allowed'}`}
                                >
                                    <CircleArrowLeft size={20} />
                                </button>
                                <button
                                    onClick={handleNextQuestion}
                                    disabled={currentIndex === quiz.length - 1}
                                    className={`bg-gray-300 text-gray-700 px-4 py-2 rounded ${currentIndex === quiz.length - 1 && 'cursor-not-allowed'}`}
                                >
                                    <CircleArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}