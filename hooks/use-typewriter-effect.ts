import { useState, useEffect } from "react"

export function useTypewriterEffect(texts: string[], typingSpeed = 20, pauseDuration = 2000) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isTyping) {
      if (currentText.length < texts[currentTextIndex].length) {
        timeout = setTimeout(() => {
          setCurrentText(texts[currentTextIndex].slice(0, currentText.length + 1))
        }, typingSpeed)
      } else {
        setIsTyping(false)
        timeout = setTimeout(() => {
          setIsTyping(true)
          setCurrentText("")
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length)
        }, pauseDuration)
      }
    }

    return () => clearTimeout(timeout)
  }, [currentText, currentTextIndex, isTyping, texts, typingSpeed, pauseDuration])

  return currentText
}

