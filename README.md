# University Portal - Final Year Project

A comprehensive University Management System built with a modern full-stack architecture.

## 🚀 How to see your Data
1. **Firebase Console**: 
   - Open your Firebase Project.
   - Go to **Firestore Database**.
   - You will see collections like `news`, `users`, etc. 
   - *Note*: If it's empty, run the app and **Log In** once with `LASU/2020/001` to trigger the automatic data population (seeding).

2. **The Backend API**: 
   - The Central University Database runs on an Express server.
   - You can test it by going to `/api/health` in your browser.
   - It handles confidential student data (CGPA, Debts) that isn't stored in the main Student Portal Firestore.

## 🔑 Test Credentials
- **Student**: Matric: `LASU/2020/001`, Surname: `Adekoya`
- **HOC**: Matric: `HOC/LASU/001`, Surname: `Oluwaseun`
- **HOD**: Matric: `HOD/LASU/001`, Surname: `Chioma`

## 🛠️ GitHub & Vercel Deployment
To make this work on Vercel:
1. **Environment Variables**: Copy everything from `firebase-applet-config.json` into Vercel's Environment Variables settings.
2. **Backend**: Vercel is best for the frontend. For the Node/Express backend to work on Vercel, use the `vercel.json` included in this repo.

## ✨ Key Features
- **Biometric-style Login**: Authenticate using Matric Number and Profile validation.
- **Dynamic Dashboard**: Real-time stats and personalized greeting.
- **Firebase Real-time**: Databases are synced live across all users.
- **Admin/Staff Panel**: Specialized roles with administrative powers.
- **Mobile App (PWA)**: This web app is PWA-ready. When opened on a mobile device, users can "Add to Home Screen" to use it just like a native mobile app with a launcher icon.

---
*Created as a Final Year Project Demonstration.*
