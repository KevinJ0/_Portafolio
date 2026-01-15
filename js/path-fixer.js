// Detects if we're on GitHub Pages and fixes image paths dynamically
(function () {
    const basePath = getBasePath();
    window.__ASSET_BASE_PATH = basePath;

    if (basePath !== './') {
        // We're on GitHub Pages, fix all paths immediately
        fixAllPaths(basePath);
    }

    // Also run on DOMContentLoaded to catch any dynamically created elements
    document.addEventListener('DOMContentLoaded', function () {
        if (basePath !== './') {
            fixAllPaths(basePath);
        }
    });

    // Watch for dynamically added images
    observeMutations(basePath);
})();

function getBasePath() {
    // If we're on GitHub Pages, the URL will contain the repo name
    const pathname = window.location.pathname;

    // Check if we're on GitHub Pages (kevinj0.github.io)
    if (window.location.hostname === 'kevinj0.github.io') {
        // Extract the repo name from pathname
        // pathname will be: /_Portafolio/ or /_Portafolio/index.html
        const match = pathname.match(/^\/([^/]+)(\/|$)/);
        if (match) {
            return '/' + match[1] + '/';
        }
    }

    // Default to relative path for local development
    return './';
}

function fixAllPaths(basePath) {
    fixImagePaths(basePath);
    fixLinkPaths(basePath);
    fixScriptPaths(basePath);
    fixCSSPaths(basePath);
}

function fixImagePaths(basePath) {
    // Fix img tags
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.startsWith('dist/')) {
            img.setAttribute('src', basePath + src);
        }
    });

    // Fix favicon
    const favicon = document.querySelector('link[rel="shortcut icon"]');
    if (favicon) {
        const href = favicon.getAttribute('href');
        if (href && href.startsWith('dist/')) {
            favicon.setAttribute('href', basePath + href);
        }
    }
}

function fixLinkPaths(basePath) {
    // Fix link tags (CSS)
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('dist/')) {
            link.setAttribute('href', basePath + href);
        }
    });
}

function fixScriptPaths(basePath) {
    // Fix script tags
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src && src.startsWith('dist/')) {
            script.setAttribute('src', basePath + src);
        }
    });
}

function fixCSSPaths(basePath) {
    // Fix CSS background images and font-face URLs
    // We need to update all stylesheet rules that contain dist/ paths
    try {
        for (let i = 0; i < document.styleSheets.length; i++) {
            try {
                const sheet = document.styleSheets[i];
                const rules = sheet.cssRules || sheet.rules;

                if (!rules) continue;

                for (let j = 0; j < rules.length; j++) {
                    const rule = rules[j];

                    // Handle regular rules with style declarations
                    if (rule.style) {
                        const bgImage = rule.style.backgroundImage;
                        if (bgImage && bgImage.includes('dist/')) {
                            const newBgImage = bgImage.replace(/url\(['"]?(?!(?:https?:|\/))dist\//g, 'url("' + basePath + 'dist/');
                            rule.style.backgroundImage = newBgImage;
                        }

                        // Handle background property
                        const background = rule.style.background;
                        if (background && background.includes('dist/')) {
                            const newBackground = background.replace(/url\(['"]?(?!(?:https?:|\/))dist\//g, 'url("' + basePath + 'dist/');
                            rule.style.background = newBackground;
                        }
                    }

                    // Handle @font-face rules
                    if (rule.type === 5) { // CSSFontFaceRule
                        if (rule.style && rule.style.src && rule.style.src.includes('dist/')) {
                            const newSrc = rule.style.src.replace(/url\(['"]?(?!(?:https?:|\/))dist\//g, 'url("' + basePath + 'dist/');
                            rule.style.src = newSrc;
                        }
                    }
                }
            } catch (e) {
                // Cross-origin stylesheets will throw, skip them
                console.debug('Could not access stylesheet:', e.message);
            }
        }
    } catch (e) {
        console.debug('Error fixing CSS paths:', e.message);
    }
}

function observeMutations(basePath) {
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // Check for added nodes
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeType === 1) { // Element node
                    // Fix the added element and its children
                    if (node.tagName === 'IMG') {
                        const src = node.getAttribute('src');
                        if (src && src.startsWith('dist/')) {
                            node.setAttribute('src', basePath + src);
                        }
                    } else if (node.tagName === 'LINK') {
                        const href = node.getAttribute('href');
                        if (href && href.startsWith('dist/')) {
                            node.setAttribute('href', basePath + href);
                        }
                    } else if (node.tagName === 'SCRIPT') {
                        const src = node.getAttribute('src');
                        if (src && src.startsWith('dist/')) {
                            node.setAttribute('src', basePath + src);
                        }
                    }

                    // Also check children
                    const imgs = node.querySelectorAll('img');
                    imgs.forEach(img => {
                        const src = img.getAttribute('src');
                        if (src && src.startsWith('dist/')) {
                            img.setAttribute('src', basePath + src);
                        }
                    });
                }
            });
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}