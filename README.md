# Project Repository

## Overview

This repository contains three main projects:

1. **Backend**: Built with Node.js, Apollo Server for GraphQL, and Prisma.
2. **Web**: Built with React 18 and Vite.
3. **Mobile**: Built with React Native Expo.

Each project has its own folder and setup instructions. Below is a brief overview of the repository structure and links to detailed README files for each project.

## Repository Structure

- **[backend/](./backend)**: Contains the backend codebase.
- **[web/](./web)**: Contains the web application codebase.
- **[mobile/](./mobile)**: Contains the mobile application codebase.

## VSCode Extensions

### Mandatory Extensions

These extensions are required to ensure a consistent development experience:

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [GraphQL: Language Feature Support](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)
- [GraphQL: Syntax Highlighting](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql-syntax)
- [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)

### Enabling Prettier for Auto-Formatting

To ensure consistent code formatting, Prettier should be enabled to auto-format files on save. Follow these steps:

1. Open VSCode settings: `File > Preferences > Settings` (or use `Ctrl + ,`).
2. Search for "Format On Save".
3. Check the box for `Editor: Format On Save`.

Alternatively, you can add the following settings to your `settings.json` file:

```json
{
  "editor.formatOnSave": true
}
```

### Recommended Extensions

These extensions are recommended to enhance your development workflow:

- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)
- [ES7 React/Redux/GraphQL/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=rodrigovallades.es7-react-js-snippets)
- [GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)

## Detailed Setup Instructions

For detailed setup instructions and more information on each project, please refer to their respective README files:

- [Backend README](./backend/README.md)
- [Web README](./web/README.md)
- [Mobile README](./mobile/README.md)
