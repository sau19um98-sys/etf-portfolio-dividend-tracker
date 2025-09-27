# Contributing to ETF Dividend Tracker

Thank you for your interest in contributing to the ETF Dividend Tracker! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Polygon.io API key (Starter plan recommended)
- Appwrite instance (cloud or self-hosted)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/etf-portfolio-dividend-tracker.git
   cd etf-portfolio-dividend-tracker
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Fill in your API keys and configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style
- Use ESLint configuration provided
- Follow React best practices
- Use TypeScript where applicable
- Maintain consistent naming conventions

### Component Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── etf/            # ETF-specific components
│   └── portfolio/      # Portfolio management components
├── context/            # React context providers
├── services/           # API services and utilities
├── pages/              # Page components
└── utils/              # Helper functions
```

### API Integration
- All API calls should go through service layers
- Implement proper error handling
- Respect rate limits (especially for Polygon.io Starter plan)
- Use caching where appropriate

## 🐛 Bug Reports

When reporting bugs, please include:
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, Node version
- **Screenshots**: If applicable

### Bug Report Template
```markdown
**Bug Description**
A clear and concise description of the bug.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 96, Firefox 95]
- Node.js: [e.g. 18.0.0]
- npm: [e.g. 8.0.0]
```

## 💡 Feature Requests

We welcome feature requests! Please:
- Check existing issues first
- Provide clear use cases
- Consider implementation complexity
- Think about API rate limit implications

### Feature Request Template
```markdown
**Feature Description**
A clear and concise description of the feature you'd like to see.

**Use Case**
Explain why this feature would be useful and who would benefit.

**Proposed Solution**
If you have ideas on how to implement this, please share.

**Additional Context**
Any other context, mockups, or examples.
```

## 🔧 Pull Requests

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] Tests pass (if applicable)
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Tested with Polygon.io Starter plan limitations

### PR Process
1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, documented code
   - Follow existing patterns
   - Test thoroughly

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format
Use conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

## 🧪 Testing

### Manual Testing
- Test all major user flows
- Verify API integration works with rate limits
- Check responsive design on different devices
- Test error scenarios (network failures, API errors)

### Polygon.io Testing
- Test with actual API keys
- Verify rate limiting works correctly
- Check delayed data indicators display properly
- Test 24-hour refresh cooldown

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex algorithms
- Explain API integration patterns
- Include examples where helpful

### User Documentation
- Update README for new features
- Add setup instructions for new services
- Document configuration options
- Include troubleshooting guides

## 🔒 Security

### Reporting Security Issues
Please report security vulnerabilities privately to [security@yourproject.com] rather than creating public issues.

### Security Guidelines
- Never commit API keys or secrets
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP guidelines

## 🎯 Areas for Contribution

### High Priority
- [ ] Real-time WebSocket integration (for Developer plan users)
- [ ] Advanced portfolio analytics
- [ ] Mobile responsiveness improvements
- [ ] Performance optimizations

### Medium Priority
- [ ] Additional chart types
- [ ] Export functionality
- [ ] Email notifications
- [ ] Advanced filtering options

### Low Priority
- [ ] Dark mode enhancements
- [ ] Accessibility improvements
- [ ] Internationalization
- [ ] Social features

## 📞 Getting Help

### Community
- GitHub Discussions for questions
- Issues for bug reports and feature requests

### Development Questions
- Check existing documentation first
- Search closed issues for similar problems
- Create detailed issues with examples

## 🎉 Recognition

Contributors will be recognized in:
- README contributors section
- Release notes for significant contributions
- Project documentation

Thank you for contributing to the ETF Dividend Tracker! 🚀
