import React, { useState } from "react";
import { DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";

interface OTPProps {
  setView: React.Dispatch<React.SetStateAction<string>>;
};

const OTP: React.FC<OTPProps> = ({setView}) => {

  const [value, setValue] = useState("")

  const handleSubmit = ()=>{
    setView('profile')
  }
  return (
    <div>
      <DialogContent className="min-w-3/4 pt-10">
        <DialogHeader>
          <DialogTitle>Email Verification</DialogTitle>
          <DialogDescription>
            Please enter the OTP sent to your email
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-row items-center justify-center mt-5">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(value) => setValue(value)}
            pattern="[0-9]*"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-14 h-14 text-2xl" />
              <InputOTPSlot index={1} className="w-14 h-14 text-2xl" />
              <InputOTPSlot index={2} className="w-14 h-14 text-2xl" />
              <InputOTPSlot index={3} className="w-14 h-14 text-2xl" />
              <InputOTPSlot index={4} className="w-14 h-14 text-2xl" />
              <InputOTPSlot index={5} className="w-14 h-14 text-2xl" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <DialogFooter>
          <Button className="mt-3" onClick={handleSubmit}>
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
};

export default OTP;