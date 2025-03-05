import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import Button from "@/components/ui/button"
import { Camera, Edit } from "lucide-react"

export default function ProfileHeader({ user }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="tertiary-bg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div size="icon" variant="secondary" className="absolute top-10 left-10 h-8 w-8 rounded-full">
              <Camera className="h-4 w-4" />
            </div>
            {/* <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full"> */}
              {/* <span className="sr-only">Change profile picture</span>
            </Button> */}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Edit className="h-3.5 w-3.5" />
                Edit Profile
              </Button>
            </div>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground mt-1">Member since {user.joinDate}</p>
          </div>

          {/* <div className="flex flex-col items-center gap-2 bg-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Current Plan</div>
            <div className="font-semibold">Premium</div>
            <Button variant="outline" size="sm">
              Manage Plan
            </Button>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}

