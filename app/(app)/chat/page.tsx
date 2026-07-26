'use client'

import { useRef, useEffect, useState } from 'react'
import { ArrowLeft, Send, Sparkles, Bot, User, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_PROMPTS = [
  'Bagaimana cara menahan diri dari checkout Paylater saat gajian?',
  'Aku lagi merasa stres dan pengin belanja online, bantu aku jeda.',
  'Berapa persen idealnya uang fleksibel dari pendapatan bulanan?',
  'Gimana cara menghadapi dorongan impulse buy saat larut malam?',
]

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async (userContent: string) => {
    if (!userContent.trim() || isLoading) return

    const userMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: userContent,
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error('Failed to fetch AI response')
      }

      const assistantId = Math.random().toString()
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '' },
      ])

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        assistantText += chunk

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: assistantText } : msg
          )
        )
      }
    } catch (err) {
      console.error('Chat error:', err)
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'assistant',
          content: 'Maaf, terjadi kendala koneksi dengan Teman AI. Silakan coba lagi.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptClick = (promptText: string) => {
    sendMessage(promptText)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    sendMessage(text)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] lg:bg-white max-w-4xl mx-auto w-full">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between p-4 lg:p-6 bg-white/90 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-3">
          <Link href="/home" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E7F2EC] flex items-center justify-center text-primary shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base lg:text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
                Teman AI Jujur
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              </h1>
              <p className="text-xs text-muted-foreground">Konsultasi privat & tanpa menghakimi</p>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#E7F2EC] text-[#265C4B] rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privat & Aman</span>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-[#E7F2EC] text-primary flex items-center justify-center shadow-sm">
              <Bot className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-sm">
              <h2 className="text-xl font-bold text-foreground">Halo! Ada yang ingin didiskusikan?</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ceritakan pemicu belanja impulsifmu atau tanyakan tips mengelola ruang uang. Teman AI di sini untuk mendengarkan.
              </p>
            </div>

            {/* Suggested Prompts */}
            <div className="w-full max-w-md pt-4 space-y-2 text-left">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Pertanyaan Populer</span>
              <div className="grid grid-cols-1 gap-2">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(prompt)}
                    className="p-3.5 text-xs lg:text-sm text-left font-medium bg-white hover:bg-muted/40 text-foreground border border-border/60 rounded-xl transition-all shadow-sm active:scale-98 hover:border-primary/40"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-[#E7F2EC] text-primary'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm lg:text-base leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                    : 'bg-white border border-border/60 text-foreground shadow-sm rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-start gap-3 animate-in fade-in">
            <div className="w-8 h-8 rounded-full bg-[#E7F2EC] text-primary flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-border/60 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-200"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-400"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-border/60 z-40 safe-area-pb">
        <form onSubmit={handleFormSubmit} className="flex gap-2 max-w-4xl mx-auto items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pesan atau pertanyaanmu di sini..."
            className="h-12 rounded-xl border-border/60 text-sm lg:text-base bg-muted/20"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-sm"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
