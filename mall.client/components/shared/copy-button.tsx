"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type LegacyDocument = Document & {
  execCommand?: (commandId: string, showUI?: boolean, value?: string) => boolean
}

/**
 * Copies text to clipboard using modern API or legacy fallback
 */
async function copyToClipboard(value: string): Promise<boolean> {
  if (!value) {
    return false
  }

  // Try modern clipboard API first
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return true
    } catch {
      // Fall through to legacy method
    }
  }

  // Legacy fallback for older browsers
  if (typeof document === "undefined") {
    return false
  }

  try {
    const textarea = document.createElement("textarea")
    textarea.value = value
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    textarea.style.pointerEvents = "none"
    textarea.setAttribute("readonly", "readonly")
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const legacyDoc = document as LegacyDocument
    const copied = legacyDoc.execCommand ? legacyDoc.execCommand("copy") : false
    document.body.removeChild(textarea)
    return copied
  } catch {
    return false
  }
}

export interface CopyButtonProps {
  /** The text content to copy */
  value: string
  /** Optional className for custom styling */
  className?: string
  /** Success message to display (optional) */
  successMessage?: string
  /** Error message to display (optional) */
  errorMessage?: string
  /** Duration to show success state in milliseconds (default: 2000) */
  successDuration?: number
  /** Accessible label for the button */
  ariaLabel?: string
  /** Show text label alongside icon */
  showLabel?: boolean
  /** Custom label text */
  labelText?: string
  /** Variant style */
  variant?: "default" | "ghost" | "outline"
  /** Size variant */
  size?: "sm" | "md" | "lg"
}

export function CopyButton({
  value,
  className,
  successMessage = "已复制",
  errorMessage = "复制失败",
  successDuration = 2000,
  ariaLabel,
  showLabel = false,
  labelText = "复制",
  variant = "default",
  size = "md",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const disabled = !value?.trim()

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleCopy = useCallback(async () => {
    if (disabled) {
      return
    }

    const success = await copyToClipboard(value)

    if (success) {
      setCopied(true)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => setCopied(false), successDuration)

      // Optional toast notification
      if (successMessage) {
        toast.success(successMessage)
      }
    } else {
      toast.error(errorMessage, {
        description: "请手动选择文本进行复制",
      })
    }
  }, [disabled, value, successDuration, successMessage, errorMessage])

  const sizeClasses = {
    sm: "min-h-[1.75rem] min-w-[1.75rem] px-2 py-1 text-xs gap-1",
    md: "min-h-[2rem] min-w-[2rem] px-2.5 py-1.5 text-xs gap-1",
    lg: "min-h-[2.5rem] min-w-[2.5rem] px-3 py-2 text-sm gap-1.5",
  }

  const variantClasses = {
    default:
      "border border-border bg-background/90 text-muted-foreground shadow-sm backdrop-blur hover:text-foreground",
    ghost: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  }

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled}
      aria-label={ariaLabel || (copied ? `已复制${labelText}` : `复制${labelText}`)}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {copied ? (
        <Check className={cn("shrink-0", iconSizeClasses[size])} />
      ) : (
        <Copy className={cn("shrink-0", iconSizeClasses[size])} />
      )}
      {showLabel && <span>{copied ? "已复制" : labelText}</span>}
      {!showLabel && <span className="sr-only">{copied ? "已复制" : labelText}</span>}
    </button>
  )
}

/**
 * Positioned variant for overlaying on content (e.g., code blocks, messages)
 */
export function CopyButtonOverlay({ value, className, ...props }: CopyButtonProps) {
  return (
    <CopyButton value={value} className={cn("absolute top-2 right-2 z-10", className)} variant="default" {...props} />
  )
}
