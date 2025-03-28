import { Bot, User } from 'lucide-react'

export function ChatLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Skeleton for bot message */}
      <div className="flex mb-4">
        <div className="flex items-start max-w-[80%]">
          <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(106, 13, 173, 0.1)' }}>
            <Bot className="h-6 w-6 primary" />
          </div>

          <div className="mx-2 space-y-3">
            {/* Message content skeleton */}
            <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
              <div className="space-y-2">
                <div className="h-4 w-64 rounded animate-pulse" style={{ backgroundColor: 'rgba(169, 169, 169, 0.2)' }} />
                <div className="h-4 w-48 rounded animate-pulse" style={{ backgroundColor: 'rgba(169, 169, 169, 0.2)' }} />
                <div className="h-4 w-56 rounded animate-pulse" style={{ backgroundColor: 'rgba(169, 169, 169, 0.2)' }} />
              </div>
            </div>
            {/* Timestamp skeleton */}
            <div className="h-3 w-16 rounded animate-pulse ml-4" style={{ backgroundColor: 'rgba(169, 169, 169, 0.2)' }} />
          </div>
        </div>
      </div>

      {/* Skeleton for user message */}
      <div className="flex mb-4 justify-end">
        <div className="flex items-end flex-row-reverse max-w-[80%]">
          <div className="flex-shrink-0 h-8 w-8 rounded-full animate-pulse" style={{ backgroundColor: 'var(--neutral-light)' }}>
            <User className="h-6 w-6 secondary border border-[#147870] rounded-full p-[2px]" />
          </div>

          <div className="mx-2 space-y-3">
            {/* Message content skeleton */}
            <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(106, 13, 173, 0.3)' }}>
              <div className="space-y-2">
                <div className="h-4 w-40 rounded animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                <div className="h-4 w-32 rounded animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
              </div>
            </div>
            {/* Timestamp skeleton */}
            <div className="h-3 w-16 rounded animate-pulse mr-4" style={{ backgroundColor: 'rgba(169, 169, 169, 0.2)' }} />
          </div>
        </div>
      </div>

      {/* Another bot message skeleton */}
      <div className="flex mb-4">
        <div className="flex items-start max-w-[80%]">
          <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(106, 13, 173, 0.1)' }}>
            <Bot className="h-6 w-6 primary" />
          </div>

          <div className="mx-2 space-y-3">
            {/* Message content skeleton with typing animation */}
            <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: 'var(--neutral-light)' }}>
              <div className="flex space-x-2">
                <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div
                  className="h-2 w-2 rounded-full bg-current animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="h-2 w-2 rounded-full bg-current animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ConversationLoadingSkeleton() {
  return (
    <div className="flex h-screen background">
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header skeleton */}
        <div className="border-b p-4 flex justify-center">
          <div className="max-w-3xl mx-auto w-full">
            <div className="flex items-center">
              <div className="p-2 rounded-full" style={{ backgroundColor: 'rgba(106, 13, 173, 0.1)' }}>
                <div className="h-6 w-6 rounded-full animate-pulse" style={{ backgroundColor: 'rgba(106, 13, 173, 0.3)' }} />
              </div>
              <div className="ml-3 space-y-2">
                <div className="h-5 w-40 rounded animate-pulse" style={{ backgroundColor: 'rgba(169, 169, 169, 0.2)' }} />
                <div className="h-4 w-64 rounded animate-pulse" style={{ backgroundColor: 'rgba(169, 169, 169, 0.2)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Messages area skeleton */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            <ChatLoadingSkeleton />
          </div>
        </div>

        {/* Input area skeleton */}
        <div className="border-t p-4">
          <div className="max-w-3xl mx-auto">
            {/* Suggestions skeleton */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-32 rounded-full animate-pulse tertiary-bg" style={{ opacity: 0.3 }} />
              ))}
            </div>

            {/* Input skeleton */}
            <div className="relative">
              <div className="w-full h-12 rounded-full border animate-pulse" style={{ backgroundColor: 'rgba(169, 169, 169, 0.05)' }} />
              <div className="absolute right-1.5 top-1.5 p-1.5 rounded-full h-9 w-9 animate-pulse" style={{ backgroundColor: 'rgba(106, 13, 173, 0.3)' }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}