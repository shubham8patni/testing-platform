# Contributing Guide

## 🤝 Welcome to the Insurance Testing Platform

Thank you for your interest in contributing to this project! This guide will help you get started with contributing code, documentation, or ideas to the Insurance Testing Platform.

## 🎯 Project Overview

The Insurance Testing Platform is an open-source system designed for validating insurance policy purchase flows across multiple environments. We use modern technologies including FastAPI, React, TypeScript, and AI-powered analysis.

### Our Mission
- Automate insurance testing workflows
- Detect regressions before production deployment
- Provide AI-powered insights for differences
- Create a platform that scales with insurance industry needs

## 🚀 Getting Started

### Prerequisites
- Python 3.9+ with pip
- Node.js 18+ with npm
- Git
- Basic understanding of REST APIs and modern web development
- Familiarity with insurance domain (helpful but not required)

### Initial Setup

1. **Fork the Repository**
   ```bash
   # Fork the repository on GitHub
   git clone https://github.com/YOUR_USERNAME/insurance-testing-platform.git
   cd insurance-testing-platform
   ```

2. **Set Up Development Environment**
   ```bash
   # Follow the setup guide in SETUP.md
   ./scripts/setup.sh
   ```

3. **Run Development Servers**
   ```bash
   ./scripts/run_dev.sh
   ```

4. **Verify Installation**
   - Backend: http://localhost:8000
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/docs

## 📋 Types of Contributions

### 🐛 Bug Reports
Help us improve by reporting bugs:

1. **Check Existing Issues**: Search for similar issues
2. **Create New Issue**: Use bug report template
3. **Provide Details**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots if applicable

### ✨ Feature Requests
We welcome feature suggestions:

1. **Discuss First**: Create an issue to discuss the feature
2. **Provide Context**:
   - Problem you're solving
   - Proposed solution
   - Alternative approaches considered
   - Impact on users

### 📝 Documentation
Help improve our documentation:

1. **Fix Typos**: Correct spelling and grammar
2. **Add Examples**: Provide code examples and use cases
3. **Update Guides**: Keep documentation current with features
4. **Translate**: Add translations if you speak multiple languages

### 💻 Code Contributions
Follow these steps for code contributions:

#### 1. Choose an Issue
- Look for issues labeled `good first issue` for beginners
- Pick issues matching your expertise
- Comment on the issue to claim it

#### 2. Create a Branch
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-number-description
```

#### 3. Make Changes
- Follow the code style guidelines
- Write tests for new functionality
- Update documentation as needed
- Keep changes small and focused

#### 4. Test Your Changes
```bash
# Run backend tests
cd backend && pytest

# Run frontend tests
cd frontend && npm test

# Check code style
black --check backend/
eslint frontend/src/
```

#### 5. Commit Your Changes
```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat: add user authentication system"

# Push to your fork
git push origin feature/your-feature-name
```

#### 6. Create Pull Request
- Open a pull request against `main` branch
- Fill out the PR template completely
- Request review from maintainers
- Address feedback promptly

## 📝 Code Style Guidelines

### Python (Backend)

#### Formatting
```bash
# Use Black for code formatting
pip install black
black --line-length 100 app/

# Use isort for import sorting
pip install isort
isort app/

# Use flake8 for linting
pip install flake8
flake8 app/
```

#### Code Standards
- Follow PEP 8 style guide
- Use type hints for all functions
- Write descriptive variable and function names
- Add docstrings for public functions
- Use async/await for I/O operations

#### Example Good Code
```python
"""
Test executor service for running insurance policy tests.

This service orchestrates test execution across multiple environments
and provides progress tracking and result storage.
"""

from typing import Dict, Any, List
from datetime import datetime

class TestExecutorService:
    """Service for executing insurance policy tests."""
    
    async def start_test(
        self, 
        test_config: Dict[str, Any]
    ) -> str:
        """
        Start a new test execution.
        
        Args:
            test_config: Configuration for the test execution
            
        Returns:
            str: Test ID for tracking execution
            
        Raises:
            ValueError: If test configuration is invalid
        """
        # Implementation here
        pass
```

### TypeScript/React (Frontend)

#### Formatting
```bash
# Use Prettier for formatting
npm install --save-dev prettier
npx prettier --write src/

# Use ESLint for linting
npm run lint
npm run lint:fix
```

#### Code Standards
- Use TypeScript for all new code
- Follow React functional component patterns
- Use custom hooks for shared logic
- Implement proper error boundaries
- Add loading states and error handling

#### Example Good Code
```typescript
import React, { useState, useCallback } from 'react';
import { TestConfig } from '../types';

interface TestConfigProps {
  initialConfig: TestConfig;
  onSubmit: (config: TestConfig) => void;
  loading?: boolean;
}

/**
 * Component for configuring test execution parameters.
 * Provides form for selecting environments, scope, and AI prompts.
 */
const TestConfig: React.FC<TestConfigProps> = ({
  initialConfig,
  onSubmit,
  loading = false
}) => {
  const [config, setConfig] = useState<TestConfig>(initialConfig);
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onSubmit(config);
    } catch (error) {
      console.error('Test configuration failed:', error);
    }
  }, [config, onSubmit]);

  return (
    <form onSubmit={handleSubmit}>
      {/* Component JSX */}
    </form>
  );
};

export default TestConfig;
```

## 🧪 Testing Guidelines

### Backend Testing

#### Test Structure
```python
# tests/test_test_executor.py
import pytest
from app.services.test_executor import TestExecutorService

class TestTestExecutorService:
    
    @pytest.fixture
    def test_executor(self):
        """Create test executor instance for testing."""
        storage = MockStorageService()
        return TestExecutorService(storage)
    
    async def test_start_test_success(self, test_executor):
        """Test successful test start."""
        config = {
            "user_id": "test_user",
            "target_env": "qa",
            "baseline_env": "stage",
            "scope": {"type": "all"}
        }
        
        test_id = await test_executor.start_test(config)
        
        assert test_id is not None
        assert test_id.startswith("test_")
```

#### Testing Requirements
- Unit tests for all service methods
- Integration tests for API endpoints
- Test coverage >80%
- Mock external dependencies
- Test error conditions and edge cases

### Frontend Testing

#### Component Testing
```typescript
// src/components/__tests__/TestConfig.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TestConfig from '../TestConfig';

describe('TestConfig', () => {
  const mockOnSubmit = jest.fn();
  
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });
  
  it('renders configuration form', () => {
    render(<TestConfig 
      initialConfig={{}} 
      onSubmit={mockOnSubmit} 
    />);
    
    expect(screen.getByLabelText('Target Environment')).toBeInTheDocument();
    expect(screen.getByLabelText('Baseline Environment')).toBeInTheDocument();
  });
  
  it('submits form with correct data', () => {
    const config = {
      target_env: 'qa',
      baseline_env: 'stage'
    };
    
    render(<TestConfig 
      initialConfig={config} 
      onSubmit={mockOnSubmit} 
    />);
    
    fireEvent.change(screen.getByLabelText('Target Environment'), {
      target: { value: 'dev' }
    });
    
    fireEvent.click(screen.getByText('Start Test'));
    
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ target_env: 'dev' })
    );
  });
});
```

#### Testing Requirements
- Unit tests for all components
- Integration tests for user flows
- Accessibility testing
- Cross-browser compatibility testing
- Visual regression testing for UI changes

## 📋 Pull Request Process

### PR Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing done

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes (or clearly documented)
```

### PR Review Process
1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Peer Review**: At least one maintainer review required
3. **Testing**: Manual testing on different environments
4. **Approval**: Maintainer approval required for merge
5. **Merge**: Squash and merge to main branch

## 🏷️ Issue Labels

### Priority Labels
- `critical`: Blocks release or breaks functionality
- `high`: Important feature or bug fix
- `medium`: Nice to have improvement
- `low`: Minor improvement or cleanup

### Type Labels
- `bug`: Error or unexpected behavior
- `enhancement`: New feature or improvement
- `documentation`: Documentation changes
- `good first issue`: Good for beginners
- `help wanted`: Community help needed

### Status Labels
- `in progress`: Currently being worked on
- `needs review`: Ready for review
- `blocked`: Waiting on dependencies
- `duplicate`: Same issue already exists

## 🌟 Recognition

### Contributor Types
- **Code Contributors**: Write code and fix bugs
- **Documentation Contributors**: Improve documentation
- **Community Contributors**: Help others and provide feedback
- **Design Contributors**: Improve UI/UX design

### Recognition Methods
- Contributor list in README
- Release notes mentioning contributors
- Special badges for significant contributions
- invitations to core team for consistent contributors

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and ideas
- **Pull Requests**: For code contributions
- **Email**: For security issues or urgent matters

### Asking Good Questions
1. **Search First**: Check docs and existing issues
2. **Be Specific**: Provide details and context
3. **Show Your Work**: Explain what you've tried
4. **Use Code Blocks**: Format code properly
5. **Follow Up**: Respond to feedback promptly

### Example Good Question
```markdown
**Subject**: Issue with test executor service

**Environment**: Ubuntu 20.04, Python 3.11, Node.js 18

**Problem**: Test executor fails when running parallel tests with the error:
```
RuntimeError: Event loop is closed
```

**What I tried**:
1. Reduced number of parallel tests from 10 to 5
2. Added error handling in async functions
3. Checked Python asyncio documentation

**Code snippet**:
```python
async def run_parallel_tests(tests):
    tasks = [run_test(test) for test in tests]
    return await asyncio.gather(*tasks)
```

**Expected behavior**: Tests should run in parallel without errors
**Actual behavior**: RuntimeError after 2-3 tests complete
```

## 🔒 Security Guidelines

### Reporting Security Issues
- **Do NOT** open public issues for security problems
- **Email**: security@yourproject.com
- **Include**: Detailed description, reproduction steps, impact assessment
- **Response**: We'll respond within 48 hours

### Secure Coding Practices
- Validate all inputs
- Use parameterized queries for database
- Store secrets in environment variables
- Implement proper authentication and authorization
- Keep dependencies updated

## 📜 Code of Conduct

### Our Pledge
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Be patient with different perspectives

### Unacceptable Behavior
- Harassment or discrimination
- Personal attacks or insults
- Spam or off-topic content
- Violation of privacy
- Deliberate intimidation

### Reporting Issues
- Contact maintainers privately
- Provide specific details
- Allow maintainers to handle appropriately
- Maintain confidentiality

## 🚀 Release Process

### Versioning
- Follow Semantic Versioning (semver)
- MAJOR.MINOR.PATCH format
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version number updated
- [ ] Tag created
- [ ] Release notes written

## 🎉 Thank You

Your contributions make this project better for everyone! We appreciate the time and effort you put into improving the Insurance Testing Platform.

### Ways to Stay Involved
- Star the repository
- Follow project updates
- Share your experiences
- Help others in discussions
- Suggest improvements

---

## 📞 Contact Information

- **Project Maintainers**: [maintainer-email@yourproject.com]
- **Security Issues**: security@yourproject.com
- **General Questions**: Use GitHub Discussions

---

Thank you for contributing to the Insurance Testing Platform! Your efforts help make insurance testing more reliable and efficient for everyone.