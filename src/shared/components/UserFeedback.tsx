import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import { 
  submitPredictionFeedback, 
  getFeedbackColor, 
  getFeedbackBadgeColor,
  type PredictionFeedback 
} from "@/shared/utils/userFeedbackService";
import { ThumbsUp, ThumbsDown, Minus, Send, MessageSquare } from "lucide-react";
import { toast } from "@/shared/components/ui/use-toast";

interface UserFeedbackProps {
  predictionId: string;
  modelName: string;
  match: {
    homeTeam: string;
    awayTeam: string;
  };
  predictedOutcome: string;
  confidence: number;
  className?: string;
  onFeedbackSubmitted?: (feedback: PredictionFeedback) => void;
}

const UserFeedback: React.FC<UserUserFeedbackProps> = ({ 
  predictionId,
  modelName,
  match,
  predictedOutcome,
  confidence,
  className = "",
  onFeedbackSubmitted
}) => {
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'partially_correct' | null>(null);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = () => {
    if (!feedback) {
      toast({
        title: "Feedback Required",
        description: "Please select whether the prediction was correct or not.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const feedbackData = submitPredictionFeedback({
        predictionId,
        modelName,
        match,
        predictedOutcome,
        actualOutcome: "", // This would be filled in later
        accuracy: feedback === 'correct' ? 100 : feedback === 'partially_correct' ? 50 : 0,
        feedback,
        confidence,
        comments
      });
      
      setSubmitted(true);
      
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(feedbackData);
      }
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! It helps us improve our predictions.",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Feedback Submitted
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-green-600 dark:text-green-400 mb-2">
              <ThumbsUp className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Thank you for your feedback! Your input helps us improve our predictions.
            </p>
            <div className="mt-3">
              <Badge className={getFeedbackBadgeColor(feedback || '')}>
                {feedback === 'correct' && 'Correct Prediction'}
                {feedback === 'partially_correct' && 'Partially Correct'}
                {feedback === 'incorrect' && 'Incorrect Prediction'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Provide Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="font-medium">{modelName}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {match.homeTeam} vs {match.awayTeam}
          </div>
          <div className="text-sm">
            Predicted: <span className="font-medium">{predictedOutcome}</span>
          </div>
          <div className="text-sm">
            Confidence: <span className="font-medium">{Math.round(confidence)}%</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Was this prediction accurate?</h3>
          <div className="flex space-x-2">
            <Button
              variant={feedback === 'correct' ? "default" : "outline"}
              onClick={() => setFeedback('correct')}
              className="flex-1"
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Correct
            </Button>
            <Button
              variant={feedback === 'partially_correct' ? "default" : "outline"}
              onClick={() => setFeedback('partially_correct')}
              className="flex-1"
            >
              <Minus className="w-4 h-4 mr-2" />
              Partially
            </Button>
            <Button
              variant={feedback === 'incorrect' ? "default" : "outline"}
              onClick={() => setFeedback('incorrect')}
              className="flex-1"
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              Incorrect
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Additional Comments</h3>
          <Textarea
            placeholder="Share any additional thoughts about this prediction..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmitFeedback}
          disabled={isSubmitting || !feedback}
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserFeedback;