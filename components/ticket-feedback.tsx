'use client'

import { useState, useTransition } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { submitFeedback } from "@/lib/actions/feedback-actions"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface TicketFeedbackProps {
    ticketId: string
    isResolved: boolean
    existingFeedback: {
        rating: number
        comment: string | null
    } | null
}

export function TicketFeedback({ ticketId, isResolved, existingFeedback }: TicketFeedbackProps) {
    const [rating, setRating] = useState(existingFeedback?.rating || 0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState(existingFeedback?.comment || "")
    const [isPending, startTransition] = useTransition()
    const [submitted, setSubmitted] = useState(!!existingFeedback)

    if (!isResolved && !existingFeedback) return null

    const handleSubmit = () => {
        if (rating === 0) {
            toast.error("Please select a rating")
            return
        }

        startTransition(async () => {
            const result = await submitFeedback(ticketId, rating, comment)
            if (result.success) {
                toast.success(result.message)
                setSubmitted(true)
            } else {
                toast.error(result.error)
            }
        })
    }

    return (
        <div className="mt-8 p-6 border rounded-lg bg-card/50 shadow-sm">
            <div className="text-center space-y-2 mb-6">
                <h3 className="text-lg font-semibold">
                    {submitted ? "Your Feedback" : "Rate your experience"}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {submitted
                        ? "Thank you for sharing your thoughts!"
                        : "How satisfied are you with the resolution of this ticket?"}
                </p>
            </div>

            <div className="flex flex-col items-center gap-6">
                {/* Stars */}
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            disabled={submitted || isPending}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => !submitted && setHoverRating(star)}
                            onMouseLeave={() => !submitted && setHoverRating(0)}
                            className={cn(
                                "transition-all duration-200 focus:outline-none",
                                (submitted || isPending) ? "cursor-default" : "cursor-pointer hover:scale-110"
                            )}
                            type="button"
                        >
                            <Star
                                className={cn(
                                    "w-8 h-8",
                                    (hoverRating || rating) >= star
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-muted text-muted-foreground/30"
                                )}
                            />
                        </button>
                    ))}
                </div>

                {/* Comment Area */}
                <div className="w-full max-w-md space-y-4">
                    {!submitted ? (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                        >
                            <Textarea
                                placeholder="Tell us more about your experience (optional)..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                disabled={isPending}
                                className="resize-none min-h-[100px]"
                            />
                            <Button
                                onClick={handleSubmit}
                                disabled={isPending || rating === 0}
                                className="w-full mt-4"
                            >
                                {isPending ? "Submitting..." : "Submit Feedback"}
                            </Button>
                        </motion.div>
                    ) : (
                        comment && (
                            <div className="bg-muted p-4 rounded-md text-sm italic text-center w-full">
                                "{comment}"
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
