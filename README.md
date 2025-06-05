# ME - CYNOOPS

A simple digital registration card web app for rescue dog teams. The app allows managing handler profiles and dog information and can generate QR codes or printable views of the registration card.

## Technologies & Tools

- **StencilJS** (v4) with **TypeScript** for the web components
- **Stencil Router** for client side routing
- **Stencil Store** for application state management
- **Firebase Hosting** for deployment
- **GitHub Actions** for automatic builds and preview deployments
- **Prettier** and **EditorConfig** for consistent code style

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd me
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Launch the development server**
   ```bash
   npm start
   ```
   The app will be available at [http://localhost:3333](http://localhost:3333).

4. **Build for production** (optional)
   ```bash
   npm run build
   ```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository and create a feature branch from `main`.
2. Make your changes and ensure the project builds (`npm run build`).
3. Open a pull request describing your changes.

Please follow the existing code style (Prettier configuration) and keep PRs focused.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
