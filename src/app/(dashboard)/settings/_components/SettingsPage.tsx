import { Button } from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Globe, Package, Settings , History} from "lucide-react";

export const SettingsPage = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold">Settings</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Language</label>
                        <select className="w-full p-2 border rounded-lg">
                            <option>English</option>
                            <option>Español</option>
                            <option>Français</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Currency</label>
                        <select className="w-full p-2 border rounded-lg">
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>COP ($)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Time Zone</label>
                        <select className="w-full p-2 border rounded-lg">
                            <option>America/Bogota</option>
                            <option>America/New_York</option>
                            <option>Europe/London</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Two-Factor Authentication
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                        <History className="w-4 h-4 mr-2" />
                        Login History
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Store Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Store Name</label>
                        <input type="text" className="w-full p-2 border rounded-lg" defaultValue="LA REFA - Auto Parts" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Business Hours</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="time" className="p-2 border rounded-lg" defaultValue="09:00" />
                            <input type="time" className="p-2 border rounded-lg" defaultValue="18:00" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
                        <input type="number" className="w-full p-2 border rounded-lg" defaultValue="10" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Integrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                            <Globe className="w-8 h-8 text-blue-500" />
                            <div>
                                <h3 className="font-medium">WhatsApp Business</h3>
                                <p className="text-sm text-gray-500">Connect with customers</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                            <Package className="w-8 h-8 text-green-500" />
                            <div>
                                <h3 className="font-medium">Inventory Management</h3>
                                <p className="text-sm text-gray-500">Sync with external systems</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Connect</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
);