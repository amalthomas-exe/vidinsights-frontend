import React, { useState } from 'react'
import { FormikValues, useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { API_URL } from '@/constants';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from '../ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Loader2, InfoIcon } from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { login } from '@/slices/authSlice'
import { setEmail,setName,setUserType,setUserID,setProfileImage } from '@/slices/userSlice';

interface LoginFormValues {
    email: string;
    password: string;
}

const Login: React.FC = () => {

    const initialValues: LoginFormValues = {
        email: '',
        password: '',
    }

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)

    const dispatch = useDispatch()

    const [alertVisible, setAlertVisible] = useState(false)
    const [alert, setAlert] = useState<{
        title: string;
        description: string;
        type: 'destructive' | 'default' | null | undefined;
    }>({
        title: '',
        description: '',
        type: null
    })

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().required('Required'),
    })

    const handleSubmit = (
        values: FormikValues
    ) => {
        let data = {
            email: values.email,
            password: values.password
        }
        setIsSubmitting(true)

        axios.post(`${API_URL}/api/user/login`, data)
            .then((res) => {
                dispatch(login(res.data.token))
                localStorage.setItem('VI_token', res.data.token)
                loadUserData(res.data.token)
            })
            .catch((err) => {
                setIsSubmitting(false)
                if (err.response.status === 400) {
                    setAlert({
                        title: 'Error',
                        description: err.response.data.message,
                        type: 'destructive'
                    })
                    setAlertVisible(true)
                }

                if (err.response.status === 401) {
                    setAlert({
                        title: 'Error',
                        description: "A different login method (Google) is associated with this email. Please login with Google",
                        type: 'destructive'
                    })
                    setAlertVisible(true)
                }
            }
            )
    };

    const loadUserData = (token: string) => {
        axios.get(`${API_URL}/api/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res.data)

                if (!res.data.profile_completed) {
                    setAlert({
                        title: 'Error',
                        description: "Please complete your profile to continue",
                        type: 'destructive'
                    })
                    setAlertVisible(true)
                    return
                }

                dispatch(setEmail(res.data.email))
                dispatch(setName(res.data.name))
                dispatch(setUserType(res.data.user_type))
                dispatch(setUserID(res.data.userID))
                dispatch(setProfileImage(res.data.profile_image))
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setIsSubmitting(false)
            })
    }


    const responseMessage = (response: any) => {
        console.log(response)
        axios.post(`${API_URL}/api/user/google`, {
            access_token: response.access_token
        })
            .then(async (res) => {
                dispatch(login(res.data.token))
                localStorage.setItem('VI_token', res.data.token)
                loadUserData(res.data.token)
            })
            .catch((err) => {
                console.log(err.response.data.message)
                if (err.response.status === 401) {
                    setAlert({
                        title: 'Error',
                        description: "An account with this Email ID already exists. Please login with your email and password",
                        type: 'destructive'
                    })
                    setAlertVisible(true)
                }
            }
            ).finally(() => {
                setGoogleLoading(false)
            })
    }

    const errorMessage = () => {
        setAlert({
            title: 'Error',
            description: 'An error occurred while logging in with Google',
            type: 'destructive'
        })
        setGoogleLoading(false)
        setAlertVisible(true)
    }

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: responseMessage,
        onError: errorMessage
    })


    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
    });


    return (
        <Dialog>
            <DialogTrigger className='flex flex-row space-x-5 border-gray-900 border-2 font-semibold items-center px-5 py-2 rounded-lg hover:shadow-lg'>
                Login
            </DialogTrigger>

            <DialogContent className="min-w-3/4 pt-10">

                <DialogHeader>
                    <DialogTitle>Login to your account</DialogTitle>
                </DialogHeader>
                {alertVisible && <Alert className='animate-in' variant={alert.type}>
                    <InfoIcon className='h-4 w-4' />
                    <AlertTitle>{alert.title}</AlertTitle>
                    <AlertDescription>
                        {alert.description}
                    </AlertDescription>
                </Alert>}

                <Button className='mt-3 flex flex-row border-gray-900 border-2' variant="outline" onClick={() => {
                    setGoogleLoading(true)
                    handleGoogleLogin()
                }}>
                    {googleLoading ? <Loader2 className='animate-spin' /> : <FontAwesomeIcon icon={faGoogle} />}

                    <div className='font-semibold'>
                        {googleLoading ? "Logging in" : "Continue with Google"}
                    </div>
                </Button>
                
                <Separator className='my-2' />

                <form onSubmit={formik.handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email Address
                            </Label>
                            <Input id="email" value={formik.values.email} className={`col-span-3 ${formik.touched.email && formik.errors.email ? "border-red-400 border-2" : null}`} onChange={formik.handleChange} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <Input id="password" type='password' value={formik.values.password} className={`col-span-3 ${formik.touched.password && formik.errors.password ? "border-red-400 border-2" : null}`} onChange={formik.handleChange} />
                        </div>
                    </div>
                    <DialogFooter>
                        {!isSubmitting ? <Button type="submit">Login</Button> : <Button disabled>
                            <Loader2 className="animate-spin" />
                            Please wait
                        </Button>}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

    )
}

export default Login