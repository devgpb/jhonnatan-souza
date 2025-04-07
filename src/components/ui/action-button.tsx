import type React from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash, RefreshCw, Pen, DollarSign, Star } from "lucide-react"

type ActionType = "create" | "delete" | "update" | "sold" | "unsold" | "edit" | "featured" | "unfeatured"

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
          text: "Criar",
          variant: "default" as const,
        }
      case "delete":
        return {
          icon: <Trash className="h-4 w-4" />,
          // text: "Deletar",
          variant: "destructive" as const,
        }
      case "update":
        return {
          icon: <Pen className="mr-2 h-4 w-4" />,
          text: "Atualizar",
          variant: "outline" as const,
        }
      case "edit":
        return {
          icon: <Pen className="h-4 w-4" />,
          variant: "yellow" as const,
        }
      case "sold":
        return {
          icon: <DollarSign className="h-4 w-4" />,
          // text: "Marcar como vendido",
          variant: "success" as const,
        }
      case "unsold":
        return {
          icon: <RefreshCw className="h-4 w-4" />,
          // text: "Desmarcar vendido",
          variant: "outline" as const,
        }
      case "featured":
        return {
          icon: <Star className="h-4 w-4 fill-yellow-500" />,
          // text: "Desmarcar vendido",
          variant: "star" as const,
        }
      case "unfeatured":
        return {
          icon: <Star className="h-4 w-4" />,
          // text: "Desmarcar vendido",
          variant: "star" as const,
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

