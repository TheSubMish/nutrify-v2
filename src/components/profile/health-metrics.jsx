import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/Label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { InfoIcon as InfoCircle } from "lucide-react";

export default function HealthMetrics({ initialMetrics, setActiveSave, setMetricsInProfile }) {
  const [metrics, setMetrics] = useState(initialMetrics || {
    age: "",
    height: "",
    weight: "",
    bmi: "",
    bodyFat: "",
    chest: "",
    waist: "",
    hips: ""
  });

  // Calculate BMI whenever height or weight changes
  useEffect(() => {
    if (metrics.height && metrics.weight) {
      const heightInMeters = metrics.height / 100;
      const bmi = (metrics.weight / (heightInMeters * heightInMeters)).toFixed(1);
      setMetrics(prev => ({ ...prev, bmi }));
    }
  }, [metrics.height, metrics.weight]);

  const handleChange = (e) => {
    const { id, value } = e.target;
  
    const numericFields = ["age", "height", "weight", "bmi", "bodyFat", "chest", "waist", "hips"];
    const updatedValue = numericFields.includes(id) && value === "" ? null : value;
  
    const updatedMetrics = { ...metrics, [id]: updatedValue };
    setMetrics(updatedMetrics);
    setActiveSave(true);
  
    if (typeof setMetricsInProfile === "function") {
      setMetricsInProfile(updatedMetrics);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Metrics</CardTitle>
        <CardDescription>Your current body measurements and health indicators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="age" className="font-bold">Age</Label>
            <Input 
              id="age" 
              value={metrics.age} 
              onChange={handleChange} 
              type="number" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height" className="font-bold">Height (cm)</Label>
            <Input 
              id="height" 
              value={metrics.height} 
              onChange={handleChange} 
              type="number" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="font-bold">Weight (kg)</Label>
            <Input 
              id="weight" 
              value={metrics.weight} 
              onChange={handleChange} 
              type="number" 
            />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="bmi" className="font-bold">Body Mass Index (BMI)</Label>
              <div className="relative group">
                <InfoCircle className="h-4 w-4 text-muted-foreground" />
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-popover text-popover-foreground text-xs p-2 rounded shadow-md w-48">
                  BMI is calculated based on your height and weight. A healthy BMI is between 18.5 and 24.9.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input id="bmi" value={metrics.bmi} readOnly />
              {metrics.bmi && (
                <Badge
                  variant={
                    metrics.bmi < 18.5
                      ? "warning"
                      : metrics.bmi < 25
                        ? "success"
                        : metrics.bmi < 30
                          ? "warning"
                          : "destructive"
                  }
                >
                  {metrics.bmi < 18.5
                    ? "Underweight"
                    : metrics.bmi < 25
                      ? "Healthy"
                      : metrics.bmi < 30
                        ? "Overweight"
                        : "Obese"}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="bodyFat" className="font-bold">Body Fat Percentage</Label>
              <div className="relative group">
                <InfoCircle className="h-4 w-4 text-muted-foreground" />
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-popover text-popover-foreground text-xs p-2 rounded shadow-md w-48">
                  For men, 10-20% is considered healthy. For women, 18-28% is considered healthy.
                </div>
              </div>
            </div>
            <Input 
              id="bodyFat" 
              value={metrics.bodyFat} 
              onChange={handleChange} 
              type="number" 
              step="0.1" 
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="font-bold">Additional Measurements (optional)</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="chest" className="text-sm font-bold">
                Chest (cm)
              </Label>
              <Input 
                id="chest" 
                value={metrics.chest} 
                onChange={handleChange} 
                placeholder="Enter measurement" 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="waist" className="text-sm font-bold">
                Waist (cm)
              </Label>
              <Input 
                id="waist" 
                value={metrics.waist} 
                onChange={handleChange} 
                placeholder="Enter measurement" 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="hips" className="text-sm font-bold">
                Hips (cm)
              </Label>
              <Input 
                id="hips" 
                value={metrics.hips} 
                onChange={handleChange} 
                placeholder="Enter measurement" 
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

