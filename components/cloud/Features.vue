<template>
    <div class="container mt-5 pt-5">
      <div class="row mt-5">
        <div class="col-md-12 col-lg-7">
          <h2>
            Kestra Cloud
            <span class="highlight">Request Access</span>
          </h2>
          <h5 class="mt-3">
            Be among the first to experience Kestra Cloud with exclusive
            access before general availability.
          </h5>
          <div class="row mt-5">
            <div class="col-6">
              <h6>
                <img src="./images/calendar_month.png" />
                Get Exclusive 30-Day Access
              </h6>
              <p>
                Explore Kestra Cloud with full, exclusive access for
                30 days prior to general availability.
              </p>
            </div>
            <div class="col-6">
              <h6>
                <img src="./images/small_cloud.png" />
                Fully Managed Infrastructure
              </h6>
              <p>
                No infrastructure setup, deployment worries, or
                ongoing maintenance. We handle the heavy lifting
                while you focus on your workflows.
              </p>
            </div>
            <div class="col-6 mt-3">
              <h6>
                <img src="./images/support_agent.png" />
                Dedicated Experts Exchange
              </h6>
              <p>
                Receive personalized support and expert guidance
                throughout your access period.
              </p>
            </div>
            <div class="col-6 mt-3">
              <h6>
                <img src="./images/check_circle.png" />
                Enterprise Feature Set
              </h6>
              <p>
                Access enterprise features including enhanced
                security, RBAC, observability, and governance during
                your exclusive access.
              </p>
            </div>
  
            <div class="col-12 mt-5 testimonial">
              <p class="mb-2">
                “Kestra Cloud has been a pivotal part of giving us
                flexibility and scalability we need to pull off
                complex processes we do at Foundation Direct.”
              </p>
              <p class="mb-0">
                <strong>
                  Michael Heidner - SVP of Analytics and Business Intelligence & Kestra Cloud
                  Adopter
                </strong>
              </p>
              <img src="./images/foundation.png" />
            </div>
          </div>
        </div>
  
        <div :class="['col-md-12 col-lg-5 form', { 'agenda-active': valid }]">
    
          <div v-if="valid" class="agenda-embed" data-aos="fade-left">
            <div v-html="validMessage" class="success success-compact"></div>
  
            <iframe
              v-if="meetingUrl"
              :src="meetingUrl"
              class="agenda-iframe"
              allowtransparency="true"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            ></iframe>
          </div>
  
          <form
            v-else
            class="row needs-validation"
            ref="cloud-form"
            @submit="onSubmit"
            novalidate
            data-aos="fade-left"
          >
            <div v-if="message" class="alert alert-danger mt-3 mb-0">
              {{ message }}
            </div>
            <h4 class="mb-4">Request Access to Kestra Cloud</h4>
            <div class="col-6">
              <label for="firstname">
                <span class="text-danger">*</span>
                First Name
              </label>
              <input
                name="firstname"
                type="text"
                class="form-control"
                id="firstname"
                required
              />
            </div>
            <div class="col-6">
              <label for="lastname">
                <span class="text-danger">*</span>
                Last Name
              </label>
              <input
                name="lastname"
                type="text"
                class="form-control"
                id="lastname"
                required
              />
            </div>
            <div class="col-12 mt-3">
              <label for="email">
                <span class="text-danger">*</span>
                Company Email
              </label>
              <input
                name="email"
                type="email"
                class="form-control"
                id="email"
                required
              />
            </div>
            <div class="col-12 mt-3">
                        <label for="use_case">
                            <span class="text-danger">*</span>
                            What’s Your Orchestration Context
                        </label>

                        <div class="form-check mt-3">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                name="use_case"
                                value="Data Orchestration"
                                id="use_case_Data_Orchestration"
                            />
                            <label
                                class="form-check-label"
                                for="use_case_analytics"
                            >
                                Data Orchestration
                            </label>
                        </div>

                        <div class="form-check mt-1">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                name="use_case"
                                value="IT & Infrastructure Orchestration"
                                id="use_case_Infrastructure_Orchestration"
                            />
                            <label
                                class="form-check-label"
                                for="use_case_Infrastructure_Orchestration"
                            >
                                IT & Infrastructure Orchestration
                            </label>
                        </div>

                        <div class="form-check mt-1">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                name="use_case"
                                value="Business Process Orchestration"
                                id="use_case_Business_Orchestration"
                            />
                            <label
                                class="form-check-label"
                                for="use_case_Business_Orchestration"
                            >
                                Business Process Orchestration
                            </label>
                        </div>

                        <div class="form-check mt-1">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                name="use_case"
                                value="Event Driven Orchestration"
                                id="use_case_Application_Data_Orchestration"
                            />
                            <label
                                class="form-check-label"
                                for="use_case_Aplication_Data_Orchestration"
                            >
                                Event Driven Orchestration
                            </label>
                        </div>

                        <div class="form-check mt-1">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                name="use_case"
                                value="AI Orchestration"
                                id="use_case_ML_&_AI"
                            />
                            <label
                                class="form-check-label"
                                for="use_case_ML_&_AI"
                            >
                                AI Orchestration
                            </label>
                        </div>
                    </div>
            <div class="col-12 mt-3">
              <label class="mb-2">
                <span class="text-danger">*</span>
                Have you already used Kestra Open Source?
              </label>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="have_you_used_kestra_open_source"
                  id="usedKestraYes"
                  value="Yes"
                  required
                />
                <label class="form-check-label" for="usedKestraYes">
                  Yes
                </label>
              </div>
  
              <div class="form-check mt-1">
                <input
                  class="form-check-input"
                  type="radio"
                  name="have_you_used_kestra_open_source"
                  id="usedKestraNo"
                  value="No"
                  required
                />
                <label class="form-check-label" for="usedKestraNo">
                  No
                </label>
              </div>
            </div>
            <div class="col-12 mt-3">
                        <label for="use_case_context">
                            <span class="text-danger">*</span>
                            tell us more about your Orchestration Strategy and how we can help.
                        </label>

                        <textarea
                            name="use_case_context"
                            class="form-control"
                            id="cloud-use_case_context"
                            required
                        ></textarea>
                    </div>
            <div class="col-12 mt-4 pb-5 d-flex justify-content-center">
              <button type="submit" class="btn btn-primary w-100">
                Book a Call
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import axios from "axios";
  import { getHubspotTracking } from "~/utils/hubspot.js";
  import posthog from "posthog-js";
  import Certifications from "~/components/layout/Certifications.vue";
  
  const route = useRoute();
  const gtm = useGtm();
  const formRef = useTemplateRef("cloud-form");
  
  const valid = ref(false);
  const validMessage = ref("");
  const message = ref("");
  
  const meetingUrl = ref<string>("");
  
  const hubSpotUrl =
    "https://api.hsforms.com/submissions/v3/integration/submit/27220195/d9c2b4db-0b35-409d-a69e-8e4186867b03";

    function getSelectedUseCases(formEl: HTMLFormElement) {
    const checkboxes = formEl.querySelectorAll(
        'input[name="use_case"]:checked',
    );
    return Array.from(checkboxes)
        .map((cb: HTMLInputElement) => cb.value)
        .join("; ");
}
  
  function getUsedKestraStatus(formEl: HTMLFormElement) {
    const radio = formEl.querySelector(
      'input[name="have_you_used_kestra_open_source"]:checked',
    ) as HTMLInputElement | null;
    return radio ? radio.value : "";
  }
  
  function ensureMeetingsScriptLoaded(): Promise<void> {
    return new Promise((resolve) => {
      if (document.querySelector('script[src*="MeetingsEmbedCode.js"]')) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
      script.defer = true;
      script.addEventListener("load", () => resolve());
      document.body.appendChild(script);
    });
  }
  
  const onSubmit = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  
    const form = formRef.value as HTMLFormElement;
    const hsq = ((window as any)._hsq = (window as any)._hsq || []);
  
    if (!form.checkValidity()) {
      valid.value = false;
      message.value = "Invalid form, please review the fields.";
    } else {
      hsq.push([
        "identify",
        {
          email: form["email"].value,
          firstname: form["firstname"].value,
          lastname: form["lastname"].value,
          kuid: localStorage.getItem("KUID"),
        },
      ]);
  
      const ip = await axios.get("https://api.ipify.org?format=json");
      const formData = {
        fields: [
          { objectTypeId: "0-1", name: "firstname", value: form["firstname"].value },
          { objectTypeId: "0-1", name: "lastname", value: form["lastname"].value },
          { objectTypeId: "0-1", name: "email", value: form["email"].value },
          { objectTypeId: "0-1", name: "use_case", value: getSelectedUseCases(form),},
          { objectTypeId: "0-1", name: "use_case_context", value: form["use_case_context"].value,},
          { objectTypeId: "0-1", name: "have_you_used_kestra_open_source", value: getUsedKestraStatus(form) },
          { objectTypeId: "0-1", name: "form_submission_identifier", value: "Contact for Cloud Edition" },
          { objectTypeId: "0-1", name: "kuid", value: localStorage.getItem("KUID") },
        ],
        context: {
          hutk: getHubspotTracking(),
          ipAddress: ip.data.ip,
          pageUri: route.path,
          pageName: document.title,
        },
      };
  
      posthog.capture("cloud_form");
      hsq.push(["trackCustomBehavioralEvent", { name: "cloud_form" }]);
  
      gtm?.trackEvent({
        event: "cloud_form",
        noninteraction: false,
      });
  
      identify(form["email"].value);
  
      axios
        .post(hubSpotUrl, formData, {})
        .then(async () => {
          valid.value = true;
          validMessage.value = "✅ Pick a meeting slot with our team below";
          window.scrollTo({ top: 0, behavior: "smooth" });
  
          await ensureMeetingsScriptLoaded();
          hsq.push(["refreshPageHandlers"]);
          hsq.push(["trackPageView"]);
  
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (timezone.startsWith("America")) {
            meetingUrl.value =
              "https://meetings-eu1.hubspot.com/luke-lipan?uuid=c75c198e-f6c2-43cb-8e05-d622bd9fa06c&embed=true";
          } else {
            meetingUrl.value =
              "https://hs.kestra.io/meetings/david76/website?uuid=9eee19c1-782a-48c5-a84a-840ed3d0a99b&embed=true";
          }
        })
        .catch((error) => {
          valid.value = false;
          if (
            error.response?.data?.errors?.filter(
              (e: any) => e.errorType === "BLOCKED_EMAIL",
            ).length > 0
          ) {
            message.value = "Please use a professional email address";
          } else {
            message.value =
              error.response?.data?.message ||
              "Form submission error";
          }
        });
    }
  };
  </script>
  
  <style scoped lang="scss">
  .cloud {
    & img {
      width: 180px;
      height: auto;
    }
  
    h6 > img {
      width: 30px;
      height: auto;
      margin-right: 10px;
    }
  
    .form {
      align-self: stretch;
      position: relative;
      padding: 60px 40px 0 40px;
      border-radius: 16px;
      background-color: white;
      display: flex;
      flex-direction: column;
  
      label:not(.form-check-label) {
        font-weight: 600;
      }
  
      &.agenda-active {
        background: transparent;
        padding: 0;
      }
      &.agenda-active::after,
      &.agenda-active::before {
        display: none !important;
      }
  
      &::after {
        @media (min-width: 992px) {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 400px;
          height: 400px;
          background-image: url("./images/cloud_visual.png");
          background-size: contain;
          background-repeat: no-repeat;
          transform: translateX(70%) translateY(-52%);
        }
      }
  
      &::before {
        content: "";
        position: absolute;
        top: -55%;
        right: -77%;
        width: 400px;
        height: 400px;
        background-image: url("./images/visual-bg.png");
        background-size: contain;
        background-repeat: no-repeat;
        z-index: -1;
      }
    }
    .success.success-compact {
      margin: 0 auto 12px auto;
      padding: 6px 12px;
      max-width: 70%;
      text-align: center;
      color: #016046;
      background: #e4f9f3;
      border: 1px solid #21ce9c;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
    }
  
    .agenda-embed {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }
  
    .agenda-iframe {
      display: block;
      width: 100%;
      height: 100vh;
      border: none;
      overflow: hidden;
    }
  
    .testimonial {
      border-left: 1px solid #414141;
    }
  }
  </style>
  