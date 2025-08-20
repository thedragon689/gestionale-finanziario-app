# 🤝 Contributing to Gestionale Finanziario

Thank you for your interest in contributing to Gestionale Finanziario! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)
- [Questions and Support](#questions-and-support)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 How Can I Contribute?

### Reporting Bugs

- Use the GitHub issue tracker
- Include detailed steps to reproduce the bug
- Provide system information (OS, browser, etc.)
- Include error messages and stack traces
- Add screenshots if applicable

### Suggesting Enhancements

- Use the GitHub issue tracker with the "enhancement" label
- Describe the feature and its benefits
- Include mockups or examples if possible
- Consider implementation complexity

### Pull Requests

- Fork the repository
- Create a feature branch
- Make your changes
- Add tests if applicable
- Update documentation
- Submit a pull request

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Git
- Docker (optional, for full stack development)

### Local Development

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/gestionale-finanziario.git
   cd gestionale-finanziario
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../core-banking && npm install
   cd ../cryptocurrency && npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development**
   ```bash
   # Frontend only
   cd frontend && npm start
   
   # Full stack
   npm run dev
   ```

### Testing

```bash
# Run all tests
npm test

# Frontend tests
cd frontend && npm test

# API tests
cd core-banking && npm test
```

## 📝 Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### React Components

- Use functional components with hooks
- Follow the component naming convention: `PascalCase`
- Use TypeScript interfaces for props
- Implement proper error boundaries
- Use React.memo for performance optimization when needed

### CSS/Styling

- Use Material-UI components and theming
- Follow the design system
- Use CSS-in-JS with emotion/styled-components
- Maintain responsive design principles

### Backend Services

- Follow RESTful API conventions
- Use proper HTTP status codes
- Implement input validation
- Add comprehensive error handling
- Use async/await for asynchronous operations

## 📋 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```bash
feat(frontend): add cryptocurrency wallet management
fix(api): resolve authentication token validation issue
docs: update API documentation
style: format code according to style guide
refactor(services): extract common API logic
test: add unit tests for transaction service
```

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure your code follows the coding standards**
2. **Add tests for new functionality**
3. **Update documentation if needed**
4. **Check that all tests pass**
5. **Verify the application builds successfully**

### Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Checklist
- [ ] I have read the [CONTRIBUTING.md](CONTRIBUTING.md) file
- [ ] My code follows the project's coding standards
- [ ] I have updated the documentation accordingly
- [ ] I have added tests to cover my changes
- [ ] All new and existing tests pass
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: At least one maintainer must approve
3. **Documentation**: Ensure documentation is updated
4. **Testing**: Verify functionality works as expected
5. **Merge**: Once approved, the PR will be merged

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
## Bug Description
Clear and concise description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]
- Node.js Version: [e.g. 18.15.0]

## Additional Context
Add any other context about the problem here
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Problem Statement
A clear and concise description of what the problem is

## Proposed Solution
A clear and concise description of what you want to happen

## Alternative Solutions
A clear and concise description of any alternative solutions you've considered

## Additional Context
Add any other context or screenshots about the feature request here
```

## ❓ Questions and Support

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check the [docs/](docs/) folder
- **Email**: support@gestionale-finanziario.com

### Before Asking

1. Check existing issues and discussions
2. Read the documentation
3. Search for similar questions
4. Provide context and details

## 🏆 Recognition

Contributors will be recognized in the following ways:

- **Contributors List**: Added to the project's contributors list
- **Release Notes**: Mentioned in release notes for significant contributions
- **Documentation**: Credit in relevant documentation sections

## 📚 Resources

- [Project Documentation](docs/)
- [API Documentation](docs/api.md)
- [Architecture Overview](ARCHITETTURA.md)
- [Development Guide](docs/development.md)
- [Testing Guide](docs/testing.md)

## 🤝 Community

- **Discussions**: [GitHub Discussions](https://github.com/your-username/gestionale-finanziario/discussions)
- **Issues**: [GitHub Issues](https://github.com/your-username/gestionale-finanziario/issues)
- **Releases**: [GitHub Releases](https://github.com/your-username/gestionale-finanziario/releases)

---

Thank you for contributing to Gestionale Finanziario! 🎉

**Made with ❤️ by the Gestionale Finanziario Team**
