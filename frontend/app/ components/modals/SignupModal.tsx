'use client'
import Modal from "./Modal"

import { useState } from "react"
import useSignupModal from "@/app/hooks/useSignupModal"
import CustomButtons from "../forms/CustomButtons"

const SignupModal = () => {
    const signupModal = useSignupModal()

    const content= (
        <>
            <form className="space-y-4">
                <input placeholder= "Your email address" type="email" className="w-full h-13.5 px-4 border border-gray-300 rounded-xl" />
                <input placeholder= "Your password" type="password" className="w-full h-13.5 px-4 border border-gray-300 rounded-xl" />
                <input placeholder= "Repeat Password" type="password" className="w-full h-13.5 px-4 border border-gray-300 rounded-xl" />

                <div className="p-5 bg-amber-200 text-black rounded-xl opacity-80">
                    The error message
                </div>

                <CustomButtons
                    label="Submit"
                    onClick={() => console.log("Test")}/> 
            </form>

        </>
        

        
    )
  return (
    <Modal
        isOpen={signupModal.isOpen}
        close={signupModal.close}
        label="Sign up"
        content={content}
        />
  )
}

export default SignupModal
