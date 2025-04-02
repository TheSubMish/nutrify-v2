"use client"

import * as React from "react"
import { CheckIcon, MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(
  (
    {
      className,
      checked,
      defaultChecked,
      indeterminate = false,
      disabled = false,
      required = false,
      name,
      value,
      id,
      onCheckedChange,
      ...props
    },
    ref,
  ) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false)

    const checkboxRef = React.useRef(null)
    const combinedRef = useCombinedRefs(ref, checkboxRef)

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked)
      }
    }, [checked])

    React.useEffect(() => {
      if (combinedRef?.current) {
        combinedRef.current.indeterminate = indeterminate
      }
    }, [combinedRef, indeterminate])

    const handleChange = (event) => {
      if (disabled) return

      const newChecked = event.target.checked

      if (checked === undefined) {
        setIsChecked(newChecked)
      }

      onCheckedChange?.(newChecked)
    }

    return (
      <span
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
          className,
        )}
        data-state={isChecked ? "checked" : "unchecked"}
      >
        <input
          type="checkbox"
          ref={combinedRef}
          id={id}
          name={name}
          value={value}
          checked={isChecked}
          required={required}
          disabled={disabled}
          className="absolute h-4 w-4 cursor-pointer opacity-0"
          onChange={handleChange}
          {...props}
        />
        {isChecked && !indeterminate && <CheckIcon className="h-4 w-4 text-primary-foreground" />}
        {indeterminate && <MinusIcon className="h-4 w-4 text-primary-foreground" />}
      </span>
    )
  },
)

Checkbox.displayName = "Checkbox"

// Helper function to combine refs
function useCombinedRefs(...refs) {
  const targetRef = React.useRef()

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return

      if (typeof ref === "function") {
        ref(targetRef.current)
      } else {
        ref.current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}

export { Checkbox }
