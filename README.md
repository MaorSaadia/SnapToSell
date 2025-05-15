This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## AI Content Generation with Gemini

This application now includes AI-powered content generation using Google's Gemini AI. The system provides:

- Automatic product description generation from images
- Social media content creation tailored to different platforms
- Video title and description generation
- Various tone and style options

### Setup Gemini API

1. Go to the [Google AI Studio](https://ai.google.dev/) and create an account
2. Get your API key from the Google AI Studio dashboard
3. Create a `.env.local` file in the project root and add:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Available Features

- **Image Analysis**: Upload product images to generate descriptions
- **Content Types**: Website product descriptions, social media posts, video content
- **Platform Optimization**: Content tailored for Instagram, TikTok, Facebook, or Twitter
- **Tone Selection**: Choose professional, casual, enthusiastic, or formal tones
- **Customization**: Edit, regenerate, and copy content with one click
