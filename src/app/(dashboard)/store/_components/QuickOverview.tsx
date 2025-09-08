import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { StoreStats } from "@/types/store"


type QuickOverviewProps = {
    stats: StoreStats[]
}

export const QuickOverview = ({ stats }: QuickOverviewProps) => {
    return(
        <div className="max-w-7xl mx-auto px-6 mt-8">
                <h3 className="text-2xl font-bold mb-6">Vista Rápida</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat: StoreStats, index: number) => (
                        <Card key={index} className="bg-white shadow-md">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <stat.icon className={`w-8 h-8 ${stat.color as string}`} />
                                    <Button variant="ghost" size="sm">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                                <p className="text-3xl font-bold">{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>   
    )
}