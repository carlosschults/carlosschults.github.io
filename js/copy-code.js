function initCopyCode() {
    const copyIcon = `<svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
    </svg>`;

    const checkIcon = `<svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>`;

    document.querySelectorAll('div.highlighter-rouge, figure.highlight').forEach((block) => {
        const code = block.querySelector('code');
        if (!code) return;

        const button = document.createElement('button');
        button.classList.add('copy-code-button');
        button.setAttribute('aria-label', 'Copy code to clipboard');
        button.innerHTML = copyIcon;

        button.addEventListener('click', () => {
            navigator.clipboard.writeText(code.innerText).then(() => {
                button.innerHTML = checkIcon;
                button.classList.add('copied');
                setTimeout(() => {
                    button.innerHTML = copyIcon;
                    button.classList.remove('copied');
                }, 2000);
            });
        });

        block.appendChild(button);
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyCode);
} else {
    initCopyCode();
}
