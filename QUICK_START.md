# UnifyRoute Website - Quick Start Guide

## ✅ What's Been Built

Your UnifyRoute website is now complete! Here's what you have:

### 🎨 Design & Features
- **Professional Landing Page** with hero section, features, use cases, and CTAs
- **Dark/Light Mode** with system preference detection and manual toggle
- **Responsive Design** that works perfectly on mobile, tablet, and desktop
- **Full-Text Search** powered by Lunr.js
- **Custom Theme** with your brand colors (#4d4d4d primary, #f25221 accent)

### 📄 Content Included
- **8 Comprehensive Documentation Pages**:
  - Getting Started (installation, prerequisites, setup)
  - Architecture (system design, components, data flow)
  - API Reference (endpoints, parameters, error handling)
  - CLI Reference (all commands and options)
  - Configuration Guide (environment variables, YAML config)
  - Deployment Guide (Docker, Kubernetes, manual setup)
  - Troubleshooting (common issues and solutions)
  - Features Overview

- **Features Page** with detailed feature descriptions
- **Interactive Homepage** with live quickstart code examples

### 🖥️ Technology
- **Hugo Static Site Generator** - Fast, secure, and efficient
- **Custom Theme** - Fully open, extensible, and optimized
- **Lunr.js Search** - Client-side full-text search
- **CSS Variables** - Easy theme customization
- **Responsive Grid System** - Mobile-first design

## 🚀 Getting Started

### Option 1: View Locally with Hugo

1. **Install Hugo** (if not installed):
   ```bash
   # macOS
   brew install hugo

   # Linux (Ubuntu/Debian)
   sudo apt-get install hugo

   # Windows (Chocolatey)
   choco install hugo
   ```

2. **Start local server**:
   ```bash
   cd UnifyRouteWeb
   make serve
   # or: hugo server -D
   ```

3. **Open in browser**:
   Visit `http://localhost:1313`

4. **Make changes** - They'll auto-reload!

### Option 2: Build for Production

```bash
cd UnifyRouteWeb

# Option A: Use the build script
./build.sh

# Option B: Use Make
make build

# Option C: Use Hugo directly
hugo --minify
```

Output will be in the `public/` directory

### Option 3: Deploy with Docker

```bash
cd UnifyRouteWeb

# Build Docker image
docker build -t unifyroute-website .

# Run container
docker run -p 80:80 unifyroute-website

# Or use docker-compose
docker-compose up -d
```

Website will be at `http://localhost`

## 📁 Project Structure

```
UnifyRouteWeb/
├── config.toml                    # Hugo configuration
├── content/                       # All content
│   ├── _index.md                 # Homepage
│   ├── features.md               # Features page
│   └── docs/                     # Full documentation
├── themes/unifyroute/            # Custom theme
│   ├── layouts/                  # HTML templates
│   ├── assets/                   # CSS and JS
│   └── static/                   # Static files
├── static/images/                # Your logos
├── public/                        # Build output (generated)
├── build.sh                       # Build script
├── Makefile                       # Make commands
├── Dockerfile                     # Docker build
├── docker-compose.yml             # Docker compose config
├── nginx.conf                     # Nginx config
├── default.conf                   # Nginx site config
└── README.md                      # Full documentation
```

## 🎨 Customizing the Website

### Change Colors

Edit `themes/unifyroute/assets/css/style.css`:

```css
:root {
  --primary-color: #4d4d4d;      /* Your primary color */
  --accent-color: #f25221;        /* Your accent color */
  /* ... */
}
```

### Update Logo

Replace images in `static/images/`:
- `logo.png` - Header logo
- `favicon.png` - Browser favicon
- `logo-space.png` - Homepage hero image

### Edit Navigation

Edit `config.toml`:

```toml
[[menu.main]]
  name = "Features"
  url = "/features/"
  weight = 1
```

### Add Documentation

Create `.md` files in `content/docs/`:

```markdown
---
title: "My Page Title"
weight: 9
---

Your content here...
```

### Custom CSS

Add to `themes/unifyroute/assets/css/` (or inline in templates):

```css
.my-custom-class {
  color: var(--accent-color);
}
```

## 🌐 Deployment Options

### Option 1: GitHub Pages

```bash
# Build the site
make build

# Commit and push
git add public/
git commit -m "Deploy website"
git push origin main

# Configure GitHub Pages to use '/public' folder
# (In repository Settings > Pages)
```

### Option 2: Netlify

```bash
# Connect repository to Netlify
# Configure build command: hugo --minify
# Configure publish directory: public/
# Deploy!
```

### Option 3: Vercel

```bash
# Connect repository to Vercel
# Configure build command: hugo --minify
# Configure output directory: public/
# Deploy!
```

### Option 4: Traditional Server (Nginx)

```bash
# Build locally
make build

# Upload to server
scp -r public/* user@server:/var/www/unifyroute/

# Configure nginx (use provided nginx.conf and default.conf)
# Restart nginx
sudo systemctl restart nginx
```

### Option 5: Docker

```bash
# Build Docker image
docker build -t unifyroute-website .

# Push to Docker Hub or registry
docker push unifyroute-website:latest

# Deploy on any platform with Docker support
docker run -p 80:80 unifyroute-website
```

## 📊 Features You Have

✅ **Responsive Design** - Works on all devices
✅ **Dark/Light Mode** - Automatic + manual toggle
✅ **Full-Text Search** - Powered by Lunr.js
✅ **SEO Ready** - Meta tags, sitemap, robots.txt
✅ **Performance** - Minified assets, optimized images
✅ **Security** - Security headers, HTTPS ready
✅ **Documentation** - 8 comprehensive guides
✅ **GitHub Ready** - .gitignore, build scripts included
✅ **Docker Ready** - Dockerfile + docker-compose.yml
✅ **Fast** - Pure HTML, no backend processing

## 🛠️ Make Commands

```bash
make help              # Show all commands
make install           # Check dependencies
make serve             # Start dev server
make build             # Build for production
make clean             # Remove build artifacts
make deploy            # Build and show deployment options
make validate          # Validate configuration
make stats             # Show website statistics
```

## 🔧 Tips & Tricks

### Hot Reload During Development
```bash
hugo server --navigateToChanged
```

### Build with Analytics
```bash
hugo --config config.toml,config.analytics.toml
```

### Check Website Size
```bash
du -sh public/
# Usually 2-5MB for a full website
```

### Generate Sitemap
```bash
# Already generated automatically
# Check: public/sitemap.xml
```

### View Build Performance
```bash
hugo --renderToMemory
```

## 📚 Resources

- **Hugo Docs**: [gohugo.io](https://gohugo.io)
- **Markdown Guide**: [markdownguide.org](https://www.markdownguide.org)
- **UnifyRoute Project**: [github.com/unifyroute/UnifyRoute](https://github.com/unifyroute/UnifyRoute)

## 🐛 Troubleshooting

### "Hugo not found"
Install Hugo: https://gohugo.io/installation/

### "Port 1313 already in use"
```bash
hugo server -D --port 1314
```

### "Changes not showing"
```bash
# Clear cache and rebuild
make clean
make serve
```

### "Search not working"
- Ensure you've run `make build` at least once
- Check browser console for JavaScript errors
- Refresh the page

## ✨ Next Steps

1. **Test locally**: `make serve`
2. **Customize**: Update colors, logos, content
3. **Deploy**: Choose your deployment platform
4. **Monitor**: Check analytics and performance
5. **Update content**: Keep documentation fresh

## 📞 Support

- **Questions?** Check the full README.md
- **Issues?** Check troubleshooting section
- **Contribute?** Submit PRs to improve the site

---

**🎉 Your UnifyRoute website is ready! Start with `make serve` to see it in action.**

Built with ❤️ for UnifyRoute - Smart LLM Routing.
