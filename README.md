# Bharat Hydraulics & Engineering Co. – eCommerce Website

Welcome to the official eCommerce platform for **Bharat Hydraulics & Engineering Co.** This web application allows customers to browse and purchase a wide range of hydraulic tools, machinery, and components.

---

## 🛠️ Project Overview

This project is a custom-built eCommerce solution designed for selling hydraulic products online. It includes features like product listings, categories, cart management, and a secure checkout process.

---

## 🚀 Getting Started (Local Development)

Follow the steps below to set up the project locally on your machine.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
````

### 2. Install Dependencies

Make sure you are using Node.js 14+ and run:

```bash
npm install --legacy-peer-deps
```

### 3. Setup Environment Variables

Copy the example environment file and rename it:

```bash
cp .env.example .env
```

Now, open the `.env` file and enter the required credentials.

---

## 🔐 Environment Variables Guide

Here’s how to get the credentials you need:

### 📦 Supabase

Supabase is used for database, authentication, and backend functions.

1. Go to [https://supabase.com](https://supabase.com) and log in or create an account.
2. Create a new project.
3. Once your project is created, go to **Settings → API**.
4. Copy the following values:

   * **Project URL** → `SUPABASE_URL`
   * **Anon Public Key** → `SUPABASE_ANON_KEY`

Paste them into your `.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
```

---

### ✉️ EmailJS

EmailJS is used for sending contact forms or order confirmations directly from the client side.

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/) and sign up or log in.
2. Go to **Email Services**, click **Add Service**, and connect your preferred email provider (like Gmail).
3. Go to **Email Templates**, and create a new template. Note the **Template ID**.
4. Go to **Account → API Keys**, and copy your **Public Key**.
5. Note your **Service ID** from the Email Services section.

Paste them into your `.env` file like this:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

---

### ✅ Final Steps

After updating `.env`, restart your development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to view the website.

---

## 📞 Support

For any support or technical issues, please contact the development team or Bharat Hydraulics & Engineering Co. directly.

