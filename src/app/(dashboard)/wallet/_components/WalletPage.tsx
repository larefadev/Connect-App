import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Badge, CreditCard, Download, Plus, TrendingUp, Wallet} from "lucide-react";

export const WalletPage = () => {
    const walletBalance = 5184.54;
    return(
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm opacity-80">Current Balance</p>
                                    <p className="text-3xl font-bold">${walletBalance.toLocaleString()}</p>
                                </div>
                                <Wallet className="w-8 h-8 opacity-80" />
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                                    <Plus className="w-4 h-4 mr-1" />
                                    Top Up
                                </Button>
                                <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                                    <Download className="w-4 h-4 mr-1" />
                                    Withdraw
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            This Month
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Income</span>
                                <span className="font-semibold text-green-600">+$2,150</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Expenses</span>
                                <span className="font-semibold text-red-600">-$890</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-bold">
                                <span>Net</span>
                                <span className="text-green-600">+$1,260</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <CreditCard className="w-5 h-5 mr-2" />
                            Payment Methods
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                        <CreditCard className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-sm">**** 4567</span>
                                </div>
                                <Badge>Primary</Badge>
                            </div>
                            <Button variant="outline" className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Payment Method
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { id: 1, type: 'income', description: 'Order Payment #12345', amount: 125.50, date: '2024-08-01' },
                            { id: 2, type: 'expense', description: 'Supplier Payment', amount: -450.00, date: '2024-08-01' },
                            { id: 3, type: 'income', description: 'Order Payment #12346', amount: 89.99, date: '2024-07-31' }
                        ].map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                        {transaction.type === 'income' ?
                                            <TrendingUp className="w-4 h-4 text-green-600" /> :
                                            <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                                        }
                                    </div>
                                    <div>
                                        <p className="font-medium">{transaction.description}</p>
                                        <p className="text-sm text-gray-500">{transaction.date}</p>
                                    </div>
                                </div>
                                <span className={`font-semibold ${
                                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


