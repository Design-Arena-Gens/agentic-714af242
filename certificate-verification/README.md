# CertiVerify - Certificate Verification System

A blockchain-powered certificate verification application with AI-powered data extraction.

## Features

- **Certificate Verification**: Upload and verify certificates using Gemini AI
- **Certificate Issuance**: Authorized institutions can issue tamper-proof certificates
- **Admin Portal**: Manage certificate templates and approve issuers
- **Blockchain Security**: Every certificate is secured with blockchain hash verification
- **JWT Authentication**: Secure authentication with role-based access control

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **AI**: Google Gemini 2.0 Flash
- **Blockchain**: Ethers.js for hash generation
- **Authentication**: JWT tokens with bcrypt

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- Gemini API key

### Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret_key_min_32_chars
NEXTAUTH_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
ADMIN_EMAIL=admin@certiverify.com
ADMIN_PASSWORD=Admin@123456
```

### Installation

```bash
npm install
```

### Initialize Admin Account

Visit `/api/init` to create the default admin account.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## User Roles

### Admin
- Manage certificate templates (upload PPTX files)
- Approve/reject issuer registrations
- Set active certificate template

### Issuer
- Register with organization details (requires admin approval)
- Generate certificates using active template
- View generated certificates

### User
- Verify certificates by uploading images
- View verification results

## Certificate Template Format

Templates should be PPTX files with placeholders:
- `{NAME}` - Student name
- `{DATE_OF_BIRTH}` - Date of birth
- `{COURSE_NAME}` - Course name
- `{ISSUE_DATE}` - Certificate issue date
- `{CERTIFICATE_ID}` - Unique certificate ID
- `{ORGANIZATION}` - Issuing organization
- `{CANDIDATE_IMAGE}` - Student photo (optional)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Admin
- `GET /api/admin/issuers` - Get all issuers
- `PATCH /api/admin/issuers/[id]/approve` - Approve/reject issuer
- `GET /api/admin/templates` - Get templates
- `POST /api/admin/templates` - Upload template
- `PATCH /api/admin/templates/[id]/activate` - Activate template

### Issuer
- `GET /api/issuer/certificates` - Get certificates
- `POST /api/issuer/certificates` - Generate certificate

### Verification
- `POST /api/verify` - Verify certificate

## Security Features

- JWT-based authentication with httpOnly cookies
- Password hashing with bcrypt
- Role-based access control
- Blockchain hash verification
- Admin approval for issuers
- Secure file uploads

## Deployment

Deploy to Vercel:

```bash
vercel deploy --prod
```

Set environment variables in Vercel dashboard.

## License

MIT
