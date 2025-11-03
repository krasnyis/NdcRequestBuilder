# NDC Request Builder

A modern Electron application for building and testing NDC (New Distribution Capability) requests.

## Features

- **Intuitive Interface**: Clean, modern UI for building NDC requests
- **Request Templates**: Pre-built templates for common NDC request types:
  - Air Shopping
  - Flight Price
  - Seat Availability
  - Order Create
  - Order Retrieve
- **JSON Validation**: Built-in JSON formatting and validation
- **Real-time Response**: View responses immediately after sending requests
- **Cross-platform**: Works on Windows, macOS, and Linux

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd NdcRequestBuilder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

To build the application for your platform:

```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run build-win    # Windows
npm run build-mac    # macOS
npm run build-linux  # Linux
```

## Project Structure

```
src/
├── main.js           # Main Electron process
├── preload.js        # Preload script for secure IPC
└── renderer/         # Renderer process (UI)
    ├── index.html    # Main HTML file
    ├── styles.css    # Application styles
    └── renderer.js   # Frontend JavaScript

assets/               # Application assets (icons, etc.)
```

## Usage

1. **Select Request Type**: Choose from the sidebar which type of NDC request you want to build
2. **Edit Request**: Modify the JSON template in the request editor
3. **Validate**: Use the "Validate" button to check JSON syntax
4. **Format**: Use the "Format JSON" button to beautify your JSON
5. **Send Request**: Click "Send Request" to process your NDC request
6. **View Response**: Check the response in the right panel

## Development

### Available Scripts

- `npm start` - Start the application in production mode
- `npm run dev` - Start the application in development mode with DevTools
- `npm run build` - Build the application for distribution
- `npm run pack` - Package the application without creating installers

### Architecture

This application follows Electron's security best practices:

- **Context Isolation**: Enabled for security
- **Node Integration**: Disabled in renderer
- **Preload Script**: Used for secure IPC communication
- **CSP**: Content Security Policy implemented

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the GitHub repository.
NdcRequestBuilder enables simple editing and generation of IATA Ndc requests. It's cross-platform and has a rich UI.