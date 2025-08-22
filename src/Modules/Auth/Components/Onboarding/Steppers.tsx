"use client"
import { useState } from "react"
import { Step } from "./Step"



export const Steppers = () => {

    const [currentStep, setCurrentStep] = useState<number>(1)

    const dataStep = [
        {
            stepNumber: 1,
            title: "Selling auto parts without stocking inventory",
            description: "Access over 250,000 auto parts ready to sell from our platform, with new products added daily.",
            image: "/images/Frame.png"
        },
        {
            stepNumber: 2,
            title: "Start your online auto parts store instantly",
            description: "Set up your digital store in minutes and start selling fast — no tech hassle, no waiting, no stress.",
            image:  "/images/Card.png"
        },
        {
            stepNumber: 3,
            title: "We handle the delivery for every order",
            description: "You make a sale, and we carefully pick and deliver it straight to your customer’s door, hassle-free.",
            image: "/images/Frame(1).png"
        }
    ]

    const stepPointer = () => {
        return (
          <div className="flex justify-center gap-2 mt-4">
            {dataStep.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full ${
                  currentStep === index ? 'bg-red-600' : 'bg-gray-300'
                } transition-all duration-300`}
              />
            ))}
          </div>
        )
      }
      
    

    return (
        <div className="flex items-center justify-center p-4 h-screen">
            <div className="flex flex-row justify-center">
                <div>
                    <Step stepInformation={dataStep[currentStep]} />
                    {stepPointer()}
                </div>
            </div>
        </div>
    )
}