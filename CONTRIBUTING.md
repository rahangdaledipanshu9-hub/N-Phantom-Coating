# Contributing to N-Phantom-Coating

First off, thank you for considering contributing to the N-Phantom-Coating project! It's people like you that make this project such a great tool for advancing stealth coating technology.

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to making participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior include:

- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Git
- Basic understanding of stealth coating technology (or willingness to learn!)
- Familiarity with the project's technical architecture

### Development Setup

1. **Fork the Repository**
   ```bash
   Click the "Fork" button on GitHub to create your own copy
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/N-Phantom-Coating.git
   cd N-Phantom-Coating
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/original-owner/N-Phantom-Coating.git
   ```

4. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

5. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

---

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**Use a clear and descriptive title** for the issue to identify the problem.

**Provide a step-by-step description** of the exact steps which reproduce the problem.

**Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.

**Describe the behavior you observed** after following the steps and point out what exactly is the problem with that behavior.

**Explain which behavior you expected to see instead** and why.

**Include screenshots/diagrams** if possible. You can use the built-in screenshot tool in most operating systems.

**Include your environment details:**
- Operating System and version
- Python version
- Any relevant software versions
- Installation method

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

**Use a clear and descriptive title** for the issue to identify the suggestion.

**Provide a step-by-step description** of the suggested enhancement in as much detail as possible.

**Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples, as Markdown code blocks.

**Describe the current behavior** and **explain the expected behavior** and why this would be useful.

**Include screenshots and animated GIFs** if applicable.

**List some other stealth coating projects or tools** where this enhancement exists.

---

## Pull Request Process

### Before You Start

1. Create an issue describing what you want to do
2. Get feedback from maintainers
3. Fork the repository
4. Create a branch with a descriptive name

### Creating a Pull Request

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix-name
   ```

2. **Make Your Changes**
   - Follow the coding standards (see below)
   - Write or update tests as needed
   - Update documentation if necessary
   - Commit with clear, descriptive messages

   ```bash
   git add .
   git commit -m "Add description of changes"
   ```

3. **Keep Your Branch Updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

4. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Submit a Pull Request**
   - Go to GitHub and create a PR from your fork
   - Use a clear title and description
   - Link any related issues
   - Ensure all tests pass

### Pull Request Title Guidelines

- Use imperative mood ("Add feature" not "Added feature")
- Use a descriptive title
- Reference issues and pull requests liberally after the first line

### Pull Request Description Template

```markdown
## Description
Brief description of what this PR does.

## Related Issues
Closes #(issue number)

## Changes Made
- Bullet point 1
- Bullet point 2
- Bullet point 3

## Testing
Describe how you tested these changes.

## Screenshots/Diagrams (if applicable)
Add relevant images or diagrams.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or my feature works
- [ ] New and existing unit tests passed locally
```

---

## Coding Standards

### Python Style Guide

We follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) with some additions:

- **Line Length**: Maximum 100 characters
- **Indentation**: 4 spaces
- **Naming Conventions**:
  - Classes: `CamelCase`
  - Functions/Variables: `snake_case`
  - Constants: `UPPER_SNAKE_CASE`
  - Private: prefix with `_`

### Code Examples

**Good:**
```python
def calculate_electromagnetic_response(frequency, material_composition):
    """
    Calculate the electromagnetic response at given frequency.
    
    Args:
        frequency (float): Frequency in Hz
        material_composition (dict): Material composition parameters
        
    Returns:
        float: Electromagnetic response coefficient
    """
    # Implementation here
    return response
```

**Bad:**
```python
def calcEM(f, comp):
    # Calculate EM response
    return resp
```

### Docstring Format

We use Google-style docstrings:

```python
def function_name(arg1, arg2):
    """Short description.
    
    Longer description if needed, explaining the function's purpose,
    behavior, and any important details.
    
    Args:
        arg1 (type): Description of arg1
        arg2 (type): Description of arg2
        
    Returns:
        type: Description of return value
        
    Raises:
        ExceptionType: When this exception is raised
        
    Examples:
        >>> result = function_name(1, 2)
        >>> print(result)
        3
    """
```

### Import Organization

```python
# Standard library imports
import os
import sys
from datetime import datetime

# Third-party imports
import numpy as np
import matplotlib.pyplot as plt

# Local imports
from src.formulation.mixer import CoatingMixer
from src.analysis.electromagnetic import EmAnalysis
```

---

## Testing Guidelines

### Writing Tests

1. **Test File Naming**: `test_*.py` or `*_test.py`
2. **Test Function Naming**: `test_*`
3. **Test Organization**: Use classes for related tests

```python
import pytest
from src.formulation.mixer import CoatingMixer

class TestCoatingMixer:
    """Tests for CoatingMixer class."""
    
    @pytest.fixture
    def mixer(self):
        """Provide a CoatingMixer instance."""
        return CoatingMixer()
    
    def test_initialization(self, mixer):
        """Test mixer initializes correctly."""
        assert mixer is not None
        assert mixer.status == 'idle'
    
    def test_add_solvent(self, mixer):
        """Test adding solvent to mixer."""
        mixer.add_solvent(volume=100)
        assert mixer.solvent_volume == 100
```

### Running Tests

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_formulation.py

# Run with coverage
pytest --cov=src tests/

# Run tests matching a pattern
pytest -k "test_mixer"
```

### Coverage Requirements

- Aim for at least 80% code coverage
- All public functions should have tests
- Critical functions should have multiple test cases

---

## Documentation

### Updating Documentation

1. Keep README.md updated with any major changes
2. Update docstrings in your code
3. Add examples for new features
4. Update CHANGELOG.md

### Documentation Format

Use Markdown with:
- Clear headings (##, ###, ####)
- Code blocks with syntax highlighting
- Links to related sections
- Examples where applicable

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring without feature changes
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process, dependencies, etc.

### Examples

```bash
git commit -m "feat(formulation): add support for custom oxide ratios"
git commit -m "fix(mixer): resolve agglomeration in high-speed mixing"
git commit -m "docs: update installation instructions for Python 3.10"
git commit -m "test(thermal): add comprehensive thermal analysis tests"
```

---

## Project Structure for Contributions

When adding new features, maintain the existing structure:

```
src/
├── module_name/
│   ├── __init__.py
│   ├── implementation.py      # Main implementation
│   ├── utilities.py           # Helper functions
│   └── exceptions.py          # Custom exceptions
```

Each module should have:
- Clear docstrings
- Type hints where applicable
- Accompanying tests in `tests/`
- Documentation in `docs/`

---

## Review Process

1. **Automated Checks**
   - Code style (flake8)
   - Type checking (mypy)
   - Test coverage
   - Build status

2. **Maintainer Review**
   - Code quality
   - Compliance with project goals
   - Documentation completeness
   - Test adequacy

3. **Merge**
   - At least one approval required
   - All checks must pass
   - Branch squashed and merged

---

## Questions?

- Check existing issues and discussions
- Create a new discussion for questions
- Email: contributors@example.com (if available)

---

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in project documentation

---

## Additional Notes

### Legal

- By contributing, you agree that your contributions will be licensed under the MIT License
- You represent that you have the right to submit the work under the MIT License
- You understand that contributions are public and may be used in any way the project maintainers decide

### Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful and professional in all interactions.

---

Thank you for contributing to N-Phantom-Coating! Your efforts help advance indigenous stealth technology for defence applications worldwide.

**Happy Contributing! 🚀**
