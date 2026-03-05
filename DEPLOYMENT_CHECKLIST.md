# Deployment Checklist

Complete these steps to deploy your UnifyRoute website:

## ✅ Pre-Deployment

- [ ] Website content is finalized
- [ ] All images are in place
- [ ] Links are working correctly
- [ ] Tested locally with `make serve`
- [ ] Built successfully with `make build`

## ✅ GitHub Setup

- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
- [ ] `.github/workflows/deploy.yml` is in place
- [ ] No build errors in Actions tab

## ✅ GitHub Pages Configuration

- [ ] Go to Settings > Pages
- [ ] Verify source is set to "GitHub Actions"
- [ ] Custom domain field is filled (if using custom domain)
- [ ] Check that `CNAME` file exists after first deploy

## ✅ DNS Configuration (if using custom domain)

- [ ] Add A records pointing to GitHub Pages IPs:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153
- [ ] Or add CNAME record if using subdomain
- [ ] Wait 24-48 hours for DNS propagation
- [ ] Verify DNS with `nslookup unifyroute.com`

## ✅ HTTPS & SSL

- [ ] GitHub Pages auto-provisions HTTPS
- [ ] Check "Enforce HTTPS" in GitHub Pages settings
- [ ] Wait up to 24 hours for certificate provisioning
- [ ] Verify `https://unifyroute.com` works

## ✅ Post-Deployment Testing

- [ ] Website loads at custom domain
- [ ] All pages are accessible
- [ ] Dark/Light mode toggle works
- [ ] Search functionality works
- [ ] Mobile responsive design verified
- [ ] All external links work (GitHub, Discord, etc.)

## ✅ Integration with Main Project

- [ ] Link added to UnifyRoute main repo README
- [ ] Footer links point to correct repositories
- [ ] Social media links are updated
- [ ] Documentation links are working

## ✅ Ongoing Maintenance

- [ ] Set up GitHub notifications for Actions
- [ ] Monitor deployment status on each push
- [ ] Keep content updated in `content/` folder
- [ ] Review analytics monthly (if set up)
- [ ] Maintain security patches for dependencies

---

## Quick Command Reference

```bash
# Local testing
make serve          # Start dev server
make build          # Production build
make clean          # Clean build artifacts

# Git operations
git add .
git commit -m "Your message"
git push origin main   # Triggers auto-deployment
```

## Support Resources

- Hugo Docs: https://gohugo.io/documentation/
- GitHub Pages: https://pages.github.com/
- GitHub Actions: https://github.com/features/actions
- Troubleshooting: See DEPLOYMENT.md
