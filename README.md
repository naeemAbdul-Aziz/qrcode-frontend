
# QR Code Generator Frontend

This is a responsive single-page frontend application for generating QR codes from URLs. It provides a clean, modern, and user-friendly interface built with Next.js, React, TypeScript, and Tailwind CSS, utilizing ShadCN UI components.

## Key Features

-   **URL to QR Code**: Easily generate QR codes by simply pasting a website URL.
-   **Instant Display**: The generated QR code is displayed instantly on the page.
-   **Download QR Code**: Users can download the generated QR code image.
-   **Responsive Design**: Mobile-first design ensures a great experience on all device sizes.
-   **Modern UI/UX**: Aesthetically pleasing interface with light and dark mode support.
-   **Loading States**: Visual feedback is provided while the QR code is being generated.
-   **Error Handling**: Clear error messages are displayed if issues occur during generation.
-   **SEO Optimized**: Basic SEO enhancements are in place.
-   **Accessible**: Designed with accessibility in mind for a better user experience for everyone.

## Technologies Used

-   **Framework**: [Next.js](https://nextjs.org/) (v15+) with App Router
-   **UI Library**: [React](https://reactjs.org/) (v18+)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
-   **Font**: Inter (loaded via `next/font`)
-   **Linting/Formatting**: Default Next.js setup (ESLint, Prettier if configured)
-   **Package Manager**: npm (or yarn/pnpm)

## API Endpoint Interaction

The frontend interacts with a backend microservice to generate the QR codes.

-   **Endpoint URL**: `https://qrcode-microservice.onrender.com/generate_qr`
-   **Method**: `POST`
-   **Headers**:
    -   `Content-Type`: `application/json`
    -   `Accept`: `application/json`
-   **Request Body**:
    ```json
    {
      "url": "<user_entered_url>"
    }
    ```
-   **Success Response Example**:
    ```json
    {
      "message": "QR code generated successfully",
      "file_url": "/download_qr/qr_code_12345.png"
    }
    ```
-   **QR Image URL Construction**:
    The full URL for the QR code image is constructed by prepending the base API URL to the `file_url` received in the response:
    `https://qrcode-microservice.onrender.com` + `file_url`
    (e.g., `https://qrcode-microservice.onrender.com/download_qr/qr_code_12345.png`)

## Project Structure

A brief overview of the important directories:

```
.
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, global styles)
│   │   ├── globals.css     # Global CSS styles and Tailwind directives
│   │   ├── layout.tsx      # Root layout component
│   │   └── page.tsx        # Main page component
│   ├── components/         # React components
│   │   ├── ui/             # ShadCN UI components
│   │   └── qr-generator-form.tsx # The main form component
│   ├── hooks/              # Custom React hooks (e.g., useToast, useMobile)
│   └── lib/                # Utility functions (e.g., cn for classnames)
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later recommended)
-   [npm](https://www.npmjs.com/) (v8.x or later) or [yarn](https://yarnpkg.com/) (v1.22.x or later)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/<your-username>/<your-repository-name>.git
    cd <your-repository-name>
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

3.  **Run the development server:**
    Using npm:
    ```bash
    npm run dev
    ```
    Or using yarn:
    ```bash
    yarn dev
    ```
    The application will typically be available at `http://localhost:9002` (as per `package.json` script).

### Building for Production

To create a production-ready build:

Using npm:
```bash
npm run build
```
Or using yarn:
```bash
yarn build
```
This will generate an optimized build in the `.next` directory.

To run the production build locally:
Using npm:
```bash
npm run start
```
Or using yarn:
```bash
yarn start
```

## Deployment

This Next.js application is ready to be deployed to any static hosting provider or platforms that support Next.js applications, such as:

-   [Vercel](https://vercel.com/) (Recommended for Next.js apps)
-   [Netlify](https://www.netlify.com/)
-   [Firebase Hosting](https://firebase.google.com/docs/hosting)
-   GitHub Pages (with some configuration for Next.js routing)

Ensure your build command is set to `npm run build` (or `yarn build`) and the output directory is `.next` (or as configured by your hosting provider for Next.js).

## SEO & Accessibility

-   **SEO**:
    -   Dynamic page titles using `metadata.title.template`.
    -   Relevant keywords included in metadata.
    -   OpenGraph metadata for social sharing.
    -   Theme color for mobile browser integration.
-   **Accessibility**:
    -   Semantic HTML elements are used where appropriate.
    -   ARIA attributes (`aria-live`, `aria-atomic`, `aria-label`, `aria-describedby`, `aria-invalid`) are implemented in the form and QR display area to assist screen reader users.
    -   Focus indicators and keyboard navigation are supported by default with ShadCN UI and native HTML elements.

## Contributing

Contributions are welcome! If you have suggestions or find a bug, please open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is open source. (You can add a specific license like MIT if you wish).

---

This README provides a detailed overview of your QR Code Generator frontend. You can now confidently push this to GitHub!
