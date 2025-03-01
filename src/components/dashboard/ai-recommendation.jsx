import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ThumbsDown, ThumbsUp } from "lucide-react"
import Button from "@/components/ui/button"

export default function AIRecommendation({ recommendation }) {
  const impactColors = {
    high: "bg-green-50 border-green-200",
    medium: "bg-amber-50 border-amber-200",
    low: "bg-blue-50 border-blue-200",
  }

  const impactTextColors = {
    high: "text-green-700",
    medium: "text-amber-700",
    low: "text-blue-700",
  }

  return (
    <Card className={`border ${impactColors[recommendation.impact]}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-full ${impactColors[recommendation.impact]} ${impactTextColors[recommendation.impact]}`}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className={`font-medium ${impactTextColors[recommendation.impact]}`}>{recommendation.title}</h3>
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded-full ${impactColors[recommendation.impact]} ${impactTextColors[recommendation.impact]} font-medium`}
              >
                {recommendation.impact.charAt(0).toUpperCase() + recommendation.impact.slice(1)} Impact
              </span>
            </div>
            <p className="text-sm mt-1 text-muted-foreground">{recommendation.description}</p>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="h-8">
                <ThumbsUp className="h-3 w-3 mr-1" />
                Helpful
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <ThumbsDown className="h-3 w-3 mr-1" />
                Not for me
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

