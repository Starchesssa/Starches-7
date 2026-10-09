# Starches — Food & Local Marketplace Delivery (Tanzania)

Starches is a modern local food and product delivery marketplace application connecting customers, restaurants, neighborhood retail shops, and boda-boda delivery riders across Tanzania (Dar es Salaam, Zanzibar, Arusha, and nationwide).

---

## 🌟 Brand Identity & Visual Language
- **Signature Orange Palette**: Primary `#FF6B00`, Warm Amber `#FFA048`.
- **Light Theme**: Warm ivory surface `#FAF7F2`, pure white cards `#FFFFFF`, crisp charcoal typography `#1A1D20`.
- **Dark Theme**: Deep charcoal `#121417`, card containers `#1E2228`, vibrant orange active states, high WCAG AA contrast.
- **Brand Symbol**: 3D geometric ribbon 'S' topped with a chef's hat, representing culinary speed, local pride, and fresh taste.

---

## 📱 Features Built & Connected

### 1. Customer Experience
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
  - Customer review ratings.
- **Cart & Order Customization**:
  - Itemized rows with image, unit price, quantity incrementers `[-] 1 [+]`, and trash removal.
  - Special kitchen instructions field (*"e.g. no onions, extra sauce"*).
  - Subtotal, delivery fee calculation (free delivery above TZS 50,000 threshold), and total.
- **Checkout & Tanzanian Payments**:
  - Tanzanian administrative address selector: District, Ward, Mtaa, and Landmark.
  - Interactive map preview with draggable pin marker and GPS location assist.
  - Mobile Money payment selector with **TigoPesa, M-Pesa, Airtel Money, and HaloPesa**.
  - USSD push session simulation (TIPS compliant; never requests or stores customer PINs).
  - Cash on delivery (COD) option.
- **Order Tracking**:
  - Coastline & road grid map (Dar es Salaam / Kinondoni / Indian Ocean).
  - Route waypoint path with animated Boda Boda rider movement.
  - Floating ETA card: *"Arriving in 12 min"*.
  - Rider contact card: Juma (★ 4.8, 324 trips, Boda Boda `MC 482 DZ`), direct phone trigger.
  - Live progress stepper: Preparing ➔ Picked up ➔ On the way ➔ Delivered.
  - Developer advance status button to test all order lifecycle states.
- **Itemized Receipt & Order History**: Full order details with re-order button.
- **Favorites & Profile**: Saved items, role switchers, theme preferences, and customer support.

### 2. Seller / Restaurant Dashboard
- Switchable via Profile or top badge.
- View real-time orders queue.
- Move orders through lifecycle: *"Accept Order"*, *"Start Preparing"*, *"Mark Ready for Pickup"*.
- Menu & catalog inventory management: Toggle *"In Stock"* / *"Out of Stock"*.
- Add new menu items with prices, categories, and bilingual titles.
- Daily revenue analytics in TZS.

### 3. Rider Delivery Partner Dashboard
- Switchable via Profile.
- Online / Offline availability toggle.
- Incoming dispatch requests with pickup restaurant & dropoff address.
- Call kitchen and call customer shortcuts.
- Status update controls: *"Mark Picked Up"*, *"Start Journey"*, *"Confirm Delivery"*.
- Daily & weekly earnings breakdown in TZS.

---

## 🛠️ Capacitor Android Packaging & APK Generation

Starches includes `capacitor.config.ts` ready for Android APK builds.

### Local Android Build Steps:
1. Build the web distribution:
   ```bash
   npm run build
   ```
2. Initialize and sync Capacitor Android:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap add android
   npx cap sync android
   ```
3. Open in Android Studio or compile directly:
   ```bash
   npx cap open android
   # Inside Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)
   ```

### GitHub Actions CI/CD APK Workflow (`.github/workflows/android-build.yml`):
```yaml
name: Build Android APK
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'
      - name: Install Dependencies
        run: |
          npm ci
          npm install @capacitor/core @capacitor/cli @capacitor/android
      - name: Build Web App
        run: npm run build
      - name: Sync Capacitor
        run: |
          npx cap add android
          npx cap sync android
      - name: Build Debug APK
        run: |
          cd android && ./gradlew assembleDebug
      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: Starches-Debug-APK
          path: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔒 Firebase Firestore & Security Model
- Documented schema and security rules in `firestore.rules`.
- Customer private data isolated to `request.auth.uid`.
- Sensitive order status transitions restricted by role (`seller`, `rider`, `customer`, `admin`).
