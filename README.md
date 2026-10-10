# Starches — Food & Local Marketplace Delivery (Tanzania)

Starches is a modern local food and product delivery marketplace application connecting customers, restaurants, neighborhood retail shops, and delivery riders across Tanzania (Dar es Salaam, Zanzibar, Arusha, and nationwide).

---

## 🌟 Brand Identity & Visual Language
- **Signature Orange Palette**: Primary `#FF6B00`, Warm Amber `#FFA048`.
- **Light Theme**: Warm ivory surface `#FAF7F2`, pure white cards `#FFFFFF`, crisp charcoal typography `#1A1D20`.
- **Dark Theme**: Deep charcoal `#121417`, card containers `#1E2228`, vibrant orange active states, high WCAG AA contrast.
- **Top Right Theme Switcher**: Animated tactile sliding switch toggle with smooth sun/moon knob animation.

---

## 📱 Features Built & Connected

### Customer Journey
- **Splash & Onboarding Walkthrough**: Brand logo, multi-slide introduction with "Get Started" and city detection.
- **City & Language Selector**:
  - Independent city selection: Dar es Salaam, Zanzibar, Arusha, Dodoma, Mwanza.
  - Notice trigger when choosing coming-soon cities: *"Starches is not available in your city yet. We are launching soon!"*
  - Bilingual localization: Instant toggle between **English (EN)** and **Kiswahili (SW)**.
- **Home Screen**:
  - Delivery location dropdown (`Kinondoni, Dar es Salaam`).
  - Search bar with filter shortcut.
  - Category shortcuts: All, Burgers, Pizza, Swahili, Drinks, Groceries, Bakery, Pharmacy.
  - "Hot Food Fast Delivery" promo hero banner with food photography.
  - "Popular Near You" horizontal card carousel (Mamboz Burger, Zanzibar Pizza).
  - "Featured Restaurants & Local Spots" with distance, prep time, free delivery badges, and review ratings.
  - "Everyday Marketplace" grid (supermarket essentials, milk, pharmacy).
- **Restaurant Detail & Menu**:
  - Hero header with cover photography, opening hours, and address.
  - Category menu sections (Burgers, Pizzas, Swahili, Drinks).
  - Item customizer modal: Add-ons (extra cheese, beef bacon), choice of sauces, special instructions, and quantity.
- **Cart & Order Customization**:
  - Itemized rows with image, unit price, quantity incrementers `[-] 1 [+]`, and trash removal.
  - Special kitchen instructions field (*"e.g. no onions, extra sauce"*).
  - Subtotal, delivery fee calculation, and total.
- **Checkout & Tanzanian Payments**:
  - Tanzanian administrative address selector: District, Ward, Mtaa, and Landmark.
  - Mobile Money payment selector with **TigoPesa, M-Pesa, Airtel Money, and HaloPesa**.
  - USSD push session simulation (TIPS compliant).
  - Cash on delivery (COD) option.

---

## 🗺️ Lightweight 2D Google Maps & Smooth Touch Scrolling

To ensure smooth performance and zero scroll-trapping on mobile phones and desktops:
1. **Strictly 2D Flat View**:
   - `tilt: 0` and `heading: 0` disabled 3D perspective distortion and heavy building mesh overhead.
   - `clickableIcons: false` prevents extraneous POI overlay computations.
   - Custom minimalist 2D vector styles for both Light and Dark themes.
2. **Cooperative Scroll Handling ("Easy Scroll")**:
   - Swiping over the map automatically scrolls the page naturally.
   - Tap the **"Easy Scroll / Panning"** toggle whenever you want to pan the map with a single finger.
3. **Lite 2D Vector Option**:
   - Tap **"Lite 2D"** on the tracking map header to switch to an ultra-fast, zero-overhead 2D vector view designed for low-bandwidth connections.
4. **Live Vehicle Tracking (Uber & Bolt Style)**:
   - Polyline route connecting restaurant to customer.
   - Live animated Boda Boda marker moving along the route.
   - Floating ETA badge (*"Arriving in ~12 min"*).
   - "Recenter on Rider" and "Fit Route" floating action buttons.

---

## 🚀 Multi-Platform Build Guide (Android APK, iOS, Desktop)

A unified GitHub Actions workflow is provided at `.github/workflows/build-all-platforms.yml` supporting:

### 1. Android APK
- **Workflow**: Automated build on `ubuntu-latest` with Java 17, Android SDK, and Capacitor.
- **Local Command**:
  ```bash
  npm run build
  npx cap sync android
  cd android && ./gradlew assembleDebug
  ```
- **Output**: `android/app/build/outputs/apk/debug/app-debug.apk`

### 2. iOS App (Xcode)
- **Workflow**: Automated build on `macos-14` runner with Xcode and CocoaPods.
- **Local Command**:
  ```bash
  npm run build
  npx cap sync ios
  npx cap open ios
  ```
- **Output**: `ios/App/build/Release-iphoneos/App.app`

### 3. Desktop Application (Windows, macOS, Linux)
- **Workflow**: Automated multi-OS matrix on `[windows-latest, macos-latest, ubuntu-latest]` powered by Electron Builder.
- **Entry point**: `electron/main.cjs`
- **Local Command**:
  ```bash
  npm run build:desktop
  ```
- **Outputs**:
  - **Windows**: `dist_electron/*.exe`
  - **macOS**: `dist_electron/*.dmg`
  - **Linux**: `dist_electron/*.AppImage`

---

## 🔒 Firebase Firestore Integration
- **Database**: Cloud Firestore project `noble-osprey-dhl8x`.
- **Collections**: `orders`, `addresses`, `users`.
- **Rules**: Production security rules deployed in `firestore.rules`.
