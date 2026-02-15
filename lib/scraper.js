// Helper to fetch and parse website content from the client-side
// Uses multiple CORS proxies to ensure reliability

async function fetchWithProxy(url, proxyType) {
    let proxyUrl = '';

    // Normalize URL
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http')) {
        targetUrl = 'https://' + targetUrl;
    }

    switch (proxyType) {
        case 'allorigins':
            proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
            break;
        case 'corsproxy':
            proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
            break;
        default:
            return null;
    }

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('Network response was not ok');

        if (proxyType === 'allorigins') {
            const data = await response.json();
            return data.contents;
        } else {
            return await response.text();
        }
    } catch (e) {
        console.warn(`Proxy ${proxyType} failed:`, e);
        return null;
    }
}

export async function fetchUrlContent(url) {
    // Try multiple proxies in sequence
    const content = await fetchWithProxy(url, 'allorigins');
    if (content) return content;

    const content2 = await fetchWithProxy(url, 'corsproxy');
    if (content2) return content2;

    throw new Error(`Failed to fetch content from ${url} (all proxies failed)`);
}

export function extractTextFromHtml(html) {
    if (!html) return '';

    // Create a temporary DOM element to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove scripts, styles, and other non-content elements
    const scripts = doc.querySelectorAll('script, style, iframe, nosecript, svg, header, footer, nav, button, input');
    scripts.forEach(script => script.remove());

    // Extract text content
    let text = doc.body.textContent || "";

    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();

    return text;
}
