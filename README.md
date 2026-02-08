# 📬 Subscription Tracker 

A backend service for tracking user subscriptions, sending reminders/notifications, and managing workflows using Node.js, Express, MongoDB, and Upstash QStash Workflows. The system supports JWT-based authentication, scheduled/background workflows, and email notifications.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based login and protected routes
- Middleware for route authorization

### 👤 User Management
- Create and manage users
- Secure password handling

### 📦 Subscription Management
- Create, update, list, and delete subscriptions
- Workflow triggers for subscription events

### 🕒 Background Workflows (Upstash QStash)
- Reliable, retriable workflow steps
- Workflow monitoring via Upstash Console
- Supports local development using tunnels (ngrok)

### ✉️ Email Notifications
- Nodemailer integration
- Templated emails for reminders/alerts

### 🗄️ MongoDB Integration
- Mongoose models for users and subscriptions

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** [MongoDB](https://www.mongodb.com/cloud/atlas) (Mongoose)
- **Auth:** JWT
- **Background Jobs / Workflows:** [Upstash QStash](https://upstash.com/qstash) + Upstash Workflow
- **Email:** Nodemailer
- **Security:** [Arcjet](https://www.arcjet.com/) (Rate limiting & Bot protection)
- **Config:** dotenv
- **Local Dev Tunneling:** ngrok (optional)

## 📁 Project Structure

```
.
├── config/
│   ├── arcjet.js
│   ├── env.js
│   ├── nodemailer.js
│   └── upstash.js
├── controllers/
│   ├── auth.controller.js
│   ├── subscription.controller.js
│   ├── user.controller.js
│   └── workflow.controller.js
├── database/
│   └── mongodb.js
├── middlewares/
│   ├── arcjet.middleware.js
│   ├── authorize.middleware.js
│   └── error.middleware.js
├── models/
│   ├── subscription.model.js
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── subscription.routes.js
│   ├── user.routes.js
│   └── workflow.routes.js
├── utils/
│   ├── email-template.js
│   └── send-email.js
├── .env.development.local
├── .env.production.local
├── app.js
└── package.json
```



## ⚙️ Environment Variables

Create `.env.development.local` in the root directory:

```env
# PORT
PORT=5500
SERVER_URL="http://localhost:5500"

# Environment
NODE_ENV="development"

# DATABASE
DB_URI="mongodb+srv://<username>:<password>@cluster0.<cluster-id>.mongodb.net/?appName=Cluster0"

# JWT
JWT_SECRET="your_secure_secret_here"
JWT_EXPIRES_IN="1d"

# ARCJET
ARCJET_KEY="your_arcjet_key_here"
ARCJET_ENV="development"

# UPSTASH QSTASH
QSTASH_URL="http://localhost:8080"
QSTASH_TOKEN="eyJVc2VySUQiOiJkZWZhdWx0VXNlciIsIlBhc3N3b3JkIjoiZGVmYXVsdFBhc3N3b3JkIn0="
QSTASH_CURRENT_SIGNING_KEY="sig_7kYjw48mhY7kAjqNGcy6cr29RJ6r"
QSTASH_NEXT_SIGNING_KEY="sig_5ZB6DVzB1wjE8S6rZ7eenA8Pdnhs"

# NODEMAILER (Gmail App Password)
EMAIL_PASSWORD="your_16_char_app_password"
```

⚠️ **Security Warning:**
- Never commit `.env` files to version control
- Add `.env*.local` to your `.gitignore`
- Use different secrets for production
- Rotate secrets immediately if exposed

## 📦 NPM Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "lint": "eslint ."
  }
}
```

## 🧑‍💻 Local Development

### Prerequisites

Before starting, ensure you have Node.js and npm installed on your system.

### Setup Commands

```bash
# Initialize Express project
npx express-generator --no-view --git ./

# Install development dependencies
npm install --save-dev nodemon

# Initialize ESLint
npx eslint --init

# Install core dependencies
npm install dotenv
npm install mongodb mongoose
npm install jsonwebtoken bcryptjs
npm i @arcjet/node @arcjet/inspect
npm install @upstash/workflow
npm install nodemailer
```

### 1️⃣ MongoDB Setup

1. Create a MongoDB cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Get your connection URL (it should look like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.<cluster-id>.mongodb.net/?appName=Cluster0
   ```
3. Save this URL for your `.env` file

**Resources:**
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Get Started with Atlas](https://www.mongodb.com/docs/atlas/getting-started/)

### 2️⃣ Arcjet Setup

1. Create a new site at [Arcjet Dashboard](https://app.arcjet.com/)
2. Name it: `Subscription-tracker`
3. Copy your API key and save it for the `.env` file:
   ```env
   ARCJET_KEY="your_key_here"
   ARCJET_ENV="development"
   ```

**Resources:**
- [Arcjet Documentation](https://docs.arcjet.com/)
- [Quick Start Guide](https://docs.arcjet.com/get-started)

### 3️⃣ QStash Local Development Server

QStash requires a publicly available API to send messages to. During development, Upstash provides QStash CLI, which allows you to run a development server locally for testing.

The development server fully supports all QStash features including Schedules, URL Groups, Workflows, and Event Logs.

> **Note:** Since the development server operates entirely in-memory, all data is reset when the server restarts.

**Resources:**
- [Upstash QStash Documentation](https://upstash.com/docs/qstash/overall/getstarted)
- [QStash Local Development](https://upstash.com/docs/qstash/howto/local-development)
- [Upstash Console](https://console.upstash.com/)

#### Start QStash CLI

You can run the QStash CLI in several ways:

**NPX (Recommended):**
```bash
npx @upstash/qstash-cli dev

# Start on a different port
npx @upstash/qstash-cli dev -port=8081
```

**Docker:**
```bash
# Pull the image
docker pull public.ecr.aws/upstash/qstash:latest

# Run the image
docker run -p 8080:8080 public.ecr.aws/upstash/qstash:latest qstash dev
```

**Direct Binary Download:**
Download from [Upstash Artifacts Repository](https://artifacts.upstash.com/#qstash/versions/)

```bash
# After extracting
./qstash dev
```

#### QStash CLI Options

```bash
$ ./qstash dev --help
Usage of dev:
  -port int
        The port to start HTTP server at [env QSTASH_DEV_PORT] (default 8080)
  -quota string
        The quota of users [env QSTASH_DEV_QUOTA] (default "payg")
```

#### Configure QStash Console

Once you start the local server:
1. Go to the QStash tab on [Upstash Console](https://console.upstash.com/)
2. Enable **local mode**
3. This allows you to publish requests and monitor messages with the local server

The development server will display test user credentials. Select and copy from one of the available users (User 1-4):

```env
QSTASH_URL="http://localhost:8080"
QSTASH_TOKEN="eyJVc2VySUQiOiJkZWZhdWx0VXNlciIsIlBhc3N3b3JkIjoiZGVmYXVsdFBhc3N3b3JkIn0="
QSTASH_CURRENT_SIGNING_KEY="sig_7kYjw48mhY7kAjqNGcy6cr29RJ6r"
QSTASH_NEXT_SIGNING_KEY="sig_5ZB6DVzB1wjE8S6rZ7eenA8Pdnhs"
```

### 4️⃣ Nodemailer Setup (Gmail)

1. Go to your Google Account settings
2. Enable **2-Step Verification**
3. Generate an **App Password**:
    - Go to Security → 2-Step Verification → App passwords
    - Select "Mail" and generate a password
4. Copy the 16-character password for your `.env` file

### 5️⃣ Environment Configuration

Create `.env.development.local` in the root directory:

```env
# PORT
PORT=5500
SERVER_URL="http://localhost:5500"

# Environment
NODE_ENV="development"

# DATABASE
DB_URI="mongodb+srv://<username>:<password>@cluster0.<cluster-id>.mongodb.net/?appName=Cluster0"

# JWT
JWT_SECRET="your_secure_secret_here"
JWT_EXPIRES_IN="1d"

# ARCJET
ARCJET_KEY="your_arcjet_key_here"
ARCJET_ENV="development"

# UPSTASH QSTASH
QSTASH_URL="http://localhost:8080"
QSTASH_TOKEN="eyJVc2VySUQiOiJkZWZhdWx0VXNlciIsIlBhc3N3b3JkIjoiZGVmYXVsdFBhc3N3b3JkIn0="
QSTASH_CURRENT_SIGNING_KEY="sig_7kYjw48mhY7kAjqNGcy6cr29RJ6r"
QSTASH_NEXT_SIGNING_KEY="sig_5ZB6DVzB1wjE8S6rZ7eenA8Pdnhs"

# NODEMAILER
EMAIL_PASSWORD="your_16_char_app_password"
```

### 6️⃣ Run the Application

```bash
# Start the development server (with auto-reload)
npm run dev

# Or start normally
node app.js
```

Server will run at: **http://localhost:5500**

> **Important:** Make sure QStash CLI is running in a separate terminal before starting your application if you're using workflows.

## 🔐 Authentication

Login returns a JWT token. Protected routes require the token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

**Example:**

```bash
curl -X GET http://localhost:5500/api/subscriptions \
  -H "Authorization: Bearer <your_token>"
```

**Token Storage:**
- Store JWT securely (httpOnly cookies recommended for production)
- Token expires based on `JWT_EXPIRES_IN` setting (default: 1 day)
- Include token in all protected route requests

## 📬 Email Notifications

Emails are sent using Nodemailer. Make sure to use **App Passwords** (for Gmail) and not your real account password.

## 🛡️ Security Features

### Implemented Security Measures

- **JWT Authentication:** Secure token-based authentication
- **Arcjet Protection:** Rate limiting and bot protection
- **Password Hashing:** bcryptjs for secure password storage
- **Environment Variables:** Sensitive data stored in `.env` files
- **Input Validation:** Sanitization of user inputs
- **QStash Signature Verification:** Webhook request validation

### Security Best Practices

- Do not expose `.env` files or commit them to version control
- Rotate JWT secrets and API keys regularly
- Use strong passwords for database and email accounts
- Validate and verify webhook signatures from Upstash
- Implement HTTPS in production
- Keep dependencies updated (`npm audit` regularly)
- Use Arcjet's rate limiting to prevent abuse
- Monitor logs for suspicious activity

## 📬 Email Notifications

Emails are sent using Nodemailer with Gmail SMTP.

**Setup Requirements:**
- Gmail account with 2-Step Verification enabled
- App Password generated (not your regular password)
- 16-character app password added to `EMAIL_PASSWORD` in `.env`

**Configuration:**
- SMTP Host: `smtp.gmail.com`
- Port: `587` (TLS)
- Authentication: App Password

**Common Issues:**
- "Invalid credentials" → Check if 2-Step Verification is enabled
- "Less secure app access" → Use App Password, not regular password
- Email not sending → Verify EMAIL_PASSWORD is correct 16-char code

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Failed:**
```
Solution: Check DB_URI format and ensure IP whitelist includes your IP
Verify username and password are correctly encoded in connection string
```

**QStash Workflow Not Triggering:**
```
Solution: Ensure QStash CLI is running (npx @upstash/qstash-cli dev)
Check QSTASH_URL matches the CLI port (default: http://localhost:8080)
Verify workflow endpoint is accessible
```

**JWT Token Invalid:**
```
Solution: Verify JWT_SECRET matches between environments
Check token expiration (JWT_EXPIRES_IN)
Ensure Authorization header format: "Bearer <token>"
```

**Email Not Sending:**
```
Solution: Verify 2-Step Verification is enabled on Gmail
Regenerate App Password if needed
Check EMAIL_PASSWORD in .env file (16 characters, no spaces)
```

**Port Already in Use:**
```bash
# Find process using port 5500
lsof -i :5500

# Kill the process
kill -9 <PID>

# Or use a different port in .env
```

**Arcjet Configuration Issues:**
```
Solution: Verify ARCJET_KEY is correct
Check ARCJET_ENV is set to "development" or "production"
Review Arcjet dashboard for rate limit hits
```

## 📌 Roadmap

Future enhancements and features:

- [ ] Add cron-based reminders for upcoming renewals
- [ ] Build frontend dashboard with React/Vue
- [ ] Implement webhooks for third-party integrations
- [ ] Add role-based access control (RBAC)
- [ ] Support multiple currencies
- [ ] Add subscription analytics and insights
- [ ] Implement recurring payment tracking
- [ ] Add mobile app notifications

---

## 📺 Credits

This project was built following a YouTube tutorial for learning purposes.