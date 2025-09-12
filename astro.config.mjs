// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [
      starlight({
        title: 'Kestra Docs',
        sidebar:  [{
                    label: "Get Started with Kestra",
                    items: [
                        {slug: "Getting Started"},
                        {slug: "Tutorial"},
                        {slug: "Architecture"},
                        {slug: "Installation Guide"},
                        {slug: "User Interface"}
                        // {slug: "Video Tutorials"}
                    ],
                // }, {
                //     label: "Build with Kestra",
                //     items: [
                //         "Concepts",
                //         "Workflow Components",
                //         "Multi-Language Script Tasks",
                //         "AI Tools",
                //         "Version Control & CI/CD",
                //         "Plugin Developer Guide",
                //         "How-to Guides"
                //     ],
                // }, {
                //     label: "Scale with Kestra",
                //     items: [
                //         "Cloud & Enterprise Edition",
                //         "Task Runners",
                //         // "Worker Groups",
                //         "Best Practices"
                //     ],
                // }, {
                //     label: "Manage Kestra",
                //     items: [
                //         "Administrator Guide",
                //         "Migration Guide",
                //         "Performance"
                //     ],
                // }, {
                //     label: "Reference Docs",
                //     items: [
                //         "Configuration",
                //         "Expressions",
                //         "API Reference",
                //         "Terraform Provider",
                //         "Server CLI",
                //         "Kestra EE CLI"
                //     ]
                },
            ]
      }),
],
  adapter: cloudflare({
    imageService: 'cloudflare'
  }),
});