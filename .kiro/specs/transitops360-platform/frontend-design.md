# Frontend Design Document: TransitOps360

## Overview

This document provides a comprehensive frontend architecture for the TransitOps360 fleet operations platform. The design prioritizes rapid development for a 6-hour hackathon while maintaining production-quality standards.

### Technology Stack

**Core Framework**:
- **React 19**: Latest features including concurrent rendering
- **TypeScript**: Type safety and better developer experience
- **Vite**: Lightning-fast development server and build tool

**Styling & UI**:
- **TailwindCSS**: Utility-first CSS framework
- **shadcn/ui**: Accessible, customizable component library
- **Lucide React**: Icon library

**State Management**:
- **TanStack Query (React Query)**: Server state management
- **React Context**: Global UI state (theme, sidebar)
- **React Hook Form**: Form state management

**Routing**:
- **React Router v6**: Client-side routing with protected routes

**Data Visualization**:
- **Recharts**: Declarative charting library

**Validation**:
- **Zod**: Schema validation for forms

### Design Philosophy

1. **Component Composition**: Build complex UIs from small, reusable components
2. **Type Safety**: Leverage TypeScript for compile-time safety
3. **Accessibility First**: WCAG 2.1 AA compliance using shadcn/ui
4. **Mobile Responsive**: Desktop-first with mobile breakpoints
5. **Performance**: Code splitting, lazy loading, optimized re-renders
6. **Developer Experience**: Fast hot reload, clear file structure

---

## 1. Route Structure

### Public Routes

```
/login                          # Authentication page
```

### Protected Routes (Authenticated Users)

```
/                              # Dashboard (role-specific)
/vehicles                      # Vehicle list
/vehicles/new                  # Create vehicle
/vehicles/:id                  # Vehicle details
/vehicles/:id/edit             # Edit vehicle

/drivers                       # Driver list
/drivers/new                   # Create driver
/drivers/:id                   # Driver details
/drivers/:id/edit              # Edit driver

/trips                         # Trip list
/trips/new                     # Create trip
/trips/:id                     # Trip details
/trips/:id/dispatch            # Dispatch trip

/maintenance                   # Maintenance list
/maintenance/new               # Create maintenance request
/maintenance/:id               # Maintenance details

/fuel                          # Fuel logs list
/fuel/new                      # Log fuel consumption

/expenses                      # Expenses list
/expenses/new                  # Log expense

/analytics                     # Analytics dashboard
/analytics/health              # Fleet health view
/analytics/compliance          # Compliance view
/analytics/costs               # Cost intelligence view

/reports                       # Reports page
```

### Route Configuration

**Route Protection**:
```typescript
<Route path="/" element={<ProtectedRoute />}>
  <Route path="/" element={<AppLayout />}>
    <Route index element={<DashboardPage />} />
    <Route path="vehicles">
      <Route index element={<VehiclesPage />} />
      <Route path="new" element={<VehicleFormPage />} />
      <Route path=":id" element={<VehicleDetailsPage />} />
      <Route path=":id/edit" element={<VehicleFormPage />} />
    </Route>
    {/* ... other routes */}
  </Route>
</Route>
```

**Protected Route Component**:
- Checks authentication status
- Redirects to /login if not authenticated
- Validates JWT token expiry
- Stores intended destination for post-login redirect

**Role-Based Route Guards**:
- Vehicle/Driver creation: Fleet_Manager only
- Trip dispatch: Fleet_Manager, Dispatcher
- Analytics: All roles (different views)

---

## 2. Page Hierarchy

### Root Level

```
App
├── LoginPage (public)
└── ProtectedRoute (authenticated)
    └── AppLayout (sidebar + topnav + content)
        ├── DashboardPage
        ├── VehiclesPage
        ├── DriversPage
        ├── TripsPage
        ├── MaintenancePage
        ├── FuelPage
        ├── ExpensesPage
        ├── AnalyticsPage
        └── ReportsPage
```

### Page Component Structure

**Pattern**: Each page follows consistent structure

```
PageComponent
├── PageHeader (title, breadcrumb, actions)
├── PageFilters (search, filters, sort)
├── PageContent
│   ├── Loading State
│   ├── Empty State
│   ├── Error State
│   └── Data View (table/cards/charts)
└── PageActions (floating action button, etc)
```

### Page Types

**List Pages** (Vehicles, Drivers, Trips, etc):
- Data table with pagination
- Search and filter bar
- Bulk actions toolbar
- Create button (if permissions allow)

**Detail Pages** (Vehicle/:id, Driver/:id, etc):
- Header with entity info and status badge
- Tabs for different sections (overview, history, documents)
- Action buttons (edit, delete, status change)
- Related entities section

**Form Pages** (Create/Edit):
- Form container with validation
- Section grouping (shadcn/ui Card)
- Save/Cancel actions
- Loading states on submit
- Success/Error notifications

**Dashboard Pages**:
- Grid layout with metric cards
- Chart widgets
- Alert/notification widgets
- Recent activity feed
- Quick action buttons

---

## 3. Component Tree

### Component Hierarchy

```
App
├── Providers
│   ├── QueryClientProvider (TanStack Query)
│   ├── AuthProvider (authentication context)
│   ├── ThemeProvider (optional dark mode)
│   └── ToastProvider (notifications)
│
├── Routes
│   ├── LoginPage
│   └── ProtectedRoute
│       └── AppLayout
│           ├── Sidebar
│           │   ├── Logo
│           │   ├── Navigation
│           │   │   ├── NavItem (collapsible)
│           │   │   └── NavLink
│           │   └── UserMenu
│           │
│           ├── TopNavigation
│           │   ├── Breadcrumbs
│           │   ├── SearchBar
│           │   ├── NotificationBell
│           │   └── UserAvatar
│           │
│           └── MainContent
│               └── Outlet (React Router)
│
├── Pages
│   ├── DashboardPage
│   │   ├── MetricsRow
│   │   │   └── MetricCard (4x)
│   │   ├── ChartsRow
│   │   │   ├── FleetUtilizationChart
│   │   │   └── CostTrendChart
│   │   ├── AlertsWidget
│   │   │   └── AlertCard (list)
│   │   └── ActivityFeed
│   │       └── ActivityItem (list)
│   │
│   ├── VehiclesPage
│   │   ├── PageHeader
│   │   │   ├── Title
│   │   │   └── CreateButton
│   │   ├── FilterBar
│   │   │   ├── SearchInput
│   │   │   ├── StatusFilter
│   │   │   └── FuelTypeFilter
│   │   └── DataTable
│   │       ├── TableHeader
│   │       ├── TableBody
│   │       │   └── VehicleRow (repeating)
│   │       └── Pagination
│   │
│   ├── VehicleDetailsPage
│   │   ├── DetailsHeader
│   │   │   ├── VehicleInfo
│   │   │   ├── StatusBadge
│   │   │   └── ActionButtons
│   │   ├── Tabs
│   │   │   ├── OverviewTab
│   │   │   │   ├── SpecsCard
│   │   │   │   ├── HealthScoreCard
│   │   │   │   └── CostSummaryCard
│   │   │   ├── TripsTab
│   │   │   │   └── TripsTable
│   │   │   ├── MaintenanceTab
│   │   │   │   └── MaintenanceHistory
│   │   │   └── DocumentsTab
│   │   │       └── DocumentsList
│   │
│   └── [Other Pages follow similar patterns]
│
└── Shared Components
    ├── UI Components (shadcn/ui)
    │   ├── Button
    │   ├── Input
    │   ├── Select
    │   ├── Table
    │   ├── Card
    │   ├── Badge
    │   ├── Dialog
    │   ├── Tabs
    │   └── Form
    │
    ├── Domain Components
    │   ├── StatusBadge
    │   ├── VehicleStatusBadge
    │   ├── DriverStatusBadge
    │   ├── TripStatusBadge
    │   ├── EntityAvatar
    │   ├── HealthScoreIndicator
    │   ├── SafetyScoreIndicator
    │   └── ComplianceIndicator
    │
    ├── Data Display
    │   ├── DataTable
    │   ├── EmptyState
    │   ├── LoadingSpinner
    │   ├── ErrorBoundary
    │   └── SkeletonLoader
    │
    ├── Forms
    │   ├── FormField
    │   ├── FormError
    │   ├── FormSection
    │   └── SubmitButton
    │
    └── Layouts
        ├── PageHeader
        ├── PageContainer
        ├── ContentSection
        └── SplitLayout
```

### Component Composition Principles

**Atomic Design**:
- **Atoms**: Button, Input, Badge, Icon
- **Molecules**: FormField, SearchBar, MetricCard
- **Organisms**: DataTable, FilterBar, NavigationMenu
- **Templates**: PageLayout, FormLayout
- **Pages**: VehiclesPage, DashboardPage

**Component Naming**:
- PascalCase for components
- Descriptive, business-domain names
- Suffix with component type when ambiguous (VehiclesTable vs VehiclesPage)

---

## 4. Layout Design

### AppLayout Structure

**Desktop Layout** (≥1024px):

```
┌─────────────────────────────────────────────────┐
│  TopNavigation (h-16, border-b)                 │
│  ┌────────────┬───────────────────────────────┐ │
│  │Breadcrumbs │  Search  │  Notifications  │👤││
│  └────────────┴───────────────────────────────┘ │
├───────┬─────────────────────────────────────────┤
│       │                                         │
│ Side  │                                         │
│ bar   │         Main Content Area               │
│       │         (p-6 bg-gray-50)                │
│ (w-64)│                                         │
│       │                                         │
│       │                                         │
└───────┴─────────────────────────────────────────┘
```

**Sidebar** (fixed, w-64):
- Company logo (top)
- Navigation menu (scrollable)
- User profile (bottom)
- Collapsible on mobile

**TopNavigation** (fixed, h-16):
- Breadcrumbs (left)
- Global search (center, optional)
- Notifications icon (right)
- User avatar dropdown (right)

**Main Content**:
- Max-width container (max-w-7xl)
- Padding: p-6
- Background: bg-gray-50 (light mode)
- Scrollable overflow-y-auto

### Sidebar Navigation

**Structure**:
```
┌─────────────┐
│   Logo      │
├─────────────┤
│ 📊 Dashboard│ <- Active highlight
├─────────────┤
│ 🚗 Fleet    │ <- Collapsible
│   Vehicles  │
│   Drivers   │
├─────────────┤
│ 📦 Operations│ <- Collapsible
│   Trips     │
│   Maintenance│
│   Fuel      │
│   Expenses  │
├─────────────┤
│ 📈 Analytics│
├─────────────┤
│ 📄 Reports  │
├─────────────┤
│             │
│   [spacer]  │
│             │
├─────────────┤
│ 👤 Profile  │
│ ⚙️  Settings │
└─────────────┘
```

**Navigation Groups**:
- Home: Dashboard
- Fleet: Vehicles, Drivers
- Operations: Trips, Maintenance, Fuel, Expenses
- Intelligence: Analytics (with sub-sections)
- Settings: Profile, Preferences

**Active State**:
- Background: bg-primary-100
- Border-left: border-l-4 border-primary-600
- Text: text-primary-900 font-semibold

**Hover State**:
- Background: bg-gray-100
- Cursor: pointer

---

## 5. Dashboard Design

### Dashboard Layouts by Role

**Common Structure**:
```
┌─────────────────────────────────────────┐
│  Page Header                            │
│  "Dashboard" + Role-specific greeting   │
├─────────────────────────────────────────┤
│  Metrics Row (4 cards)                  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ KPI1 │ │ KPI2 │ │ KPI3 │ │ KPI4 │  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
├─────────────────────────────────────────┤
│  Content Row (charts, tables, widgets)  │
│  ┌────────────────┐ ┌─────────────────┐│
│  │ Chart/Table    │ │ Alerts Widget   ││
│  │                │ │                 ││
│  │                │ │                 ││
│  └────────────────┘ └─────────────────┘│
├─────────────────────────────────────────┤
│  Activity Feed                          │
│  Recent Actions & Events                │
└─────────────────────────────────────────┘
```

### Fleet Manager Dashboard

**Metrics Cards** (grid-cols-4):
1. **Total Vehicles**
   - Number: 50
   - Change: +2 this month
   - Icon: Truck

2. **Fleet Utilization**
   - Percentage: 75.5%
   - Visual: Progress bar
   - Icon: Activity

3. **Vehicles In Shop**
   - Number: 3
   - Status: Warning if > 5
   - Icon: Wrench

4. **Average Health Score**
   - Score: 85/100
   - Visual: Color-coded
   - Icon: Heart

**Charts Row** (grid-cols-2):
- **Fleet Utilization Chart** (Line/Area)
  - X-axis: Last 30 days
  - Y-axis: Utilization %
  - Multiple lines: Available, On Trip, In Shop

- **Maintenance Status** (Doughnut)
  - Current: 40
  - Overdue: 5
  - Scheduled: 15

**Widgets**:
- **Command Center Alerts** (Card)
  - License expiring (HIGH priority)
  - Overdue maintenance (MEDIUM)
  - Low utilization vehicles (LOW)
  - Click to view details

- **Recent Activity Feed** (Card)
  - Last 10 events
  - Trip dispatched, Vehicle added, Maintenance completed
  - Timestamp, user, entity

### Dispatcher Dashboard

**Metrics Cards**:
1. **Active Trips**: 18
2. **Available Vehicles**: 25
3. **Available Drivers**: 12
4. **Pending Dispatches**: 5

**Content**:
- **Active Trips Table**
  - Origin → Destination
  - Vehicle, Driver
  - Dispatched time
  - Quick actions (Complete, View)

- **Dispatch Recommendations Widget**
  - For pending trips
  - Shows recommended vehicle/driver pairs
  - One-click dispatch

### Safety Officer Dashboard

**Metrics Cards**:
1. **Total Drivers**: 30
2. **License Expiring**: 5
3. **Average Safety Score**: 92
4. **Compliance Rate**: 85%

**Content**:
- **Compliance Overview** (Table)
  - Driver name
  - License expiry
  - Status indicator
  - Days until expiry

- **Driver Safety Scores** (Bar Chart)
  - Top 10 drivers
  - Safety score ranking

### Financial Analyst Dashboard

**Metrics Cards**:
1. **Total Operating Cost**: ₹5,00,000
2. **Fuel Cost**: ₹3,00,000
3. **Average Cost/KM**: ₹15.50
4. **Lowest ROI Vehicle**: -16%

**Content**:
- **Cost Breakdown** (Pie Chart)
  - Fuel: 60%
  - Maintenance: 30%
  - Other: 10%

- **Cost Trends** (Line Chart)
  - Last 6 months
  - Fuel, Maintenance, Total

- **Vehicle ROI Table**
  - Top profitable vehicles
  - Bottom unprofitable vehicles

---

## 6. Role-Based Experience Design

### Access Control Strategy

**UI-Level Protection**:
- Conditional rendering based on `user.role`
- Hide/disable buttons for unauthorized actions
- Show appropriate error messages

**Route-Level Protection**:
- Redirect to dashboard if route unauthorized
- Show 403 error page

### Permission Mapping

**Fleet_Manager**:
- Full CRUD: Vehicles, Drivers, Maintenance
- View: All sections
- Actions: Create, Edit, Delete, Status changes

**Dispatcher**:
- Full CRUD: Trips, Fuel, Expenses
- View: Vehicles (read-only), Drivers (read-only)
- Actions: Dispatch, Complete, Cancel trips

**Safety_Officer**:
- Full CRUD: Drivers
- View: All sections (read-only)
- Focus: Compliance dashboard

**Financial_Analyst**:
- Full CRUD: Expenses
- View: All sections (read-only)
- Focus: Cost analytics dashboard

### Component-Level Permissions

**Example**:
```typescript
// VehicleActions.tsx
{hasPermission(user, 'manage_vehicles') && (
  <Button onClick={handleEdit}>Edit</Button>
)}

{hasPermission(user, 'manage_vehicles') && (
  <Button onClick={handleDelete} variant="destructive">
    Delete
  </Button>
)}

// Available to all roles
<Button onClick={handleView} variant="outline">
  View Details
</Button>
```

### Personalized Experiences

**Dashboard Routing**:
- `/` redirects to role-specific dashboard
- Each role sees different default view

**Navigation Menu**:
- Hide unavailable sections
- Example: Safety Officer doesn't see "Create Vehicle"

**Data Filtering**:
- Show relevant data first
- Example: Dispatcher sees active trips at top

---

## 7. State Management Strategy

### Three-Layer State Architecture

**1. Server State** (TanStack Query):
- API data caching
- Background refetching
- Optimistic updates
- Loading/error states

**2. Global UI State** (React Context):
- Authentication state
- User profile
- Theme preference
- Sidebar collapsed/expanded

**3. Local Component State** (useState):
- Form input values (with React Hook Form)
- Modal open/close
- Dropdown open/close
- Component-specific UI state

### TanStack Query Configuration

**Query Keys Structure**:
```typescript
const queryKeys = {
  vehicles: {
    all: ['vehicles'] as const,
    lists: () => [...queryKeys.vehicles.all, 'list'] as const,
    list: (filters: VehicleFilters) => 
      [...queryKeys.vehicles.lists(), filters] as const,
    detail: (id: string) => 
      [...queryKeys.vehicles.all, 'detail', id] as const,
  },
  drivers: {
    all: ['drivers'] as const,
    lists: () => [...queryKeys.drivers.all, 'list'] as const,
    list: (filters: DriverFilters) => 
      [...queryKeys.drivers.lists(), filters] as const,
    detail: (id: string) => 
      [...queryKeys.drivers.all, 'detail', id] as const,
  },
  trips: { /* similar structure */ },
  dashboard: ['dashboard'] as const,
  analytics: {
    health: ['analytics', 'health'] as const,
    compliance: ['analytics', 'compliance'] as const,
    costs: ['analytics', 'costs'] as const,
  },
}
```

**Query Configuration**:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 seconds
      cacheTime: 300_000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

### Custom Hooks Pattern

**Data Fetching Hooks**:
```typescript
// useVehicles.ts
export function useVehicles(filters?: VehicleFilters) {
  return useQuery({
    queryKey: queryKeys.vehicles.list(filters || {}),
    queryFn: () => vehiclesApi.getAll(filters),
  })
}

// useVehicle.ts
export function useVehicle(id: string) {
  return useQuery({
    queryKey: queryKeys.vehicles.detail(id),
    queryFn: () => vehiclesApi.getById(id),
    enabled: !!id,
  })
}
```

**Mutation Hooks**:
```typescript
// useCreateVehicle.ts
export function useCreateVehicle() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: vehiclesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.vehicles.lists() 
      })
      toast({
        title: "Success",
        description: "Vehicle created successfully",
      })
    },
    onError: (error: ApiError) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
```

### Optimistic Updates

**Example: Trip Completion**:
```typescript
export function useCompleteTrip() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: tripsApi.complete,
    onMutate: async (tripId) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.trips.detail(tripId) 
      })
      
      // Snapshot previous value
      const previousTrip = queryClient.getQueryData(
        queryKeys.trips.detail(tripId)
      )
      
      // Optimistically update
      queryClient.setQueryData(
        queryKeys.trips.detail(tripId),
        (old: Trip) => ({ ...old, status: 'Completed' })
      )
      
      return { previousTrip }
    },
    onError: (err, tripId, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.trips.detail(tripId),
        context.previousTrip
      )
    },
    onSettled: (tripId) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.trips.detail(tripId) 
      })
    },
  })
}
```

---

## 8. Form Validation Strategy

### React Hook Form + Zod Integration

**Form Schema Definition** (Zod):
```typescript
import { z } from 'zod'

export const vehicleSchema = z.object({
  registration_number: z
    .string()
    .min(5, 'Minimum 5 characters')
    .max(20, 'Maximum 20 characters')
    .regex(/^[A-Z0-9]+$/, 'Only uppercase letters and numbers'),
  make: z
    .string()
    .min(1, 'Make is required')
    .max(50, 'Maximum 50 characters'),
  model: z
    .string()
    .min(1, 'Model is required')
    .max(50, 'Maximum 50 characters'),
  year: z
    .number()
    .min(1900, 'Invalid year')
    .max(new Date().getFullYear() + 1, 'Year cannot be in future'),
  capacity_kg: z
    .number()
    .positive('Capacity must be positive'),
  fuel_type: z.enum(['Diesel', 'Petrol', 'CNG', 'Electric']),
  acquisition_cost: z
    .number()
    .nonnegative('Cost cannot be negative'),
  fuel_efficiency: z
    .number()
    .positive('Efficiency must be positive')
    .optional(),
})

export type VehicleFormData = z.infer<typeof vehicleSchema>
```

**Form Component Pattern**:
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function VehicleForm({ vehicle, onSubmit }: VehicleFormProps) {
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle || {
      registration_number: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      capacity_kg: 0,
      fuel_type: 'Diesel',
      acquisition_cost: 0,
    },
  })
  
  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data)
  })
  
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name="registration_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Number</FormLabel>
              <FormControl>
                <Input placeholder="MH12AB1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ... other fields */}
      </form>
    </Form>
  )
}
```

### Validation Types

**Field-Level Validation**:
- Required fields
- Min/max length
- Format validation (regex)
- Type validation

**Cross-Field Validation**:
```typescript
const tripSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  cargo_weight_kg: z.number().positive(),
  vehicle_id: z.string().uuid().optional(),
}).refine(
  (data) => data.origin !== data.destination,
  {
    message: "Origin and destination must be different",
    path: ["destination"],
  }
)
```

**Async Validation** (e.g., check registration uniqueness):
```typescript
const checkRegistrationUnique = async (value: string) => {
  const exists = await vehiclesApi.checkRegistration(value)
  return !exists
}

// In form
{...register('registration_number', {
  validate: {
    unique: async (value) => 
      await checkRegistrationUnique(value) || 
      'Registration number already exists'
  }
})}
```

### Error Display

**Field Errors**:
- Show below input field
- Red text color (text-destructive)
- Icon indicator (AlertCircle)

**Form-Level Errors**:
- Toast notification for API errors
- Alert component at top of form for validation summary

**Loading States**:
- Disable submit button during submission
- Show spinner icon
- Disable all inputs to prevent changes

---

## 9. Design System

### Color Palette

**Primary Colors** (Fleet/Operations theme):
```css
--primary-50: #eff6ff
--primary-100: #dbeafe
--primary-200: #bfdbfe
--primary-300: #93c5fd
--primary-400: #60a5fa
--primary-500: #3b82f6  /* Main brand color */
--primary-600: #2563eb
--primary-700: #1d4ed8
--primary-800: #1e40af
--primary-900: #1e3a8a
```

**Status Colors**:
```css
/* Success/Available */
--success: #10b981  /* green-500 */

/* Warning/In Shop */
--warning: #f59e0b  /* amber-500 */

/* Error/Critical */
--error: #ef4444  /* red-500 */

/* Info/On Trip */
--info: #3b82f6  /* blue-500 */

/* Neutral/Off Duty */
--neutral: #6b7280  /* gray-500 */
```

**Semantic Colors**:
```typescript
const statusColors = {
  vehicle: {
    Available: 'bg-green-100 text-green-800 border-green-200',
    'On Trip': 'bg-blue-100 text-blue-800 border-blue-200',
    'In Shop': 'bg-amber-100 text-amber-800 border-amber-200',
    Retired: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  driver: {
    Available: 'bg-green-100 text-green-800 border-green-200',
    'On Trip': 'bg-blue-100 text-blue-800 border-blue-200',
    'Off Duty': 'bg-gray-100 text-gray-800 border-gray-200',
    Suspended: 'bg-red-100 text-red-800 border-red-200',
  },
  trip: {
    Draft: 'bg-gray-100 text-gray-800 border-gray-200',
    Dispatched: 'bg-blue-100 text-blue-800 border-blue-200',
    Completed: 'bg-green-100 text-green-800 border-green-200',
    Cancelled: 'bg-red-100 text-red-800 border-red-200',
  },
}
```

### Typography

**Font Family**:
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

**Font Sizes**:
```css
--text-xs: 0.75rem     /* 12px */
--text-sm: 0.875rem    /* 14px */
--text-base: 1rem      /* 16px */
--text-lg: 1.125rem    /* 18px */
--text-xl: 1.25rem     /* 20px */
--text-2xl: 1.5rem     /* 24px */
--text-3xl: 1.875rem   /* 30px */
--text-4xl: 2.25rem    /* 36px */
```

**Font Weights**:
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

**Usage**:
- Page titles: text-3xl font-bold
- Section titles: text-2xl font-semibold
- Card titles: text-lg font-semibold
- Body text: text-base font-normal
- Captions: text-sm text-gray-600

### Spacing Scale

**Tailwind Default Scale** (rem-based):
```
0: 0px
1: 0.25rem  (4px)
2: 0.5rem   (8px)
3: 0.75rem  (12px)
4: 1rem     (16px)
5: 1.25rem  (20px)
6: 1.5rem   (24px)
8: 2rem     (32px)
10: 2.5rem  (40px)
12: 3rem    (48px)
```

**Common Patterns**:
- Card padding: p-6
- Section spacing: space-y-6
- Form field spacing: space-y-4
- Button padding: px-4 py-2

### Elevation (Shadows)

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

**Usage**:
- Cards: shadow-sm
- Dropdowns: shadow-md
- Modals: shadow-lg
- Hover states: shadow-md (transition)

### Border Radius

```css
--radius-sm: 0.125rem  /* 2px */
--radius: 0.375rem     /* 6px */
--radius-md: 0.5rem    /* 8px */
--radius-lg: 0.75rem   /* 12px */
--radius-xl: 1rem      /* 16px */
--radius-full: 9999px
```

**Usage**:
- Buttons: rounded-md
- Cards: rounded-lg
- Inputs: rounded-md
- Badges: rounded-full
- Avatars: rounded-full

### Component Styling Standards

**Buttons**:
```typescript
const buttonVariants = {
  default: 'bg-primary text-white hover:bg-primary/90',
  destructive: 'bg-red-500 text-white hover:bg-red-600',
  outline: 'border border-gray-300 bg-white hover:bg-gray-50',
  ghost: 'hover:bg-gray-100',
  link: 'text-primary underline-offset-4 hover:underline',
}

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-11 px-8',
  icon: 'h-10 w-10',
}
```

**Cards**:
```css
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

.card-header {
  @apply mb-4 pb-4 border-b border-gray-200;
}

.card-title {
  @apply text-lg font-semibold text-gray-900;
}

.card-description {
  @apply text-sm text-gray-600 mt-1;
}
```

**Data Tables**:
```css
.table {
  @apply w-full border-collapse;
}

.table-header {
  @apply bg-gray-50 border-b border-gray-200;
}

.table-header-cell {
  @apply px-4 py-3 text-left text-sm font-semibold text-gray-700;
}

.table-row {
  @apply border-b border-gray-200 hover:bg-gray-50 transition-colors;
}

.table-cell {
  @apply px-4 py-3 text-sm text-gray-900;
}
```

---

## 10. Responsive Strategy

### Breakpoint System

**Tailwind Breakpoints**:
```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape, small tablets
  md: '768px',   // Tablets
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large desktop
}
```

### Mobile-First Approach

**Base Styles**: Mobile (<640px)
**Progressive Enhancement**: Add complexity at larger breakpoints

### Layout Adaptations

**Sidebar Navigation**:
```typescript
// Desktop (≥1024px): Fixed sidebar, always visible
<aside className="hidden lg:block lg:fixed lg:w-64">
  <Sidebar />
</aside>

// Mobile (<1024px): Slide-out drawer
<Sheet>
  <SheetTrigger asChild className="lg:hidden">
    <Button variant="ghost" size="icon">
      <Menu />
    </Button>
  </SheetTrigger>
  <SheetContent side="left">
    <Sidebar />
  </SheetContent>
</Sheet>
```

**Grid Layouts**:
```typescript
// Metrics Cards
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <MetricCard />
  <MetricCard />
  <MetricCard />
  <MetricCard />
</div>

// Charts Row
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <ChartWidget />
  <ChartWidget />
</div>

// Content + Sidebar
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">
    <MainContent />
  </div>
  <aside>
    <SidebarWidget />
  </aside>
</div>
```

**Data Tables**:
```typescript
// Desktop: Full table
<div className="hidden md:block">
  <Table>
    {/* All columns */}
  </Table>
</div>

// Mobile: Card list
<div className="md:hidden space-y-4">
  {items.map(item => (
    <Card key={item.id}>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Key fields only */}
      </CardContent>
    </Card>
  ))}
</div>
```

### Typography Scaling

```typescript
// Page titles
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Dashboard
</h1>

// Section titles
<h2 className="text-xl sm:text-2xl font-semibold">
  Fleet Overview
</h2>

// Body text (no scaling needed, remains readable)
<p className="text-base text-gray-600">
  Description text
</p>
```

### Touch-Friendly Targets

**Minimum Touch Target**: 44x44px (iOS), 48x48px (Android)

```typescript
// Mobile buttons
<Button className="h-12 px-6 text-base sm:h-10 sm:px-4 sm:text-sm">
  Create Vehicle
</Button>

// Touch-friendly table rows
<tr className="h-14 sm:h-10">
  <td className="py-4 sm:py-2">Content</td>
</tr>
```

### Responsive Images

```typescript
// Avatar sizes
<Avatar className="h-12 w-12 sm:h-10 sm:w-10">
  <AvatarImage src={user.avatar} />
  <AvatarFallback>{user.initials}</AvatarFallback>
</Avatar>

// Vehicle images
<img 
  src={vehicle.image}
  alt={vehicle.registration}
  className="w-full h-48 sm:h-32 object-cover rounded-lg"
/>
```

### Modal/Dialog Adaptations

```typescript
// Desktop: Centered dialog
// Mobile: Full-screen sheet
<Dialog>
  <DialogContent className="sm:max-w-lg max-h-screen overflow-y-auto">
    {/* Form content */}
  </DialogContent>
</Dialog>
```

### Navigation Adaptations

**Desktop**: Breadcrumbs in TopNav
**Mobile**: Back button + current page title

```typescript
// Desktop breadcrumbs
<nav className="hidden md:flex" aria-label="Breadcrumb">
  <ol className="flex items-center space-x-2">
    <li><Link to="/">Dashboard</Link></li>
    <li>/</li>
    <li>Vehicles</li>
  </ol>
</nav>

// Mobile back button
<div className="md:hidden">
  <Button variant="ghost" onClick={() => navigate(-1)}>
    <ArrowLeft className="mr-2" />
    Back
  </Button>
</div>
```

---

## Performance Optimization

### Code Splitting

**Route-Based Splitting**:
```typescript
import { lazy, Suspense } from 'react'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const VehiclesPage = lazy(() => import('./pages/VehiclesPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))

// Wrap with Suspense
<Suspense fallback={<PageLoadingSpinner />}>
  <Routes>
    <Route path="/" element={<DashboardPage />} />
    <Route path="/vehicles" element={<VehiclesPage />} />
    <Route path="/analytics" element={<AnalyticsPage />} />
  </Routes>
</Suspense>
```

### Image Optimization

**Lazy Loading**:
```typescript
<img 
  src={vehicle.image}
  alt={vehicle.registration}
  loading="lazy"
  className="w-full h-48 object-cover"
/>
```

### Memoization

**Expensive Computations**:
```typescript
const sortedVehicles = useMemo(() => {
  return vehicles?.sort((a, b) => 
    b.health_score - a.health_score
  )
}, [vehicles])
```

**Callbacks**:
```typescript
const handleStatusChange = useCallback((id: string, status: string) => {
  updateVehicleStatus({ id, status })
}, [updateVehicleStatus])
```

### Virtual Scrolling

**Large Lists** (100+ items):
```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

const rowVirtualizer = useVirtualizer({
  count: vehicles.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 60,
})

return (
  <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
    {rowVirtualizer.getVirtualItems().map(virtualRow => (
      <VehicleRow 
        key={vehicles[virtualRow.index].id}
        vehicle={vehicles[virtualRow.index]}
      />
    ))}
  </div>
)
```

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

**Keyboard Navigation**:
- All interactive elements focusable (tab order)
- Skip links for main content
- Escape key closes modals/dropdowns

**Screen Reader Support**:
- Semantic HTML (nav, main, aside, article)
- ARIA labels for icon buttons
- ARIA live regions for notifications
- Alt text for images

**Color Contrast**:
- Text/background: minimum 4.5:1
- Large text: minimum 3:1
- UI components: minimum 3:1

**Focus Indicators**:
```css
.focus-visible:focus {
  @apply outline-none ring-2 ring-primary ring-offset-2;
}
```

### Form Accessibility

```typescript
<FormField>
  <FormLabel htmlFor="registration">
    Registration Number
  </FormLabel>
  <FormControl>
    <Input
      id="registration"
      aria-describedby="registration-error"
      aria-invalid={!!errors.registration}
      {...field}
    />
  </FormControl>
  <FormMessage id="registration-error" />
</FormField>
```

---

## Development Workflow

### File Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   ├── vehicles.ts
│   │   ├── drivers.ts
│   │   └── trips.ts
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── domain/          # Business components
│   │   ├── layouts/
│   │   └── shared/
│   ├── hooks/
│   │   ├── useVehicles.ts
│   │   ├── useAuth.ts
│   │   └── useToast.ts
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── VehiclesPage.tsx
│   │   └── ...
│   ├── routes/
│   │   ├── index.tsx
│   │   └── ProtectedRoute.tsx
│   ├── types/
│   │   ├── vehicle.ts
│   │   ├── driver.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── components.json
```

### Naming Conventions

**Components**: PascalCase (VehicleCard.tsx)
**Hooks**: camelCase with 'use' prefix (useVehicles.ts)
**Utils**: camelCase (formatCurrency.ts)
**Types**: PascalCase (Vehicle.ts)
**Constants**: UPPER_SNAKE_CASE (API_BASE_URL)

---

## Document Status

**Status**: Complete - Ready for Implementation

**Created**: 2024-01-15

**Framework**: React 19 + TypeScript + Vite

**UI Library**: shadcn/ui + TailwindCSS

This frontend design document provides complete specifications for implementing the TransitOps360 user interface within the 6-hour hackathon timeframe. All layouts, components, and patterns are production-ready while optimized for rapid development.

**Next Steps**: Initialize React project, configure Tailwind and shadcn/ui, implement AppLayout and authentication flow.
