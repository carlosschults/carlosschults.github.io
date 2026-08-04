(function () {
    'use strict';

    // ── Back to top ──────────────────────────────────────────────────────────
    var backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '&#8679;';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── Footnote popups ───────────────────────────────────────────────────────
    var popup = null;

    function closePopup() {
        if (popup) {
            popup.remove();
            popup = null;
        }
    }

    document.addEventListener('click', function (e) {
        // Handle footnote reference clicks
        var link = e.target.closest('a.footnote');
        if (link) {
            e.preventDefault();

            var href = link.getAttribute('href');
            // Toggle off if the same footnote is already open
            if (popup && popup.dataset.fnHref === href) {
                closePopup();
                return;
            }
            closePopup();

            var fnId = href.replace(/^#/, '');
            var fnEl = document.getElementById(fnId);
            if (!fnEl) return;

            // Clone content and strip the back-link arrow
            var content = fnEl.cloneNode(true);
            content.querySelectorAll('a.reversefootnote').forEach(function (el) {
                el.remove();
            });

            popup = document.createElement('div');
            popup.className = 'footnote-popup';
            popup.dataset.fnHref = href;

            var closeBtn = document.createElement('span');
            closeBtn.className = 'footnote-popup-close';
            closeBtn.setAttribute('aria-label', 'Close');
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', closePopup);

            popup.appendChild(closeBtn);
            popup.appendChild(content);
            document.body.appendChild(popup);

            // Position below the superscript, clamped to viewport width
            var rect = link.getBoundingClientRect();
            var popupWidth = Math.min(340, window.innerWidth - 32);
            popup.style.maxWidth = popupWidth + 'px';

            var top = rect.bottom + window.scrollY + 6;
            var left = rect.left + window.scrollX;
            if (left + popupWidth > window.innerWidth - 16) {
                left = window.innerWidth - popupWidth - 16;
            }
            if (left < 8) left = 8;

            popup.style.top = top + 'px';
            popup.style.left = left + 'px';
            return;
        }

        // Close when clicking outside the popup
        if (popup && !popup.contains(e.target)) {
            closePopup();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closePopup();
    });
})();
