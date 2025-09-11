import Image from "next/image"
import { IStep } from "../Types/Step"

type Props = {
    stepInformation:IStep 
}


export const Step = (
    props: Props
)=>{
    const { stepInformation } = props
    return (
        <>
            <div className="flex flex-col items-center text-center px-4">
                <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
                    <Image 
                        src={stepInformation.image} 
                        alt={stepInformation.title} 
                        width={500} 
                        height={500}
                        className="w-full h-auto object-contain"
                    />
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mt-4 sm:mt-6 px-2">
                    {stepInformation.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-sm sm:max-w-md lg:max-w-lg px-2 leading-relaxed">
                    {stepInformation.description}
                </p>
            </div>
        </>
    )
}