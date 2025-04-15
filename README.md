# YRGO Internify

YRGO Internify is a web application designed to connect students from YRGO's Digital Designer and Web Developer programs with companies offering internship positions (LIA - Lärande i Arbete). The platform enables companies to create profiles, list available internship positions, and connect with potential interns.

## Features

### For Companies

- **Company Profiles**: Companies can create detailed profiles including logo, cover image, description, and contact information.
- **Position Management**: Add, edit, and remove internship positions.
- **Skills Matching**: Specify required skills and tools for each position to find suitable candidates.
- **Dashboard**: A personalized dashboard to manage company profiles and internship listings.

### For Students

- **Company Exploration**: Browse company profiles and available internship positions.
- **Skills Filtering**: Filter companies and positions based on specific skills.
- **Direct Contact**: Connect directly with companies offering relevant positions.
- **Event Registration**: Sign up for networking events to meet potential employers.

## Tech Stack

- **Frontend**: Next.js (React), CSS Modules
- **Backend**: Supabase (Authentication, Database, Storage)
- **Styling**: Custom CSS with responsive design
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                   # Next.js app router structure
│   ├── components/        # Reusable UI components
│   │   ├── buttons/       # Button components
│   │   ├── cards/         # Card components for listings
│   │   ├── form/          # Form components
│   │   ├── header/        # Header components
│   │   ├── profile/       # Profile-related components
│   │   └── ...
│   ├── company/           # Company registration and profile pages
│   ├── companies/         # Company listings and details
│   ├── dashboard/         # User dashboard
│   ├── event/             # Event registration and details
│   ├── positions/         # Internship position listings
│   ├── globals.css        # Global styles
│   └── ...
├── assets/                # Static assets
├── hook/                  # Custom React hooks
├── utils/                 # Utility functions
│   └── supabase/          # Supabase client configurations
└── ...
```

## Key Components

- **Authentication Flow**: Complete user registration, login, and session management.
- **Profile Creation**: Multi-step form for company profile creation.
- **Position Management**: Interface for adding, editing, and removing internship positions.
- **Skills Matching**: System to match positions with required skills.
- **Responsive Design**: Mobile-friendly interface adapting to different screen sizes.
- **Networking Events**: Registration system for in-person networking events.

## Installation and Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/internify.git
cd internify
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server**

```bash
npm run dev
```

5. **Build for production**

```bash
npm run build
```

## Database Structure

The application uses Supabase with the following main tables:

- **users**: Authentication user accounts
- **companies**: Company profiles
- **positions**: Internship positions
- **webbutvecklare_skill_position**: Skills for Web Developer positions
- **digitaldesigner_skill_position**: Skills for Digital Designer positions
- **skills_webbutvecklare**: Skills catalog for Web Developers
- **skills_digitaldesigner**: Skills catalog for Digital Designers
- **lia_event_attendes**: Event registrations

## Contributing

This project was created by YRGO students as part of their education program. If you'd like to contribute, please contact the original developers.

## Team Members

- [Andrea Wingårdh](https://github.com/Andreawingardh) (Web Developer)
- [Linnéa Malmström](https://www.linkedin.com/in/linneamalmstroem/) (Digital Designer)
- [Mahtias Jebrand](https://github.com/Mahtte94) (Web Developer)
- [Markus Zeljak](https://markuszeljak.com/) (Digital Designer)

## License

This project is a student project created for educational purposes under a MIT license..

## Contact

For more information about this project, please contact:

- Marie Kalmnäs (Digital Designer Teacher) - marie.kalmnas@educ.goteborg.se
- Hans Andersson (Web Developer Teacher) - hans.2.andersson@educ.goteborg.se
