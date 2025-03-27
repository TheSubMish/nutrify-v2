"use client"
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/auth/card";
import Label from "@/components/ui/Label";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/supabase.config";

// Initialize Supabase client
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };
    // setError(err.message || "An error occurred during registration");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Form validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            
            // Sign up with Supabase
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name,
                    }
                }
            });

            if (error) throw error;

            // If successful, store user profile data in the profiles table
            if (data?.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        { 
                            id: data.user.id, 
                            full_name: formData.name,
                            email: formData.email
                        }
                    ]);
                
                if (profileError) throw profileError;
                
                // Redirect to login page with success message
                toast.success("Account created successfully!");
                router.push('/dashboard');
            }
        } catch (err) {
            toast.error(err.message || "An error occurred during registration");
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
                        <CardTitle className="text-2xl font-bold text-center">Register for NutrifyMe</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                {error && (
                                    <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input 
                                        id="name" 
                                        type="text" 
                                        placeholder="Enter your full name" 
                                        required 
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
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
                                        placeholder="Create a password" 
                                        required 
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input 
                                        id="confirmPassword" 
                                        type="password" 
                                        placeholder="Confirm your password" 
                                        required 
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    variant="secondary" 
                                    className="w-full mt-4"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating account...' : 'Register'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
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
    );
}