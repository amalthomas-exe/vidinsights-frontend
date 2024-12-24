import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useParams } from "react-router-dom";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { MessageCircle, SendHorizonal } from "lucide-react"
import { useSelector } from "react-redux";
import Login from "./Navbar/Login";
import axios from "axios";
import { API_URL } from "@/constants";
import { Separator } from '@/components/ui/separator';
import { Skeleton } from "@/components/ui/skeleton";

interface ChatItem {
    parts: string
    role: "user" | "model"
}

const Chat: React.FC = () => {
    const [chatArray, setChatArray] = useState<ChatItem[]>([])
    const [chatInput, setChatInput] = useState<string>("")
    const token = useSelector((state: any) => state.auth.token)
    const { id } = useParams()
    const [loading, setLoading] = useState<boolean>(true)
    const [chatMounted, setChatMounted] = useState<boolean>(false)

    useEffect(() => {
        if (!chatMounted) {
            console.log("fetching chat")

            axios.get(`${API_URL}/api/chat/history`, {
                params: {
                    video_id: id
                },

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                setLoading(false)
                setChatArray([
                    {
                        parts: "Hello! How can I help you?",
                        role: "model",
                    },
                    ...res.data.history
                ])
            }).catch(() => {
                setLoading(false)
                setChatMounted(true)
                setChatArray([
                    {
                        parts: "Hello! How can I help you?",
                        role: "model",
                    }
                ])
            }
            )
        }
    }, [])

    const handleSend = () => {
        if (chatInput === "") return
        setChatArray(prevChatArray => [...prevChatArray, {
            parts: chatInput,
            role: "user",
        }])
        setChatInput("")

        let data = {
            message: chatInput,
            video_id: id
        }
        setLoading(true)
        axios.post(`${API_URL}/api/chat`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            setChatArray(prevChatArray => [...prevChatArray, {
                parts: res.data.response,
                role: "model",
            }])
            setLoading(false)

        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <Sheet>
            <SheetTrigger>
                <div className="z-30 fixed flex flex-row items-center bottom-10 right-10 bg-gray-900 px-5 py-2 rounded-full shadow-lg">
                    <MessageCircle color="#fff" size={20} />
                    <div className="text-white font-semibold text-md ml-3">Chat</div>
                </div>
            </SheetTrigger>

            <SheetContent className="w-full">
                <SheetHeader>
                    <SheetTitle>VidInsights Chat</SheetTitle>
                    <SheetDescription>
                        Chat with your video and get insights
                    </SheetDescription>
                </SheetHeader>


                {token ?
                    <>
                        <Separator className="my-2" />
                        <div className="flex flex-col h-[90%] w-full overflow-y-auto mt-5">
                            {chatArray.map((chat, index) => (
                                chat.role === "user" ? (
                                    <div key={index} className={`flex flex-row items-center justify-end w-full ${index === chatArray.length - 1 ? "mb-5" : ""}`}>
                                        <div className="bg-gray-900 text-sm text-white px-3 py-2 rounded-lg rounded-br-none mb-5 max-w-[70%]">{chat.parts}</div>
                                    </div>
                                ) : (
                                    <div key={index} className={`flex flex-row items-center justify-start w-full ${index === chatArray.length - 1 ? "mb-5" : ""}`}>
                                        <div className="bg-gray-200 text-sm text-gray-900 px-3 py-2 rounded-lg rounded-bl-none mb-5 max-w-[70%]">{chat.parts}</div>
                                    </div>
                                )
                            ))}

                            {loading &&

                                <div className="bg-gray-200 rounded-lg rounded-bl-none mb-5 max-w-[70%] p-3">
                                    <Skeleton className="w-[80%] h-[20px] rounded-full mb-1" />
                                    <Skeleton className="w-[90%] h-[20px] rounded-full mb-1" />
                                    <Skeleton className="w-[60%] h-[20px] rounded-full mb-1" />
                                </div>
                            }
                        </div>


                        <SheetFooter className="absolute bottom-5 bg-white w-full -ml-5 px-2">
                            <form className="flex flex-row items-center justify-between w-full" onSubmit={(e) => {
                                e.preventDefault()
                                handleSend()
                            }}>
                                <Input type="text" value={chatInput} className="w-[85%] text-gray-700 text-sm" onChange={(e) => {
                                    setChatInput(e.target.value)
                                }}

                                    placeholder="Type a message"
                                />
                                <Button type="submit" className=" bg-gray-900 text-white" onClick={handleSend}>
                                    <SendHorizonal size={20} color="#fff" />
                                </Button>
                            </form>
                        </SheetFooter>
                    </> : (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="text-gray-900 text-md text-center font-semibold mb-10">You need to be logged in to use the chat feature</div>

                            <Login />
                        </div>
                    )
                }
            </SheetContent>
        </Sheet>
    )
}

export default Chat;