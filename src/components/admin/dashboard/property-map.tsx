"use client"

import { useEffect, useRef } from "react"

interface PropertyMapProps {
  data: {
    points: Array<{
      x: number
      y: number
      value: number
      sold: boolean
    }>
  }
}

export default function PropertyMap({ data }: PropertyMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      notation: "compact",
      compactDisplay: "short",
    }).format(value)
  }

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const parent = canvas.parentElement
      if (!parent) return

      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Draw map
    const drawMap = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      ctx.fillStyle = "#f8fafc"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 1

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Vertical lines
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Draw points
      data.points.forEach((point) => {
        const x = point.x * canvas.width
        const y = point.y * canvas.height
        const radius = Math.max(5, Math.min(15, Math.log10(point.value) * 3))

        // Draw circle
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = point.sold ? "rgba(16, 185, 129, 0.7)" : "rgba(59, 130, 246, 0.7)"
        ctx.fill()
        ctx.strokeStyle = point.sold ? "rgb(16, 185, 129)" : "rgb(59, 130, 246)"
        ctx.lineWidth = 2
        ctx.stroke()
      })
    }

    drawMap()

    // Add tooltip functionality
    const tooltip = document.createElement("div")
    tooltip.style.position = "absolute"
    tooltip.style.padding = "8px 12px"
    tooltip.style.backgroundColor = "white"
    tooltip.style.borderRadius = "4px"
    tooltip.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)"
    tooltip.style.fontSize = "12px"
    tooltip.style.pointerEvents = "none"
    tooltip.style.opacity = "0"
    tooltip.style.transition = "opacity 0.2s"
    tooltip.style.zIndex = "1000"
    canvas.parentElement?.appendChild(tooltip)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / canvas.width
      const y = (e.clientY - rect.top) / canvas.height

      // Find closest point
      let closestPoint = null
      let minDistance = 0.05 // Minimum distance to show tooltip

      for (const point of data.points) {
        const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2))
        if (distance < minDistance) {
          closestPoint = point
          minDistance = distance
        }
      }

      if (closestPoint) {
        tooltip.style.opacity = "1"
        tooltip.style.left = `${e.clientX}px`
        tooltip.style.top = `${e.clientY - 40}px`
        tooltip.innerHTML = `
          <div>
            <div><strong>Valor:</strong> ${formatCurrency(closestPoint.value)}</div>
            <div><strong>Status:</strong> ${closestPoint.sold ? "Vendido" : "Disponível"}</div>
          </div>
        `
      } else {
        tooltip.style.opacity = "0"
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      canvas.removeEventListener("mousemove", handleMouseMove)
      tooltip.remove()
    }
  }, [data])

  return (
    <div className="w-full h-80 relative">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  )
}

