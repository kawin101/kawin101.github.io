'use client';
import { useEffect } from 'react';

export default function AdminPage() {
    useEffect(() => {
        // Include the script that builds the page and powers Decap CMS
        const script = document.createElement('script');
        script.src = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";
        script.async = true;
        document.body.appendChild(script);

        // Netlify Identity
        const scriptIdentity = document.createElement('script');
        scriptIdentity.src = "https://identity.netlify.com/v1/netlify-identity-widget.js";
        scriptIdentity.async = true;
        document.body.appendChild(scriptIdentity);

        return () => {
            // Cleanup if needed, though CMS usually takes over body
            document.body.removeChild(script);
            document.body.removeChild(scriptIdentity);
        }
    }, []);

    return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Loading Content Manager...</p>
        </div>
    );
}
