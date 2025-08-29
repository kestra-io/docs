<template>
  <div class="container mt-5 pt-5">
    <div class="row mt-5">
      <div class="col-md-12 col-lg-7">
        <h2>
          Kestra Cloud
          <span class="highlight">Book a call to get access</span>
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

      <!-- Right column -->
      <div class="col-md-12 col-lg-5 meeting-container">
        <!-- FORM STATE (blurred background image under the form) -->
        <div v-if="!valid" class="meeting-form">
          <img
            class="background"
            src="/demo/header-background.png"
            alt=""
            data-aos="fade-right"
          />
          <form
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

            <div class="col-md-6 col-12">
              <label for="firstname" class="form-label">
                First Name
              </label>
              <input
                name="firstname"
                type="text"
                class="form-control"
                id="firstname"
                placeholder="First Name"
                required
              />
            </div>

            <div class="col-md-6 col-12">
              <label for="lastname" class="form-label">
                Last Name
              </label>
              <input
                name="lastname"
                type="text"
                class="form-control"
                id="lastname"
                placeholder="Last Name"
                required
              />
            </div>

              <div class="col-12">
              <label for="email" class="form-label">
                  Company Email
              </label>
              <input
                name="email"
                type="email"
                class="form-control"
                id="email"
                placeholder="Company Email"
                required
              />
            </div>

            <div class="col-12">
              <label for="use_case_context" class="form-label">
                Tell us more about your Orchestration strategy and how we can help.
              </label>
              <textarea
                name="use_case_context"
                class="form-control"
                id="cloud-use_case_context"
                  rows="3"
                placeholder="Tell us more about your Orchestration strategy and how we can help."
              ></textarea>
            </div>
            <div class="col-12 mb-4">
               <small class="agree">
                  By submitting this form, you agree to our <NuxtLink href="/privacy-policy">Privacy Policy.</NuxtLink>
               </small>
            </div>

            <div class="col-12 d-flex justify-content-center">
              <button type="submit" class="btn btn-primary w-100">
                Book a Call
              </button>
            </div>
          </form>
        </div>

        <!-- AGENDA STATE -->
        <div v-else class="custom-meetings-iframe-container embed-responsive">
          <div class="iframe-wrapper">
            <iframe
              v-if="meetingUrl"
              :src="meetingUrl"
              class="embed-responsive-item"
              allowtransparency="true"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { getHubspotTracking } from "~/utils/hubspot.js";
import posthog from "posthog-js";

const route = useRoute();
const gtm = useGtm();
const formRef = useTemplateRef("cloud-form");

const valid = ref(false);
const message = ref("");
const meetingUrl = ref<string>("");

const hubSpotUrl = "https://api.hsforms.com/submissions/v3/integration/submit/27220195/d9c2b4db-0b35-409d-a69e-8e4186867b03";

function ensureMeetingsScriptLoaded(): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector('script[src*="MeetingsEmbedCode.js"]')) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
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
    return;
  }

  hsq.push([
    "identify",
    {
      email: (form as any)["email"].value,
      firstname: (form as any)["firstname"].value,
      lastname: (form as any)["lastname"].value,
      kuid: localStorage.getItem("KUID") || "",
    },
  ]);

  const ip = await axios.get("https://api.ipify.org?format=json");
  const formData = {
    fields: [
      { objectTypeId: "0-1", name: "firstname", value: (form as any)["firstname"].value },
      { objectTypeId: "0-1", name: "lastname", value: (form as any)["lastname"].value },
      { objectTypeId: "0-1", name: "email", value: (form as any)["email"].value },
      { objectTypeId: "0-1", name: "use_case_context", value: (form as any)["use_case_context"].value },
      { objectTypeId: "0-1", name: "form_submission_identifier", value: "Contact for Cloud Edition" },
      { objectTypeId: "0-1", name: "kuid", value: localStorage.getItem("KUID") || "" },
    ],
    context: {
      hutk: getHubspotTracking() || "",
      ipAddress: ip.data.ip,
      pageUri: route.path,
      pageName: document.title,
    },
  };

  posthog.capture("cloud_form");
  hsq.push(["trackCustomBehavioralEvent", { name: "cloud_form" }]);
  gtm?.trackEvent({ event: "cloud_form", noninteraction: false });
  identify((form as any)["email"].value);

  try {
    await axios.post(hubSpotUrl, formData, {});
    valid.value = true;

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
  } catch (error: any) {
    valid.value = false;
    if (error?.response?.data?.errors?.filter((e: any) => e.errorType === "BLOCKED_EMAIL").length > 0) {
      message.value = "Please use a professional email address";
    } else {
      message.value = error?.response?.data?.message || "It looks like we've hit a snag. Please ensure cookies are enabled and that any ad-blockers are disabled for this site, then try again.";
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";


.meeting-container {
  position: relative;

  @include media-breakpoint-up(lg) {
    padding: calc($spacer * 1.25) calc($spacer * 0.5);
  }

  .meeting-form {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 680px; /* base height for the form */

    h4 {
      color: $primary;
      margin-top: 1rem;
      text-align: center;
    }

    img.background {
      width: 644px;
      max-width: 100%;
      z-index: 0;
      opacity: 0.2;
      filter: blur(6px);
      transform: scale(1.05);
    }

    form {
      border-radius: 0.25rem;
      padding: 0rem 1rem 2rem 1rem;
      position: absolute;
      z-index: 1;
      top: 0;
      width: 85%;
      background: white;

      /* Ensure dark text inside form */
      color: #212529;

      label {
          display: none;
      }

      input, textarea {
          margin-bottom: 1.25rem;
      }

      @include media-breakpoint-up(lg) {
        width: 85%;
      }
    }
  }
  .custom-meetings-iframe-container {
    display: flex;
    align-items: stretch;
    justify-content: center;
    min-height: 680px;

    .iframe-wrapper {
      flex: 1 1 auto;
      display: flex;
      min-height: 0;
      width: 100%;
    }

    .embed-responsive-item {
      flex: 1 1 auto;
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }
  }
}

.testimonial {
  border-left: 1px solid #414141;
}
</style>
