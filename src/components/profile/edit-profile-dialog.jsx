"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Button from "@/components/ui/button"
import Label from "@/components/ui/Label"
import Input from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function EditProfileDialog({ user, isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        userId: user?.id || "",
        name: user?.name || "",
        email: user?.email || "",
        avatar: user?.avatar || "",
    })
    const [isLoading, setIsLoading] = useState(false)

    console.log(user);
    

    const fileInputRef = useRef(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
      
        try {
            const formDataToSend = new FormData()
            formDataToSend.append('userId', user.id)
            formDataToSend.append('name', formData.name)
            formDataToSend.append('email', formData.email)
            
            // Append file if selected
            if (fileInputRef.current.files[0]) {
                formDataToSend.append('file', fileInputRef.current.files[0])
            }
        
            const response = await fetch("/api/profile", {
                method: "POST",
                body: formDataToSend // Let browser set Content-Type with boundary
            })
        
            const data = await response.json()
            console.log(data.success)
            if (data.success) {
                toast.success("Your profile has been updated")
                if (onSuccess) onSuccess(data.user)
                onClose()
            } else {
                toast.error(data.message || "Failed to update profile")
            }
        } catch (error) {
          toast.error("Something went wrong. Please try again.")
        } finally {
          setIsLoading(false)
        }
    }

    const handleAvatarChange = (event) => {
        const file = event.target.files[0]
        if (file) {
        const newAvatarUrl = URL.createObjectURL(file)
            setFormData((prev) => ({
                ...prev,
                avatar: newAvatarUrl,
            }))
        }
    }

    const handleCameraClick = () => {
        fileInputRef.current.click()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center mb-4">
                <div className="relative">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={formData.avatar} alt={formData.name} />
                    <AvatarFallback className="tertiary-bg">
                    {formData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                </Avatar>
                    <Camera className="h-4 w-4 absolute top-8 left-8" onClick={handleCameraClick} />
                    <input name="file" type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleAvatarChange} />
                    <span className="sr-only">Change profile picture</span>
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            </div>
            <DialogFooter>
            <Button variant="outline" onClick={onClose}>
                Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    )
}

