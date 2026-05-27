<template>
    <div class="uc" :style="{ '--c': cur.color, '--c-light': cur.color + '15' }">
        <div class="uc-stage">
            <div class="uc-strip" :style="{ transform: `translateX(calc(50% - ${current * 256 + 120}px))` }">
                <div
                    v-for="(item, idx) in items"
                    :key="item.id"
                    class="uc-card"
                    :class="{ active: idx === current }"
                    :style="{ '--card-c': item.color }"
                    @click="go(idx)"
                >
                    <div class="uc-card-icon" :style="{ background: idx === current ? item.color : '' }">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <template v-if="item.id === 'data-pipelines'"><path d="M4 6h16M4 12h16M4 18h16"/></template>
                            <template v-else-if="item.id === 'api-orchestration'"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></template>
                            <template v-else-if="item.id === 'ai-workflows'"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></template>
                            <template v-else-if="item.id === 'infrastructure'"><rect x="2" y="3" width="20" height="6" rx="1"/><rect x="2" y="15" width="20" height="6" rx="1"/><path d="M6 9v6M18 9v6"/></template>
                            <template v-else-if="item.id === 'event-driven'"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></template>
                            <template v-else><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></template>
                        </svg>
                    </div>
                    <strong class="uc-card-label">{{ item.label }}</strong>
                    <span class="uc-card-desc">{{ item.desc }}</span>
                </div>
            </div>
        </div>

        <!-- nav -->
        <div class="uc-nav">
            <div class="uc-arrow" :class="{ disabled: current === 0 }" @click="go(current - 1)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
            </div>
            <div class="uc-dots">
                <span
                    v-for="(item, idx) in items" :key="item.id"
                    class="uc-dot" :class="{ active: idx === current }"
                    :style="idx === current ? { background: item.color } : {}"
                    @click="go(idx)"
                />
            </div>
            <div class="uc-arrow" :class="{ disabled: current === items.length - 1 }" @click="go(current + 1)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </div>
        </div>

        <!-- detail -->
        <p class="uc-detail">{{ cur.detail }}</p>

        <!-- CTA -->
        <div v-if="!showLoom" class="uc-cta-row">
            <div v-if="cur.id !== 'other'" class="uc-cta-btn btn btn-lg btn-primary" @click="showModal = true">
                See a demo of Kestra for {{ cur.label }}
            </div>
            <div v-else class="uc-cta-btn btn btn-lg btn-primary" @click="showModal = true">
                Ask for a dedicated video
            </div>
        </div>

        <!-- fallback -->
        <p v-if="!showModal && !showLoom && cur.id !== 'other'" class="uc-fallback">
            Don't find what you're looking for?
            <a href="#" @click.prevent="go(items.length - 1)">Tell us what you need</a>
        </p>

        <!-- ========== SINGLE TELEPORT: shows form, then swaps to loom ========== -->
        <Teleport to="body">
            <div v-if="showModal || showLoom || showConfirmation" :style="{
                position: 'fixed', inset: '0', zIndex: '9999',
                background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem',
            }" @click.self="showModal = false; showLoom = false; showConfirmation = false">

                <!-- ===== FORM state ===== -->
                <div v-if="showModal && !showLoom" :style="{
                    position: 'relative',
                    background: 'var(--ks-background-primary, #fff)',
                    border: '1px solid var(--ks-border-primary, #e0e0e0)',
                    borderRadius: '1rem',
                    padding: '2.5rem 2rem 2rem',
                    width: '100%', maxWidth: '460px',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
                }">
                    <div :style="{
                        position: 'absolute', top: '1rem', right: '1rem',
                        cursor: 'pointer', color: 'var(--ks-content-tertiary, #999)',
                        width: '32px', height: '32px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }" @click="showModal = false">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </div>
                    <!-- HEADER -->
                    <div style="text-align:center;margin-bottom:1.5rem">
                        <div :style="{
                            width: '56px', height: '56px', borderRadius: '0.75rem',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', background: cur.color, marginBottom: '0.75rem',
                        }">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <template v-if="cur.id === 'data-pipelines'"><path d="M4 6h16M4 12h16M4 18h16"/></template>
                                <template v-else-if="cur.id === 'api-orchestration'"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></template>
                                <template v-else-if="cur.id === 'ai-workflows'"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></template>
                                <template v-else-if="cur.id === 'infrastructure'"><rect x="2" y="3" width="20" height="6" rx="1"/><rect x="2" y="15" width="20" height="6" rx="1"/><path d="M6 9v6M18 9v6"/></template>
                                <template v-else-if="cur.id === 'event-driven'"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></template>
                                <template v-else><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></template>
                            </svg>
                        </div>
                        <template v-if="cur.id !== 'other'">
                            <h3 style="font-size:1.375rem;font-weight:700;margin:0 0 0.25rem">See Kestra for {{ cur.label }}</h3>
                            <p style="font-size:0.875rem;color:var(--ks-content-secondary, #666);margin:0">Enter your email and we'll unlock the demo instantly.</p>
                        </template>
                        <template v-else>
                            <h3 style="font-size:1.375rem;font-weight:700;margin:0 0 0.25rem">Request a dedicated video</h3>
                            <p style="font-size:0.875rem;color:var(--ks-content-secondary, #666);margin:0">Give us some information about what you want to see.</p>
                        </template>
                    </div>

                    <!-- STANDARD FORM (for known use cases) -->
                    <form v-if="cur.id !== 'other'" style="display:flex;flex-direction:column;gap:1rem">
                        <div>
                            <label for="uc-email" style="display:block;font-size:0.8125rem;font-weight:600;margin-bottom:0.25rem;color:var(--ks-content-primary, #131316)">Work email</label>
                            <input id="uc-email" v-model="form.email" type="email" placeholder="you@company.com" :style="{
                                width: '100%', padding: '0.7rem 0.875rem',
                                border: '1px solid var(--ks-border-primary, #e0e0e0)', borderRadius: '0.5rem',
                                background: 'var(--ks-background-input, #fff)', color: 'var(--ks-content-primary, #131316)',
                                fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none',
                            }" />
                        </div>
                        <div style="display:flex;gap:0.75rem">
                            <div style="flex:1">
                                <label for="uc-name" style="display:block;font-size:0.8125rem;font-weight:600;margin-bottom:0.25rem;color:var(--ks-content-primary, #131316)">Full name</label>
                                <input id="uc-name" v-model="form.name" type="text" placeholder="Jane Doe" :style="{
                                    width: '100%', padding: '0.7rem 0.875rem',
                                    border: '1px solid var(--ks-border-primary, #e0e0e0)', borderRadius: '0.5rem',
                                    background: 'var(--ks-background-input, #fff)', color: 'var(--ks-content-primary, #131316)',
                                    fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none',
                                }" />
                            </div>
                            <div style="flex:1">
                                <label for="uc-role" style="display:block;font-size:0.8125rem;font-weight:600;margin-bottom:0.25rem;color:var(--ks-content-primary, #131316)">Role</label>
                                <select id="uc-role" v-model="form.role" :style="{
                                    width: '100%', padding: '0.7rem 0.875rem',
                                    border: '1px solid var(--ks-border-primary, #e0e0e0)', borderRadius: '0.5rem',
                                    background: 'var(--ks-background-input, #fff)', color: 'var(--ks-content-primary, #131316)',
                                    fontSize: '0.875rem', fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
                                }">
                                    <option value="" disabled>Select</option>
                                    <option value="engineer">Software Engineer</option>
                                    <option value="data-engineer">Data Engineer</option>
                                    <option value="devops">DevOps / Platform</option>
                                    <option value="tech-lead">Tech Lead / Architect</option>
                                    <option value="manager">Engineering Manager</option>
                                    <option value="cto">CTO / VP Eng</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <button type="button" class="btn btn-lg btn-primary" style="width:100%;cursor:pointer;margin-top:0.25rem" :disabled="submitting" @click="submitForm">
                            {{ submitting ? 'Loading your demo...' : 'Watch the demo' }}
                        </button>
                    </form>

                    <!-- CUSTOM FORM (for "Something Else") -->
                    <form v-else style="display:flex;flex-direction:column;gap:1rem">
                        <div style="display:flex;gap:0.75rem">
                            <div style="flex:1">
                                <label style="display:block;font-size:0.8125rem;font-weight:600;margin-bottom:0.25rem;color:var(--ks-content-primary, #131316)">Work email</label>
                                <input v-model="form.email" type="email" placeholder="you@company.com" :style="{
                                    width: '100%', padding: '0.7rem 0.875rem',
                                    border: '1px solid var(--ks-border-primary, #e0e0e0)', borderRadius: '0.5rem',
                                    background: 'var(--ks-background-input, #fff)', color: 'var(--ks-content-primary, #131316)',
                                    fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none',
                                }" />
                            </div>
                            <div style="flex:1">
                                <label style="display:block;font-size:0.8125rem;font-weight:600;margin-bottom:0.25rem;color:var(--ks-content-primary, #131316)">Full name</label>
                                <input v-model="form.name" type="text" placeholder="Jane Doe" :style="{
                                    width: '100%', padding: '0.7rem 0.875rem',
                                    border: '1px solid var(--ks-border-primary, #e0e0e0)', borderRadius: '0.5rem',
                                    background: 'var(--ks-background-input, #fff)', color: 'var(--ks-content-primary, #131316)',
                                    fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none',
                                }" />
                            </div>
                        </div>
                        <div style="display:flex;gap:0.75rem">
                            <div style="flex:1">
                                <label style="display:block;font-size:0.8125rem;font-weight:600;margin-bottom:0.25rem;color:var(--ks-content-primary, #131316)">Company</label>
                                <input v-model="form.company" type="text" placeholder="Acme Corp" :style="{
                                    width: '100%', padding: '0.7rem 0.875rem',
                                    border: '1px solid var(--ks-border-primary, #e0e0e0)', borderRadius: '0.5rem',
                                    background: 'var(--ks-background-input, #fff)', color: 'var(--ks-content-primary, #131316)',
                                    fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none',
                                }" />
                            </div>
                            <div style="flex:1">
                                <label style="display:block;font-size:0.8125rem;font-weight:600;margin-bottom:0.25rem;color:var(--ks-content-primary, #131316)">Role</label>
                                <select v-model="form.role" :style="{
                                    width: '100%', padding: '0.7rem 0.875rem',
                                    border: '1px solid var(--ks-border-primary, #e0e0e0)', borderRadius: '0.5rem',
                                    background: 'var(--ks-background-input, #fff)', color: 'var(--ks-content-primary, #131316)',
                                    fontSize: '0.875rem', fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
                                }">
                                    <option value="" disabled>Select</option>
                                    <option value="engineer">Software Engineer</option>
                                    <option value="data-engineer">Data Engineer</option>
                                    <option value="devops">DevOps / Platform</option>
                                    <option value="tech-lead">Tech Lead / Architect</option>
                                    <option value="manager">Engineering Manager</option>
                                    <option value="cto">CTO / VP Eng</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style="display:block;font-size:0.8125rem;font-weight:600;margin-bottom:0.25rem;color:var(--ks-content-primary, #131316)">Current orchestration stack</label>
                            <input v-model="form.stack" type="text" placeholder="e.g. Airflow, Prefect, cron jobs, nothing yet..." :style="{
                                width: '100%', padding: '0.7rem 0.875rem',
                                border: '1px solid var(--ks-border-primary, #e0e0e0)', borderRadius: '0.5rem',
                                background: 'var(--ks-background-input, #fff)', color: 'var(--ks-content-primary, #131316)',
                                fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none',
                            }" />
                        </div>
                        <div>
                            <label style="display:block;font-size:0.8125rem;font-weight:600;margin-bottom:0.25rem;color:var(--ks-content-primary, #131316)">What workflows do you want to orchestrate?</label>
                            <textarea v-model="form.custom" rows="3" placeholder="Be specific: what triggers them, what systems are involved, what's the expected output..." :style="{
                                width: '100%', padding: '0.7rem 0.875rem',
                                border: '1px solid var(--ks-border-primary, #e0e0e0)', borderRadius: '0.5rem',
                                background: 'var(--ks-background-input, #fff)', color: 'var(--ks-content-primary, #131316)',
                                fontSize: '0.875rem', fontFamily: 'inherit', resize: 'none', outline: 'none',
                            }"></textarea>
                        </div>
                        <div>
                            <label style="display:block;font-size:0.8125rem;font-weight:600;margin-bottom:0.25rem;color:var(--ks-content-primary, #131316)">What's your timeline?</label>
                            <select v-model="form.timeline" :style="{
                                width: '100%', padding: '0.7rem 0.875rem',
                                border: '1px solid var(--ks-border-primary, #e0e0e0)', borderRadius: '0.5rem',
                                background: 'var(--ks-background-input, #fff)', color: 'var(--ks-content-primary, #131316)',
                                fontSize: '0.875rem', fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
                            }">
                                <option value="" disabled>Select</option>
                                <option value="exploring">Just exploring</option>
                                <option value="this-quarter">Evaluating this quarter</option>
                                <option value="this-month">Need something this month</option>
                                <option value="migrating">Actively migrating from another tool</option>
                            </select>
                        </div>
                        <button type="button" class="btn btn-lg btn-primary" style="width:100%;cursor:pointer;margin-top:0.25rem" :disabled="submitting" @click="submitCustom">
                            {{ submitting ? 'Sending...' : 'Request my video' }}
                        </button>
                    </form>
                </div>

                <!-- ===== LOOM state (replaces form in same overlay) ===== -->
                <div v-if="showLoom" :style="{
                    position: 'relative',
                    background: 'var(--ks-background-primary, #fff)',
                    border: '1px solid var(--ks-border-primary, #e0e0e0)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    width: '100%', maxWidth: '800px',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
                }">
                    <div :style="{
                        position: 'absolute', top: '1rem', right: '1rem',
                        cursor: 'pointer', color: 'var(--ks-content-tertiary, #999)',
                    }" @click="showLoom = false">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </div>
                    <div style="text-align:center;margin-bottom:1.25rem">
                        <h3 style="font-size:1.25rem;font-weight:700;margin:0 0 0.25rem">Here's your {{ submittedUseCase }} walkthrough</h3>
                        <p style="font-size:0.875rem;color:var(--ks-content-secondary, #666);margin:0">Recorded by our team. Watch it now or share it.</p>
                    </div>
                    <div style="position:relative;padding-bottom:55.198776758409785%;height:0;border-radius:0.75rem;overflow:hidden">
                        <iframe
                            src="https://www.loom.com/embed/6f7c014b99854d2b871daee7989382f9"
                            frameborder="0"
                            webkitallowfullscreen
                            mozallowfullscreen
                            allowfullscreen
                            allow="autoplay; fullscreen"
                            style="position:absolute;top:0;left:0;width:100%;height:100%"
                        ></iframe>
                    </div>
                </div>

                <!-- ===== CONFIRMATION state (for custom requests) ===== -->
                <div v-if="showConfirmation" :style="{
                    position: 'relative',
                    background: 'var(--ks-background-primary, #fff)',
                    border: '1px solid var(--ks-border-primary, #e0e0e0)',
                    borderRadius: '1rem',
                    padding: '3rem 2.5rem',
                    width: '100%', maxWidth: '480px',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
                    textAlign: 'center',
                }">
                    <div :style="{
                        position: 'absolute', top: '1rem', right: '1rem',
                        cursor: 'pointer', color: 'var(--ks-content-tertiary, #999)',
                    }" @click="showConfirmation = false">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </div>
                    <div :style="{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'var(--ks-background-alert-success, #bffddd)',
                        color: 'var(--ks-content-alert-success, #215d42)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '1.25rem',
                    }">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <h3 style="font-size:1.5rem;font-weight:700;margin:0 0 0.5rem">The team is working on it!</h3>
                    <p style="font-size:1rem;color:var(--ks-content-secondary, #666);margin:0 0 1rem;line-height:1.6">
                        You'll have your dedicated demo within <strong style="color:var(--ks-content-primary, #131316)">48 hours</strong>.
                        We'll send it to <strong style="color:var(--ks-content-primary, #131316)">{{ form.email }}</strong>.
                    </p>
                    <p style="font-size:0.875rem;color:var(--ks-content-tertiary, #999);margin:0">
                        Our team will review your request and record a Loom walkthrough tailored to your exact workflow and stack.
                    </p>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script>
export default {
    data() {
        return {
            current: 3,
            startX: 0,
            showModal: false,
            showLoom: false,
            showConfirmation: false,
            submitting: false,
            submittedUseCase: "",
            form: { email: "", name: "", role: "", company: "", custom: "", stack: "", timeline: "" },
            items: [
                { id: "data-pipelines", label: "Data Pipelines", desc: "ETL, ELT, batch & streaming ingestion", detail: "See how Kestra orchestrates complex data flows across sources, transforms, and destinations — with built-in retries, backfills, and lineage.", color: "#0369A1" },
                { id: "api-orchestration", label: "API Orchestration", desc: "Microservices coordination & scheduling", detail: "Watch Kestra chain API calls across services with conditional logic, error handling, and parallel execution — all defined in YAML.", color: "#7C3AED" },
                { id: "ai-workflows", label: "AI & ML Workflows", desc: "Model training, inference, RAG pipelines", detail: "From data prep to model serving, see how Kestra manages the full ML lifecycle with language-agnostic tasks and GPU-aware scheduling.", color: "#059669" },
                { id: "infrastructure", label: "Infrastructure", desc: "CI/CD, provisioning, DevOps", detail: "Kestra as your infrastructure backbone — Terraform, Ansible, Docker, Kubernetes. Event-driven provisioning with full audit trail.", color: "#D97706" },
                { id: "event-driven", label: "Event-Driven", desc: "Webhooks, triggers, real-time", detail: "See Kestra react to events in real-time — S3 uploads, Kafka messages, webhooks, schedules — and chain them into reliable workflows.", color: "#DC2626" },
                { id: "other", label: "Something Else", desc: "Your workflow, your way", detail: "Don't see your use case? Tell us what you're building — we'll prepare a dedicated Loom walkthrough tailored to your setup.", color: "#631bff" },
            ],
        }
    },
    computed: {
        cur() { return this.items[this.current] },
    },
    mounted() {
        this.$el.addEventListener("touchstart", (e) => { this.startX = e.touches[0].clientX }, { passive: true })
        this.$el.addEventListener("touchend", (e) => {
            const dx = e.changedTouches[0].clientX - this.startX
            if (dx > 60) this.go(this.current - 1)
            else if (dx < -60) this.go(this.current + 1)
        }, { passive: true })
        document.addEventListener("keydown", this.onKey)
    },
    beforeUnmount() {
        document.removeEventListener("keydown", this.onKey)
    },
    methods: {
        go(idx) {
            if (idx >= 0 && idx < this.items.length) this.current = idx
        },
        onKey(e) {
            if (this.showModal) return
            if (e.key === "ArrowLeft") this.go(this.current - 1)
            if (e.key === "ArrowRight") this.go(this.current + 1)
        },
        submitForm() {
            this.submitting = true
            this.submittedUseCase = this.cur.label
            setTimeout(() => {
                this.submitting = false
                this.showModal = false
                this.showLoom = true
            }, 1200)
        },
        submitCustom() {
            this.submitting = true
            setTimeout(() => {
                this.submitting = false
                this.showModal = false
                this.showConfirmation = true
            }, 1200)
        },
    },
}
</script>

<style lang="scss" scoped>
.uc {
    text-align: center;
}

.uc-stage {
    overflow: hidden;
    padding: 2rem 0;
}

.uc-strip {
    display: flex;
    gap: 1rem;
    transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
}

.uc-card {
    flex-shrink: 0;
    width: 240px;
    padding: 2rem 1.25rem;
    border: 2px solid var(--ks-border-primary);
    border-radius: 0.75rem;
    background: var(--ks-background-primary);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    filter: blur(2px);
    opacity: 0.45;
    transform: scale(0.92);
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);

    &.active {
        filter: blur(0);
        opacity: 1;
        transform: scale(1);
        border-color: var(--card-c, var(--ks-border-active));
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06), 0 0 0 1px var(--card-c, var(--ks-border-active));
    }

    &:hover:not(.active) {
        opacity: 0.6;
        filter: blur(1px);
    }

    @include media-breakpoint-down(sm) {
        width: 200px;
        padding: 1.5rem 1rem;
    }
}

.uc-card-icon {
    width: 52px;
    height: 52px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ks-background-purple-light);
    color: var(--ks-content-color-highlight);
    transition: background 0.3s, color 0.3s;

    .active & { color: #fff; }
}

.uc-card-label {
    font-size: 1rem;
    color: var(--ks-content-primary);
}

.uc-card-desc {
    font-size: $font-size-xs;
    color: var(--ks-content-secondary);
    line-height: 1.4;
}

.uc-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
}

.uc-arrow {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--ks-content-primary);
    transition: color 0.2s, background 0.2s;

    &:hover:not(.disabled) {
        color: var(--c, var(--ks-content-color-highlight));
        background: var(--c-light, var(--ks-background-purple-light));
    }

    &.disabled { opacity: 0.15; pointer-events: none; }
}

.uc-dots {
    display: flex;
    gap: 0.5rem;

    .uc-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--ks-border-secondary);
        cursor: pointer;
        transition: transform 0.2s, background 0.2s;
        &.active { transform: scale(1.4); }
    }
}

.uc-detail {
    max-width: 440px;
    margin: 0 auto 1.75rem;
    padding: 0 1.5rem;
    font-size: $font-size-sm;
    color: var(--ks-content-secondary);
    line-height: 1.6;
}

.uc-cta-row {
    margin-bottom: 0.5rem;
}

.uc-cta-btn {
    display: inline-block;
    cursor: pointer;
}

.uc-fallback {
    margin-top: 0.75rem;
    font-size: $font-size-sm;
    color: var(--ks-content-tertiary);

    a {
        color: var(--ks-content-color-highlight);
        text-decoration: underline;
        text-underline-offset: 2px;
        font-weight: 500;
    }
}


</style>
