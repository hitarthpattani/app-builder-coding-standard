# React Component Style Guide

## Adobe App Builder - React Spectrum Components

This document outlines the coding standards and best practices for React components in the `web-src` directory of this Adobe App Builder application.

---

## Table of Contents

1. [Component Structure](#component-structure)
2. [Function Declaration Standards](#function-declaration-standards)
3. [Import and Export Patterns](#import-and-export-patterns)
4. [Adobe React Spectrum Guidelines](#adobe-react-spectrum-guidelines)
5. [State Management](#state-management)
6. [Event Handling](#event-handling)
7. [Styling and CSS](#styling-and-css)
8. [Accessibility](#accessibility)
9. [Error Handling](#error-handling)
10. [File Organization](#file-organization)
11. [Code Examples](#code-examples)

---

## Component Structure

### ✅ Standard Component Pattern

All React components must follow this standardized structure:

```javascript
/*
 * <license header>
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ComponentName, OtherComponent } from '@adobe/react-spectrum';

// Component definition using arrow function
const ComponentName = props => {
  // 1. State declarations
  const [state, setState] = useState(initialState);

  // 2. Internal functions (defined before use)
  const handleSomething = () => {
    // function logic
  };

  const handleAsync = async () => {
    // async function logic
  };

  // 3. Effects and lifecycle
  useEffect(() => {
    // effect logic
  }, [dependencies]);

  // 4. Render
  return <ComponentName>{/* JSX content */}</ComponentName>;
};

// PropTypes definition
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.func,
};

// Default export
export default ComponentName;
```

---

## Function Declaration Standards

### ✅ Arrow Functions Only

**Rule**: All components and internal functions must use arrow function syntax.

```javascript
// ✅ GOOD - Component as arrow function
const MyComponent = props => {
  // ✅ GOOD - Internal functions as arrow functions
  const handleClick = () => {};
  const processData = async () => {};

  return <div>Content</div>;
};

// ❌ BAD - Function declaration
function MyComponent(props) {
  // ❌ BAD - Function declaration
  function handleClick() {}

  return <div>Content</div>;
}
```

### Function Order

1. **State hooks** first
2. **Internal functions** before they're used
3. **Effects and lifecycle** after functions
4. **Render** last

---

## Import and Export Patterns

### ✅ Import Standards

```javascript
// ✅ GOOD - React imports
import React, { useState, useEffect } from 'react';

// ✅ GOOD - Adobe React Spectrum - import from main package
import { View, Heading, ActionButton, Form } from '@adobe/react-spectrum';

// ✅ GOOD - Icons from Spectrum
import Function from '@spectrum-icons/workflow/Function';

// ✅ GOOD - Local imports
import config from '../config.json';
import { utilityFunction } from '../utils';

// ❌ BAD - Subpath imports (use main package instead)
import View from '@adobe/react-spectrum/View';
```

### ✅ Export Standards

```javascript
// ✅ GOOD - Default export for main components
const MyComponent = () => {
  return <div>Content</div>;
};

export default MyComponent;

// ✅ GOOD - Named export for utility components
export const UtilityComponent = () => {
  return <span>Utility</span>;
};

// ✅ GOOD - Both patterns are acceptable
export const Home = () => <View>Home Content</View>;
```

---

## Adobe React Spectrum Guidelines

### ✅ Component Usage

```javascript
// ✅ GOOD - Proper Spectrum component usage
const MyForm = () => {
  return (
    <View width="size-6000">
      <Heading level={1}>Form Title</Heading>
      <Form necessityIndicator="label">
        <ActionButton
          variant="primary"
          onPress={handleSubmit}
          isDisabled={!isValid}
        >
          <Text>Submit</Text>
        </ActionButton>
      </Form>
    </View>
  );
};

// ✅ GOOD - Use Spectrum sizing tokens
<View
  width="size-6000"
  padding="size-200"
  margin="size-100"
/>

// ❌ BAD - Avoid hardcoded values
<View
  width="600px"
  padding="16px"
  margin="8px"
/>
```

### ✅ Accessibility with Spectrum

```javascript
// ✅ GOOD - Proper accessibility attributes
<ActionButton
  aria-label="Save document"
  onPress={handleSave}
>
  <Save />
  <Text>Save</Text>
</ActionButton>

// ✅ GOOD - Form accessibility
<TextArea
  label="Description"
  isRequired
  validationState={isValid ? 'valid' : 'invalid'}
  aria-describedby="description-help"
/>
```

---

## State Management

### ✅ useState Hook Pattern

```javascript
// ✅ GOOD - Object state for related values
const MyComponent = () => {
  const [formState, setFormState] = useState({
    value: '',
    isValid: false,
    isLoading: false,
    error: null,
  });

  // ✅ GOOD - Update state immutably
  const updateField = (field, value) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return <Form />;
};

// ✅ GOOD - Separate state for unrelated values
const MyComponent = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return <View />;
};
```

---

## Event Handling

### ✅ Event Handler Patterns

```javascript
const MyComponent = () => {
  // ✅ GOOD - Arrow function handlers
  const handleSubmit = () => {
    // handle submit logic
  };

  const handleInputChange = value => {
    // handle input change
  };

  // ✅ GOOD - Async handlers
  const handleAsyncAction = async () => {
    try {
      const result = await apiCall();
      // handle success
    } catch (error) {
      // handle error
    }
  };

  return (
    <Form>
      <ActionButton onPress={handleSubmit}>Submit</ActionButton>
      <TextArea onChange={handleInputChange} />
    </Form>
  );
};
```

---

## Styling and CSS

### ✅ Styling Approach

```javascript
// ✅ GOOD - Use Spectrum design tokens
<View
  backgroundColor="gray-200"
  borderRadius="medium"
  padding="size-200"
/>

// ✅ GOOD - Custom CSS classes for specific styling
<ul className="SideNav">
  <li className="SideNav-item">
    Content
  </li>
</ul>

// ✅ GOOD - Inline styles for dynamic values only
<View
  style={{
    width: `${dynamicWidth}px`,
    opacity: isVisible ? 1 : 0.5
  }}
/>

// ❌ BAD - Avoid extensive inline styling
<View
  style={{
    padding: '16px',
    margin: '8px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px'
  }}
/>
```

---

## Accessibility

### ✅ Accessibility Requirements

```javascript
// ✅ GOOD - Semantic HTML with Spectrum
<Heading level={1}>Page Title</Heading>
<Heading level={2}>Section Title</Heading>

// ✅ GOOD - ARIA attributes
<ActionButton
  aria-label="Delete item"
  aria-describedby="delete-help-text"
>
  <Delete />
</ActionButton>

// ✅ GOOD - Form accessibility
<TextArea
  label="Comments"
  isRequired
  validationState={hasError ? 'invalid' : 'valid'}
  errorMessage={hasError ? 'Please enter a comment' : ''}
/>
```

---

## Error Handling

### ✅ Error Boundary Pattern

```javascript
// ✅ GOOD - Error boundary usage
const App = () => {
  const onError = (_error, _componentStack) => {
    // Log error to service
  };

  const fallbackComponent = ({ componentStack, error }) => {
    return (
      <View padding='size-400'>
        <Heading level={1}>Something went wrong</Heading>
        <pre>{error.message}</pre>
      </View>
    );
  };

  return (
    <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
      <MyApp />
    </ErrorBoundary>
  );
};
```

### ✅ Error State Handling

```javascript
// ✅ GOOD - Component error states
const MyComponent = () => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      setState(prev => ({ ...prev, data: result, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
    }
  };

  if (state.error) {
    return (
      <View>
        <StatusLight variant='negative'>Error: {state.error}</StatusLight>
      </View>
    );
  }

  return <View>Content</View>;
};
```

---

## File Organization

### ✅ Directory Structure

```
web-src/src/
├── components/
│   ├── common/          # Reusable components
│   ├── pages/           # Page-level components
│   ├── forms/           # Form components
│   └── layout/          # Layout components
├── hooks/               # Custom hooks
├── utils/               # Utility functions
└── constants/           # Constants and enums
```

### ✅ File Naming

- **Components**: PascalCase (`MyComponent.js`)
- **Hooks**: camelCase starting with 'use' (`useCustomHook.js`)
- **Utils**: camelCase (`apiUtils.js`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.js`)

---

## Code Examples

### ✅ Complete Component Example

```javascript
/*
 * <license header>
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Heading,
  Form,
  TextArea,
  ActionButton,
  StatusLight,
  Text,
} from '@adobe/react-spectrum';
import Send from '@spectrum-icons/workflow/Send';

const ContactForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    message: '',
    isValid: false,
    error: null,
  });

  const validateMessage = value => {
    return value.trim().length >= 10;
  };

  const handleMessageChange = value => {
    const isValid = validateMessage(value);
    setFormData(prev => ({
      ...prev,
      message: value,
      isValid,
      error: isValid ? null : 'Message must be at least 10 characters',
    }));
  };

  const handleSubmit = async () => {
    if (!formData.isValid) return;

    try {
      await onSubmit(formData.message);
      setFormData({
        message: '',
        isValid: false,
        error: null,
      });
    } catch (error) {
      setFormData(prev => ({
        ...prev,
        error: 'Failed to send message',
      }));
    }
  };

  return (
    <View width='size-6000' padding='size-300'>
      <Heading level={2}>Contact Us</Heading>

      <Form necessityIndicator='label'>
        <TextArea
          label='Message'
          isRequired
          value={formData.message}
          onChange={handleMessageChange}
          validationState={formData.error ? 'invalid' : formData.isValid ? 'valid' : undefined}
          errorMessage={formData.error}
          placeholder='Enter your message...'
        />

        <ActionButton
          variant='primary'
          onPress={handleSubmit}
          isDisabled={!formData.isValid || isSubmitting}
        >
          <Send />
          <Text>{isSubmitting ? 'Sending...' : 'Send Message'}</Text>
        </ActionButton>

        {formData.error && <StatusLight variant='negative'>{formData.error}</StatusLight>}
      </Form>
    </View>
  );
};

ContactForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

ContactForm.defaultProps = {
  isSubmitting: false,
};

export default ContactForm;
```

---

## ESLint and Prettier Integration

This style guide is enforced by:

- **ESLint**: Configured with React-specific rules for `web-src` directory
- **Prettier**: Automatically formats code with React-friendly settings
- **Husky**: Pre-commit hooks ensure code quality

### Commands

```bash
# Lint React components
npm run lint:check

# Format React components
npm run format

# Auto-fix linting issues
npm run lint:fix
```

---

## Additional Resources

- [Adobe React Spectrum Documentation](https://react-spectrum.adobe.com/)
- [Adobe App Builder Documentation](https://developer.adobe.com/app-builder/)
- [React Best Practices](https://react.dev/learn)

---

**Last Updated**: January 2025  
**Version**: 1.0.0
