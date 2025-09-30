function initDarkMode() {
    const themeToggle = document.createElement('button');
    themeToggle.classList.add('theme-toggle');
    
    // Create SVG icons for both themes
    const sunIcon = `<svg viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zm10-8a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zM6 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zm13.071-6.071a1 1 0 0 1-1.414 0l-1.414-1.414a1 1 0 0 1 1.414-1.414l1.414 1.414a1 1 0 0 1 0 1.414zM6.343 18.728a1 1 0 0 1-1.414 0l-1.414-1.414a1 1 0 1 1 1.414-1.414l1.414 1.414a1 1 0 0 1 0 1.414zm12.728 0a1 1 0 0 1 0-1.414l1.414-1.414a1 1 0 1 1 1.414 1.414l-1.414 1.414a1 1 0 0 1-1.414 0zM6.343 5.929a1 1 0 0 1 0-1.414l1.414-1.414a1 1 0 1 1 1.414 1.414L7.757 5.929a1 1 0 0 1-1.414 0zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>
    </svg>`;
    
    const moonIcon = `<svg viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z"/>
    </svg>`;
    
    // Set initial icon based on theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    themeToggle.innerHTML = initialTheme === 'dark' ? sunIcon : moonIcon;
    document.body.setAttribute('data-theme', initialTheme);

    document.body.appendChild(themeToggle);

    // Toggle theme and icon
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        themeToggle.innerHTML = newTheme === 'dark' ? sunIcon : moonIcon;
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
    initDarkMode();
}