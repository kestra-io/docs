<template>
    <div class="mt-5 mb-5">
        <div class="header-container">
            <div class="header container d-flex flex-column align-items-center gap-3">
                <h1 data-aos="fade-left">AI-Powered answers from our docs</h1>
                <h4 data-aos="fade-right">Don't Just Ask AI, Learn with it!</h4>
            </div>
        </div>
    </div>
    <section>
        <div class="container d-flex">
            <div class="card w-100">
                <div class="card-body">
                    <template v-for="message in messages">
                        <div :class="`d-flex flex-row mb-4 block-${message.role}`">
                            <div class="p-3 bubble">
                                <ContentRenderer
                                    class="markdown"

                                    v-if="message.role === 'assistant' && message.markdown"
                                    :value="message.markdown"
                                    :prose="false"
                                />
                                <p v-else>
                                    {{ message.content }}
                                </p>

                                <span class="timestamp">{{ message.timestamp }}</span>
                            </div>
                            <div class="avatar">
                                <Account v-if="message.role === 'user' " />
                                <img
                                    v-else
                                    :src="'/favicon-192x192.png'"
                                    alt="Kestra Bot"
                                >
                            </div>
                        </div>
                    </template>

                    <div v-if="isLoading" class="d-flex justify-content-center">
                        <div class="mt-3 mb-3 d-flex">
                            <div class="dot-pulse">
                                <div class="dot-pulse-dot"></div>
                            </div>
                        </div>
                    </div>

                    <div class="form-outline mb-3">
                        <textarea
                            class="form-control"
                            rows="4"
                            placeholder="Enter a prompt for Kestra..."
                            v-model="inputMessage"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        class="btn btn-primary w-100"
                        @click="sendMessage"
                        :disabled="isLoading || !inputMessage.trim()"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    </section>

    <LayoutFooterContact
        title="Didn’t find the help you were looking for?"
        darkButtonText="Ask on slack"
        darkButtonHref="https://kestra.io/slack"
        purpleButtonText="Browse the documentation"
        purpleButtonHref="/docs/"
    />
</template>

<script setup>
    import {EventSourceParserStream} from 'eventsource-parser/stream'
    import Account from "vue-material-design-icons/Account.vue";
    const { parseMarkdown } = await import("@nuxtjs/mdc/runtime");
    const {highlightCodeBlocks} = useShiki();


    const messages = ref([]);
    const inputMessage = ref("");
    const isLoading = ref(false);

    // onMounted(() => {
    //     sendMessage();
    // })

    const sendMessage = async () => {
        if (!inputMessage.value.trim()) {
            return;
        }

        const userMessage = {
            content: inputMessage.value,
            role: 'user',
            timestamp: new Date().toISOString(),
        };

        messages.value.push(userMessage);
        inputMessage.value = '';
        isLoading.value = true;

        try {
            const chatHistory = messages.value.map(msg => ({
                role: msg.role,
                content: msg.content,
                timestamp: msg.timestamp,
            }));

            const response = await fetch('https://api.kestra.io/v1/search-ai', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(chatHistory)
            })

            if (response.status !== 200) {
                const json = await response.json();
                console.error('Error sending message:', json);

                messages.value.push({
                    content: "Error sending message:\n" + json.message,
                    role: 'system',
                    timestamp: new Date().toISOString(),
                });
            } else {
                const reader = response.body
                    .pipeThrough(new TextDecoderStream())
                    .pipeThrough(new EventSourceParserStream())
                    .getReader()

                const indexToUpdate = messages.value.length;

                while (true) {
                    const {value, done} = await reader.read();
                    if (done) {
                        break;
                    }

                    if (messages.value.length === indexToUpdate) {
                        messages.value.push({
                            content: "",
                            role: 'assistant',
                            timestamp: new Date().toISOString(),
                        });
                    }

                    const data = JSON.parse(value.data);

                    const replaceDocLink = (content) => {
                        // return content.replaceAll(//g, "");

                        return content;
                    };

                    if (value.id === 'response' && data.response) {
                        messages.value[indexToUpdate].content += data.response;
                        messages.value[indexToUpdate].timestamp = new Date().toISOString();

                        messages.value[indexToUpdate].content = replaceDocLink(messages.value[indexToUpdate].content);

                        try {
                            messages.value[indexToUpdate].markdown = await parseMarkdown(messages.value[indexToUpdate].content);
                        } catch (e) {
                            // could fail to parse invalid markdown during the sse progress, just ignore the transformation on that case
                        }
                    }

                    if (value.id === 'completed') {
                        await highlightCodeBlocks();
                    }
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            messages.value.push({
                content: "Oops! Something went wrong. Please try again later.",
                role: 'system',
                timestamp: new Date().toISOString(),
            });
        } finally {
            isLoading.value = false;
        }
    };
</script>

<style lang="scss" scoped>
    @import "../assets/styles/variable";

    .header-container {
        background: url("/landing/plugins/bg.svg") no-repeat top;

        .header {
            padding-bottom: calc($spacer * 4.125);
            border-bottom: 1px solid rgba(255, 255, 255, 0.10);

            h1, h4 {
                color: $white;
                text-align: center;
                font-weight: 400;
                margin-bottom: 0;
            }

            h1 {
                font-size: $font-size-4xl;
            }

            h4 {
                font-size: $font-size-xl;
            }
        }
    }


    .form-control {
        color: $white-1;
    }

    textarea {
        border: 1px solid #242427;
        background: $black-4;


        &:focus {
            background: $black-4;
            color: $white-1;
        }

        &::placeholder {
            color: $white-5;
        }

    }

    .btn-primary:before {
        display: none;
    }

    .card {
        background: $black-2;

        .avatar {
            width: 45px;
            height: 45px;
            border-radius: 100%;
            background: $purple-31;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;

            :deep(svg) {
                fill: $secondary;
                bottom: 0.15rem
            }

            img {
                max-width: 100%;
                max-height: 100%;
                border-radius: 100%;
            }
        }

        .block-user {
            flex-direction: row-reverse !important;
            justify-content: flex-end;

            .avatar {
                margin-right: 0.5rem;
            }
        }

        .block-assistant, .block-system  {
            justify-content: flex-end;

            .avatar {
                margin-left: 0.5rem;
            }
        }

        .block-assistant {
            .bubble {
                width: 100%;
            }
        }

        .timestamp {
            font-size: 0.70rem;
            color: $black-8;
            display: flex;
            justify-content: flex-end;
        }

        .bubble {
            background: $black-3;
            color: $white;
            white-space: pre-line;
            border-radius: 1rem;

            :deep(pre) {
                background-color: var(--kestra-io-token-color-background-secondary);
                border: 1px solid var(--kestra-io-token-color-border-secondary);
                padding: 1.25rem;
                border-radius: var(--bs-border-radius-lg);
                position: relative;

                code {
                    display: flex;
                    flex-direction: column;
                }
            }
        }
    }

    :deep(a) {
        color: var(--kestra-io-token-text-link-default);
    }

    .dot-pulse {
        position: relative;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: #a78bfa; /* purple-400 */
        color: #a78bfa; /* purple-400 */
        animation: dotPulse 1.5s infinite ease-in-out;
    }

    .dot-pulse::before, .dot-pulse::after {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: #a78bfa; /* purple-400 */
        color: #a78bfa; /* purple-400 */
    }

    .dot-pulse::before {
        left: -15px;
        animation: dotPulseBefore 1.5s infinite ease-in-out;
    }

    .dot-pulse::after {
        left: 15px;
        animation: dotPulseAfter 1.5s infinite ease-in-out;
    }

    @keyframes dotPulseBefore {
        0% {
            transform: scale(1);
        }
        25% {
            transform: scale(0.9);
        }
        50%, 100% {
            transform: scale(0.75);
        }
    }

    @keyframes dotPulse {
        0%, 100% {
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
