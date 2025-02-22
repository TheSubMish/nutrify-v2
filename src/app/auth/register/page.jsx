import Button from "@/components/ui/button"
import Input from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/auth/card"
import Label from "@/components/ui/Label"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'


export default function RegisterPage() {
    return (
        <>
            <Link href="/" className="absolute top-4 left-4">
                <Button variant="ghost" className="p-2">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
            </Link>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Register for NutrifyMe</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" type="text" placeholder="Enter your full name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Enter your email" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" placeholder="Create a password" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input id="confirmPassword" type="password" placeholder="Confirm your password" required />
                            </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button variant="secondary" className="w-full">Register</Button>
                        <div className="text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-primary hover:underline">
                            Log in here
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}