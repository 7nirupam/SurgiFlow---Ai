# Quick Start Guide - Advanced Features Demo

## 🚀 Running the Application

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🎤 Testing Voice Neural Interface

### Step 1: Access the Voice Interface

**On Desktop:**
1. Log in to the application
2. Look for the **"Voice Command"** button in the top-right header (green gradient button)
3. Click to open the Neural Interface

**On Mobile:**
1. Log in to the application
2. Look for the **pulsing microphone FAB** in the bottom-right corner
3. Tap to open the Neural Interface

### Step 2: Grant Microphone Permissions

When you first open the voice interface, your browser will ask for microphone permissions:
- Click **"Allow"** to enable voice commands
- If blocked, check your browser settings to enable microphone access

### Step 3: Test Voice Commands

The interface will automatically start listening. Try these commands:

**Adding Stock:**
```
"Add 50 forceps"
"Produce 100 scalpels"
"Manufactured 25 scissors"
```

**Removing Stock:**
```
"Remove 10 forceps"
"Sell 5 scalpels"
"Sold 3 scissors"
```

**Locating Items:**
```
"Find forceps"
"Where is the scalpel?"
"Locate scissors"
```

**Updating Prices:**
```
"Set price of forceps to 500"
"Update price of scalpel to 750"
```

### Step 4: Observe the Feedback

**While Listening:**
- You'll see 5 green animated bars pulsing (waveform visualization)
- Your speech will appear as text in real-time

**While Processing:**
- A spinning icon appears
- "Processing..." text is shown

**After Execution:**
- Green checkmark with "✓ Executed"
- Confirmation message (e.g., "Added 50 units to Forceps")
- Modal auto-closes after 1.5 seconds

### Fallback Testing (Without Gemini API)

If you want to test without the Gemini API:

1. Rename `.env.local` temporarily or set `VITE_GEMINI_API_KEY=INVALID`
2. The system will use the regex fallback parser
3. Use exact command formats:
   - "Add [number] [product name]"
   - "Remove [number] [product name]"
   - "Locate [product name]"

---

## 🚨 Testing Stock Alert System

### Part 1: Critical Popup Alert (< 5 Units)

#### Setup:
1. Navigate to **Inventory** section
2. Find any product in the list
3. Manually reduce its stock to **4 or below**

#### Expected Behavior:
- A **red popup** appears immediately in the center of the screen
- Header shows "CRITICAL STOCK ALERT" with pulsing warning icon
- Product details are displayed:
  - Product image/icon
  - Product name and SKU
  - Large stock count (pulsing)

#### Test Actions:

**Action 1: Deploy Batch**
1. Click the **"🚀 Deploy Batch (+50 Units)"** button
2. Observe:
   - Popup closes immediately
   - Product stock increases by 50 units
   - Firestore is updated
3. Verify in Inventory that stock is now updated

**Action 2: Mute Alert**
1. Reduce another product's stock to < 5
2. Click the **"Mute Alert"** button
3. Observe:
   - Popup closes
   - Alert is NOT triggered again for the same product in this session
4. Refresh the page to reset the deduplication

#### Deduplication Test:
1. Set Product A stock to 3 units
2. Critical popup appears for Product A
3. Click "Mute"
4. Set Product A stock to 2 units
5. **Expected**: No popup appears (already alerted in this session)
6. Set Product B stock to 3 units
7. **Expected**: Popup appears for Product B

---

### Part 2: Passive Shortage Drawer (< 10 Units)

#### Setup:
1. Set **3-5 different products** to stock levels between 5-9 units
2. Set **1-2 products** to stock levels below 5 units (critical)

#### Expected Behavior:
- A **bell icon** appears in the top-right corner
- A **red badge** shows the count of low-stock items (e.g., "5")
- The bell icon **pulses** to draw attention

#### Test Actions:

**Opening the Drawer:**
1. Click the **bell icon**
2. Observe:
   - Drawer slides in from the right
   - Backdrop appears with blur effect
   - Header shows "Low Stock Board"
   - Item count badge displays total low-stock items

**Viewing Items:**
1. Scroll through the list
2. Observe color coding:
   - **Rose background**: Critical items (< 5 units)
   - **Amber background**: Low items (5-9 units)
3. Each item shows:
   - Product image/icon
   - Product name and SKU
   - Stock count (large, color-coded)
   - Warehouse location badge
   - Status badges (Critical, Location)

**Locating an Item:**
1. Click on any product in the drawer
2. Observe:
   - Drawer closes
   - App navigates to **Inventory** section
   - The selected product is **highlighted** (yellow flash)
   - Page scrolls to the product

**Closing the Drawer:**
- Click the **X button** in the header, OR
- Click the **backdrop** (dark area outside drawer)

#### Empty State Test:
1. Ensure all products have stock ≥ 10 units
2. Click the bell icon
3. Observe:
   - Drawer opens
   - Green checkmark icon displayed
   - Message: "All Stock Levels Healthy"
   - "No items below 10 units threshold"

---

## 🎨 Visual Verification Checklist

### Voice Neural Interface
- [ ] Full-screen dark backdrop with blur
- [ ] Gradient background (slate → emerald)
- [ ] Pulsing Sparkles icon in header
- [ ] 5 animated waveform bars (green gradient)
- [ ] Large microphone button (changes color when listening)
- [ ] Smooth animations and transitions
- [ ] Responsive on mobile and desktop

### Critical Stock Popup
- [ ] Red gradient background (rose → red)
- [ ] Thick rose border (4px)
- [ ] Pulsing AlertTriangle icon
- [ ] Large stock count (6xl font)
- [ ] White "Deploy Batch" button
- [ ] Translucent "Mute" button
- [ ] Centered on screen

### Shortage Drawer
- [ ] Slides in from right smoothly
- [ ] Gradient header (amber → orange)
- [ ] Item count badge in header
- [ ] Color-coded item cards (rose/amber)
- [ ] Status badges on each item
- [ ] Smooth scrolling
- [ ] Backdrop blur effect

---

## 🧪 Edge Cases to Test

### Voice Interface
1. **No microphone access**: Should show error message
2. **Unsupported browser**: Should show error message
3. **Product not found**: Should show "Product not found" error
4. **Ambiguous command**: Should show "Could not understand" error
5. **Empty transcript**: Should not process anything

### Stock Alerts
1. **Multiple products critical simultaneously**: Should show popup for first one only
2. **Stock updated while drawer open**: Should update in real-time
3. **Product deleted while in low stock**: Should handle gracefully
4. **Rapid stock changes**: Should not spam popups (deduplication)

---

## 📱 Responsive Testing

### Desktop (≥ 1024px)
- [ ] Voice button in header (visible)
- [ ] Floating FAB (hidden)
- [ ] Bell icon in top-right
- [ ] Drawer max-width 28rem
- [ ] Large modal sizes

### Tablet (768px - 1023px)
- [ ] Voice button in header (visible)
- [ ] Floating FAB (hidden)
- [ ] Bell icon in top-right
- [ ] Drawer full-width
- [ ] Medium modal sizes

### Mobile (< 768px)
- [ ] Voice button in header (hidden)
- [ ] Floating FAB (visible, pulsing)
- [ ] Bell icon in top-right
- [ ] Drawer full-width
- [ ] Optimized font sizes
- [ ] Touch-friendly targets (≥ 44px)

---

## 🔧 Troubleshooting

### Voice Interface Not Opening
1. Check browser console for errors
2. Verify component is imported in App.tsx
3. Check z-index conflicts
4. Clear browser cache

### Microphone Not Working
1. Check browser permissions (Settings → Privacy → Microphone)
2. Test microphone in other apps
3. Try a different browser (Chrome recommended)
4. Check if HTTPS is enabled (required for mic access)

### Gemini API Errors
1. Verify `.env.local` has valid `VITE_GEMINI_API_KEY`
2. Check API quota in Google Cloud Console
3. Verify billing is enabled
4. Fallback parser should activate automatically

### Stock Alerts Not Appearing
1. Verify product stock is actually < 5 (critical) or < 10 (low)
2. Check browser console for errors
3. Verify Firestore connection
4. Check z-index hierarchy
5. Clear session storage and refresh

### Drawer Not Sliding
1. Check Tailwind CSS is loaded
2. Verify `animate-in` utilities are available
3. Check for CSS conflicts
4. Try hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)

---

## 🎯 Success Criteria

### Voice Interface
✅ Opens on button/FAB click  
✅ Requests microphone permission  
✅ Shows waveform animation while listening  
✅ Displays transcript in real-time  
✅ Processes commands correctly  
✅ Shows confirmation message  
✅ Updates Firestore  
✅ Auto-closes after success  
✅ Handles errors gracefully  

### Stock Alerts
✅ Critical popup appears when stock < 5  
✅ Deduplication prevents spam  
✅ Deploy Batch adds 50 units  
✅ Mute dismisses popup  
✅ Bell icon shows badge count  
✅ Drawer slides in smoothly  
✅ Items are color-coded correctly  
✅ Clicking item navigates and highlights  
✅ Empty state shows when no low stock  

---

## 📊 Performance Benchmarks

### Voice Interface
- Modal open time: < 100ms
- Speech recognition start: < 200ms
- Gemini API response: 1-3 seconds
- Fallback parser: < 50ms
- Auto-close delay: 1.5 seconds

### Stock Alerts
- Popup trigger time: < 100ms
- Drawer slide animation: 300ms
- Item click navigation: < 200ms
- Real-time update latency: < 500ms

---

## 🎬 Demo Script

### For Stakeholders/Clients

**Intro (30 seconds):**
"Today I'll demonstrate two advanced features we've built for SurgiFlow: a Voice Command Neural Interface and a Dual-Layer Stock Alert System."

**Voice Demo (2 minutes):**
1. "Let me show you the voice interface..." [Click button]
2. "I'll add 50 units of forceps..." [Speak command]
3. "Notice the waveform visualization and real-time transcript"
4. "The system uses Google's Gemini AI to understand natural language"
5. "Let me locate a product..." [Speak locate command]
6. "See how it navigates and highlights the item automatically"

**Stock Alert Demo (2 minutes):**
1. "Now for the stock alerts. I'll reduce this product to 3 units..." [Edit stock]
2. "Immediately, a critical alert appears"
3. "I can deploy a batch of 50 units with one click..." [Click Deploy]
4. "For less urgent items, we have the passive monitoring system" [Click bell]
5. "This drawer shows all items below 10 units, color-coded by severity"
6. "Clicking any item takes me directly to it in the inventory"

**Wrap-up (30 seconds):**
"These features ensure inventory managers can work hands-free and never miss critical stock levels. The system is production-ready and fully integrated with Firebase."

---

**Last Updated:** February 8, 2026  
**Version:** 1.0.0  
**Status:** ✅ Ready for Production
