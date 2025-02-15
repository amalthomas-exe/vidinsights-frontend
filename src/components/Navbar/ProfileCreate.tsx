import React, { useState } from "react";
import { DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useSelector, useDispatch } from "react-redux";
import { setName, setUserType, setProfileImage } from "@/slices/userSlice";
import { Check, ChevronsUpDown } from "lucide-react"
import axios from "axios";
import { API_URL } from "@/constants";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const options = [
    {
        value: "student",
        label: "Student",
    },
    {
        value: "professional",
        label: "Professional",
    },
    {
        value: "teacher",
        label: "Teacher",
    },
    {
        value: "freelancer",
        label: "Freelancer",
    },
    {
        value: "other",
        label: "Other",
    },
]

interface ProfileCreateProps {
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileCreate: React.FC<ProfileCreateProps> = ({ setDialogOpen }) => {
    const user = useSelector((state: any) => state.user)
    const token = useSelector((state: any) => state.auth.token)

    const dispatch = useDispatch()

    const [open, setOpen] = useState(false)
    const [name, setLocalName] = useState(user.name !== null ? user.name : "")
    const [value, setValue] = useState("other")
    const [loading, setLoading] = useState(false)

    console.log(user)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalName(e.target.value)
    }

    const handleSubmit = () => {
        console.log("Submitted")

        if (name === "" || value === "") {
            return
        }

        let data = {
            name: name,
            user_type: value,
            profile_image: `https://api.dicebear.com/9.x/thumbs/svg?seed=${name}`
        }

        setLoading(true)
        axios.post(`${API_URL}/api/user/create`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res.data)
                dispatch(setName(name))
                dispatch(setUserType(value))
                dispatch(setProfileImage(`https://api.dicebear.com/9.x/thumbs/svg?seed=${name}`))
                setDialogOpen(false)
            })
            .catch((err) => {
                console.log(err)
            }).finally(() => {
                setLoading(false)
            })
    }



    return (
        <div>
            <DialogContent className="min-w-3/4 pt-10">
                <DialogHeader>
                    <DialogTitle>Create Profile</DialogTitle>
                    <DialogDescription>
                        Just a few more steps to create your profile
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col justify-center-center mt-5">
                    <Label className="text-md font-semibold">Name</Label>
                    <Input className="mt-2" placeholder="John Doe" value={name} onChange={handleChange} />

                    <Label className="text-md font-semibold mt-5 mb-3">How would you describe yourself</Label>

                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[200px] justify-between"
                            >
                                {value
                                    ? options.find((option) => option.value === value)?.label
                                    : "Select an option"}
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Search options" className="h-9" />
                                <CommandList>
                                    <CommandEmpty>No option found.</CommandEmpty>
                                    <CommandGroup>
                                        {options.map((option) => (
                                            <CommandItem
                                                key={option.value}
                                                value={option.value}
                                                onSelect={(currentValue) => {
                                                    setValue(currentValue === value ? "" : currentValue)
                                                    setOpen(false)
                                                }}
                                            >
                                                {option.label}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        value === option.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                <DialogFooter>
                    <Button className="mt-3" onClick={handleSubmit}>
                        {loading ?
                            <>
                                <Loader2 className="animate-spin" />
                                <div>
                                    Creating Profile
                                </div>
                            </> : "Create Profile"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </div>
    );
};

export default ProfileCreate;