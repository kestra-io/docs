<template>
    <div class="h-100 d-flex flex-column mh-100">
        <AiChatHeader @openSearch="$emit('backToSearch')" />
        <div class="content scroller" id="contentContainer" ref="contentContainer">
            <div v-if="messages.length === 0" class="message welcome">
                <div class="avatar">
                    <img src="/icon-simple.svg" alt="Kestra AI" />
                </div>
                <div class="bubble">
                    <p>Hi! I'm your Kestra AI assistant.<br />Ask me anything about workflows.</p>
                </div>
            </div>

            <div v-if="messages.length === 0 && randomQuestion" class="examples">
                <h6>EXAMPLE QUESTIONS</h6>
                <div class="cards">
                    <template v-for="(question, index) in randomQuestion" :key="index">
                        <div class="card" @click="askQuestion(question)">
                            {{ question }}
                        </div>
                    </template>
                </div>
            </div>

            <div v-if="messages.length > 0" class="messages">
                <template v-for="(message, messageIndex) of messages" :key="messageIndex">
                    <div :class="`message message-${message.role}`">
                        <div class="avatar">
                            <div v-if="message.role === 'user'" class="user">
                                <AccountCircle />
                            </div>
                            <div v-else class="ai">
                                <img
                                    src="/icon-simple.svg"
                                    alt="Kestra AI"
                                    width="28px"
                                    height="44px"
                                />
                            </div>
                        </div>
                        <div class="bubble">
                            <template v-if="message.role === 'assistant'">
                                <div v-if="message.markdown" @click="handleContentClick">
                                    <MDCParserAndRenderer
                                        class="bd-markdown"
                                        :content="message.markdown"
                                    />
                                </div>

                                <div
                                    v-if="
                                        isLoading &&
                                        messageIndex === messages.length - 1 &&
                                        !message.content
                                    "
                                    class="loading"
                                >
                                    <div class="dots"></div>
                                </div>
                            </template>
                            <p v-else>{{ message.content }}</p>

                            <div
                                v-if="message.role === 'assistant' && message.sources?.length"
                                class="sources"
                            >
                                <h6>SOURCES</h6>
                                <div class="items">
                                    <a
                                        v-for="source in message.sources"
                                        :key="source.url"
                                        :href="source.url"
                                        target="_blank"
                                        class="item"
                                    >
                                        <div class="icon">
                                            <FileDocumentOutline />
                                        </div>
                                        <div class="info">
                                            <div class="title">
                                                {{ source.title }}
                                            </div>
                                            <div class="path">
                                                {{ source.path }}
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <span class="timestamp">{{ formatTimestamp(message.timestamp) }}</span>
                        </div>
                    </div>
                </template>
                <div
                    class="d-flex justify-content-end me-3 mb-1"
                    v-if="!isLoading && messages.length > 0"
                >
                    <button type="submit" class="btn btn-sm btn-dark" @click="clearMessage">
                        <TrashCan />
                        Start a new prompt
                    </button>
                </div>
            </div>
        </div>

        <div class="input" :class="{ disabled: isLoading }">
            <div class="container">
                <textarea
                    id="ai-chat-input"
                    ref="textareaRef"
                    v-model="userInput"
                    :disabled="isLoading"
                    placeholder="Enter a prompt for Kestra"
                    rows="1"
                    @keydown.enter="handleEnterKey"
                    @input="autoResize"
                ></textarea>
                <Send @click="sendMessage" :disabled="isLoading || !userInput.trim()" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref } from "vue"
    import posthog from "posthog-js"
    import { EventSourceParserStream } from "eventsource-parser/stream"
    import AiChatHeader from "~/components/ai/AiChatHeader.vue"
    import Send from "vue-material-design-icons/Send.vue"
    import TrashCan from "vue-material-design-icons/TrashCan.vue"
    import AccountCircle from "vue-material-design-icons/AccountCircle.vue"
    import FileDocumentOutline from "vue-material-design-icons/FileDocumentOutline.vue"
    import { extractSourcesFromMarkdown, isInternalLink } from "~/utils/sources.ts"
    import MDCParserAndRenderer from "~/components/MDCParserAndRenderer.vue"
    import { API_URL } from "astro:env/client"

    interface Message {
        content: string
        role: "user" | "assistant" | "system"
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

    // random client must be client only
    const randomQuestion = ref<Array<string>>()
    onMounted(() => {
        const questions = [
            "How to add secrets?",
            "How to configure my internal storage?",
            "What are main differences between Open Source and Enterprise?",
            "How to sync my flows with Git?",
            "How to set up CI/CD for kestra flows?",
            "What is a task runner?",
            "How to handle errors & retry on flow?",
            "How to run Python script?",
            "How to schedule flow?",
            "How to write expression for previous tasks outputs?",
            "How to deploy Kestra inside Kubernetes?",
            "How to prevent concurrent execution of the same flow?",
            "How to trigger a flow after another one?",
            "How to run a Ansible playbook?",
            "How to run dbt?",
            "How to receive an alert on flow failure?",
        ]

        // Shuffle and pick 3 questions once on mount
        randomQuestion.value = [...questions].sort(() => Math.random() - 0.5).slice(0, 3)
    })

    const emit = defineEmits<{
        close: []
        backToSearch: []
    }>()

    const createUUID = () => {
        return new Date().getTime().toString(16) + Math.floor(1e7 * Math.random()).toString(16)
    }

    const userInput = ref<string>("")
    const messages = ref<Message[]>([])
    const isLoading = ref<boolean>(false)
    const contentContainer = ref<HTMLElement | null>(null)
    const textareaRef = ref<HTMLTextAreaElement | null>(null)
    const conversationId = ref<string>(createUUID())
    const abortController = ref<AbortController>(new AbortController())

    const askQuestion = (question: string): void => {
        userInput.value = question
        sendMessage()
    }

    const clearMessage = (): void => {
        abortController.value.abort()
        abortController.value = new AbortController()
        userInput.value = ""
        isLoading.value = false
        conversationId.value = createUUID()
        messages.value = []
        if (textareaRef.value) {
            textareaRef.value.style.height = "auto"
        }
    }

    const handleEnterKey = (event: KeyboardEvent): void => {
        if (event.shiftKey) {
            return
        }
        event.preventDefault()
        sendMessage()
    }

    const autoResize = (): void => {
        if (textareaRef.value) {
            textareaRef.value.style.height = "auto"
            const maxHeight = 150
            const newHeight = Math.min(textareaRef.value.scrollHeight, maxHeight)
            textareaRef.value.style.height = `${newHeight}px`
            textareaRef.value.style.overflowY =
                textareaRef.value.scrollHeight > maxHeight ? "auto" : "hidden"
        }
    }

    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp)
        const today = new Date()
        const isToday = date.toDateString() === today.toDateString()

        const timeString = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })

        if (isToday) {
            return `Today at ${timeString}`
        } else {
            const dateString = date.toLocaleDateString([], {
                month: "short",
                day: "numeric",
            })
            return `${dateString} at ${timeString}`
        }
    }

    const createUserMessage = (content: string): Message => ({
        content,
        role: "user",
        timestamp: new Date().toISOString(),
    })

    const createSystemMessage = (content: string): Message => ({
        content,
        role: "system",
        timestamp: new Date().toISOString(),
    })

    const createAssistantMessage = (): Message => ({
        content: "",
        role: "assistant",
        timestamp: new Date().toISOString(),
    })

    const updateMarkdown = async (index: number) => {
        try {
            const rawMd = messages.value[index].content
            // Verify that markdown code blocks (```) and inline code (`) are all closed properly
            const codeBlockCount = (rawMd.match(/```/g) || []).length
            const inlineCodeCount = (rawMd.match(/(?<!`)`(?!`)/g) || []).length
            if (codeBlockCount % 2 !== 0 || inlineCodeCount % 2 !== 0) {
                return
            }

            messages.value[index].markdown = rawMd
        } catch (e) {
            // Silent fail for markdown parsing
        }
    }

    const processStreamData = async (
        indexToUpdate: number,
        value: StreamValue,
        data: ResponseData,
    ): Promise<void> => {
        if (value.id === "response" && data.response) {
            messages.value[indexToUpdate].content += data.response
            messages.value[indexToUpdate].timestamp = new Date().toISOString()
            await updateMarkdown(indexToUpdate)
        }

        if (value.id === "completed") {
            const sources = extractSourcesFromMarkdown(messages.value[indexToUpdate].content)
            if (sources.length > 0) {
                messages.value[indexToUpdate].sources = sources
            }
        }
    }

    const handleContentClick = (event: Event): void => {
        const link = (event.target as HTMLElement).closest("a")
        const href = link?.getAttribute("href")

        if (href && isInternalLink(href)) {
            emit("close")
        }
    }

    const sendMessage = async (): Promise<void> => {
        const trimmedInput = userInput.value.trim()
        if (!trimmedInput || isLoading.value) return

        const userMessage = createUserMessage(trimmedInput)
        messages.value.push(userMessage)
        userInput.value = ""
        if (textareaRef.value) {
            textareaRef.value.style.height = "auto"
            textareaRef.value.style.overflowY = "hidden"
        }
        isLoading.value = true

        const loadingMessage = createAssistantMessage()
        messages.value.push(loadingMessage)

        try {
            const chatHistory: ChatHistoryItem[] = messages.value.slice(0, -1).map((msg) => ({
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp,
            }))

            const signal = abortController.value.signal

            const response = await fetch(`${API_URL}/search-ai/${conversationId.value}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: chatHistory,
                    distinctId: posthog.get_distinct_id(),
                }),
                credentials: "include",
                signal: signal,
            })

            posthog.capture("search_ai", {
                text: trimmedInput,
                chatHistoryLen: chatHistory.length,
            })

            if (response.status !== 200) {
                console.error("API request failed with status:", response.status)
                return
            }

            const reader = response.body
                ?.pipeThrough(new TextDecoderStream())
                .pipeThrough(new EventSourceParserStream())
                .getReader()

            if (!reader) throw new Error("Failed to get stream reader")

            const indexToUpdate = messages.value.length - 1

            while (true) {
                const { value, done } = await reader.read()
                if (done) break

                const streamValue = value as StreamValue
                const data = JSON.parse(streamValue.data) as ResponseData
                await processStreamData(indexToUpdate, streamValue, data)
            }
        } catch (error: any) {
            if (error.name == "AbortError") {
                // gère abort()
                return
            }

            console.error("Error sending message:", error)
            messages.value.pop()
            messages.value.push(
                createSystemMessage("Oops! Something went wrong. Please try again later."),
            )
        } finally {
            isLoading.value = false
        }
    }
</script>

<style lang="scss" scoped src="../../assets/styles/ai.scss"></style>