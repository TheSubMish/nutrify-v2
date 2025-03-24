"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/auth/card";
import Label from "@/components/ui/Label";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Check if user just registered
        if (router.query?.registered === 'true') {
            setSuccessMessage('Account created successfully! Please login.');
        }
    }, [router.query]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            setLoading(true);
            
            // Sign in with Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;
            const { data: { session } } = await supabase.auth.getSession();
            // If successful, redirect to dashboard
            if (data?.user) {
                // Store token in localStorage (Supabase handles this automatically)
                toast.success("Logged in successfully");

                console.log("Session Before Saving: ", session);
                localStorage.setItem("session", JSON.stringify(session));
                console.log("Session After Saving: ", localStorage.getItem("session"));

                setTimeout(() => {
                    router.push('/dashboard');
                }, 500);
            }
        } catch (err) {
            toast.error(err.message || "Invalid email or password");
            // setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

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
                        <CardTitle className="text-2xl font-bold text-center">Login to NutrifyMe</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                {error && (
                                    <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                                        {error}
                                    </div>
                                )}
                                {successMessage && (
                                    <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
                                        {successMessage}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        required 
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input 
                                        id="password" 
                                        type="password" 
                                        placeholder="Enter your password" 
                                        required 
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="text-right">
                                    <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Button 
                                    type="submit" 
                                    variant="secondary" 
                                    className="w-full mt-4"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-center text-sm">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="text-primary hover:underline">
                                Register here
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}