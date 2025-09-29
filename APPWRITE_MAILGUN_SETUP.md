# Appwrite and Mailgun Integration Guide

This guide explains how to set up Appwrite with Mailgun for email authentication and notifications in your ETF Dividend Tracker application.

## Mailgun Setup

1. **Create a Mailgun Account**:
   - Sign up at [Mailgun](https://www.mailgun.com/)
   - Verify your domain or use Mailgun's sandbox domain for testing

2. **Get SMTP Credentials**:
   - Navigate to Sending → Domain Settings → SMTP Credentials
   - Note your SMTP username and password

## Appwrite Email Configuration

1. **Configure SMTP in Appwrite**:
   - In your `docker-compose.yml`, ensure these environment variables are set:
   ```yaml
   - _APP_SMTP_HOST=smtp.mailgun.org
   - _APP_SMTP_PORT=587
   - _APP_SMTP_USERNAME=${MAILGUN_USERNAME}
   - _APP_SMTP_PASSWORD=${MAILGUN_PASSWORD}
   - _APP_SMTP_SECURE=tls
   ```

2. **Test Email Delivery**:
   - From the Appwrite console, go to Settings → Email
   - Send a test email to verify the configuration

## Setting Up Email Authentication

1. **Enable Email Authentication**:
   - In the Appwrite console, go to Auth → Settings
   - Enable the Email/Password method
   - Configure password requirements

2. **Customize Email Templates**:
   - Go to Auth → Settings → Email Templates
   - Customize the following templates:
     - Welcome Email
     - Password Recovery
     - Email Verification

## Implementing Email Auth in Your App

1. **Update the AuthContext.jsx**:
   - Replace the demo authentication with Appwrite SDK
   - Implement proper email authentication methods

2. **Example Implementation**:

```javascript
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { Client, Account, ID } from 'appwrite';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
  
  const account = new Account(client);
  
  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.get();
        setCurrentUser(session);
      } catch (error) {
        console.log('No active session found');
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);
  
  // Sign up with email and password
  const signup = async (email, password, name) => {
    try {
      setError(null);
      setLoading(true);
      
      const user = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      
      // Send verification email
      await account.createVerification(
        `${window.location.origin}/verify-email`
      );
      
      // Auto login after signup
      await login(email, password);
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const session = await account.createEmailSession(email, password);
      const user = await account.get();
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Sign out
  const logout = async () => {
    try {
      await account.deleteSession('current');
      setCurrentUser(null);
    } catch (error) {
      setError(error.message);
    }
  };
  
  // Password reset
  const resetPassword = async (email) => {
    try {
      setError(null);
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };
  
  // Update user profile
  const updateProfile = async (name) => {
    try {
      setError(null);
      const user = await account.updateName(name);
      setCurrentUser(user);
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };
  
  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    updateProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
```

## Setting Up Appwrite Functions for Mailgun Webhooks

1. **Create a New Function in Appwrite**:
   - Go to Functions in the Appwrite console
   - Create a new function (e.g., "Process Mailgun Webhook")
   - Select Node.js as the runtime

2. **Configure the Function**:
   - Set up environment variables for your function
   - Configure the webhook endpoint in Mailgun to point to your function

3. **Example Function Code**:

```javascript
// Example Appwrite function for processing Mailgun webhooks
const crypto = require('crypto');
const sdk = require('node-appwrite');

module.exports = async function(req, res) {
  // Verify Mailgun webhook signature
  const signature = req.headers['x-mailgun-signature'];
  const timestamp = req.headers['x-mailgun-timestamp'];
  const token = req.headers['x-mailgun-token'];
  
  const signingKey = req.variables['MAILGUN_API_KEY'];
  const encodedToken = crypto
    .createHmac('sha256', signingKey)
    .update(timestamp + token)
    .digest('hex');
  
  if (encodedToken !== signature) {
    return res.json({ success: false, message: 'Invalid signature' }, 401);
  }
  
  // Process the webhook event
  const event = req.body.event;
  const recipient = req.body.recipient;
  
  // Initialize Appwrite SDK
  const client = new sdk.Client();
  const database = new sdk.Databases(client);
  
  client
    .setEndpoint(req.variables['APPWRITE_ENDPOINT'])
    .setProject(req.variables['APPWRITE_PROJECT_ID'])
    .setKey(req.variables['APPWRITE_API_KEY']);
  
  // Handle different event types
  switch (event) {
    case 'delivered':
      // Log successful delivery
      break;
    case 'opened':
      // Track email open
      break;
    case 'clicked':
      // Track link clicks
      break;
    case 'bounced':
    case 'dropped':
      // Handle failed deliveries
      break;
    default:
      // Unknown event
  }
  
  return res.json({ success: true });
};
```

## Security Considerations

1. **API Key Protection**:
   - Never expose your Mailgun API key in client-side code
   - Use Appwrite functions for any operations requiring the API key

2. **Webhook Verification**:
   - Always verify Mailgun webhook signatures
   - Implement rate limiting for webhook endpoints

3. **Email Template Security**:
   - Avoid including sensitive information in emails
   - Use secure links with limited-time tokens for actions

## Testing Your Integration

1. **Test Account Creation**:
   - Create a test account and verify email delivery
   - Check that verification emails are properly formatted

2. **Test Password Reset**:
   - Trigger a password reset flow
   - Verify the reset email is delivered and the link works

3. **Test Webhook Processing**:
   - Use Mailgun's webhook testing tools
   - Verify your function correctly processes events