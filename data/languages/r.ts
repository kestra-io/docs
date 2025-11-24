export const rFeatures = {
    title: 'Advanced R Scripting with Kestra',
    childList: [
      {
        source: '/landing/features/language/sub-pages/icon-customize.svg',
        title: 'Customize at Runtime',
        description: 'Add any R package to your environment as your workflows demand, maintaining flexibility without pre-configurations.',
      },
      {
        source: '/landing/features/language/sub-pages/icon-sync.svg',
        title: 'Import or Sync your Entire Project',
        description: 'Sync your  R project into Kestra. Enjoy comprehensive support for all your dependencies and modules.',
      },
      {
        source: '/landing/features/language/sub-pages/icon-cloud.svg',
        title: 'Cloud-Agnostic Execution',
        description: 'Deploy and execute your R scripts on any cloud with Kestra’s Task Runners. Optimize for performance, cost, compliance.',
      },
    ],
  };

  export const rPowerDesc = [
    ' R is essential for statistical analysis, visualization, and data manipulation. With Kestra, you can effortlessly automate data ingestion, conduct complex statistical analysis, and handle real-time data processing. Kestra\'s robust orchestration capabilities ensure that your R scripts run smoothly and efficiently, streamlining your data-driven projects.'
  ];

  export const rScripts = [
    {
      title: 'Embrace GitOps best practices for your R scripts',
      description: 'Kestra takes R script orchestration to the next level by embracing Continuous Integration/Continuous Deployment (CI/CD) and GitOps principles. Manage your R workflows with the same rigor as your application code: version control, automated testing, and consistent, repeatable deployment environments. Kestra  lets you define workflows in YAML, ensuring that your orchestration is as maintainable and scalable as your applications.',
      source: '/landing/features/language/git-with-kestra.svg',
      imgWidth: '520px',
      imgHeight: '282px',
    },
    {
      title: 'Integration with Docker, Seamless Environment Management',
      description: 'Managing environments for R scripts is straightforward with Kestra’s Docker integration. Containerize each part of your R workflow to ensure isolated and consistent settings, directly from Kestra\'s intuitive editor. This integration simplifies handling environment inconsistencies and boosts reproducibility.',
      source: '/landing/features/language/r/scripts/docker.svg',
      imgWidth: '568px',
      imgHeight: '420px',
    },
    {
      title: 'Embedded R Scripts for Simplicity',
      description: 'For tasks that need straightforward solutions, Kestra’s task feature allows embedding R scripts directly into your workflows. Ideal for data manipulation, quick statistical calculations, or creating data alerts within larger workflows. Embed your R scripts directly to reduce complexity and enhance execution speed.',
      source: '/landing/features/language/r/scripts/embedded-r.svg',
      imgHeight: '420px',
      mask: 'mask-1',
    }
  ];

  export const rOrchestratorDesc = [
    'Kestra seamlessly integrates with your existing R scripts with no need for modifications. Just call your scripts as they are, and let Kestra do the heavy lifting. Focus on your analysis and let Kestra handle the orchestration.'
  ];