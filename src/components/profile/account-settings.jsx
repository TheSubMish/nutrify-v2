import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Input from "@/components/ui/input"
import Label from "@/components/ui/Label"
import Button from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function AccountSettings({ user }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Update your account details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="font-bold">Full Name</Label>
              <Input id="fullName" defaultValue={user.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold">Email Address</Label>
              <Input id="email" defaultValue={user.email} type="email" />
            </div>
          </div>

          <div className="space-y-2">
            {/* <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value="••••••••" /> */}
            <Button variant="secondary" className="h-auto p-0 text-sm font-extrabold">
              Change password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Control how and when you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications" className="text-base font-bold">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive updates, tips, and reminders via email</p>
              </div>
              <Switch id="emailNotifications" defaultChecked className="primary-bg" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushNotifications" className="text-base font-bold">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive real-time alerts on your device</p>
              </div>
              <Switch id="pushNotifications" defaultChecked className="primary-bg" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="mealReminders" className="text-base font-bold">
                  Meal Reminders
                </Label>
                <p className="text-sm text-muted-foreground">Get reminders for logging your meals</p>
              </div>
              <Switch id="mealReminders" defaultChecked className="primary-bg" />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-base font-bold">Notification Frequency</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <input type="radio" id="daily" name="frequency" className="rounded-full" defaultChecked />
                <Label htmlFor="daily" className="text-sm font-normal">
                  Daily Digest
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="weekly" name="frequency" className="rounded-full" />
                <Label htmlFor="weekly" className="text-sm font-normal">
                  Weekly Summary
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="important" name="frequency" className="rounded-full" />
                <Label htmlFor="important" className="text-sm font-normal">
                  Important Only
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Manage your data and privacy preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dataSharing" className="text-base font-bold">
                Data Sharing
              </Label>
              <p className="text-sm text-muted-foreground">Allow anonymous data sharing to improve recommendations</p>
            </div>
            <Switch id="dataSharing" defaultChecked className="primary-bg"/>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="activityTracking" className="text-base font-bold">
                Activity Tracking
              </Label>
              <p className="text-sm text-muted-foreground">Track app usage to personalize your experience</p>
            </div>
            <Switch id="activityTracking" defaultChecked className="primary-bg"/>
          </div>

          <div className="mt-6 space-y-2">
            <Button variant="primary" className="font-extrabold">Download My Data</Button>
            <p className="text-xs text-muted-foreground">Request a copy of all your personal data</p>
          </div>

          <div className="mt-6">
            <Button variant="tertiary" className="font-extrabold">Delete Account</Button>
            <p className="text-xs text-muted-foreground mt-2">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

