import React,{useState} from 'react'
import SignupForm from './SignupForm'
import OTP from './OTP'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import ProfileCreate from './ProfileCreate'

const Signup: React.FC = () => {
    const [view, setView] = useState('signup')
    const [dialogOpen, setDialogOpen] = useState(false)
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger className='flex flex-row space-x-5 border-gray-900 border-2 bg-gray-900 text-white ml-5  font-semibold items-center px-5 py-2 rounded-lg hover:shadow-lg'>
                Create Account
            </DialogTrigger>
            {view === 'signup' && <SignupForm setView={setView} setDialogOpen={setDialogOpen}/>}
            {view === 'otp' && <OTP setView={setView} />}
            {view === 'profile' && <ProfileCreate setDialogOpen={setDialogOpen} />}
        </Dialog>

    )
}

export default Signup
