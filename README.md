# UnifyRoute Website

This is the official website and documentation for [UnifyRoute](https://github.com/unifyroute/UnifyRoute), an open-source, self-hosted gateway for routing requests across multiple LLM providers.

## Overview

The website includes:
- **Landing Page** - Homepage with features, quickstart, and use cases
- **Documentation** - Comprehensive guides including:
  - Getting Started
  - Architecture & Design
  - API Reference
  - CLI Commands
  - Configuration Guide
  - Deployment Instructions
  - Troubleshooting
- **Features Page** - Detailed feature descriptions
- **Dark/Light Mode** - Full theme support with system preference detection
- **Full-Text Search** - Lunr.js powered search across all content

## Building the Website

### Prerequisites

- Hugo 0.100+ (extended version recommended)
  - [Install Hugo](https://gohugo.io/installation/)
- Python 3.7+ (for search index generation)
- Node.js 14+ (optional, for CSS/JS preprocessing)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/unifyroute/UnifyRoute.git
   cd UnifyRoute/website  # or UnifyRouteWeb
   ```

2. **Start development server**
   ```bash
   hugo server -D
   # Website will be available at http://localhost:1313
   ```

3. **View in browser**
   - Open [http://localhost:1313](http://localhost:1313)
   - Changes are live-reloaded

### Production Build

1. **Run build script**
   ```bash
   chmod +x build.sh
   ./build.sh
   ```

   Or use Hugo directly:
   ```bash
   hugo --minify
   ```

2. **Output**
   - Generated files are in the `public/` directory
   - Ready for deployment

## Project Structure

```
.
├── config.toml              # Hugo configuration
├── content/                 # Content files
│   ├── _index.md           # Homepage
│   ├── features.md         # Features page
│   └── docs/               # Documentation
│       ├── _index.md       # Docs homepage
│       ├── getting-started.md
│       ├── architecture.md
│       ├── api-reference.md
│       ├── cli.md
│       ├── configuration.md
│       ├── deployment.md
│       └── troubleshooting.md
├── themes/
│   └── unifyroute/         # Custom theme
│       ├── layouts/        # Template files
│       ├── assets/         # CSS and JavaScript
│       └── static/         # Static assets
├── static/
│   └── images/             # Logos and images
├── build.sh               # Build script
└── README.md              # This file
```

## Customization

### Colors & Branding

Edit theme color variables in `themes/unifyroute/assets/css/style.css`:

```css
:root {
  --primary-color: #4d4d4d;      /* Dark gray */
  --accent-color: #f25221;        /* Orange */
  /* ... other variables ... */
}
```

### Navigation

Edit menu items in `config.toml`:

```toml
[[menu.main]]
  name = "Features"
  url = "/features/"
  weight = 1
```

### Logos

Place logos in `static/images/`:
- `logo.png` - Header logo
- `favicon.png` - Favicon
- `logo-space.png` - Homepage hero image

### Content

Edit markdown files in `content/` directory. Hugo supports:
- Markdown with front matter
- YAML configuration
- Custom shortcodes

## Deployment

### To Static Hosting (GitHub Pages, Netlify, Vercel)

1. Build the site:
   ```bash
   ./build.sh
   ```

2. Deploy `public/` folder to your hosting platform

3. Configure DNS and HTTPS

### To Custom Server

#### Using Nginx

```nginx
server {
    listen 80;
    server_name unifyroute.example.com;

    root /var/www/unifyroute;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Using Apache

```apache
<VirtualHost *:80>
    ServerName unifyroute.example.com
    DocumentRoot /var/www/unifyroute

    <Directory /var/www/unifyroute>
        Options -MultiViews
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.html [QSA,L]
    </Directory>
</VirtualHost>
```

### Enable HTTPS

```bash
# Using Let's Encrypt with Certbot
sudo certbot certonly --webroot -w /var/www/unifyroute -d unifyroute.example.com
```

## Dark/Light Mode

The website automatically:
1. Detects system preference (`prefers-color-scheme`)
2. Loads saved user preference from localStorage
3. Provides a manual toggle button

JavaScript code in `themes/unifyroute/assets/js/theme.js` manages theme switching.

## Search Functionality

Search is powered by Lunr.js:
- Searches across all page titles and content
- Fuzzy matching support
- Results updated as user types
- Search data built during site generation

Search index is auto-generated in `public/search-index.json`

## Performance Optimization

The site is optimized for speed:
- Static HTML output (no server-side processing)
- Minified CSS and JavaScript
- Image optimization
- Lazy loading support
- CDN-friendly structure

Lighthouse scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## Analytics (Optional)

To add analytics:

1. Add to `config.toml`:
   ```toml
   [params]
     googleAnalytics = "G-XXXXXXXXXX"
   ```

2. Analytics code will be automatically included in production builds

## Troubleshooting

### Hugo not found
```bash
# Install Hugo
brew install hugo           # macOS
choco install hugo          # Windows
apt-get install hugo        # Linux
```

### Build errors
```bash
# Check Hugo version
hugo version
# Should be 0.100+

# Validate config
hugo config
```

### Theme not loading
```bash
# Check theme path
ls -la themes/unifyroute

# Reinstall theme
rm -rf themes/unifyroute
git clone <theme-repo> themes/unifyroute
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

This website is part of the UnifyRoute project and is licensed under the Apache License 2.0.

See [LICENSE](LICENSE) for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/unifyroute/UnifyRoute/issues)
- **Discussions**: [GitHub Discussions](https://github.com/unifyroute/UnifyRoute/discussions)
- **Email**: support@unifyroute.io

## More Information

- **Main Project**: [UnifyRoute GitHub](https://github.com/unifyroute/UnifyRoute)
- **Documentation**: Available on the website
- **Community**: Join our Discord (link on website)

---

Built with ❤️ for the community. [UnifyRoute](https://github.com/unifyroute/UnifyRoute) - Smart LLM Routing.
