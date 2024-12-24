import React, { useState } from "react";
import { useFormik, FormikValues } from "formik";
import {DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, InfoIcon } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { login } from "@/slices/authSlice";
import { setEmail ,setName,setUserID,setUserType,setProfileImage} from "@/slices/userSlice";
import { API_URL } from "@/constants";
import axios from "axios";
import * as Yup from "yup";

interface SignupFormValues {
    email: string;
    password: string;
    passwordConfirm: string;
}

interface SignupFormProps {
    setView: React.Dispatch<React.SetStateAction<string>>;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupForm: React.FC<SignupFormProps> = ({setView,setDialogOpen}) => {

    const initialValues: SignupFormValues = {
        email: '',
        password: '',
        passwordConfirm: ''
    }

    const dispatch = useDispatch()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)

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
        passwordConfirm: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Required')
    })

    const handleSubmit = (
        values: FormikValues
    ) => {
        let data = {
            email: values.email,
            password: values.password
        }
        setIsSubmitting(true)

        axios.post(`${API_URL}/api/user/signup`, data)
            .then((res) => {
                dispatch(login(res.data.token))
                localStorage.setItem('VI_token', res.data.token)
                dispatch(setEmail({email: values.email}))
                setView('otp')
            })
            .catch((err) => {
                if (err.response.status === 400) {
                    setAlert({
                        title: 'Error',
                        description: err.response.data.message,
                        type: 'destructive'
                    })
                    setAlertVisible(true)
                }
            }
            ).finally(() => {
                setIsSubmitting(false)
            })
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
    });

    const loadUserData = (token: string) => {
        axios.get(`${API_URL}/api/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res.data)
                dispatch(setName(res.data.name))
                dispatch(setEmail(res.data.email))
                dispatch(setUserID(res.data.userID))

                if (!res.data.profile_completed) {
                    setView('profile')
                    return
                }

                dispatch(setUserType(res.data.user_type))
                dispatch(setProfileImage(res.data.profile_image))
                setDialogOpen(false)
                
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
                localStorage.setItem('VI_token', res.data.token)
                dispatch(login(res.data.token))
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


    return (
        <div>
            <DialogContent className="min-w-3/4 pt-10">
                <DialogHeader>
                    <DialogTitle>Create profile</DialogTitle>
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
                    {googleLoading ? <Loader2 className="animate-spin" /> : <FontAwesomeIcon icon={faGoogle} />}

                    <div className='font-semibold'>
                        {googleLoading ? "Creating account" : "Continue with Google"}
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

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="passwordConfirm" className="text-right">
                                Confirm Password
                            </Label>
                            <Input id="passwordConfirm" type='password' value={formik.values.passwordConfirm} className={`col-span-3 ${formik.touched.passwordConfirm && formik.errors.passwordConfirm ? "border-red-400 border-2" : null}`} onChange={formik.handleChange} />
                        </div>
                    </div>
                    <DialogFooter>
                        {!isSubmitting ? <Button type="submit">Next</Button> : <Button disabled>
                            <Loader2 className="animate-spin" />
                            Please wait
                        </Button>}
                    </DialogFooter>
                </form>
            </DialogContent>
        </div>
    )
}

export default SignupForm;