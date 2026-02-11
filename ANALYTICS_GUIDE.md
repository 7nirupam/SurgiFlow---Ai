# 📊 Firebase Analytics Integration Guide

## Overview

Firebase Analytics is now fully integrated into SurgiFlow AI. This guide explains how to use analytics tracking throughout the application.

---

## Configuration

### Environment Variables

The following Firebase Analytics configuration is set in `.env.local`:

```bash
VITE_FIREBASE_MEASUREMENT_ID=G-43TVXZFPC2
```

### Firebase Config

All Firebase configuration is centralized in `firebaseConfig.ts`:
- Firebase App initialization
- Firebase Authentication
- Firebase Analytics
- Helper functions for tracking events

---

## Available Analytics Functions

### Import Analytics Functions

```typescript
import {
  trackPageView,
  trackProductView,
  trackTransaction,
  trackQuotationCreated,
  trackProductionBatch,
  trackAIQuery,
  trackUserLogin,
  trackSearch,
  logAnalyticsEvent
} from './firebaseConfig';
```

---

## Usage Examples

### 1. Track Page Views

Track when users navigate to different modules:

```typescript
// In Dashboard component
useEffect(() => {
  trackPageView('Dashboard');
}, []);

// In Inventory component
useEffect(() => {
  trackPageView('Inventory');
}, []);
```

### 2. Track Product Views

Track when users view product details:

```typescript
const handleProductClick = (product: Product) => {
  trackProductView(product.id, product.name);
  setDetailsProduct(product);
};
```

### 3. Track Transactions

Track completed sales:

```typescript
const handleCompleteSale = async (transaction: Transaction) => {
  await api.saveTransaction(transaction);
  
  trackTransaction(
    transaction.id,
    transaction.total,
    transaction.items.length
  );
};
```

### 4. Track Quotations

Track when quotations are created:

```typescript
const handleSaveQuotation = async (quotation: Quotation) => {
  await api.saveQuotation(quotation);
  
  trackQuotationCreated(quotation.id, quotation.total);
};
```

### 5. Track Production Updates

Track WIP batch progress:

```typescript
const handleStageUpdate = async (batch: StockBatch) => {
  await api.updateBatch(batch);
  
  trackProductionBatch(batch.id, batch.stage);
};
```

### 6. Track AI Interactions

Track AI feature usage:

```typescript
const handleVoiceCommand = async (text: string) => {
  try {
    const result = await parseVoiceCommand(text);
    trackAIQuery('voice_command', true);
    return result;
  } catch (error) {
    trackAIQuery('voice_command', false);
    throw error;
  }
};
```

### 7. Track User Login

Track authentication events:

```typescript
const handleLogin = (user: AuthUser, method: string) => {
  setUser(user);
  trackUserLogin(method); // 'email', 'google', 'facebook'
};
```

### 8. Track Search

Track search queries:

```typescript
const handleSearch = (searchTerm: string) => {
  setSearchTerm(searchTerm);
  const results = filterProducts(searchTerm);
  trackSearch(searchTerm, results.length);
};
```

### 9. Custom Events

Track custom events specific to your needs:

```typescript
import { logAnalyticsEvent } from './firebaseConfig';

// Track custom event
logAnalyticsEvent('custom_event_name', {
  parameter1: 'value1',
  parameter2: 123,
  parameter3: true
});
```

---

## Recommended Implementation

### App.tsx

Add page view tracking when views change:

```typescript
useEffect(() => {
  trackPageView(currentView);
}, [currentView]);
```

### Auth.tsx

Track login methods:

```typescript
const loginWithEmail = async (e: React.FormEvent) => {
  // ... existing code
  trackUserLogin('email');
  onLogin(user);
};

const loginWithGoogle = async () => {
  // ... existing code
  trackUserLogin('google');
};

const loginWithFacebook = async () => {
  // ... existing code
  trackUserLogin('facebook');
};
```

### Inventory.tsx

Track product interactions:

```typescript
const handleProductClick = (product: Product) => {
  trackProductView(product.id, product.name);
  setDetailsProduct(product);
};

const handleSearch = (term: string) => {
  setSearchTerm(term);
  const results = filtered;
  trackSearch(term, results.length);
};
```

### Billing.tsx

Track transactions:

```typescript
const handleCompleteSale = async () => {
  const transaction = createTransaction();
  await onSave(transaction);
  
  trackTransaction(
    transaction.id,
    transaction.total,
    transaction.items.length
  );
};
```

---

## Firebase Console

### View Analytics Data

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **SurgiFlow (surgiflow-8a716)**
3. Navigate to **Analytics** → **Dashboard**

### Available Reports

- **Real-time**: See active users and current events
- **Events**: View all tracked events
- **Conversions**: Track important business metrics
- **User Properties**: Segment users by attributes
- **Audiences**: Create user segments
- **Funnels**: Analyze user journeys

---

## Event Naming Conventions

### Standard Events (Recommended)

Use Firebase's predefined events when possible:
- `login` - User authentication
- `page_view` - Page navigation
- `search` - Search queries
- `view_item` - Product views
- `purchase` - Completed transactions
- `generate_lead` - Quotation creation

### Custom Events

For SurgiFlow-specific events:
- `production_update` - WIP batch progress
- `ai_interaction` - AI feature usage
- `recall_initiated` - Product recall started
- `warehouse_navigation` - WDID lookup

---

## Best Practices

### 1. Don't Over-Track

Only track meaningful user interactions:
- ✅ Page views, transactions, searches
- ✅ Important user actions
- ❌ Every button click
- ❌ Mouse movements

### 2. Use Consistent Naming

- Use lowercase with underscores: `page_view`
- Be descriptive: `quotation_created` not `qc`
- Follow Firebase conventions

### 3. Include Relevant Parameters

```typescript
// Good
trackTransaction('TX-001', 5000, 3);

// Better
logAnalyticsEvent('purchase', {
  transaction_id: 'TX-001',
  value: 5000,
  currency: 'USD',
  items: 3,
  customer_type: 'hospital',
  payment_method: 'bank_transfer'
});
```

### 4. Respect User Privacy

- Don't track PII (personally identifiable information)
- Don't include sensitive data in event parameters
- Follow GDPR/privacy regulations

### 5. Test Analytics

Use Firebase DebugView to test events:
```bash
# Enable debug mode
npm run dev -- --mode development
```

Then check DebugView in Firebase Console.

---

## Debugging

### Check if Analytics is Working

```typescript
import { analytics } from './firebaseConfig';

console.log('Analytics initialized:', !!analytics);
```

### View Events in Console

Open browser DevTools → Network tab → Filter by "google-analytics"

### Common Issues

**Analytics not tracking:**
- Check if `measurementId` is correct
- Verify Firebase project settings
- Check browser console for errors
- Ensure cookies are enabled

**Events not appearing:**
- Wait 24-48 hours for data to appear in reports
- Use DebugView for real-time testing
- Check event name spelling

---

## Performance Impact

Firebase Analytics is lightweight:
- **Bundle size**: ~30KB gzipped
- **Performance**: Minimal impact
- **Loading**: Asynchronous, non-blocking

---

## Privacy & Compliance

### GDPR Compliance

If serving EU users:
1. Add cookie consent banner
2. Allow users to opt-out
3. Anonymize IP addresses

```typescript
import { getAnalytics } from 'firebase/analytics';

const analytics = getAnalytics(app);
// Anonymize IP
analytics.setAnalyticsCollectionEnabled(userConsent);
```

### Data Retention

Configure in Firebase Console:
- Analytics → Data Settings → Data Retention
- Recommended: 14 months

---

## Next Steps

1. **Implement tracking** in key components
2. **Test events** using DebugView
3. **Create custom reports** in Firebase Console
4. **Set up conversions** for business goals
5. **Monitor regularly** for insights

---

## Resources

- [Firebase Analytics Docs](https://firebase.google.com/docs/analytics)
- [Event Reference](https://firebase.google.com/docs/reference/js/analytics)
- [Best Practices](https://firebase.google.com/docs/analytics/best-practices)
- [DebugView Guide](https://firebase.google.com/docs/analytics/debugview)

---

**Analytics is now ready to track user behavior and provide valuable insights for SurgiFlow AI! 📊**
