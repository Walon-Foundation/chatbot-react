import React from "react"
import './Chatbot.css'

export interface ChatbotProp {
    chatbotId:string
    apiKey:string
    user:{
        name:string
    }
}


export function Chatbot(props:ChatbotProp) {
  return (
    <div>Chatbox</div>
  )
}


