.PHONY: help install serve build clean deploy

help:
	@echo "UnifyRoute Website - Available Commands"
	@echo ""
	@echo "  make install     Install dependencies"
	@echo "  make serve       Start development server"
	@echo "  make build       Build production website"
	@echo "  make clean       Clean build artifacts"
	@echo "  make deploy      Deploy to production"
	@echo "  make validate    Validate website"
	@echo ""

install:
	@echo "Checking dependencies..."
	@which hugo > /dev/null || (echo "Hugo is required. Install from: https://gohugo.io/installation/" && exit 1)
	@echo "✓ Hugo is installed"
	@echo ""
	@echo "Setting up..."
	@chmod +x build.sh
	@echo "✓ Ready to build"

serve:
	@echo "Starting development server..."
	@echo "Website available at: http://localhost:1313"
	hugo server -D --watch

build: clean
	@echo "Building website..."
	./build.sh
	@echo ""
	@echo "✓ Build complete!"
	@echo "Output: ./public"

clean:
	@echo "Cleaning build artifacts..."
	rm -rf public/
	rm -rf resources/
	@echo "✓ Clean complete"

deploy: build
	@echo "Deploying website..."
	@echo "Note: Configure your deployment method in deploy script"
	@echo ""
	@echo "Deployment files ready in ./public/"
	@echo ""
	@echo "Option 1: GitHub Pages"
	@echo "  git add public/"
	@echo "  git commit -m 'Deploy website'"
	@echo "  git push origin gh-pages"
	@echo ""
	@echo "Option 2: Custom Server (scp)"
	@echo "  scp -r public/* user@server:/var/www/unifyroute"
	@echo ""
	@echo "Option 3: Docker"
	@echo "  docker build -t unifyroute-website ."
	@echo "  docker run -p 80:80 unifyroute-website"

validate:
	@echo "Validating Hugo configuration..."
	hugo config
	@echo "✓ Configuration is valid"
	@echo ""
	@echo "Building test version..."
	hugo --destination /tmp/test-build-$$
	@echo "✓ Build validation passed"

stats:
	@echo "Website Statistics:"
	@echo "Pages: $$(find content -name '*.md' | wc -l)"
	@echo "Size: $$(du -sh . | cut -f1)"
	@echo "Build size: $$([ -d public ] && du -sh public | cut -f1 || echo 'Not built')"

watch:
	@echo "Watching for changes..."
	watchmedo shell-command \
		--patterns="*.md;*.html;*.css;*.js" \
		--recursive \
		--command='echo "Changed: {path}" && $(MAKE) clean build' \
		.

.DEFAULT_GOAL := help
