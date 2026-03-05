# Deployment Guide

This website is deployed using GitHub Pages with automatic CI/CD via GitHub Actions.

## Quick Start

### 1. Push to GitHub

```bash
git add .
git commit -m "Website updates"
git push origin main
```

The GitHub Actions workflow will automatically:
- Build the site with Hugo
- Deploy to GitHub Pages
- Point to your custom domain

### 2. Configure GitHub Pages

1. Go to **Repository Settings > Pages**
2. Under "Build and deployment":
   - **Source**: GitHub Actions
   - The workflow will handle everything automatically
3. Your site will be live at the domain specified in `.github/workflows/deploy.yml`

### 3. Set Up Custom Domain

**If deploying to `unifyroute.com`:**

Most DNS providers allow **multiple A records** for the same domain. Add all 4 GitHub Pages IPs:

**Add these 4 A Records:**
```
A Record: 185.199.108.153
A Record: 185.199.109.153
A Record: 185.199.110.153
A Record: 185.199.111.153
```

**How to Add Multiple A Records (by provider):**

**GoDaddy:**
1. Domain Settings > Manage DNS
2. Click "Add" multiple times
3. Type: A, Name: @, Value: [IP]
4. Save

**Namecheap:**
1. Manage > Advanced DNS
2. "Add New Record" (repeat 4x)
3. Type: A, Host: @, Value: [IP]

**Route53 (AWS):**
1. Create A Record
2. Name: unifyroute.com
3. Click "Add another value"
4. Enter all 4 IPs in same record

**CloudFlare:**
1. DNS tab > Add Record
2. Type: A, Name: @
3. Value: [IP]
4. TTL: Auto
5. Repeat for each IP

**Alternative: Use CNAME (if you can't add multiple A records):**
```
CNAME: unifyroute.com points to unifyroute.github.io
```

GitHub Pages will auto-validate and enable HTTPS

### 4. Verify Deployment

- Check **GitHub Actions** tab for build logs
- Visit `https://unifyroute.com` to access the live site
- Monitor deployments in the Actions tab

## Local Testing

Before pushing to main:

```bash
# Start dev server
make serve

# Or use Hugo directly
hugo server -D

# Visit http://localhost:1313
```

## File Structure

```
UnifyRouteWeb/
├── .github/workflows/
│   └── deploy.yml           # Auto-deployment config
├── config.toml              # Hugo config
├── content/                 # All markdown content
├── themes/unifyroute/       # Custom theme
├── public/                  # Build output (generated)
├── Makefile                 # Build commands
└── DEPLOYMENT.md            # This file
```

## Updating Content

1. Edit files in `content/` or `themes/`
2. Test locally with `make serve`
3. Push to main branch
4. Site auto-deploys in ~2 minutes

## Troubleshooting

### Build Failed
Check **GitHub Actions > Failed Run** for error details. Common issues:
- Hugo syntax errors in templates
- Missing front matter in markdown files
- Image paths incorrect

### Site Not Updating
1. Check Actions tab - is the latest push deployed?
2. Clear browser cache (Ctrl+Shift+Delete)
3. Wait 2-3 minutes for DNS propagation

### Domain Not Working
1. Verify DNS records are correct
2. Check GitHub Pages settings - is custom domain set?
3. HTTPS might take 24 hours to provision

## Manual Build

If you need to build locally:

```bash
# Production build
make build

# Or directly
hugo --minify
```

Output will be in `public/` directory.

## Integration with Main UnifyRoute Project

1. Link from main repo README:
   ```markdown
   🌐 [Website](https://unifyroute.com) | 📖 [Docs](https://unifyroute.com/docs)
   ```

2. Keep this repo focused on website content only

3. Link to main project from website footer (already configured)

## Support

- For website issues: GitHub Issues in this repo
- For deployment help: Check GitHub Actions logs
- For content updates: Submit PRs to this repository
