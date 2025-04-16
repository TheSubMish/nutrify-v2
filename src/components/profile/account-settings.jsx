import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Input from "@/components/ui/input"
import Label from "@/components/ui/Label"
import Button from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ChangePasswordModal } from "@/components/profile/change-password"
import { useAppStore } from "@/store"
import { toast } from "sonner"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"

export default function AccountSettings({ setActiveSave }) {

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user, userSettings, setUserSettings } = useAppStore()

  useEffect(() => {

    if (!user) {
      toast.error("Please log in to access your profile.");
      return;
    }

    if (userSettings && Object.keys(userSettings).length > 0) {
      setIsLoading(false);
      return;
    }

    const fetchUserSetting = async () => {
      setIsLoading(true);

      const res = await fetch("/api/account-setting", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        toast.error("Error fetching user settings.");
        setIsLoading(false);
        return;
      }

      const response = await res.json();
      const { data } = response;

      const defaultSettings = {
        email_notification: true,
        sms_notification: true,
        push_notification: true,
        meal_reminder: true,
        notification_freq: "daily",
        data_sharing: true,
        activity_tracking: true,
      };

      if (data) {
        // Assuming data contains user settings
        setUserSettings({
          email_notification: data.email_notification ?? true,
          sms_notification: data.sms_notification ?? true,
          push_notification: data.push_notification ?? true,
          meal_reminder: data.meal_remainder ?? true,
          notification_freq: data.notification_freq ?? "daily",
          data_sharing: data.data_sharing ?? true,
          activity_tracking: data.activity_tracking ?? true,
        });
      } else {
        // If no settings found, use default settings
        setUserSettings(defaultSettings);
      }

      setIsLoading(false);
    }

    fetchUserSetting();

  }, [user]);

  const handleToggleChange = (field) => {

    const currentSetting = userSettings;
    const newSetting = { ...currentSetting, [field]: !currentSetting[field] };
    setUserSettings(newSetting);
    setActiveSave(true);

  }

  const handleSelectChange = (value) => {
    const currentSetting = userSettings;
    const newSetting = { ...currentSetting, notification_freq: value };
    setUserSettings(newSetting);
    setActiveSave(true);
  }


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

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
              <Input id="fullName" defaultValue={user.name} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold">Email Address</Label>
              <Input id="email" defaultValue={user.email} type="email" disabled />
            </div>
          </div>

          <div className="space-y-2">
            {/* <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value="••••••••" /> */}
            <Button
              variant="secondary"
              className="h-auto p-0 text-sm font-extrabold"
              onClick={() => setIsPasswordModalOpen(true)}
            >
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
              <Switch id="emailNotifications" checked={userSettings.email_notification}
                onCheckedChange={() => handleToggleChange("email_notification")} className={userSettings.email_notification ? "primary-bg" : "tertiary-bg"} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushNotifications" className="text-base font-bold">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive real-time alerts on your device</p>
              </div>
              <Switch id="pushNotifications" checked={userSettings.push_notification}
                onCheckedChange={() => handleToggleChange("push_notification")} className={userSettings.push_notification ? "primary-bg" : "tertiary-bg"} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="mealReminders" className="text-base font-bold">
                  Meal Reminders
                </Label>
                <p className="text-sm text-muted-foreground">Get reminders for logging your meals</p>
              </div>
              <Switch id="mealReminders" checked={userSettings.meal_reminder}
                onCheckedChange={() => handleToggleChange("meal_reminder")} className={userSettings.meal_reminder ? "primary-bg" : "tertiary-bg"} />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-base font-bold">Notification Frequency</Label>
            <RadioGroup className="grid grid-cols-1 md:grid-cols-3 gap-4" value={userSettings.notification_freq} onValueChange={handleSelectChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="text-sm font-normal">
                  Daily Digest
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="text-sm font-normal">
                  Weekly Summary
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="important" id="important" />
                <Label htmlFor="important" className="text-sm font-normal">
                  Important Only
                </Label>
              </div>
            </RadioGroup>
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
            <Switch id="dataSharing" checked={userSettings.data_sharing}
              onCheckedChange={() => handleToggleChange("data_sharing")} className={userSettings.data_sharing ? "primary-bg" : "tertiary-bg"} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="activityTracking" className="text-base font-bold">
                Activity Tracking
              </Label>
              <p className="text-sm text-muted-foreground">Track app usage to personalize your experience</p>
            </div>
            <Switch id="activityTracking" checked={userSettings.activity_tracking}
              onCheckedChange={() => handleToggleChange("activity_tracking")} className={userSettings.activity_tracking ? "primary-bg" : "tertiary-bg"} />
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
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  )
}

