import {SalesOverview} from "@/app/(dashboard)/_components/SalesOverview";
import {DashboardInformation} from "@/app/(dashboard)/_components/DashboardInformation";
import {NewArrivals} from "@/app/(dashboard)/_components/NewArrivals";

export const DashboardPage = () =>{
        return (
            <div className="space-y-6">
                {/* Sales Overview */}
                <SalesOverview/>
                {/* Order Information & wallet */}
               {/*<DashboardInformation/>*/}
                {/* New Arrivals */}
                <NewArrivals/>
            </div>
        )
}