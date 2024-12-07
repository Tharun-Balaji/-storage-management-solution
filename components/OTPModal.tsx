"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { sendEmailOTP, verifySecret } from "@/lib/actions/user.actions";

/**
 * Renders an OTP modal for verifying a user's account.
 * This component displays an AlertDialog with inputs for a 6-digit OTP code.
 * Users can submit the OTP for verification or request a resend of the OTP.
 * Upon successful verification, the user is redirected to the homepage.
 * 
 * @param {string} accountId - The account ID of the user.
 * @param {string} email - The email address to which the OTP is sent.
 * 
 * @returns {JSX.Element} The OTP modal component.
 */
export default function OTPModal({ accountId, email }: { accountId: string; email: string }) {

  const router = useRouter();

  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the submission of the OTP form
   * @param {React.MouseEvent<HTMLButtonElement>} e - The event object
   */
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    console.log({ accountId, password });

    try {
      /**
       * Verify the OTP and authenticate the user
       * @param {{ accountId: string; password: string; }} - The user ID and OTP to verify
       */
      const sessionId = await verifySecret({ accountId, password });

      console.log({ sessionId });

      /**
       * If the OTP is valid, redirect the user to the homepage
       */
      if (sessionId) router.push("/");
    } catch (error) {
      console.error("Failed to verify OTP", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleResendOtp = async () => {
    await sendEmailOTP({ email });
  };

  return (
    // AlertDialog component to display the OTP modal
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter Your OTP
            {/* Close button to close the dialog */}
            <Image
              src="/assets/icons/close-dark.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => setIsOpen(false)}
              className="otp-close-button"
            />
          </AlertDialogTitle>

          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            {/* Display the email address to which the OTP was sent */}
            We&apos;ve sent a code to{" "}
            <span className="pl-1 text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Input for OTP with 6 slots */}
        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className="shad-otp">
            <InputOTPSlot index={0} className="shad-otp-slot" />
            <InputOTPSlot index={1} className="shad-otp-slot" />
            <InputOTPSlot index={2} className="shad-otp-slot" />
            <InputOTPSlot index={3} className="shad-otp-slot" />
            <InputOTPSlot index={4} className="shad-otp-slot" />
            <InputOTPSlot index={5} className="shad-otp-slot" />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            {/* Submit button for OTP verification */}
            <AlertDialogAction
              onClick={handleSubmit}
              className="shad-submit-btn h-12"
              type="button"
            >
              Submit
              {/* Loader shown during submission */}
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
            </AlertDialogAction>
            <div className="subtitle-2 mt-2 text-center text-light-100">
              {/* Resend OTP option */}
              Didn&apos;t get a code?
              <Button
                type="button"
                variant="link"
                className="pl-1 text-brand"
                onClick={handleResendOtp}
              >
                Click to resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}