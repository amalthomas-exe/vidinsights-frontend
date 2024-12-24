import React, { useLayoutEffect, useState } from 'react'
import Login from './Login'
import Signup from './Signup'
import { useSelector } from 'react-redux'
import { API_URL } from '@/constants'
import axios from 'axios'
import { setName, setEmail, setUserID, setUserType, setProfileImage } from '@/slices/userSlice'
import { login, logout } from '@/slices/authSlice'
import { useDispatch } from 'react-redux'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar: React.FC = () => {
    const user = useSelector((state: any) => state.user)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('VI_token')
        dispatch(logout())
        dispatch(setName(null))
        dispatch(setEmail(null))
        dispatch(setUserID(null))
        dispatch(setUserType(null))
        dispatch(setProfileImage(null))
    }

    useLayoutEffect(() => {
        let token = localStorage.getItem('VI_token')
        dispatch(login(token))

        if (token == null) {
            return
        }

        setLoading(true)
        axios.get(`${API_URL}/api/user`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((res) => {
            console.log(res.data)
            dispatch(setName(res.data.name))
            dispatch(setEmail(res.data.email))
            dispatch(setUserID(res.data.userID))
            dispatch(setUserType(res.data.user_type))
            dispatch(setProfileImage(res.data.profile_image))
        }
        ).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    const nav = document.getElementById('navbar')

    window.onscroll = () => {
        if (nav !== null) {
            if (window.scrollY > 100) {
                nav.classList.remove('bg-transparent')
                nav.classList.add('bg-gray-100')
            } else {
                nav.classList.remove('bg-white-100')
                nav.classList.add('bg-transparent')
            }
        }
    }

    return (
        <div className='flex flex-row justify-between w-full fixed z-20 p-5 bg-transparent' id="navbar">
            <div className='text-3xl text-gray-900 font-semibold hover:cursor-pointer' onClick={() => {
                navigate('/')
            }}>VidInsights</div>

            <div className="flex flex-row items-center">
                {
                    user.profile_image !== null ? <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <img src={user.profile_image} alt="profile" className="w-10 h-10 rounded-full cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Settings
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <div className="flex flex-row items-center">
                                    <LogOut color="#dc2626" size={20}  />
                                    <div className='font-semibold text-red-600 ml-2'>Log out</div>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                        : loading ?
                            <div className='bg-gray-400 w-10 h-10 rounded-full flex flex-col items-center justify-center'>
                                <Loader2 size={30} color='#ffffff' className="animate-spin" />
                            </div> :
                            <>
                                <Login />
                                <Signup />
                            </>

                }
            </div>
        </div>
    )
}

export default Navbar
