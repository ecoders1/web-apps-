# Requirements Document

## Introduction

The Welcome / Login Page is the primary entry point for the "Exit Exam Ethiopia" Next.js application. It serves as both a welcoming screen for new visitors and an authentication gateway for returning users. The page must present a modern glassmorphism UI with a university graduation illustration on the left panel and a full-featured authentication form on the right panel. It replaces and redesigns `src/app/login/page.tsx`.

## Glossary

- **Login_Page**: The React component at `src/app/login/page.tsx` that renders the welcome and authentication UI.
- **Auth_Panel**: The right-side section containing all authentication form controls.
- **Illustration_Panel**: The left-side decorative section visible on large screens with the graduation illustration and stats.
- **AuthTab**: The selected authentication method — one of `email`, `phone`.
- **OTP**: One-time password sent via Telegram for phone-based authentication.
- **Supabase**: The backend-as-a-service providing authentication and database functionality.
- **ThemeProvider**: The `next-themes` provider already installed in `src/components/theme-provider.tsx` that manages dark/light mode.
- **Guest_User**: An unauthenticated visitor who accesses exam content without signing in.
- **Google_OAuth**: Authentication via Google using Supabase's OAuth provider.
- **Telegram_OTP**: Phone-number-based authentication where Supabase sends a one-time-password via a Telegram bot.
- **Glassmorphism**: A UI design style using blurred translucent surfaces with subtle borders and backdrop-filter effects, already defined in `globals.css` via the `.glass` utility class.

---

## Requirements

### Requirement 1: Page Layout and Responsive Design

**User Story:** As a student, I want a visually appealing and responsive welcome page, so that I have a great first impression on both desktop and mobile devices.

#### Acceptance Criteria

1. THE Login_Page SHALL render a full-viewport split layout with the Illustration_Panel on the left (hidden on screens smaller than `lg`) and the Auth_Panel on the right.
2. WHEN the viewport is narrower than the `lg` breakpoint (1024 px), THE Login_Page SHALL display only the Auth_Panel in a centered single-column layout.
3. THE Illustration_Panel SHALL occupy approximately 52% of the viewport width on `lg` and larger screens.
4. THE Login_Page SHALL apply a dark navy gradient background (`from-[#0a0f1e]` to `#0d1b4b`) to the Illustration_Panel on all theme settings.
5. THE Auth_Panel SHALL adapt its background to white in light mode and `#0d1117` in dark mode using Tailwind dark-mode utilities.
6. THE Login_Page SHALL be accessible, with all interactive elements reachable by keyboard and carrying appropriate `aria-label` attributes.

---

### Requirement 2: Illustration Panel Content

**User Story:** As a student, I want to see a motivational university illustration with key statistics, so that I am inspired to prepare for my exit exam.

#### Acceptance Criteria

1. THE Illustration_Panel SHALL display the app name "Exit Exam Ethiopia" with a graduation cap icon (`GraduationCap` from `lucide-react`) in the top-left corner.
2. THE Illustration_Panel SHALL render a central circular graduation illustration composed of two concentric glass rings with the `GraduationCap` icon at the center.
3. THE Illustration_Panel SHALL display up to four department labels (e.g., "Computer Science", "Civil Engineering", "Medicine", "Pharmacy") positioned around the outer ring using absolute positioning.
4. THE Illustration_Panel SHALL show a slow-spinning dashed gold ring around the illustration using a CSS animation of at least 20 seconds per revolution.
5. THE Illustration_Panel SHALL display a headline reading "Ace Your Exit Exam with Confidence" where "Exit Exam" is rendered with the `.text-gold-gradient` CSS class defined in `globals.css`.
6. THE Illustration_Panel SHALL display three statistics: "500+ Exam Papers", "45+ Universities", and "25K+ Students" in amber/gold color to reinforce credibility.
7. THE Illustration_Panel SHALL render floating ambient background orbs (blurred, animated `pulse`) for visual depth.

---

### Requirement 3: Authentication Method Selection

**User Story:** As a student, I want to choose between email and phone authentication, so that I can log in using my preferred method.

#### Acceptance Criteria

1. THE Auth_Panel SHALL render a segmented tab control with two options: "Email" and "Phone".
2. WHEN the user selects the "Email" tab, THE Auth_Panel SHALL display the email/password login form.
3. WHEN the user selects the "Phone" tab, THE Auth_Panel SHALL display the phone number input form with the Ethiopian country code prefix (+251 🇪🇹).
4. THE Auth_Panel SHALL visually highlight the active tab with a white background (dark mode: gray-700) and a blue text color.
5. WHEN the "Phone" tab is active, THE Auth_Panel SHALL display a helper text informing the user that an OTP will be sent via Telegram.

---

### Requirement 4: Email / Password Login

**User Story:** As a registered student, I want to sign in with my email and password, so that I can access my personalized dashboard.

#### Acceptance Criteria

1. THE Auth_Panel SHALL render an email input field with a `Mail` icon prefix and `type="email"` validation.
2. THE Auth_Panel SHALL render a password input field with a `Lock` icon prefix and a toggle button to show or hide the password.
3. THE Auth_Panel SHALL render a "Forgot?" link that navigates to `/forgot-password`.
4. WHEN the user submits the email/password form, THE Login_Page SHALL call `supabase.auth.signInWithPassword()` with the provided email and password.
5. WHEN authentication succeeds, THE Login_Page SHALL redirect the user to `/dashboard` using `router.push` and call `router.refresh()`.
6. IF authentication fails, THEN THE Auth_Panel SHALL display the error message returned by Supabase inside a red-tinted error banner below the tab selector.
7. WHILE the authentication request is in-flight, THE Auth_Panel SHALL disable the submit button and show a `Loader2` spinner with the label "Signing in…".

---

### Requirement 5: Phone / OTP Login

**User Story:** As a student without email access, I want to receive a Telegram OTP on my phone number, so that I can authenticate securely.

#### Acceptance Criteria

1. WHEN the "Phone" tab is active, THE Auth_Panel SHALL render a phone input field pre-labeled with "+251 🇪🇹".
2. WHEN the user submits the phone form, THE Login_Page SHALL call `supabase.auth.signInWithOtp({ phone })` with the formatted Ethiopian phone number.
3. WHILE the OTP request is in-flight, THE Auth_Panel SHALL disable the submit button and show a loading spinner.
4. IF the OTP request fails, THEN THE Auth_Panel SHALL display the Supabase error message in the error banner.
5. WHEN the OTP request succeeds, THE Auth_Panel SHALL display a success message prompting the user to check their Telegram for the OTP code and show a verification code input.

---

### Requirement 6: Google OAuth Login

**User Story:** As a student with a Google account, I want to sign in with one click using Google, so that I do not need to remember a password.

#### Acceptance Criteria

1. THE Auth_Panel SHALL render a "Google" button displaying the Google color logo SVG and the label "Google".
2. WHEN the user clicks the Google button, THE Login_Page SHALL call `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '/auth/callback' } })`.
3. IF the Google OAuth call fails, THEN THE Auth_Panel SHALL display the error message in the error banner.

---

### Requirement 7: Telegram OTP Social Button

**User Story:** As a student, I want a dedicated Telegram OTP button visible alongside Google, so that the option is clearly discoverable.

#### Acceptance Criteria

1. THE Auth_Panel SHALL render a "Telegram OTP" button displaying the Telegram blue SVG icon alongside the label "Telegram OTP".
2. WHEN the user clicks the Telegram OTP button while the phone tab is not active, THE Auth_Panel SHALL switch to the "Phone" tab.
3. WHEN the user clicks the Telegram OTP button while the phone tab is already active, THE Auth_Panel SHALL focus the phone input field.

---

### Requirement 8: Guest Access

**User Story:** As a prospective student, I want to browse exam content without an account, so that I can evaluate the platform before registering.

#### Acceptance Criteria

1. THE Auth_Panel SHALL render a "Continue as Guest — Browse Free" button styled with a dashed amber border and amber text.
2. WHEN the user clicks the guest access button, THE Login_Page SHALL navigate to `/exams` using `router.push`.
3. THE Guest button SHALL display a `Sparkles` icon from `lucide-react`.

---

### Requirement 9: Sign Up Navigation

**User Story:** As a new student, I want a prominent link to the registration page, so that I can create an account easily.

#### Acceptance Criteria

1. THE Auth_Panel SHALL render the text "Don't have an account?" followed by a "Create one free" link.
2. WHEN the user clicks "Create one free", THE Login_Page SHALL navigate to `/register`.

---

### Requirement 10: Dark / Light Mode Toggle

**User Story:** As a student, I want to switch between dark and light themes, so that I can use the app comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Auth_Panel SHALL render a theme toggle button in the top-right corner using `Sun` and `Moon` icons from `lucide-react`.
2. WHEN the current theme is "dark" and the user clicks the toggle, THE Login_Page SHALL call `setTheme("light")` from `useTheme()`.
3. WHEN the current theme is "light" and the user clicks the toggle, THE Login_Page SHALL call `setTheme("dark")` from `useTheme()`.
4. THE theme toggle button SHALL carry `aria-label="Toggle theme"`.

---

### Requirement 11: Mobile Logo Display

**User Story:** As a mobile student, I want to see the app logo on the login page, so that I know I am on the correct app even without the illustration panel.

#### Acceptance Criteria

1. WHEN the viewport is narrower than the `lg` breakpoint, THE Auth_Panel SHALL render the graduation cap logo and "Exit Exam Ethiopia" text centered above the login form.
2. WHEN the viewport is `lg` or wider, THE Auth_Panel SHALL hide the mobile logo (the Illustration_Panel logo is sufficient).

---

### Requirement 12: Glassmorphism Visual Design

**User Story:** As a student, I want a modern, visually appealing UI, so that the app feels premium and trustworthy.

#### Acceptance Criteria

1. THE Login_Page SHALL apply the `.glass` CSS utility class (defined in `globals.css`) to the department label pills rendered around the graduation illustration.
2. THE Illustration_Panel SHALL use `backdrop-filter: blur` on the inner illustration rings to achieve the glassmorphism effect.
3. THE Auth_Panel inputs SHALL use rounded-xl borders with a subtle focus ring in blue (`focus:ring-blue-500/50`).
4. THE Auth_Panel social buttons (Google, Telegram) SHALL use a white/gray-800 card surface with a subtle border and shadow.
