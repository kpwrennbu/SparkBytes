# Spark!Bytes

**Spark!Bytes** is an innovative web application designed to help Boston University redistribute surplus food from events and programs to students, staff, and professors. By enabling quick listing, discovery, and claiming of available food, Spark!Bytes reduces waste, promotes sustainability, and supports food access on campus.

This project was built using [Next.js](https://nextjs.org) and Supabase, with Ant Design components for a clean, responsive UI.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sparkbytes.git
cd sparkbytes
```
### 2. Install Dependencies
Use your preferred package manager:
```bash
npm install
# or
yarn install
```
### 3. Set Up Environment Variables
Create a .env.local file in the root directory:
```bash
touch .env.local
```
Then add the following:
```bash
# Supabase project details
NEXT_PUBLIC_SUPABASE_URL=https://ztuoczhbsqzkjvnoucia.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# USDA FoodData Central API for nutrition info (if used in search or input)
FOOD_DATA_CENTRAL_API_KEY=YOUR_FOODDATA_KEY

# Resend email service (optional backup to Mailgun)
RESEND_API_KEY=re_LFF3YnJH_QKydFUQcixCAcfgNTPBtgpfP

# Mailgun for sending order or event emails
MAILGUN_API_KEY=YOUR_MAILGUN_KEY
MAILGUN_DOMAIN=sandbox5f16cac6c35f4b078011a1fbb34215f7.mailgun.org
```
### 4. Run the Development Server
```bash
npm run dev
```
Open http://localhost:3000, or whatever port specified, to view the app.

## 🧪 What You Can Do

- Browse and claim available food from BU events
- Post leftover food (if you're an event organizer)
- Edit your profile, including avatar uploads
- See orders, food stats, and campus-wide availability

## 🛠️ Tech Stack

- Next.js App Router (TypeScript)
- React
- Supabase (PostgreSQL, Auth, Storage)
- Ant Design for UI
- Vercel for deployment

## 🔒 Authentication
- Users must sign in with a valid BU email (@bu.edu) to access the app.
- Supabase Auth handles user sessions and protected routes.

##🧼 Supabase Notes for Graders

If you're testing:
- Admin policies have been removed for easier grading.
- You can upload avatars and edit accounts without restriction.
- If avatar uploads or image previews fail, ensure ```.env.local ``` values are set correctly.

## 🌐 Deployment

Deployed via Vercel. Visit: [GET THIS] 

## 📬 Contact

Please refer to About Page on how to contact us!

## 📝 Notes
- Please contact kpwrenn@bu.edu for Mailgun (Email Notification) Access. I only get 5 free emails to put on the mailing list

