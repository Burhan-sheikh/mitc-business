# Contributing to MITC Web App

Thank you for your interest in contributing to MITC Web App! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS, etc.)

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/Burhan-sheikh/mitc-business.git
   cd mitc-business
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the code style guidelines
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   npm run dev
   npm run lint
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description
   - Link related issues
   - Include screenshots if UI changes

## Development Guidelines

### Code Style

- Use ES6+ JavaScript features
- Follow React best practices
- Use functional components and hooks
- Keep components small and focused
- Use meaningful variable and function names
- Add comments for complex logic

### Component Structure

```javascript
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue)

  useEffect(() => {
    // Side effects
  }, [dependencies])

  const handleAction = () => {
    // Event handler
  }

  return (
    <div>
      {/* JSX */}
    </div>
  )
}

MyComponent.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
}

export default MyComponent
```

### Commit Messages

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example: `feat: add product filtering by price range`

### Testing

- Test all new features manually
- Verify responsive design on multiple devices
- Check dark mode compatibility
- Test with different user roles (guest, user, admin)

## Project Structure

- `src/components/` - React components
- `src/pages/` - Page components
- `src/contexts/` - React contexts
- `src/services/` - API services
- `src/utils/` - Utility functions
- `src/styles/` - Global styles and themes
- `functions/` - Cloud Functions

## Questions?

Feel free to:
- Open an issue for discussion
- Contact: mateencorp@gmail.com
- WhatsApp: +91 8082754459

Thank you for contributing! 🎉
