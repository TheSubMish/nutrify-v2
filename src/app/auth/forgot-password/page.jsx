"use client"
import { useState } from 'react';
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/auth/card";
import Label from "@/components/ui/Label";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/supabase.config.mjs';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/change-password`
            });
            if (error) throw error;
            toast.success("Password reset email sent. Check your inbox.");
        } catch (err) {
            toast.error(err.message || "Failed to send reset email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Link href="/auth/login" className="absolute top-4 left-4">
                <Button variant="ghost" className="p-2">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
            </Link>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    variant="secondary" 
                                    className="w-full mt-4"
                                    disabled={loading}
                                >
                                    {loading ? 'Sending...' : 'Send Reset Email'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="text-center text-sm">
                        Remembered your password? {" "}
                        <Link href="/auth/login" className="text-primary hover:underline">
                            Login here
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
