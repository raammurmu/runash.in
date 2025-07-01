import type {
  ContentGenerationRequest,
  ContentGenerationResponse,
  AutoHighlight,
  ChatModerationRule,
  ChatModerationEvent,
} from "./ai-types"

class AIService {
  private apiKey: string | null = null

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || null
  }

  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResponse> {
    if (!this.apiKey) {
      throw new Error("OpenAI API key not configured")
    }

    try {
      const prompt = this.buildContentPrompt(request)

      // Simulate AI content generation
      const response = await this.callOpenAI(prompt)

      return {
        id: `gen_${Date.now()}`,
        type: request.type,
        content: response.content,
        alternatives: response.alternatives || [],
        confidence: response.confidence || 0.85,
        usage_tokens: response.usage_tokens || 150,
        created_at: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Content generation failed:", error)
      throw new Error("Failed to generate content")
    }
  }

  async generateHighlights(streamId: string, duration: number): Promise<AutoHighlight[]> {
    try {
      // Simulate highlight detection
      const highlights: AutoHighlight[] = [
        {
          id: `highlight_${Date.now()}_1`,
          stream_id: streamId,
          timestamp: Math.floor(duration * 0.2),
          duration: 30,
          title: "Epic Gaming Moment",
          description: "Incredible clutch play that had viewers on the edge of their seats",
          confidence: 0.92,
          thumbnail_url: "/placeholder.svg?height=180&width=320",
          clip_url: `/clips/${streamId}_highlight_1.mp4`,
          tags: ["gaming", "clutch", "epic"],
          engagement_score: 8.5,
          created_at: new Date().toISOString(),
        },
        {
          id: `highlight_${Date.now()}_2`,
          stream_id: streamId,
          timestamp: Math.floor(duration * 0.6),
          duration: 45,
          title: "Funny Reaction",
          description: "Hilarious reaction that got the chat laughing",
          confidence: 0.78,
          thumbnail_url: "/placeholder.svg?height=180&width=320",
          clip_url: `/clips/${streamId}_highlight_2.mp4`,
          tags: ["funny", "reaction", "comedy"],
          engagement_score: 7.2,
          created_at: new Date().toISOString(),
        },
        {
          id: `highlight_${Date.now()}_3`,
          stream_id: streamId,
          timestamp: Math.floor(duration * 0.8),
          duration: 60,
          title: "Tutorial Segment",
          description: "Educational content explaining advanced techniques",
          confidence: 0.85,
          thumbnail_url: "/placeholder.svg?height=180&width=320",
          clip_url: `/clips/${streamId}_highlight_3.mp4`,
          tags: ["tutorial", "educational", "tips"],
          engagement_score: 6.8,
          created_at: new Date().toISOString(),
        },
      ]

      return highlights
    } catch (error) {
      console.error("Highlight generation failed:", error)
      throw new Error("Failed to generate highlights")
    }
  }

  async moderateMessage(message: string, rules: ChatModerationRule[]): Promise<ChatModerationEvent | null> {
    try {
      for (const rule of rules.filter((r) => r.enabled)) {
        const violation = await this.checkRule(message, rule)
        if (violation) {
          return {
            id: `mod_${Date.now()}`,
            stream_id: "current_stream",
            user_id: "user_123",
            username: "viewer_user",
            message,
            rule_triggered: rule.name,
            action_taken: rule.action,
            confidence: violation.confidence,
            timestamp: new Date().toISOString(),
          }
        }
      }
      return null
    } catch (error) {
      console.error("Message moderation failed:", error)
      return null
    }
  }

  private buildContentPrompt(request: ContentGenerationRequest): string {
    const prompts = {
      title: `Generate a ${request.tone} ${request.length} title for a stream about: ${request.context}`,
      description: `Write a ${request.tone} ${request.length} description for a stream about: ${request.context}`,
      tags: `Generate relevant tags for a stream about: ${request.context}`,
      script: `Create a ${request.tone} ${request.length} script outline for: ${request.context}`,
      thumbnail: `Describe a compelling thumbnail concept for: ${request.context}`,
    }

    return prompts[request.type] || prompts.title
  }

  private async callOpenAI(prompt: string): Promise<any> {
    // Simulate OpenAI API call with realistic responses
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const responses = {
      title: {
        content: "🔥 EPIC Gaming Session - You Won't Believe What Happens Next!",
        alternatives: [
          "Live Gaming Marathon - Join the Adventure!",
          "Pro Tips & Epic Fails - Gaming Stream",
          "Interactive Gaming Session - Chat Decides!",
        ],
        confidence: 0.88,
        usage_tokens: 45,
      },
      description: {
        content:
          "Join me for an incredible gaming session where we'll tackle the most challenging levels, interact with amazing viewers, and maybe even break some personal records! Bring your energy and let's make this stream unforgettable. Don't forget to hit that follow button and join our growing community!",
        alternatives: [
          "Ready for some serious gaming action? Let's dive into epic adventures together!",
          "Interactive gaming stream with viewer challenges and epic moments ahead!",
        ],
        confidence: 0.85,
        usage_tokens: 120,
      },
      tags: {
        content: "gaming, live, interactive, community, epic, adventure, pro-tips, entertainment",
        alternatives: [
          "gaming, stream, live-action, viewer-choice, epic-moments",
          "interactive-gaming, community-stream, live-entertainment",
        ],
        confidence: 0.9,
        usage_tokens: 35,
      },
    }

    return responses.title // Default response
  }

  private async checkRule(message: string, rule: ChatModerationRule): Promise<{ confidence: number } | null> {
    const checks = {
      spam: () => {
        const repeated = /(.)\1{4,}/.test(message) || message.split(" ").some((word) => word.length > 20)
        return repeated ? { confidence: 0.85 } : null
      },
      toxicity: () => {
        const toxicWords = ["toxic", "hate", "awful", "terrible", "worst"]
        const hasToxic = toxicWords.some((word) => message.toLowerCase().includes(word))
        return hasToxic ? { confidence: 0.75 } : null
      },
      profanity: () => {
        const profanity = ["damn", "hell", "crap"]
        const hasProfanity = profanity.some((word) => message.toLowerCase().includes(word))
        return hasProfanity ? { confidence: 0.8 } : null
      },
      caps: () => {
        const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length
        return capsRatio > 0.7 && message.length > 10 ? { confidence: 0.9 } : null
      },
      links: () => {
        const hasLink = /https?:\/\//.test(message)
        return hasLink ? { confidence: 0.95 } : null
      },
    }

    const checker = checks[rule.type as keyof typeof checks]
    return checker ? checker() : null
  }
}

export const aiService = new AIService()
