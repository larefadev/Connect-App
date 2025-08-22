import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Upload, User} from "lucide-react";
import {Button} from "@/components/ui/button";

export const ProfilePage = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold">Profile</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-400" />
                    </div>
                    <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                    </Button>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">First Name</label>
                            <input type="text" className="w-full p-2 border rounded-lg" defaultValue="Auto" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Last Name</label>
                            <input type="text" className="w-full p-2 border rounded-lg" defaultValue="Parts" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input type="email" className="w-full p-2 border rounded-lg" defaultValue="auto@parts.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input type="tel" className="w-full p-2 border rounded-lg" defaultValue="+1 234 567 8900" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <textarea className="w-full p-2 border rounded-lg"  defaultValue="123 Main Street, Bogotá, Colombia"></textarea>
                    </div>
                    <Button className="bg-red-500 hover:bg-red-600 text-white">
                        Save Changes
                    </Button>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive email updates about your orders</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-sm text-gray-500">Receive SMS updates about your orders</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 className="font-medium">Marketing Communications</h3>
                        <p className="text-sm text-gray-500">Receive promotional emails and offers</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
            </CardContent>
        </Card>
    </div>
);