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

    // ── Table of Contents ─────────────────────────────────────────────────────
    var postContent = document.querySelector('.post-content');
    if (postContent) {
        var headings = Array.prototype.slice.call(
            postContent.querySelectorAll('h2[id], h3[id]')
        );
        if (headings.length >= 3) {
            buildTOC(headings);
        }
    }

    function headingText(el) {
        var clone = el.cloneNode(true);
        clone.querySelectorAll('.heading-anchor').forEach(function (a) { a.remove(); });
        return clone.textContent.trim();
    }

    function buildTOC(headings) {
        var toc = document.createElement('nav');
        toc.className = 'toc';
        toc.setAttribute('aria-label', 'Table of contents');

        var header = document.createElement('div');
        header.className = 'toc-header';

        var title = document.createElement('strong');
        title.className = 'toc-title';
        title.textContent = 'CONTENTS';

        var toggleBtn = document.createElement('button');
        toggleBtn.className = 'toc-toggle';
        toggleBtn.textContent = 'hide';

        header.appendChild(title);
        header.appendChild(toggleBtn);
        toc.appendChild(header);

        var list = document.createElement('ul');
        list.className = 'toc-list';

        var items = [];
        headings.forEach(function (h) {
            var li = document.createElement('li');
            li.className = 'toc-item toc-' + h.tagName.toLowerCase();
            li.dataset.target = h.id;

            var a = document.createElement('a');
            a.href = '#' + h.id;
            a.textContent = headingText(h);

            li.appendChild(a);
            list.appendChild(li);
            items.push(li);
        });

        toc.appendChild(list);
        document.body.appendChild(toc);

        // Restore collapsed state from localStorage
        if (localStorage.getItem('toc-hidden') === 'true') {
            list.classList.add('toc-list--hidden');
            toggleBtn.textContent = 'show';
            toggleBtn.setAttribute('aria-label', 'Show table of contents');
        } else {
            toggleBtn.setAttribute('aria-label', 'Hide table of contents');
        }

        toggleBtn.addEventListener('click', function () {
            var nowHidden = list.classList.toggle('toc-list--hidden');
            toggleBtn.textContent = nowHidden ? 'show' : 'hide';
            toggleBtn.setAttribute('aria-label', (nowHidden ? 'Show' : 'Hide') + ' table of contents');
            localStorage.setItem('toc-hidden', nowHidden);
        });

        // Scroll-spy: highlight the heading currently in view
        if ('IntersectionObserver' in window) {
            var activeId = headings[0] ? headings[0].id : null;

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        activeId = entry.target.id;
                    }
                });
                items.forEach(function (li) {
                    li.classList.toggle('toc-item--active', li.dataset.target === activeId);
                });
            }, { rootMargin: '-68px 0px -60% 0px', threshold: 0 });

            headings.forEach(function (h) { observer.observe(h); });
        }
    }
})();
