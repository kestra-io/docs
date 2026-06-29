<template>
    <div class="h-100 d-flex flex-column mh-100">
        <AiChatHeader @openSearch="$emit('backToSearch')" />
        <div
            class="content scroller"
            id="contentContainer"
            ref="contentContainer"
        >
            <div v-if="!messages.length" class="message welcome">
                <div class="avatar">
                    <img src="/icon-simple.svg" alt="Kestra AI" />
                </div>
                <div class="bubble">
                    <p>
                        Hi! I'm your Kestra AI assistant.<br />Ask me anything
                        about workflows.
                    </p>
                </div>
            </div>

            <div
                v-if="!messages.length && randomAiQuestions.length"
                class="examples"
            >
                <p class="text-overline">EXAMPLE QUESTIONS</p>
                <div class="cards">
                    <div
                        v-for="question in randomAiQuestions"
                        :key="question"
                        class="card"
                        @click="askQuestion(question)"
                    >
                        {{ question }}
                    </div>
                </div>
            </div>

            <div v-if="messages.length" class="messages">
                <div
                    v-for="(message, index) in messages"
                    :key="index"
                    :class="`message message-${message.role}`"
                >
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
                            <div
                                v-if="message.markdown"
                                @click="handleContentClick"
                            >
                                <MDCParserAndRenderer
                                    class="bd-markdown"
                                    :content="message.markdown"
                                />
                            </div>

                            <div
                                v-if="
                                    isLoading &&
                                    index === messages.length - 1 &&
                                    !message.content
                                "
                                class="loading"
                            >
                                <div class="dots"></div>
                            </div>
                        </template>
                        <p v-else>{{ message.content }}</p>

                        <div
                            v-if="
                                message.role === 'assistant' &&
                                message.sources?.length
                            "
                            class="sources"
                        >
                            <p class="label-small">SOURCES</p>
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

                        <span class="timestamp">{{
                            formatTimestamp(message.timestamp)
                        }}</span>
                    </div>
                </div>

                <div
                    class="d-flex justify-content-end me-3 mb-1"
                    v-if="!isLoading && messages.length"
                >
                    <button
                        type="submit"
                        class="btn btn-sm btn-dark"
                        @click="clearMessage"
                    >
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
                <Send
                    @click="sendMessage"
                    :disabled="isLoading || !userInput.trim()"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref, nextTick } from "vue"
    import posthog from "posthog-js"
    import { EventSourceParserStream } from "eventsource-parser/stream"
    import AiChatHeader from "~/components/ai/AiChatHeader.vue"
    import Send from "vue-material-design-icons/Send.vue"
    import TrashCan from "vue-material-design-icons/TrashCan.vue"
    import AccountCircle from "vue-material-design-icons/AccountCircle.vue"
    import FileDocumentOutline from "vue-material-design-icons/FileDocumentOutline.vue"
    import {
        extractSourcesFromMarkdown,
        isInternalLink,
    } from "~/utils/sources.ts"
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
    defineProps<{
        randomAiQuestions: string[]
    }>()

    const emit = defineEmits<{
        close: []
        backToSearch: []
    }>()

    const createUUID = () => {
        return (
            new Date().getTime().toString(16) +
            Math.floor(1e7 * Math.random()).toString(16)
        )
    }

    const userInput = ref<string>("")
    const messages = ref<Message[]>([])
    const isLoading = ref<boolean>(false)
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
            const newHeight = Math.min(
                textareaRef.value.scrollHeight,
                maxHeight,
            )
            textareaRef.value.style.height = `${newHeight}px`
            textareaRef.value.style.overflowY =
                textareaRef.value.scrollHeight > maxHeight ? "auto" : "hidden"
        }
    }

    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp)
        const isToday = date.toDateString() === new Date().toDateString()
        const time = new Intl.DateTimeFormat("default", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)

        if (isToday) return `Today at ${time}`

        const day = new Intl.DateTimeFormat("default", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)

        return `${day}`
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
            const sources = extractSourcesFromMarkdown(
                messages.value[indexToUpdate].content,
            )
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
            const chatHistory: ChatHistoryItem[] = messages.value
                .slice(0, -1)
                .map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                    timestamp: msg.timestamp,
                }))

            const signal = abortController.value.signal

            const response = await fetch(
                `${API_URL}/search-ai/${conversationId.value}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messages: chatHistory,
                        distinctId: posthog.get_distinct_id(),
                    }),
                    credentials: "include",
                    signal: signal,
                },
            )

            posthog.capture("search_ai", {
                text: trimmedInput,
                chatHistoryLen: chatHistory.length,
            })

            if (response.status !== 200) {
                console.error(
                    "API request failed with status:",
                    response.status,
                )
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
                createSystemMessage(
                    "Oops! Something went wrong. Please try again later.",
                ),
            )
        } finally {
            isLoading.value = false
        }
    }
</script>

<style lang="scss" scoped>
    .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1050;
        display: flex;
        justify-content: center;
        padding: 2rem;

        @include media-breakpoint-down(md) {
            padding: 2rem 0.5rem 0.5rem;
            align-items: flex-start;
        }
    }

    .dialog {
        background: var(--ks-background-body);
        border-radius: 8px;
        border: $block-border;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        overflow: hidden;

        @include media-breakpoint-down(md) {
            width: 100%;
            max-width: none;
            max-height: calc(100vh - 4rem);
            border-radius: 0.5rem;
            margin: 0 0.25rem;
        }
    }

    .avatar {
        width: 28px;
        height: 44px;
    }

    .content {
        padding: 32px 32px 0;
        max-height: 100%;
        overflow-y: auto;
        width: 100%;
        margin: 0 auto 1rem;

        @include media-breakpoint-down(md) {
            padding: 1rem;
            width: 100%;
        }

        .btn-dark {
            background: var(--ks-background-secondary);
            border: $block-border;
            color: var(--ks-content-primary);

            &:hover {
                background: var(--ks-background-primary);
            }
        }

        .welcome {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 0;
            margin-bottom: 2rem;

            @include media-breakpoint-down(md) {
                gap: 1rem;
                margin-bottom: 1.5rem;

                p {
                    font-size: 0.875rem;
                    line-height: 1.4;
                }
            }

            .avatar {
                flex-shrink: 0;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }
        }

        .examples {
            margin-bottom: 2rem;

            @include media-breakpoint-down(md) {
                margin-bottom: 1.5rem;
            }

            p.text-overline {
                color: var(--ks-content-tertiary);
                font-size: 0.75rem;
                font-weight: 600;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                margin-bottom: 1rem;
            }

            .cards {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;

                @include media-breakpoint-down(md) {
                    gap: 0.5rem;
                }
            }

            .card {
                width: fit-content;
                background: var(--ks-background-body);
                border: $block-border;
                border-radius: 0.5rem;
                padding: 1rem;
                cursor: pointer;
                transition: all 0.2s ease-in-out;
                color: var(--ks-content-secondary);
                font-size: 0.875rem;
                line-height: 1.4;

                &:hover {
                    border-color: var(--ks-border-secondary);
                    color: var(--ks-content-primary);
                }

                @include media-breakpoint-down(md) {
                    width: 100%;
                    padding: 0.75rem;
                    font-size: 0.8rem;
                }
            }
        }

        .messages {
            flex: 1;
            padding-right: 0.5rem;
        }

        .message {
            display: flex;
            margin-bottom: 1rem;
            gap: 0.75rem;

            @include media-breakpoint-down(md) {
                gap: 0.5rem;
            }

            .avatar {
                flex-shrink: 0;

                .user {
                    font-size: 24px;
                    color: var(--ks-content-link);
                }

                .ai {
                    display: flex;
                    align-items: start;
                }
            }

            .bubble {
                padding: 1rem;
                border-radius: 1rem;
                background: var(--ks-background-body);
                border: $block-border;
                color: var(--ks-content-primary);
                white-space: pre-line;
                max-width: calc(100% - 48px);
                position: relative;

                @include media-breakpoint-down(md) {
                    padding: 0.75rem;
                    font-size: 0.875rem;
                    max-width: calc(100% - 32px);
                }

                p {
                    margin: 0 0 0.5rem;

                    &:last-child {
                        margin-bottom: 0;
                    }
                }

                .timestamp {
                    font-size: 0.7rem;
                    color: var(--ks-content-tertiary);
                    display: block;
                    text-align: right;
                    margin-top: 0.5rem;
                }

                :deep(pre) {
                    border: $block-border;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    margin: 1rem 0;
                }

                :deep(.language),
                :deep(.copy) {
                    position: absolute;
                    top: 1.75rem;
                    right: 1rem;
                }

                :deep(.code-block) {
                    background: transparent;
                    border: none;
                    padding: 1.25rem 0;
                }

                :deep(table) {
                    border: $block-border;
                    padding: 0.25rem;
                    font-size: 90%;
                    width: 100%;

                    thead {
                        th,
                        td {
                            padding: 0.5rem;
                            border-bottom: $block-border !important;
                        }
                    }
                }

                :deep(.table-responsive) {
                    margin: 0.5rem 0 !important;
                }

                :deep(a) {
                    color: var(--ks-content-link);
                }

                :deep(h1),
                :deep(h2),
                :deep(h3),
                :deep(h4),
                :deep(h5),
                :deep(h6) {
                    color: var(--ks-content-primary);
                }

                .sources {
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: $block-border;

                    p.label-small {
                        color: var(--ks-content-tertiary);
                        font-size: 0.75rem;
                        font-weight: 600;
                        letter-spacing: 0.05em;
                        text-transform: uppercase;
                        margin: 0 0 0.75rem;
                    }

                    .items {
                        display: flex;
                        flex-direction: column;
                        gap: 0.5rem;
                    }

                    .item {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        padding: 0.75rem;
                        background: var(--ks-background-body);
                        border: $block-border;
                        border-radius: 0.5rem;
                        text-decoration: none;
                        color: var(--ks-content-secondary);
                        font-size: 0.875rem;
                        transition: all 0.2s ease-in-out;

                        &:hover {
                            border-color: var(--ks-border-secondary);
                            color: var(--ks-background-body);
                        }

                        @include media-breakpoint-down(md) {
                            padding: 0.5rem;
                            font-size: 0.8rem;
                        }

                        .icon {
                            flex-shrink: 0;
                            color: var(--ks-content-tertiary);
                            font-size: 22px;
                        }

                        .info {
                            flex: 1;
                            min-width: 0;

                            .title {
                                font-weight: 500;
                                line-height: 1.4;
                                margin-bottom: 0.25rem;

                                @include media-breakpoint-down(md) {
                                    font-size: 0.8rem;
                                    line-height: 1.3;
                                }
                            }

                            .path {
                                font-size: 0.75rem;
                                color: var(--ks-content-tertiary);
                                line-height: 1.2;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;

                                @include media-breakpoint-down(md) {
                                    font-size: 0.7rem;
                                }
                            }
                        }
                    }
                }
            }
        }

        .loading {
            display: flex;
            margin-bottom: 1rem;

            .dots {
                position: relative;
                width: 10px;
                height: 10px;
                border-radius: 5px;
                background: var(--ks-content-link);
                animation: dotPulse 1.5s infinite ease-in-out;
                margin-left: 1rem;

                &::before,
                &::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    width: 10px;
                    height: 10px;
                    border-radius: 5px;
                    background: var(--ks-content-link);
                }

                &::before {
                    left: -15px;
                    animation: dotPulseBefore 1.5s infinite ease-in-out;
                }

                &::after {
                    left: 15px;
                    animation: dotPulseAfter 1.5s infinite ease-in-out;
                }
            }
        }
    }

    .input {
        margin-top: auto;
        width: 100%;
        margin-bottom: 0.75rem;

        &.disabled {
            cursor: not-allowed;
            opacity: 0.8;
        }

        .container {
            background: var(--ks-background-primary);
            border: 1px solid var(--ks-border-primary);
            border-radius: 0.5rem;
            padding: 1rem;
            min-height: 56px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: border-color 0.2s ease-in-out;

            @include media-breakpoint-down(md) {
                padding: 12px;
                min-height: 56px;
            }

            &:focus-within {
                border-color: var(--ks-border-active);
            }

            .send-icon {
                height: 28px;
                font-size: 24px;
                color: var(--ks-content-tertiary);
                cursor: pointer;
                transition: color 0.2s ease-in-out;
                align-self: flex-end !important;
                :deep(.material-design-icon__svg) {
                    top: 2.002px;
                }
                &:hover {
                    color: var(--ks-content-color-highlight);
                }
            }

            textarea {
                flex: 1;
                background: transparent;
                color: var(--ks-content-primary);
                font-size: 1rem;
                resize: none;
                outline: none;
                overflow-y: hidden;
                max-height: 150px;
                border: none;

                @include media-breakpoint-down(md) {
                    font-size: 0.875rem;
                }

                &::placeholder {
                    color: var(--ks-content-tertiary);
                }
            }
        }
    }

    @keyframes dotPulseBefore {
        0% {
            transform: scale(1);
        }

        25% {
            transform: scale(0.9);
        }

        50%,
        100% {
            transform: scale(0.75);
        }
    }

    @keyframes dotPulse {
        0%,
        100% {
            transform: scale(0.75);
        }

        50% {
            transform: scale(1);
        }
    }

    @keyframes dotPulseAfter {
        0% {
            transform: scale(0.75);
        }

        50% {
            transform: scale(0.9);
        }

        100% {
            transform: scale(1);
        }
    }
</style>
