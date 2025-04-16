"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/auth/card";
import Label from "@/components/ui/Label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "@/store";
import Image from "next/image";
import GoogleIcon from "@/assets/img/google-icon.png";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClientComponentClient();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            const userData = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.full_name || "User",
                avatar: data.user.user_metadata?.avatar_url || null,
                created_at: data.user.created_at,
            };

            useAppStore.getState().setUser(userData);

            toast.success("Logged in successfully");

            router.push("/dashboard/profile");
        } catch (err) {
            toast.error(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            }
        });

        if (error) {
            toast.error(error.message || "Google sign-in failed");
            router.push("/auth/login");
        }

        // router.push("/auth/callback");
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
                                <Button type="submit" variant="secondary" className="w-full mt-4" disabled={loading}>
                                    {loading ? "Logging in..." : "Login"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    {/* <CardContent>
                        <div className="flex flex-col items-center space-y-4">
                            <Button
                                variant="outline"
                                className="w-full flex items-center justify-center space-x-2"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                            >
                                <Image
                                    src={GoogleIcon}
                                    alt="Google"
                                    width={20}
                                    height={20}
                                    className="h-5 w-5"
                                />
                                <span>Sign in with Google</span>
                            </Button>
                        </div>
                    </CardContent> */}
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
