import posthog from 'posthog-js'

export default function(email) {
    if (window?.signals?.identify) {
        window.signals.identify({ email: email })
    }

    var _hsq = window._hsq = window._hsq || [];
    _hsq.push(['identify', {email: email}]);

    posthog.identify(
        undefined,
        {email: email}
    );
}

