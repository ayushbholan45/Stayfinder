'use client';

import { useEffect } from "react";
import CustomButtons from "../forms/CustomButtons"
import { ConversationType } from "@/app/inbox/page";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { getAccessToken } from "@/app/lib/actions";

interface ConversationDetailProps {
    userId: string;
    token: string;
    conversation: ConversationType;
    
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({
    userId,
    token,
    conversation
}) => {
    
    const myUser = conversation.users?.find((user) => user.id == userId)
    const otherUser = conversation.users?.find((user) => user.id != userId)

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(`ws://127.0.0.1:8000/ws/${conversation.id}/?token=${token}`, {
        share: false,
        shouldReconnect: () => true,
      },
    )

    useEffect(() => {
        console.log("Connection state changed", readyState);
    }, [readyState]);
    
    return (
    <>
        <div className="max-h-100 overflow-auto flex flex-col space-y-4">
            <div className="w-[80%] py-4 px-6 rounded-xl bg-blue-200">
                <p className="font-bold text-gray-500">John Doe</p>
                <p>hello i am John</p>
            </div>
            
            <div className="w-[80%] ml-[20%] py-4 px-6 rounded-xl bg-pink-200">
                <p className="font-bold text-gray-500">Raymond Green</p>
                <p>hello i am Raymond</p>
            </div>
        </div>

        <div className="mt-4 py-4 px-6 flex border border-gray-300 space-x-4 rounded-xl">
            <input 
                type="text" 
                placeholder="Type your message..." 
                className="w-full p-2 bg-gray-100 rounded-xl"
            />

            <CustomButtons 
                label="Send"
                onClick={() => console.log("Clicked")}
                className="w-25 bg-stayfinder hover:bg-stayfinder-dark"/>
                

        </div>
    </>
    
  )
}

export default ConversationDetail
