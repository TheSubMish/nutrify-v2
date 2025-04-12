"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wind, AlertCircle, MapPin } from "lucide-react"
import Button from "@/components/ui/button"
// import { aw } from "framer-motion/dist/types.d-CdW9auKD"

export default function AirQualityIndex() {
    const [aqi, setAqi] = useState(null)
    const [location, setLocation] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const APIKEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY

    // Function to determine AQI category and color
    const getAqiInfo = (value) => {
        if (value <= 50) {
            return { category: "Good", color: "#00E400", textColor: "text-green-600" }
        } else if (value <= 100) {
            return { category: "Moderate", color: "#FFFF00", textColor: "text-yellow-600" }
        } else if (value <= 150) {
            return { category: "Unhealthy for Sensitive Groups", color: "#FF7E00", textColor: "text-orange-600" }
        } else if (value <= 200) {
            return { category: "Unhealthy", color: "#FF0000", textColor: "text-red-600" }
        } else if (value <= 300) {
            return { category: "Very Unhealthy", color: "#8F3F97", textColor: "text-purple-600" }
        } else {
            return { category: "Hazardous", color: "#7E0023", textColor: "text-red-800" }
        }
    }

    const fetchAirQuality = async (lat, lon) => {
        setLoading(true)
        setError(null)

        try {
            // Using OpenWeatherMap API for air quality data
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIKEY || "YOUR_API_KEY"}`,
            )

            if (!response.ok) {
                throw new Error("Failed to fetch air quality data")
            }

            const data = await response.json()
            setAqi(data.list[0].main.aqi * 50) // OpenWeatherMap AQI is on a scale of 1-5, multiplying by 50 to get a value on the standard AQI scale

            // Get location name from coordinates
            const geoResponse = await fetch(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${APIKEY || "YOUR_API_KEY"}`,
            )

            if (geoResponse.ok) {
                const geoData = await geoResponse.json()
                if (geoData.length > 0) {
                    setLocation(`${geoData[0].name}, ${geoData[0].country}`)
                }
            }
        } catch (err) {
            setError("Could not fetch air quality data. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    const getUserLocation = () => {
        setLoading(true)
        setError(null)

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchAirQuality(position.coords.latitude, position.coords.longitude)
                },
                (err) => {
                    setError("Could not get your location. Please allow location access.")
                    setLoading(false)
                },
            )
        } else {
            setError("Geolocation is not supported by your browser")
            setLoading(false)
        }
    }

    useEffect(() => {
        getUserLocation()
    }, [])

    const aqiInfo = aqi ? getAqiInfo(aqi) : { category: "Unknown", color: "#cccccc", textColor: "text-gray-600" }
    const percentage = aqi ? Math.min((aqi / 300) * 100, 100) : 0

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center justify-between">
                    <span>Air Quality Index</span>
                    {location && (
                        <div className="flex items-center text-sm font-normal text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {location}
                        </div>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-40 gap-2">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                        <p className="text-sm text-center text-muted-foreground">{error}</p>
                        <Button variant="outline" size="sm" onClick={getUserLocation} className="mt-2">
                            Try Again
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center mb-4">
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 rounded-full border-4 border-gray-200 overflow-hidden">
                                    <div
                                        className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                                        style={{
                                            height: `${percentage}%`,
                                            backgroundColor: aqiInfo.color,
                                            borderRadius: percentage === 100 ? "9999px" : "0 0 9999px 9999px",
                                        }}
                                    ></div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <Wind className={`h-6 w-6 ${aqiInfo.textColor} mb-1`} />
                                    <span className="font-bold text-lg">{aqi}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-4">
                            <p className={`font-medium ${aqiInfo.textColor}`}>{aqiInfo.category}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {aqi <= 50
                                    ? "Air quality is good. Enjoy your outdoor activities!"
                                    : aqi <= 100
                                        ? "Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion."
                                        : aqi <= 150
                                            ? "Members of sensitive groups may experience health effects."
                                            : aqi <= 200
                                                ? "Everyone may begin to experience health effects. Limit outdoor activities."
                                                : "Health alert: everyone may experience more serious health effects. Avoid outdoor activities."}
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <Button variant="outline" size="sm" onClick={getUserLocation} className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                Refresh
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
