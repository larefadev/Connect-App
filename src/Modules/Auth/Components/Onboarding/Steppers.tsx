"use client"
import { useState } from "react"
import { Step } from "./Step"



export const Steppers = () => {

    const [currentStep, setCurrentStep] = useState<number>(1)

    const dataStep = [
        {
            stepNumber: 1,
            title: "Vende repuestos automotrices sin mantener inventario",
            description: "Accede a más de 250,000 repuestos automotrices listos para vender desde nuestra plataforma, con nuevos productos agregados diariamente.",
            image: "/images/Frame.png"
        },
        {
            stepNumber: 2,
            title: "Inicia tu tienda de repuestos automotrices en línea instantáneamente",
            description: "Configura tu tienda digital en minutos y comienza a vender rápido — sin complicaciones técnicas, sin esperas, sin estrés.",
            image:  "/images/Card.png"
        },
        {
            stepNumber: 3,
            title: "Nos encargamos de la entrega de cada pedido",
            description: "Tú haces una venta, y nosotros seleccionamos y entregamos cuidadosamente directamente a la puerta de tu cliente, sin complicaciones.",
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