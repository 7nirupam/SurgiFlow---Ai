# 🧪 SurgiFlow AI - Testing Guide

## Manual Testing Checklist

### 🔐 Authentication Module

#### Email/Password Login
- [ ] Login with `admin@surgiflow.com` / `admin123`
- [ ] Verify admin role access
- [ ] Test invalid credentials (should show error)
- [ ] Test empty form submission
- [ ] Verify logout functionality

#### Social Authentication
- [ ] Google OAuth login
- [ ] Facebook OAuth login
- [ ] Verify redirect flow works
- [ ] Check user profile data is captured

---

### 📊 Dashboard Module

- [ ] Dashboard loads without errors
- [ ] Stock status cards display correctly
- [ ] Low stock alerts visible
- [ ] Recent transactions list populated
- [ ] WIP batches summary shown
- [ ] Navigation to other modules works

---

### 📦 Inventory Module

#### Product Management
- [ ] Product list displays with correct data
- [ ] Search functionality works
- [ ] Filter by category works
- [ ] Stock status indicators correct (IN_STOCK, LOW_STOCK, OUT_OF_STOCK)
- [ ] Warehouse location (WDID) displayed
- [ ] Edit product details
- [ ] Update stock levels
- [ ] Price history tracking

#### Warehouse Features
- [ ] WDID system working (Aisle-Rack-Shelf-Bin)
- [ ] Location search/filter
- [ ] Batch tracking visible

---

### 💰 Billing Module

#### Point of Sale
- [ ] Add products to cart
- [ ] Quantity adjustment works
- [ ] Remove items from cart
- [ ] Customer name input
- [ ] GST calculation correct (18%)
- [ ] Total calculation accurate
- [ ] Complete transaction
- [ ] Stock automatically decremented

#### Payment Methods
- [ ] Cash payment option
- [ ] Card payment option
- [ ] UPI payment option
- [ ] Bank transfer option

---

### 📄 Invoices Module

- [ ] Transaction history displays
- [ ] Filter by date range
- [ ] Search by customer name
- [ ] View invoice details
- [ ] PDF generation (if implemented)
- [ ] Print functionality

---

### 📋 Quotations Module

- [ ] Create new quotation
- [ ] Add multiple products
- [ ] Set validity period
- [ ] Calculate totals correctly
- [ ] Save quotation
- [ ] View saved quotations
- [ ] Edit existing quotation
- [ ] Convert to invoice (if implemented)

---

### 🚚 Delivery Module

- [ ] Delivery list displays
- [ ] Status indicators correct (QUEUED, DISPATCHED, OUT_FOR_DELIVERY, DELIVERED)
- [ ] ETA displayed
- [ ] Update delivery status
- [ ] WhatsApp link generation (if implemented)
- [ ] Tracking information

---

### 🏭 Production Hub

#### WIP Tracking
- [ ] Batch list displays
- [ ] Current stage visible
- [ ] Stage progression works
- [ ] Operator assignment
- [ ] Timestamp recording
- [ ] Raw material tracking

#### Manufacturing Stages
- [ ] FORGING stage tracking
- [ ] MACHINING stage tracking
- [ ] POLISHING stage tracking
- [ ] CLEANING stage tracking
- [ ] QC stage tracking
- [ ] STERILIZATION stage tracking
- [ ] PACKED stage tracking
- [ ] Auto-add to inventory when PACKED

---

### 🤖 AI Features

#### Voice Commands (if Gemini API configured)
Test these commands:
- [ ] "Add 50 forceps to inventory"
- [ ] "Sell 10 scalpels"
- [ ] "Where is the bone saw?"
- [ ] "Set price of forceps to 2500"
- [ ] "Move batch B-001 to polishing"

#### AI Advisor
- [ ] Ask about inventory levels
- [ ] Request production recommendations
- [ ] Query warehouse locations
- [ ] Get business insights

#### DHR Generation
- [ ] Generate Device History Record for batch
- [ ] Verify regulatory compliance format
- [ ] Check all required fields included

#### Production Analysis
- [ ] Bottleneck identification
- [ ] Production forecast generation
- [ ] Strategic factory report

---

### 📚 Catalog/Brochure Module

- [ ] Product catalog displays
- [ ] Images load correctly (if available)
- [ ] Product details accurate
- [ ] Print-friendly layout
- [ ] Export functionality (if implemented)

---

### ⚠️ Recall Center

- [ ] Batch search functionality
- [ ] Recall reason input
- [ ] WhatsApp notification generation
- [ ] Email notification generation
- [ ] Recall history tracking

---

### 🔧 Factory Mode

- [ ] Enter factory mode
- [ ] Full-screen interface
- [ ] Touch-friendly controls
- [ ] Quick stage updates
- [ ] Exit factory mode

---

### 👥 Admin Panel (Admin Role Only)

#### User Management
- [ ] User list displays
- [ ] Add new user
- [ ] Edit user details
- [ ] Change user role
- [ ] Suspend/activate user
- [ ] View user activity

#### System Configuration
- [ ] Role management
- [ ] System settings
- [ ] Access to documentation

---

### 📖 Documentation Module

- [ ] System documentation loads
- [ ] Navigation works
- [ ] Code examples display correctly
- [ ] API documentation accessible

---

## Performance Testing

### Load Time
- [ ] Initial page load < 3 seconds
- [ ] Dashboard renders < 1 second
- [ ] Module switching < 500ms
- [ ] Search results < 300ms

### Lighthouse Audit
Run Lighthouse in Chrome DevTools:
```bash
# Target scores
Performance: > 90
Accessibility: > 95
Best Practices: > 90
SEO: > 90
PWA: > 80
```

### Bundle Size
```bash
npm run build
# Check dist folder size
# Target: < 1MB for main bundle
```

---

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari
- [ ] Chrome Mobile (Android)
- [ ] Samsung Internet

### Responsive Design
- [ ] Mobile (320px - 480px)
- [ ] Tablet (481px - 768px)
- [ ] Laptop (769px - 1024px)
- [ ] Desktop (1025px+)

---

## Security Testing

### Authentication
- [ ] Cannot access app without login
- [ ] Session persists on refresh
- [ ] Logout clears session
- [ ] Role-based access control works

### Data Validation
- [ ] Input sanitization
- [ ] SQL injection prevention (if using database)
- [ ] XSS prevention
- [ ] CSRF protection

### API Security
- [ ] API keys not exposed in client
- [ ] Rate limiting (if implemented)
- [ ] HTTPS enforced in production

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab navigation works
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Arrow keys navigate lists

### Screen Reader
- [ ] ARIA labels present
- [ ] Form labels associated
- [ ] Error messages announced
- [ ] Status updates announced

### Visual
- [ ] Color contrast meets WCAG AA
- [ ] Text scalable to 200%
- [ ] Focus indicators visible
- [ ] No content flashing

---

## Error Handling

### Network Errors
- [ ] Offline mode graceful degradation
- [ ] API timeout handling
- [ ] Retry mechanism
- [ ] User-friendly error messages

### Data Errors
- [ ] Invalid input validation
- [ ] Empty state handling
- [ ] Missing data fallbacks
- [ ] Corrupted data recovery

---

## Integration Testing

### Firebase Integration
- [ ] Authentication flow
- [ ] Real-time updates (if using Firestore)
- [ ] Cloud Messaging (if implemented)
- [ ] Analytics tracking

### Gemini AI Integration
- [ ] API calls successful
- [ ] Response parsing correct
- [ ] Error handling for API failures
- [ ] Quota management

---

## User Acceptance Testing (UAT)

### Scenario 1: Daily Inventory Check
1. Login as staff user
2. Navigate to Inventory
3. Check low stock items
4. Update stock levels
5. Verify changes saved

### Scenario 2: Process Sale
1. Login as staff user
2. Navigate to Billing
3. Add products to cart
4. Enter customer details
5. Complete transaction
6. Verify invoice generated
7. Check stock decremented

### Scenario 3: Track Production
1. Login as operator
2. Navigate to Production Hub
3. View WIP batches
4. Update batch stage
5. Add operator notes
6. Verify stage progression

### Scenario 4: Generate Reports
1. Login as manager
2. Navigate to Dashboard
3. View analytics
4. Request AI insights
5. Generate production forecast
6. Export data (if implemented)

---

## Automated Testing (Future Enhancement)

### Unit Tests
```bash
# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### E2E Tests
```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npx playwright test
```

---

## Bug Reporting Template

When reporting bugs, include:

```markdown
**Bug Description:**
Brief description of the issue

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- Browser: Chrome 120
- OS: macOS 14
- User Role: Admin
- Timestamp: 2026-02-07 12:30

**Screenshots:**
Attach relevant screenshots

**Console Errors:**
Paste any console errors
```

---

## Testing Sign-Off

Before production deployment:

- [ ] All critical features tested
- [ ] No blocking bugs
- [ ] Performance targets met
- [ ] Security audit passed
- [ ] Accessibility requirements met
- [ ] Cross-browser testing complete
- [ ] Mobile responsiveness verified
- [ ] UAT scenarios passed
- [ ] Documentation updated
- [ ] Stakeholder approval obtained

---

**Testing Completed By:** _______________  
**Date:** _______________  
**Approved For Production:** ☐ Yes ☐ No
