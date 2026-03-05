#!/bin/bash

# UnifyRoute Website Build Script
# This script builds the Hugo website and generates search index

set -e

echo "🔨 Building UnifyRoute Website..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SITE_DIR="."
PUBLIC_DIR="public"

# Step 1: Check Hugo installation
echo -e "${BLUE}Checking Hugo installation...${NC}"
if ! command -v hugo &> /dev/null; then
    echo -e "${YELLOW}Hugo not found. Installing...${NC}"
    # This would need platform-specific installation
    echo "Please install Hugo: https://gohugo.io/installation/"
    exit 1
fi

echo -e "${GREEN}✓ Hugo is available${NC}"

# Step 2: Clean previous build
echo -e "${BLUE}Cleaning previous build...${NC}"
if [ -d "$PUBLIC_DIR" ]; then
    rm -rf "$PUBLIC_DIR"
fi
echo -e "${GREEN}✓ Clean complete${NC}"

# Step 3: Build the site
echo -e "${BLUE}Building Hugo site...${NC}"
hugo --minify --config config.toml --destination "$PUBLIC_DIR"
echo -e "${GREEN}✓ Build complete${NC}"

# Step 4: Generate search index
echo -e "${BLUE}Generating search index...${NC}"

# Create search index from content
python3 << 'PYTHON_SCRIPT'
import os
import json
import re
from pathlib import Path

def extract_frontmatter(content):
    """Extract YAML frontmatter from markdown"""
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            return parts[2].strip()
    return content

def clean_text(text):
    """Clean HTML and extra whitespace"""
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def generate_search_index():
    """Generate search index from content files"""
    documents = []
    doc_id = 0

    content_dir = Path('content')

    for md_file in content_dir.rglob('*.md'):
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                file_content = f.read()

            # Extract content without frontmatter
            body = extract_frontmatter(file_content)

            # Parse title and section from file path
            parts = md_file.relative_to(content_dir).parts
            filename = md_file.stem

            # Determine section
            if len(parts) > 1 and parts[0] == 'docs':
                section = 'Documentation'
                title = filename.replace('-', ' ').title()
            else:
                section = 'Pages'
                title = filename.replace('-', ' ').title()

            # Extract first 200 characters as excerpt
            clean_body = clean_text(body)
            excerpt = clean_body[:200] + ('...' if len(clean_body) > 200 else '')

            # Generate URL
            url_parts = list(parts[:-1]) + [filename.replace('_index', '')]
            url = '/' + '/'.join(url_parts) + ('/' if filename == '_index' else '/')

            documents.append({
                'id': str(doc_id),
                'title': title,
                'content': clean_body[:500],
                'excerpt': excerpt,
                'section': section,
                'url': url
            })
            doc_id += 1

        except Exception as e:
            print(f"Warning: Could not process {md_file}: {e}")

    return documents

documents = generate_search_index()

# Save search index to static directory so Hugo includes it
import os
os.makedirs('static', exist_ok=True)
output_data = {'documents': documents}
with open('static/search-index.json', 'w', encoding='utf-8') as f:
    json.dump(output_data, f, indent=2)

print(f"Generated {len(documents)} search documents")
PYTHON_SCRIPT

echo -e "${GREEN}✓ Search index generated${NC}"

# Step 5: Summary
echo -e "${BLUE}Build Summary:${NC}"
echo -e "Output directory: ${GREEN}$PUBLIC_DIR${NC}"
echo -e "Website is ready for deployment!"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test locally: hugo server -D"
echo "2. Deploy: Copy 'public' directory to your server"
echo "3. Configure web server (nginx, Apache, etc.)"
