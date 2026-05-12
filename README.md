# Smart Plate Detector - AI Powered Vehicle Recognition

A modern, high-performance web application designed to detect and extract vehicle license plate numbers from images using state-of-the-art AI.

## 🚀 Features

- **AI-Powered Recognition**: Uses Google Gemini Pro Vision to accurately identify registration numbers and locate plate regions.
- **Interactive Dashboard**: Modern, responsive UI with real-time processing feedback.
- **Processed Image Export**: Download processed images with auto-generated bounding boxes and labels.
- **Detection History**: Persistent SQLite storage to keep track of all recognized vehicles.
- **Smart Search**: Quickly find specific plates in your detection history.
- **Dark/Light Mode**: Elegant theme support for all environments.
- **Professional Aesthetic**: Built with Tailwind CSS and Framer Motion for a premium user experience.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS (V4), Framer Motion, Lucide icons.
- **Backend**: Node.js, Express, SQLite (via `better-sqlite3`).
- **AI Engine**: Google Gemini API for detection & OCR.

## 📁 Project Structure

```text
Smart-Plate-Detector/
├── public/                 # Static assets & processed images
│   ├── uploads/            # Original uploaded images
│   └── processed/          # Placeholder for generated exports
├── src/
│   ├── components/         # React UI modules
│   ├── services/           # API integration (Gemini)
│   ├── lib/                # Shared utilities
│   └── App.tsx             # Main application & routing
├── server.ts               # Express backend & SQLite setup
├── database.db             # Local detection history store
├── vite.config.ts          # Build configuration
└── package.json            # Project dependencies
```

## ⚙️ Setup Instructions

1. **Prerequisites**: 
   - Node.js (v18+)
   - A Google Gemini API Key.

2. **Environment Configuration**:
   - Create a `.env` file (or use the one in AI Studio secrets).
   - Add your key: `GEMINI_API_KEY="your_api_key_here"`

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## 🔍 How It Works

1. **Image Selection**: User selects a vehicle image via the dashboard.
2. **AI Analysis**: The image is processed in the browser by the Gemini Vision model.
3. **Extraction**: The model identifies coordinates of the license plate and performs OCR on the characters.
4. **Processing**: The system draws a bounding box on a canvas overlay for the user to review.
5. **Storage**: Data is securely pushed to the Express backend and stored in the SQLite `detections` table.
6. **Analytics**: The history page calculates averages and frequency from stored data.

---
Developed as a professional AI project submission.
