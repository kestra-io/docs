export const allQuestions = [
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

export const getRandomAiQuestions = () =>
    [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 3)
