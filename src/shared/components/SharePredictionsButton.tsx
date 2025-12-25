import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Share2, Twitter, Facebook, Linkedin, Link, Copy } from "lucide-react";
import { toast } from "@/shared/components/ui/use-toast";
import { type MatchPrediction } from "@/shared/utils/types";

interface SharePredictionsButtonProps {
  homeTeam: string;
  awayTeam: string;
  predictions: MatchPrediction[];
}

const SharePredictionsButton: React.FC<SharePredictionsButtonProps> = ({
  homeTeam,
  awayTeam,
  predictions
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Find the best prediction (highest confidence)
  const bestPrediction = predictions.reduce((prev, current) =>
    (prev.confidence > current.confidence) ? prev : current
  );

  // Generate share text
  const generateShareText = () => {
    return `VARtificial Intelligence - Match Prediction

${homeTeam} vs ${awayTeam}
Prediction: ${bestPrediction.outcome}
Confidence: ${bestPrediction.confidence.toFixed(1)}%
Model: ${bestPrediction.modelName}

Powered by ML ensemble (Naive Bayes, Random Forest, Logistic Regression)`;
  };

  // Generate share URL
  const generateShareUrl = () => {
    return `${window.location.origin}${window.location.pathname}`;
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Prediction details copied to clipboard",
      });
    });
  };

  // Share on Twitter
  const shareOnTwitter = () => {
    const text = encodeURIComponent(generateShareText());
    const url = encodeURIComponent(generateShareUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  // Share on Facebook
  const shareOnFacebook = () => {
    const url = encodeURIComponent(generateShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  // Share on LinkedIn
  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(generateShareUrl());
    const title = encodeURIComponent(`Football Prediction: ${homeTeam} vs ${awayTeam}`);
    const summary = encodeURIComponent(generateShareText());
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`, '_blank');
  };

  // Copy link
  const copyLink = () => {
    const url = generateShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link copied",
        description: "Prediction link copied to clipboard",
      });
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={copyToClipboard}>
          <Copy className="w-4 h-4 mr-2" />
          Copy Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnTwitter}>
          <Twitter className="w-4 h-4 mr-2 text-blue-400" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnFacebook}>
          <Facebook className="w-4 h-4 mr-2 text-blue-600" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnLinkedIn}>
          <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyLink}>
          <Link className="w-4 h-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SharePredictionsButton;