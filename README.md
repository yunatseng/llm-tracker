# LLM Tracker

A Vue.js application for tracking the latest LLM models using a timeline interface with filtering capabilities.

## 🌐 Live Demo

Visit the live application: [https://your-username.github.io/llm-tracker](https://your-username.github.io/llm-tracker)

## ✨ Features

- 📊 **Timeline Visualization**: Interactive timeline displaying model release history
- 🔍 **Smart Filtering**: Filter by architecture type, search by name, and multiple sorting options
- 🔄 **Automated Updates**: Daily automated data fetching from OpenRouter APIs via GitHub Actions
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **High Performance**: Built with Vue 3 Composition API and Vite
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS and Inter font

## 🚀 Supported Model Architectures

- **GPT Series**: OpenAI GPT model family
- **Claude Series**: Anthropic Claude model family
- **Gemini Series**: Google Gemini model family

## 🛠️ Tech Stack

- **Frontend**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Fonts**: Inter (Google Fonts)
- **Deployment**: GitHub Pages
- **Automation**: GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm

### Development Setup

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/llm-tracker.git
cd llm-tracker
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Start development server

```bash
npm run dev
```

#### 4. Build for production

```bash
npm run build
```

#### 5. Preview production build

```bash
npm run preview
```

## 🚀 GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Initial Setup

1. **Fork or create the repository** on GitHub

2. **Enable GitHub Pages**:

   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages`
   - Folder: `/ (root)`

3. **Configure repository secrets** (if needed):
   - The current setup doesn't require API keys
   - Data is fetched server-side via GitHub Actions

### Automatic Deployment

The project includes a GitHub Actions workflow that:

- **Runs daily at 8:00 UTC** to fetch fresh model data
- **Can be triggered manually** from the Actions tab
- **Automatically deploys** to GitHub Pages after data updates

To trigger a manual update:

1. Go to your repository on GitHub
2. Click the "Actions" tab
3. Select "Update LLM Models Data"
4. Click "Run workflow"

### Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Deploy to GitHub Pages (requires gh-pages package)
npm install -g gh-pages
gh-pages -d dist
```

## 📁 Project Structure

```text
src/
├── components/
│   ├── FilterPanel.vue    # Filter panel component
│   ├── Timeline.vue       # Timeline display component
│   ├── ModelCard.vue      # Model card component
│   ├── Alert.vue          # Alert notification component
│   └── LoadingSpinner.vue # Loading spinner component
├── App.vue               # Main application component
├── main.js              # Application entry point
└── style.css            # Global styles with Tailwind CSS
```

## 🧩 Component Overview

### App.vue

Main application component responsible for:

- Data fetching from static JSON file
- State management and filtering logic
- Child component coordination
- Error handling and loading states

### FilterPanel.vue

Filter control panel providing:

- Architecture type filtering (GPT, Claude, Gemini)
- Keyword search functionality
- Sorting options (name, date, price)
- Filter reset capability

### Timeline.vue

Timeline display component supporting:

- Date-grouped model visualization
- Statistics and model count display
- Multiple sorting modes
- Responsive timeline layout

### ModelCard.vue

Model information card displaying:

- Model basic information and metadata
- Pricing information (input/output tokens)
- Technical specifications
- Context length and other details

### Alert.vue

Notification component for:

- Error messages
- Warning notifications
- Success confirmations
- Dismissible alerts

### LoadingSpinner.vue

Loading state component providing:

- Animated loading indicators
- Loading text display
- Consistent loading UX

## 🔧 Development Guide

### Adding New Model Architectures

1. Update `scripts/fetch-models.js` to include new API endpoints
2. Add new architecture options in `FilterPanel.vue`
3. Configure color schemes in `Timeline.vue`'s `getArchitectureColor` function
4. Update documentation

### Customizing Styles

The project uses Tailwind CSS for styling. Customize the theme in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        // Add custom colors
      },
    },
  },
};
```

### Data Structure

The application expects model data in the following format:

```json
{
  "models": [
    {
      "id": "model-id",
      "name": "Model Name",
      "architecture": "GPT|Claude|Gemini",
      "created": "2025-05-30T00:00:00Z",
      "context_length": 128000,
      "pricing": {
        "prompt": "0.000001",
        "completion": "0.000002"
      }
    }
  ],
  "lastUpdated": "2025-05-30T12:00:00Z"
}
```

## 🌐 Browser Support

- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for providing the model APIs
- [Vue.js](https://vuejs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the fast build tool
