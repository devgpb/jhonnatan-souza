import type React from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash, RefreshCw } from "lucide-react"

type ActionType = "create" | "delete" | "update"

interface ActionButtonProps {
  type: ActionType
  onClick: () => void
  disabled?: boolean
  className?: string
}

const ActionButton: React.FC<ActionButtonProps> = ({ type, onClick, disabled = false, className = "" }) => {
  const getButtonProps = () => {
    switch (type) {
      case "create":
        return {
          icon: <Plus className="mr-2 h-4 w-4" />,
          text: "Create",
          variant: "default" as const,
        }
      case "delete":
        return {
          icon: <Trash className="mr-2 h-4 w-4" />,
          text: "Delete",
          variant: "destructive" as const,
        }
      case "update":
        return {
          icon: <RefreshCw className="mr-2 h-4 w-4" />,
          text: "Update",
          variant: "outline" as const,
        }
    }
  }

  const { icon, text, variant } = getButtonProps()

  return (
    <Button variant={variant} onClick={onClick} disabled={disabled} className={`flex items-center ${className}`}>
      {icon}
      {text}
    </Button>
  )
}

export default ActionButton

