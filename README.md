# 🥗 NutriPal — Personalized AI Nutritionist

> **Hyper-personalized dietary planning, real-time biometric calculations, and intelligent AI-powered nutritional insights.**

NutriPal is a full-stack health and nutrition application built with React 19, TypeScript, Vite, Express, and Google Gemini AI. It transforms biometric data, dietary preferences, and fitness goals into actionable, balanced daily meal plans featuring real-time macro breakdowns, grocery checklists, restaurant alternatives, and a 6-month health projection.

---

## ✨ Features

### 1. 📋 Multi-Step Plan Generator
- **Biometrics & BMI Engine:** Supports both Metric and Imperial units with instant BMI score calculation, categorization, and healthy weight range indicators.
- **Customizable Goals:** Weight Loss, Muscle Gain, Maintenance, Energy Boost, and Athletic Performance.
- **Dietary & Allergen Filtering:** Flexible configurations for Vegan, Vegetarian, Keto, Paleo, Mediterranean, Gluten-Free, Dairy-Free, Nut-Free, and more.

### 2. 🍽️ Interactive Meal Planner
- **Full Daily Schedule:** Breakfast, Lunch, Dinner, and nutrient-dense Snacks.
- **Dynamic Macronutrient Tracking:** Live charts displaying Calorie, Protein, Carbohydrate, and Fat distribution against target requirements.
- **One-Click Meal Swapping:** Easily customize meals while automatically maintaining daily caloric and macronutrient targets.

### 3. 🤖 AI-Powered Nutrition Intelligence (Gemini 2.5 Flash)
- **Enhanced Meal Descriptions:** Context-aware, sensory culinary descriptions emphasizing macro balance and health benefits.
- **Automated Grocery Lists:** Generates structured shopping lists for individual meals or entire daily plans with a single click.
- **Curated Restaurant Suggestions:** Discovers dining options and menu recommendations that match the user's specific meal plan macros.
- **6-Month Future Health Predictor:** AI-modeled projections predicting weight change trajectory, cardiovascular improvements, energy stability, and metabolic metrics.
- **Fault-Tolerant Architecture:** Graceful server-side fallbacks ensure uninterrupted user experience even under offline or rate-limited conditions.

### 4. 📊 Expo & Community Analytics Dashboard
- Visualized attendee statistics, dietary trend distributions, and biometric averages powered by Recharts.
- Perfect for wellness exhibitions, fitness centers, and health kiosks.

### 5. 🖨️ Sharing, Kiosk & Accessibility
- **Print-Friendly Format:** Clean, high-contrast stylesheet designed for physical printing and PDF export.
- **QR Code Mobile Handoff:** Scan on-screen QR codes to view plans seamlessly on mobile devices.
- **Kiosk Mode:** Automatic inactivity timer reset (2 minutes) optimized for public interactive displays.
- **Dark & Light Mode:** Seamless theme toggling with persistent state and Tailwind styling.

---

## 🛠️ Tech Stack

- **Frontend:**
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Vite 6](https://vitejs.dev/)
  - [React Router 7](https://reactrouter.com/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Recharts 3](https://recharts.org/)
  - [qrcode.react](https://www.npmjs.com/package/qrcode.react)
- **Backend & AI:**
  - [Express 5](https://expressjs.com/) (Node.js runtime via `tsx`)
  - [Google Gen AI TypeScript SDK](https://github.com/google-gemini/generative-ai-js) (`@google/genai`)
  - Model: `gemini-2.5-flash` with structured JSON schema outputs
- **Build Tools:**
  - `esbuild` for production server bundling

---

## 📁 Project Structure
