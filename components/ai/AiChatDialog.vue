<template>
    <div class="overlay" @click="handleOverlayClick">
        <div class="dialog" @click.stop>
            <AiChatHeader @openSearch="$emit('backToSearch')" />
            <div class="content">
                <div v-if="messages.length === 0" class="welcome">
                    <div class="avatar">
                        <NuxtImg src="/docs/icons/ks-logo.png" alt="Kestra AI" />
                    </div>
                    <div class="text">
                        <p>Hi! I'm your Kestra AI assistant.<br>Ask me anything about workflows.</p>
                    </div>
                </div>
                
                <div v-if="messages.length === 0" class="examples">
                    <h6>EXAMPLE QUESTIONS</h6>
                    <div class="cards">
                        <div class="card" @click="askQuestion('How do I run an ETL pipeline with retries and dynamic scaling in Kestra?')">
                            How do I run an ETL pipeline with retries and dynamic scaling in Kestra?
                        </div>
                        <div class="card" @click="askQuestion('How do I run Kestra with Docker?')">
                            How do I run Kestra with Docker?
                        </div>
                        <div class="card" @click="askQuestion('Can I use multiple triggers for one flow?')">
                            Can I use multiple triggers for one flow?
                        </div>
                    </div>
                </div>

                <div v-if="messages.length > 0" class="messages scroller" ref="messagesContainer">
                    <template v-for="message in messages" :key="message.timestamp">
                        <div :class="`message message-${message.role}`">
                            <div class="avatar">
                                <div v-if="message.role === 'user'" class="user">
                                    <AccountCircle />
                                </div>
                                <div v-else class="ai">
                                    <NuxtImg src="/docs/icons/ks-logo.png" alt="Kestra AI" width="28px" height="44px"/>
                                </div>
                            </div>
                            <div class="bubble">
                                <template v-if="message.role === 'assistant'">
                                    <div v-if="message.markdown && !isLoading" @click="handleContentClick">
                                        <ContentRenderer
                                            class="markdown prose prose-sm"
                                            :value="message.markdown"
                                        />
                                    </div>
                                    <div v-else-if="isMessageStreaming(message) || (isLoading && message.content === '')" class="loading">
                                        <div class="dots"></div>
                                    </div>
                                    <p v-else-if="message.content">{{ message.content }}</p>
                                </template>
                                <p v-else>{{ message.content }}</p>
                                
                                <div v-if="message.role === 'assistant' && message.sources?.length" class="sources">
                                    <h6>SOURCES</h6>
                                    <div class="items">
                                        <NuxtLink 
                                            v-for="source in message.sources" 
                                            :key="source.url"
                                            :to="source.url"
                                            external
                                            target="_blank"
                                            class="item"
                                        >
                                            <div class="icon">
                                                <FileDocumentOutline :size="24" />
                                            </div>
                                            <div class="info">
                                                <div class="title">{{ source.title }}</div>
                                                <div class="path">{{ source.path }}</div>
                                            </div>
                                        </NuxtLink>
                                    </div>
                                </div>
                                
                                <span class="timestamp">{{ formatTimestamp(message.timestamp) }}</span>
                            </div>
                        </div>
                    </template>
                </div>
                
                <div class="input">
                    <div class="container">
                        <textarea 
                            id="ai-chat-input"
                            v-model="userInput"
                            placeholder="Enter a prompt for Kestra"
                            rows="1"
                            @keydown.ctrl.enter="sendMessage"
                        ></textarea>
                        <Send @click="sendMessage" :disabled="isLoading || !userInput.trim()"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore - EventSourceParserStream might not have proper types
import { EventSourceParserStream } from 'eventsource-parser/stream'
import { useMagicKeys } from '@vueuse/core'
import AiChatHeader from "./AiChatHeader.vue"
import Send from "vue-material-design-icons/Send.vue"
import AccountCircle from "vue-material-design-icons/AccountCircle.vue"
import FileDocumentOutline from "vue-material-design-icons/FileDocumentOutline.vue"

interface Message {
    content: string
    role: 'user' | 'assistant' | 'system'
    timestamp: string
    markdown?: any
    sources?: Source[]
}

interface Source {
    title: string
    url: string
    path: string
}

interface ChatHistoryItem {
    role: string
    content: string
    timestamp: string
}

interface StreamValue {
    id: string
    data: string
}

interface ResponseData {
    response?: string
    message?: string
}

const { parseMarkdown } = await import("@nuxtjs/mdc/runtime")
const { highlightCodeBlocks } = useShiki()
const { escape } = useMagicKeys()

const emit = defineEmits<{
    close: []
    backToSearch: []
}>()

const userInput = ref<string>('')
const messages = ref<Message[]>([])
const isLoading = ref<boolean>(false)
const messagesContainer = ref<HTMLElement | null>(null)

watch(escape, (v) => {
    if (v) {
        emit('close')
    }
})

const handleOverlayClick = (): void => {
    emit('close')
}

const askQuestion = (question: string): void => {
    userInput.value = question
    sendMessage()
}

const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    const timeString = date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    })
    
    if (isToday) {
        return `Today at ${timeString}`
    } else {
        const dateString = date.toLocaleDateString([], {
            month: 'short',
            day: 'numeric'
        })
        return `${dateString} at ${timeString}`
    }
}

const extractSourcesFromMarkdown = (content: string): Source[] => {
    const sources: Source[] = []
    const linkRegex = /\[([^\]]+)\](?:\(([^\)]+)\)|<([^>]+)>)/g
    let match: RegExpExecArray | null
    
    const getSimpleType = (item: string): string => item.split(".").pop() || ""
    
    while ((match = linkRegex.exec(content)) !== null) {
        const [, title, parenUrl, angleUrl] = match
        let url = parenUrl || angleUrl
        const originalUrl = url
        
        if (url.includes('#/')) {
            url = url.split('#')[1]
        }
        
        const isDocsUrl = url.includes('kestra.io/docs') || url.startsWith('/docs/')
        const isPluginUrl = url.includes('kestra.io/plugins') || url.startsWith('/plugins/')
        
        if (isDocsUrl) {
            const fullUrl = url.startsWith('/docs/') ? `https://kestra.io${url}` : originalUrl
            const pathPart = url.replace(/^(https:\/\/kestra\.io)?\/docs\//, '').replace(/\//g, ' > ')
            const path = `docs > ${pathPart}`
            
            sources.push({ title: title.trim(), url: fullUrl, path })
        } else if (isPluginUrl) {
            const fullUrl = url.startsWith('/plugins/') ? `https://kestra.io${url}` : originalUrl
            const pathPart = url.replace(/^(https:\/\/kestra\.io)?\/plugins\//, '')
            
            const urlParts = pathPart.split('/')
            const [pluginName, type, className] = urlParts
            
            if (pluginName && type && className) {
                const simpleClassName = getSimpleType(className)
                const path = `plugins > ${pluginName} > ${type} > ${simpleClassName}`
                sources.push({ title: title.trim(), url: fullUrl, path })
            } else {
                const path = `plugins > ${pathPart.replace(/\//g, ' > ')}`
                sources.push({ title: title.trim(), url: fullUrl, path })
            }
        }
    }
    
    return sources.filter((source, index, self) => 
        index === self.findIndex(s => s.url === source.url)
    )
}

const scrollToBottom = (): void => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
    })
}

const isMessageStreaming = (message: Message): boolean => {
    return message.role === 'assistant' && 
           !message.markdown && 
           isLoading.value
}

const createUserMessage = (content: string): Message => ({
    content,
    role: 'user',
    timestamp: new Date().toISOString()
})

const createSystemMessage = (content: string): Message => ({
    content,
    role: 'system', 
    timestamp: new Date().toISOString()
})

const createAssistantMessage = (): Message => ({
    content: "",
    role: 'assistant',
    timestamp: new Date().toISOString()
})

const processStreamData = async (indexToUpdate: number, value: StreamValue, data: ResponseData): Promise<void> => {
    if (value.id === 'response' && data.response) {
        messages.value[indexToUpdate].content += data.response
        messages.value[indexToUpdate].timestamp = new Date().toISOString()
        scrollToBottom()
    }

    if (value.id === 'completed') {
        try {
            messages.value[indexToUpdate].markdown = await parseMarkdown(messages.value[indexToUpdate].content)
        } catch (e) {
            // Silent fail for markdown parsing
        }

        const sources = extractSourcesFromMarkdown(messages.value[indexToUpdate].content)
        if (sources.length > 0) {
            messages.value[indexToUpdate].sources = sources
        }
        
        await highlightCodeBlocks()
        scrollToBottom()
    }
}

const handleContentClick = (event: Event): void => {
    const link = (event.target as HTMLElement).closest('a')
    const href = link?.getAttribute('href')
    
    if (href?.startsWith('/') || href?.startsWith('#')) {
        emit('close')
    }
}

const sendMessage = async (): Promise<void> => {
    const trimmedInput = userInput.value.trim()
    if (!trimmedInput || isLoading.value) return
    
    const userMessage = createUserMessage(trimmedInput)
    messages.value.push(userMessage)
    userInput.value = ''
    isLoading.value = true
    scrollToBottom()

    const loadingMessage = createAssistantMessage()
    messages.value.push(loadingMessage)
    scrollToBottom()

    try {
        const chatHistory: ChatHistoryItem[] = messages.value.slice(0, -1).map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp
        }))

        const response = await fetch('https://api.kestra.io/v1/search-ai', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(chatHistory),
        })

        if (response.status !== 200) {
            console.error('API request failed with status:', response.status)
            return
        }

        const reader = response.body
            ?.pipeThrough(new TextDecoderStream())
            .pipeThrough(new EventSourceParserStream())
            .getReader()

        if (!reader) throw new Error('Failed to get stream reader')

        const indexToUpdate = messages.value.length - 1

        while (true) {
            const { value, done } = await reader.read()
            if (done) break

            const streamValue = value as StreamValue
            const data = JSON.parse(streamValue.data) as ResponseData
            await processStreamData(indexToUpdate, streamValue, data)
        }
    } catch (error) {
        console.error('Error sending message:', error)
        messages.value.pop()
        messages.value.push(createSystemMessage("Oops! Something went wrong. Please try again later."))
    } finally {
        isLoading.value = false
        scrollToBottom()
    }
}
</script>

<style lang="scss" scoped src="../../assets/styles/ai.scss"></style>