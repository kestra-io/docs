# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Kestra documentation

## Working relationship
- You can push back on ideas-this can lead to better documentation. Cite sources and explain your reasoning when you do so
- ALWAYS ask for clarification rather than making assumptions
- NEVER lie, guess, or make up information
- If you are making an inferrance, stop and ask me for confirmation or say that you need more information

## Project context
- Format: Markdown files (.md) with YAML frontmatter
- Config: nuxt.config.ts and content.config.ts for navigation, content collections, and settings
- Framework: Nuxt 3 with @nuxt/content for file-based CMS
- Components: Vue 3 components organized by feature in components/ directory
- Content structure: Numbered directories in content/docs/ control navigation order

## Content strategy
- Document just enough for user success - not too much, not too little
- Prioritize accuracy and usability of information
- Make content evergreen when possible
- Search for existing information before adding new content. Avoid duplication unless it is done for a strategic reason
- Check existing patterns for consistency
- Start by making the smallest reasonable changes

## Frontmatter requirements for pages
- title: Clear, descriptive page title
- description: Concise summary for SEO/navigation

## Writing standards
- The first sentence of any page must be short and concise, as it is used the ChildCard.vue component. If more detail is needed, separate extra information into a second paragraph just after the first sentence.
- Second-person voice ("you")
- Prerequisites at start of procedural content
- Test all code examples before publishing
- Match style and formatting of existing pages
- Include both basic and advanced use cases
- Language tags on all code blocks
- Alt text on all images
- Relative paths for internal links
- Use broadly applicable examples rather than overly specific business cases
- Lead with context when helpful - explain what something is before diving into implementation details
- Use sentence case for all headings ("Getting started", not "Getting Started")
- Use sentence case for code block titles ("Expandable example", not "Expandable Example")
- Prefer active voice and direct language
- Remove unnecessary words while maintaining clarity
- Break complex instructions into clear numbered steps
- Make language more precise and contextual

### Language and tone standards
- Avoid promotional language. You are a technical writing assistant, not a marketer. Never use phrases like "breathtaking" or "exceptional value"
- Reduce conjunction overuse. Limit use of "moreover," "furthermore," "additionally," "on the other hand." Favor direct, clear statements
- Avoid editorializing. Remove phrases like "it's important to note," "this article will," "in conclusion," or personal interpretations
- No undue emphasis. Avoid overstating importance or significance of routine technical concepts

### Technical accuracy standards
- Verify all links. Every link, both internal and external, must be tested and functional before publication
- Maintain consistency. Use consistent terminology, formatting, and language variety throughout all documentation
- Valid technical references. Ensure all code examples, API references, and technical specifications are current and accurate

### Formatting discipline
- Purposeful formatting. Use bold, italics, and emphasis only when it serves the user's understanding, not for visual appeal
- Clean structure. Avoid excessive formatting. Never use emoji or decorative elements that don't add functional value

### Component introductions
- Start with action-oriented language: "Use [component] to..." rather than "The [component] component..."
- Be specific about what components can contain or do
- Make introductions practical and user-focused

### Property descriptions
- End all property descriptions with periods for consistency
- Be specific and helpful rather than generic
- Add scope clarification where needed (e.g., "For Font Awesome icons only:")
- Use proper technical terminology ("boolean" not "bool")

### Code examples
- Keep examples simple and practical
- Use consistent formatting and naming
- Provide clear, actionable examples rather than showing multiple options when one will do

## Content organization
- Structure content in the order users need it
- Combine related information to reduce redundancy
- Use specific links (direct to relevant pages rather than generic dashboards)
- Put most commonly needed information first

## Git workflow
- NEVER use --no-verify when committing
- Ask how to handle uncommitted changes before starting
- Create a new branch when no clear branch exists for changes
- Commit frequently throughout development
- NEVER skip or disable pre-commit hooks

## Do not
- Skip frontmatter on any markdown file
- Use absolute URLs for internal links
- Include untested code examples
- Make assumptions - always ask for clarification

## Development Commands

### Local Development
```bash
npm install          # Install dependencies
npm run dev         # Start development server on localhost:3001
npm run build       # Build for production
npm run generate    # Generate static site
npm run preview     # Preview production build
```

### Deployment Commands
```bash
npm run pages:dev           # Cloudflare Pages development
npm run pages:build         # Build for Cloudflare Pages deployment
npm run pages:deploy        # Deploy to Cloudflare Pages
npm run pages:build-deploy  # Build and deploy to Cloudflare Pages
```

## Technical Architecture

This is the Kestra documentation website built with **Nuxt 3** and **@nuxt/content**. Key technical details:

- **Framework**: Nuxt 3 with Vue 3 Composition API
- **Content Management**: @nuxt/content for file-based CMS using markdown files
- **Content Location**: 
  - `content/docs/` - Documentation organized in numbered directories (01.getting-started, 02.installation, etc.)
  - `content/blogs/` - Blog posts with date-based naming
- **Navigation**: Directory structure with numbered prefixes controls navigation order
- **Components**: Vue 3 components in `components/` directory, organized by feature
- **Styling**: Bootstrap 5 with SCSS preprocessing
- **Development Server**: Runs on port 3001 (not default 3000)
- **Deployment**: Optimized for Cloudflare Pages
- **Requirements**: Node.js 20+ (especially for Apple Silicon Macs)