<template>
    <div>
        <Head>
            <Title>Orchestrate your Python Scripts with Kestra</Title>
            <Meta name="description"
                  content="Build declaratively your workflows and seamlessly run all your Python Scripts with Kestra"/>
        </Head>

        <FeaturesLanguageSubPagesHeader
            title="Python Scripts"
            description="Build declaratively your workflows and seamlessly run all your Python Scripts"
            source="/landing/features/language/python/header.svg"
        />
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguageSubPagesFeatures
                :features="pythonFeatures"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguageSubPagesPower
                title="with Python"
                :description="pythonPowerDesc"
                source="/landing/features/language/python/power.svg"
            />
        </NuxtLazyHydrate>

        <NuxtLazyHydrate when-visible>
            <FeaturesLanguageSubPagesScripts
                title="Python"
                :scripts="pythonScripts"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguageSubPagesOrchestrator
                :description="pythonOrchestratorDesc"
                source="/landing/features/language/python/scripts/python-puzzle.svg"
            />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <FeaturesLanguagePlugins/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutFooterContact
                title="Getting Started with  Declarative Orchestration"
                darkButtonText="Get started"
                darkButtonHref="docs/getting-started"
                purpleButtonText="Talk to us"
                purpleButtonHref="https://kestra.io/demo"
            />
        </NuxtLazyHydrate>
    </div>
</template>

<script setup>
  const {origin} = useRequestURL()

  const pythonFeatures = {
    title: 'Advanced Python Scripting with Kestra',
    childList: [
      {
        source: '/landing/features/language/sub-pages/icon-customize.svg',
        title: 'Customize at Runtime',
        description: 'Add any Python package to your environment as your workflows demand, maintaining flexibility without pre-configurations.',
      },
      {
        source: '/landing/features/language/sub-pages/icon-sync.svg',
        title: 'Import or Sync your Entire Project',
        description: 'Sync your  Python project into Kestra. Enjoy comprehensive support for all your dependencies and modules.',
      },
      {
        source: '/landing/features/language/sub-pages/icon-cloud.svg',
        title: 'Cloud-Agnostic Execution',
        description: 'Deploy and execute your Python scripts on any cloud with Kestra’s Task Runners. Optimize for performance, cost, compliance.',
      },
    ],
  };

  const pythonPowerDesc = [
    'Python scripts are the backbone of many automations, data processing, and web applications. With Python, you can analyze massive datasets, or even build complex machine-learning models. Kestra, with its robust orchestration capabilities, unlocks Python’s potential by managing these scripts effectively.',
    'Whether you are automating data ingestion, running nightly builds, or orchestrating complex workflows in real time, Kestra streamlines these processes, making it easier and faster to deliver results.'
  ];

  const pythonOrchestratorDesc = [
    'Integrate seamlessly with your existing Python scripts — no changes necessary. Unlike other platforms that require you to adjust your code to fit their environment, Kestra adapts to your code. Simply call your scripts as you have developed them, and Kestra handles the rest.',
    'Maintain your focus on writing great code, not on adapting it to fit the orchestration tool. Whether your scripts are set up for data processing, automation, or any other task, integrating them into Kestra is as simple as defining your workflow.',
  ];

  const pythonScripts = [
    {
      title: 'Embrace GitOps best practices for your Python scripts',
      description: 'Kestra takes Python script orchestration to the next level by embracing Continuous Integration/Continuous Deployment (CI/CD) and GitOps principles. Manage your Python workflows with the same rigor as your application code: version control, automated testing, and consistent, repeatable deployment environments. Kestra  lets you define workflows in YAML, ensuring that your orchestration is as maintainable and scalable as your applications.',
      source: '/landing/features/language/git-with-kestra.svg',
      imgWidth: '520px',
      imgHeight: '282px',
    },
    {
      title: 'Integration with Docker, Seamless Environment Management',
      description: 'Managing environments for Python scripts doesn\'t have to be complicated. With Kestra’s Docker integration, each part of your Python workflow can be containerized, ensuring that they run in isolated and consistent settings. From Kestra\'s intuitive editor, you can control Docker containers, manage dependencies, and scale your scripts across multiple environments without ever leaving the platform. This integration simplifies environment inconsistencies and enhances reproducibility.',
      source: '/landing/features/language/python/scripts/docker.svg',
      imgWidth: '568px',
      imgHeight: '420px',
    },
    {
      title: 'Embedded Python Scripts for Simplicity',
      description: 'For simpler tasks that require quick, straightforward solutions, Kestra’s Python task feature allows you to embed Python scripts directly into your workflows. This is ideal for small-scale data formatting, quick calculations, or script-based alerts within larger workflows. By embedding scripts directly, Kestra reduces complexity and enhances execution speed, providing a streamlined approach to handle simpler, yet frequent tasks.',
      source: '/landing/features/language/python/scripts/embedded-python.svg',
      imgHeight: '420px',
      mask: 'mask-1',
    }
  ];

  useHead({
    meta: [
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:site', content: '@kestra_io'},
      {name: 'twitter:title', content: "Code in Any language with Kestra the Language Agnostic Platform"},
      {
        name: 'twitter:description',
        content: "Separate your business logic from your orchestration logic with a versatile set of language-agnostic developer tools"
      },
      {name: 'twitter:image', content: `${origin}/landing/features/declarative/header-bg.svg`},
      {name: 'twitter:image:alt', content: "Declarative Data Orchestration with Kestra"}
    ]
  })
</script>
