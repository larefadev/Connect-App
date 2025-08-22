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
            <div className="flex flex-col items-center text-center">
                <Image src={stepInformation.image} alt={stepInformation.title} width={500} height={500} />
                <h2 className="text-xl font-bold text-gray-900 mt-6">
                    {stepInformation.title}
                </h2>
                <p className="text-sm text-gray-600 mt-2 max-w-xs">
                    {stepInformation.description}
                </p>
            </div>
        </>
    )
}