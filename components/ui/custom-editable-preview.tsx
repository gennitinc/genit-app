import React, { useState, useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"

interface EditableElement {
  id: string
  type: "text" | "button" | "div"
  content: string
  style: React.CSSProperties
  className: string
}

interface CustomEditablePreviewProps {
  initialContent: EditableElement[]
  onChange?: (elements: EditableElement[]) => void
}

export function CustomEditablePreview({ initialContent, onChange }: CustomEditablePreviewProps) {
  const [elements, setElements] = useState<EditableElement[]>(initialContent)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleElementClick = (id: string) => {
    setSelectedElement(id)
  }

  const handleContentChange = (id: string, newContent: string) => {
    const updatedElements = elements.map((el) => (el.id === id ? { ...el, content: newContent } : el))
    setElements(updatedElements)
    onChange?.(updatedElements)
  }

  const handleStyleChange = (id: string, property: string, value: string) => {
    const updatedElements = elements.map((el) =>
      el.id === id ? { ...el, style: { ...el.style, [property]: value } } : el,
    )
    setElements(updatedElements)
    onChange?.(updatedElements)
  }

  const handleClassChange = (id: string, newClass: string) => {
    const updatedElements = elements.map((el) => (el.id === id ? { ...el, className: newClass } : el))
    setElements(updatedElements)
    onChange?.(updatedElements)
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="h-full overflow-auto bg-white p-4">
      {elements.map((element) => (
        <div key={element.id} onClick={() => handleElementClick(element.id)} className="relative group">
          {React.createElement(
            element.type,
            {
              style: element.style,
              className: `${element.className} ${selectedElement === element.id ? "outline outline-blue-500" : ""}`,
              contentEditable: selectedElement === element.id,
              onBlur: (e: React.FocusEvent<HTMLElement>) =>
                handleContentChange(element.id, e.currentTarget.textContent || ""),
              suppressContentEditableWarning: true,
            },
            element.content,
          )}
          {selectedElement === element.id && (
            <div className="absolute top-full left-0 bg-white border border-gray-200 p-2 z-10">
              <input
                type="text"
                value={element.className}
                onChange={(e) => handleClassChange(element.id, e.target.value)}
                placeholder="Tailwind classes"
                className="block w-full mb-2 p-1 border border-gray-300 rounded"
              />
              <input
                type="color"
                value={element.style.color as string}
                onChange={(e) => handleStyleChange(element.id, "color", e.target.value)}
                className="block w-full mb-2"
              />
              <input
                type="text"
                value={element.style.fontSize as string}
                onChange={(e) => handleStyleChange(element.id, "fontSize", e.target.value)}
                placeholder="Font size (e.g., 16px)"
                className="block w-full p-1 border border-gray-300 rounded"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

