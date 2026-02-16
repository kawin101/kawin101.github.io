'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import GlobalSearch from './GlobalSearch';

export default function PageWrapper({
    children,
    profile,
    projects = [],
    experience = [],
    education = [],
    blogPosts = []
}) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <div className="bg-white text-dark min-vh-100">
            <GlobalSearch
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                data={{ projects, experience, education, blogPosts }}
            />
            <Navbar
                profile={profile}
                onSearchClick={() => setIsSearchOpen(true)}
            />
            <main>
                {children}
            </main>
        </div>
    );
}
