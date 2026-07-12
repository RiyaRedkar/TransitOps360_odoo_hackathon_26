# 🚀 TransitOps360 Frontend - Quick Start Guide

## ⚡ 30-Second Setup

### 1. Start the Dev Server
```bash
cd frontend
npm run dev
```

✅ **Dev server running at**: http://localhost:5173

### 2. Open in Browser
```
http://localhost:5173
```

### 3. Login
```
Email:    admin@transit.com
Password: admin123
```

✅ **Done! You're in the app.**

---

## 🎯 What You Can Do Right Now

1. **Explore Dashboard**
   - View KPI metrics
   - Check charts
   - See recent trips
   - Review alerts
   - Browse activity

2. **Explore Vehicles**
   - Search by registration or make
   - Filter by status
   - View health scores
   - Sort data
   - Paginate results

3. **Test Navigation**
   - Click menu items
   - Toggle sidebar
   - Check breadcrumbs
   - Resize window
   - Test mobile view

4. **View Responsiveness**
   - Open DevTools (F12)
   - Toggle Device Toolbar
   - View at 375x667 (mobile)
   - View at 768x1024 (tablet)
   - View at 1920x1080 (desktop)

---

## 📱 Browser DevTools

### Open Developer Tools
- **Windows/Linux**: F12 or Ctrl+Shift+I
- **Mac**: Cmd+Option+I

### Test Responsiveness
1. Click device toggle icon (or Ctrl+Shift+M)
2. Select device or custom dimensions
3. Test navigation and layouts

### Debug Components
1. Go to Elements tab
2. Inspect any component
3. See styling in Styles panel
4. Check computed values

### Monitor Performance
1. Go to Performance tab
2. Record a session
3. Check animation smoothness
4. View load times

---

## 🗂️ File Locations

### Important Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Routes configuration |
| `src/pages/LoginPage.tsx` | Login UI |
| `src/pages/DashboardPage.tsx` | Dashboard UI |
| `src/pages/VehiclesPage.tsx` | Vehicles UI |
| `src/components/layout/Sidebar.tsx` | Navigation |
| `src/components/layout/TopNav.tsx` | Header |
| `tailwind.config.js` | Theme colors |
| `src/index.css` | Global styles |

---

## 🎨 Customization Cheat Sheet

### Change Primary Color
**File**: `tailwind.config.js`

```javascript
colors: {
  'primary': '#2563EB',  // Change this color
}
```

### Change Font
**File**: `tailwind.config.js`

```javascript
fontFamily: {
  sans: ['Your Font Name', 'sans-serif'],
}
```

### Add Animation
**File**: `src/index.css`

```css
@keyframes myAnimation {
  0% { /* start */ }
  100% { /* end */ }
}
```

### Change Spacing
Use Tailwind classes:
```tsx
<div className="p-6">  // padding
<div className="space-y-4">  // vertical spacing
```

---

## 🔧 Build Commands

### Development
```bash
npm run dev    # Start dev server
```

### Production Build
```bash
npm run build  # Create optimized build
```

### Preview Build
```bash
npm run preview  # Test production build locally
```

### Type Check
```bash
tsc --noEmit  # Check TypeScript errors
```

### Linting
```bash
npm run lint  # Check code style
```

---

## 🐛 Troubleshooting

### Issue: Port 5173 already in use
**Solution**:
```bash
# Find process using port 5173
lsof -i :5173

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- --port 5174
```

### Issue: Module not found
**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: Styles not applying
**Solution**:
```bash
# Tailwind CSS rebuilds automatically
# Just save your file and refresh browser
```

### Issue: Hot reload not working
**Solution**:
```bash
# Stop dev server (Ctrl+C)
# Start again
npm run dev
```

---

## 📚 Understanding the Structure

### App Flow
```
main.tsx
  ↓
App.tsx (Routes)
  ↓
├─ /login → LoginPage
│
└─ / → ProtectedRoute
    ↓
    AppLayout (Sidebar + TopNav)
    ↓
    ├─ DashboardPage
    ├─ VehiclesPage
    ├─ DriversPage
    └─ ... (other pages)
```

### Component Imports
```tsx
// UI Components
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

// Domain Components
import { KPICard } from '@/components/domain/KPICard'

// Utilities
import { cn } from '@/lib/utils'
```

### Page Structure
```tsx
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'

export default function MyPage() {
  const [data, setData] = useState(null)
  
  return (
    <div className="space-y-6">
      <h1>My Page</h1>
      <Card>
        {/* Content */}
      </Card>
    </div>
  )
}
```

---

## 🎯 Testing Checklist

- [ ] Open http://localhost:5173
- [ ] Login with demo credentials
- [ ] Dashboard loads with metrics
- [ ] Charts render and animate
- [ ] Search works on Vehicles page
- [ ] Filters work (All, Available, etc.)
- [ ] Sidebar navigation responsive
- [ ] Mobile view works (< 640px)
- [ ] Tablet view works (640-1024px)
- [ ] Desktop view works (> 1024px)
- [ ] All text is readable
- [ ] Colors look good
- [ ] Animations are smooth
- [ ] No console errors (F12)
- [ ] Buttons are clickable

---

## 📊 Component Reference Quick Links

### Pages
- `src/pages/LoginPage.tsx` - Beautiful login
- `src/pages/DashboardPage.tsx` - Main dashboard
- `src/pages/VehiclesPage.tsx` - Vehicles table
- `src/pages/DriversPage.tsx` - Drivers stub
- `src/pages/TripsPage.tsx` - Trips stub
- `src/pages/MaintenancePage.tsx` - Maintenance stub
- `src/pages/CompliancePage.tsx` - Compliance stub
- `src/pages/AnalyticsPage.tsx` - Analytics stub

### Layouts
- `src/components/layout/AppLayout.tsx` - Main layout
- `src/components/layout/Sidebar.tsx` - Sidebar menu
- `src/components/layout/TopNav.tsx` - Top bar

### UI Components
- `src/components/ui/Button.tsx` - Button component
- `src/components/ui/Card.tsx` - Card component
- `src/components/ui/Input.tsx` - Input field
- `src/components/ui/Badge.tsx` - Badge

### Domain Components
- `src/components/domain/KPICard.tsx` - Metrics card
- `src/components/domain/StatusBadge.tsx` - Status badge

---

## 🔗 Useful Links

### Documentation Files
- `FRONTEND_UI_SUMMARY.md` - Project overview
- `FRONTEND_IMPLEMENTATION_GUIDE.md` - Development guide
- `FRONTEND_STATUS.md` - Current status
- `FRONTEND_COMPLETE_SUMMARY.md` - Complete details
- `COMPONENTS_VISUAL_REFERENCE.md` - Visual guide

### Configuration Files
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `tailwind.config.js` - Tailwind theme
- `vite.config.ts` - Vite build config

### External Resources
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

---

## 💡 Pro Tips

### 1. Use Chrome DevTools Shortcuts
- `Ctrl+K` - Search files
- `Ctrl+Shift+P` - Command palette
- `Ctrl+Shift+I` - Inspect element
- `F12` - Toggle DevTools

### 2. React DevTools
- Install React DevTools browser extension
- Inspect component tree
- Check component props
- View hooks state

### 3. Fast Navigation
- Use keyboard shortcuts
- Tab through buttons
- Enter to activate
- Escape to close

### 4. Mobile Testing
- Don't just resize browser
- Test actual touch interactions
- Check button sizes (44x44px minimum)
- Verify text readability

### 5. Responsive Testing
- Test at breakpoints: 375, 640, 768, 1024, 1920
- Check sidebar behavior
- Verify table responsiveness
- Test navigation drawer

---

## 🎬 Demo Script (2 Minutes)

```
1. Show Login (15 seconds)
   - Click email field
   - Show pre-filled demo credentials
   - Click Sign In button
   - Show smooth transition

2. Dashboard Tour (45 seconds)
   - Point out 8 KPI cards
   - Mention trend indicators
   - Show 4 charts rendering
   - Scroll down to recent trips
   - Show alerts widget
   - Show activity timeline

3. Vehicles Page (30 seconds)
   - Click Vehicles in sidebar
   - Type in search box
   - Click status filter tabs
   - Show data table with data
   - Mention health score bars

4. Responsive Demo (30 seconds)
   - Open DevTools (F12)
   - Toggle Device Toolbar
   - Show mobile layout
   - Show tablet layout
   - Show desktop layout

5. Key Highlights (30 seconds)
   - Dark premium theme
   - Smooth animations
   - Responsive design
   - Professional appearance
   - Ready for integration
```

---

## ✅ Pre-Demo Checklist

- [ ] Dev server running (`npm run dev`)
- [ ] Browser open to http://localhost:5173
- [ ] Logged in with demo credentials
- [ ] No console errors (F12)
- [ ] All pages load quickly
- [ ] Charts animate smoothly
- [ ] Navigation responds
- [ ] Mobile view tested
- [ ] Network tab clean
- [ ] Ready to present!

---

## 🎊 You're All Set!

Everything is ready to go. The frontend is fully functional and ready for:

✅ Hackathon demo  
✅ Stakeholder review  
✅ Backend integration  
✅ Feature development  

**Happy presenting!** 🚀

---

## 🤝 Need Help?

### Quick Answers
- **Styles not applying?** → Save file, hard refresh (Ctrl+Shift+R)
- **Component not rendering?** → Check browser console (F12)
- **Port already in use?** → Kill process or use different port
- **Dependencies missing?** → Run `npm install`
- **TypeScript errors?** → Check component imports

### Where to Look
- **Component examples** → Look at similar components in `src/components/`
- **Styling help** → Check `tailwind.config.js` and `src/index.css`
- **Route issues** → Check `src/App.tsx`
- **Type errors** → Check `src/types/index.ts`

### When Stuck
1. Check browser console (F12)
2. Check network tab for API errors
3. Check React DevTools for component state
4. Look at recent changes in git diff
5. Try restarting dev server

---

**Frontend is ready. Let's build something amazing!** 💻✨
