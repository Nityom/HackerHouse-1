# HH Goa 2026 Builder ID

A browser-based Builder ID generator for Hacker House Goa 2026. Upload a photo, add your name and role, generate a playful builder title, and export a share-ready `1200 x 1500` PNG.

**Live app:** [hacker-house-1.vercel.app](https://hacker-house-1.vercel.app)

The experience is designed around an illustrated Goan travel-poster aesthetic with a circular portrait, beach and sea scenery, palms, sunset, stickers, stamps, and ticket details.

## Features

- Generates a real `1200 x 1500` PNG entirely in the browser
- Supports JPG, PNG, HEIC, and HEIF photos
- Handles portrait, landscape, and off-center images with cover cropping
- Drag-to-reposition and zoom controls for the uploaded photo
- Editable name, stack/role, and builder title
- Random builder-title generator
- Mobile Web Share flow with the generated PNG attached
- Desktop fallback that downloads the PNG and opens a pre-filled X post
- Includes the required `#FrameInGoa` hashtag in the share caption
- Responsive layout for mobile and desktop
- No login, signup, upload server, or backend required

## How It Works

1. Choose a JPG, PNG, HEIC, or HEIF photo.
2. Drag the preview to reposition the crop and use the zoom slider if needed.
3. Enter a name, stack/role, and builder title.
4. Download the finished card as a PNG or use **Share to X**.

The preview and exported file are drawn by the same HTML canvas renderer, so the downloaded image matches the on-screen result.

## Sharing Behavior

On supported mobile browsers, the Web Share API passes both the generated PNG and the following caption to the native share sheet:

> Goa mode: activated. I just made my HH Goa 2026 Builder ID. See you by the sea. #FrameInGoa

Browsers do not allow websites to attach a local image directly to an X intent URL. When file sharing is unavailable, the app downloads the PNG first and then opens X with the caption pre-filled so the user can attach the downloaded image.

## Privacy and Performance

Photo processing happens locally in the browser. Images are not uploaded to a server or stored remotely.

The HEIC decoder is loaded with a dynamic import only when a HEIC or HEIF image is selected. Regular JPG and PNG users receive the smaller initial application bundle.

## Tech Stack

- React 19
- TypeScript
- Vite
- HTML Canvas API
- Web Share API
- [`heic-to`](https://www.npmjs.com/package/heic-to) for browser-side HEIC conversion
- [`lucide-react`](https://lucide.dev/) for interface icons

## Local Development

### Prerequisites

- Node.js 20 or newer
- npm

### Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Available Scripts

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and create the production bundle
npm run lint     # Run ESLint
npm run preview  # Preview the production bundle locally
```

## Production Build

```bash
npm run build
```

The deployable static files are written to `dist/`. The app can be hosted on any static platform such as Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

HTTPS is recommended in production because native file sharing through the Web Share API requires a secure browser context.

## Project Structure

```text
src/
  App.tsx      Canvas renderer, image processing, form, export, and sharing
  App.css      Responsive poster-inspired interface styles
  main.tsx     React application entry point
```

## Validation

The current implementation has been checked with:

- Production TypeScript and Vite build
- ESLint
- Desktop and mobile browser layouts
- JPG/PNG image upload and circular cover crop
- Canvas dimensions and nonblank pixel output
- Generated PNG blob, filename, and MIME type
- Mobile-width horizontal overflow checks

## Submission Note

The generated card and pre-filled share caption both contain `#FrameInGoa`, as required by the HH Goa 2026 shortlisting task.
