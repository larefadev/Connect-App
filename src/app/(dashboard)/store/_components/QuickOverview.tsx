import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { StoreStats } from "@/types/store"


type QuickOverviewProps = {
    stats: StoreStats[]
}

export const QuickOverview = ({ stats }: QuickOverviewProps) => {
    return(
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left">Vista Rápida</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {stats.map((stat: StoreStats, index: number) => (
                        <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color as string}`} />
                                    <Button variant="ghost" size="sm" className="p-1 sm:p-2">
                                        <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </Button>
                                </div>
                                <p className="text-gray-600 text-xs sm:text-sm mb-2 leading-tight">{stat.label}</p>
                                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>   
    )
}