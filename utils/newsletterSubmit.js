import posthog from 'posthog-js'
import identify from "./identify.js";
import axios from "axios";
const gtm = useGtm()

const hubSpotUrl = "https://api.hsforms.com/submissions/v3/integration/submit/27220195/433b234f-f3c6-431c-898a-ef699e5525fa";

export default function (that, e) {
    e.preventDefault()
    e.stopPropagation()

    const form = that.$refs.newsletter;

    const route = useRoute()
    if (!form.checkValidity()) {
        that.valid = false;
        that.message = "Invalid form, please review the fields."
    } else {
        that.valid = true;
        form.classList.add('was-validated')

        const formData = {
            fields: [{
                objectTypeId: "0-1",
                name: "email",
                value: form.email.value
            }],
            context: {
                pageUri: route.path,
                pageName: document.title
            }
        }

        posthog.capture("newsletter_form");

        gtm?.trackEvent({
            event: "newsletter_form",
            noninteraction: false,
        })

        identify(form.email.value);

        axios.post(hubSpotUrl, formData)
            .then((response) => {
                if (response.status !== 200) {
                    that.message = response.data.message;
                    that.valid = false;
                } else {
                    that.valid = true;
                    that.message = response.data.inlineMessage;
                    form.reset()
                    form.classList.remove('was-validated')
                }
            })
    }
}