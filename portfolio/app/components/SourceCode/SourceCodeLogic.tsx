'use client';
import React, { useEffect } from 'react';

const SourceCodeLogic: React.FC = () => {
    useEffect(() => {
        "use strict";

        /* =====================================================
           1. CUSTOM DROPDOWN (.sc-cd) LOGIC
           ===================================================== */
        const customDropdowns = document.querySelectorAll('.sc-cd');

        const closeAllDropdowns = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest('.sc-cd')) {
                customDropdowns.forEach(cd => cd.classList.remove('is-open'));
            }
        };
        document.addEventListener('click', closeAllDropdowns);

        customDropdowns.forEach(cd => {
            const trigger = cd.querySelector('.sc-cd__trigger');
            if (!trigger) return;
            const triggerLabel = cd.querySelector('.sc-cd__label');
            if (!triggerLabel) return;
            const defaultLabel = triggerLabel.textContent || '';
            const options = cd.querySelectorAll('.sc-cd__option');
            const isRadio = cd.classList.contains('sc-cd--radio');
            const filterType = (cd as HTMLElement).dataset.filter;

            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                customDropdowns.forEach(other => { if (other !== cd) other.classList.remove('is-open'); });
                cd.classList.toggle('is-open');
            });

            options.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const val = (option as HTMLElement).dataset.value;
                    const isAll = val === 'all';

                    // Synchronize other dropdowns of the same type (Desktop vs Mobile)
                    const twins = document.querySelectorAll(`.sc-cd[data-filter="${filterType}"]`);
                    
                    twins.forEach(twin => {
                        const twinOptions = twin.querySelectorAll('.sc-cd__option');
                        const twinAll     = twin.querySelector('.sc-cd__option[data-value="all"]');
                        const twinTarget  = twin.querySelector(`.sc-cd__option[data-value="${val}"]`);
                        const twinLabel   = twin.querySelector('.sc-cd__label') as HTMLElement;

                        if (isRadio) {
                            twinOptions.forEach(opt => opt.classList.remove('active'));
                            if (twinTarget) twinTarget.classList.add('active');
                            if (twinLabel && twinTarget) twinLabel.textContent = twinTarget.querySelector('.sc-cd__opt-text')?.textContent || '';
                        } else {
                            if (isAll) {
                                twinOptions.forEach(opt => opt.classList.remove('active'));
                                if (twinAll) twinAll.classList.add('active');
                            } else {
                                if (twinTarget) twinTarget.classList.toggle('active');
                                if (twinAll) twinAll.classList.remove('active');
                                
                                // Recover 'all' if nothing selected
                                const anyActive = twin.querySelectorAll('.sc-cd__option.active:not([data-value="all"])');
                                if (anyActive.length === 0 && twinAll) twinAll.classList.add('active');
                            }
                            updateTriggerLabel(twin, twinLabel, defaultLabel);
                        }
                    });

                    if (isRadio) cd.classList.remove('is-open');
                    applyFilters();
                });
            });
        });

        function updateTriggerLabel(cd: Element, labelEl: HTMLElement, defaultText: string) {
            const active = cd.querySelectorAll('.sc-cd__option.active:not([data-value="all"])');
            if (active.length === 0) {
                labelEl.innerHTML = defaultText;
            } else if (active.length === 1) {
                const text = active[0].querySelector('.sc-cd__opt-text')?.textContent;
                if (text) labelEl.innerHTML = text;
            } else {
                labelEl.innerHTML = `${defaultText} <span class="sc-cd__count">${active.length}</span>`;
            }
        }


        /* =====================================================
           2. MOBILE DRAWER
           ===================================================== */
        const filterToggleBtn = document.getElementById('sc-filter-toggle');
        const filterDrawer    = document.getElementById('sc-filter-drawer');
        const filterOverlay   = document.getElementById('sc-filter-overlay');
        const filterCloseBtn  = document.getElementById('sc-filter-drawer-close');

        function openDrawer()  { if (!filterDrawer || !filterOverlay) return; filterDrawer.classList.add('is-open'); filterOverlay.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
        function closeDrawer() { if (!filterDrawer || !filterOverlay) return; filterDrawer.classList.remove('is-open'); filterOverlay.classList.remove('is-open'); document.body.style.overflow = ''; }

        if (filterToggleBtn) filterToggleBtn.addEventListener('click', openDrawer);
        if (filterCloseBtn)  filterCloseBtn.addEventListener('click', closeDrawer);
        if (filterOverlay)   filterOverlay.addEventListener('click', closeDrawer);


        /* =====================================================
           3. RESET FILTERS
           ===================================================== */
        function resetAllFilters() {
            customDropdowns.forEach(cd => {
                const opts    = cd.querySelectorAll('.sc-cd__option');
                const triggerLabelEl = cd.querySelector('.sc-cd__label');
                if (!triggerLabelEl) return;
                const isRadio = cd.classList.contains('sc-cd--radio');
                opts.forEach(o => o.classList.remove('active'));
                if (isRadio) {
                    const newest = cd.querySelector('.sc-cd__option[data-value="newest"]');
                    if (newest) { newest.classList.add('active'); triggerLabelEl.textContent = "Newest First"; }
                } else {
                    const allOpt = cd.querySelector('.sc-cd__option[data-value="all"]');
                    if (allOpt) allOpt.classList.add('active');
                    const ft = (cd as HTMLElement).dataset.filter;
                    if (ft === 'category') triggerLabelEl.textContent = "Category";
                    if (ft === 'tech')     triggerLabelEl.textContent = "Tech Stack";
                    if (ft === 'year')     triggerLabelEl.textContent = "Year";
                }
            });
            const si = document.getElementById('sc-search') as HTMLInputElement;
            if (si) si.value = '';
            applyFilters();
        }

        ['sc-reset-filters', 'sc-reset-filters-m', 'sc-no-results-reset'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', resetAllFilters);
        });


        /* =====================================================
           4. VIEW TOGGLE (GRID / LIST)
           ===================================================== */
        const gridBtn      = document.getElementById('sc-grid-view-btn');
        const listBtn      = document.getElementById('sc-list-view-btn');
        const projectsGrid = document.getElementById('sc-projects-grid');

        if (gridBtn && listBtn) {
            gridBtn.addEventListener('click', () => {
                gridBtn.classList.add('active');    gridBtn.setAttribute('aria-pressed', 'true');
                listBtn.classList.remove('active'); listBtn.setAttribute('aria-pressed', 'false');
                if (projectsGrid) projectsGrid.classList.remove('is-list');
            });
            listBtn.addEventListener('click', () => {
                listBtn.classList.add('active');    listBtn.setAttribute('aria-pressed', 'true');
                gridBtn.classList.remove('active'); gridBtn.setAttribute('aria-pressed', 'false');
                if (projectsGrid) projectsGrid.classList.add('is-list');
            });
        }


        /* =====================================================
           5. LIVE SEARCH + MULTI-FILTER + INFINITE SCROLL
           ===================================================== */
        const searchInput = document.getElementById('sc-search') as HTMLInputElement;
        const searchClear = document.getElementById('sc-search-clear');
        const countEl     = document.getElementById('sc-count');
        const noResults   = document.getElementById('sc-no-results');
        const spinner     = document.getElementById('sc-spinner');
        const sentinel    = document.getElementById('sc-infinite-sentinel');

        let visibleCards: HTMLElement[] = []; // Currently filtered cards
        let displayingCount = 6;  // Initial count to show
        const STEP          = 3;  // How many to load on each scroll
        let isLoading       = false;

        function getActiveValues(filterType: string) {
            const allDDs = document.querySelectorAll(`.sc-cd[data-filter="${filterType}"]`);
            const vals   = new Set();
            allDDs.forEach(dd => {
                dd.querySelectorAll('.sc-cd__option.active').forEach(a => {
                    const val = (a as HTMLElement).dataset.value;
                    if (val) vals.add(val);
                });
            });
            return vals;
        }

        function applyFilters() {
            const allCards = Array.from(document.querySelectorAll('.sc-project-card')) as HTMLElement[];
            const query      = searchInput ? searchInput.value.trim().toLowerCase() : '';
            const categories = getActiveValues('category');
            const techs      = getActiveValues('tech');
            const years      = getActiveValues('year');

            // Handle Clear Button visibility
            if (searchClear) {
                searchClear.hidden = query.length === 0;
            }

            // 1. Filter allCards into visibleCards
            visibleCards = allCards.filter(card => {
                const cardCategories = (card.dataset.category || '').split(',').filter(Boolean);
                const cardTechs      = (card.dataset.tech || '').split(',').filter(Boolean);
                const cardYear       = card.dataset.year || '';
                
                const matchSearch   = !query || (card.dataset.title || '').toLowerCase().includes(query);
                const matchCategory = categories.has('all') || Array.from(categories).some(cat => cardCategories.includes(cat as string));
                const matchTech     = techs.has('all')      || Array.from(techs).some(tech => cardTechs.includes(tech as string));
                const matchYear     = years.has('all')      || years.has(cardYear);
                
                return matchSearch && matchCategory && matchTech && matchYear;
            });

            // 2. Reset scroll state
            displayingCount = 6; 
            updateDisplay();

            if (countEl)   countEl.textContent = visibleCards.length.toString();
            if (noResults) (noResults as HTMLElement).hidden = visibleCards.length > 0;
            if (projectsGrid) (projectsGrid as HTMLElement).style.display = visibleCards.length === 0 && allCards.length > 0 ? 'none' : '';
        }

        function updateDisplay() {
            const allCards = Array.from(document.querySelectorAll('.sc-project-card')) as HTMLElement[];
            allCards.forEach(card => card.hidden = true);
            
            const toShow = visibleCards.slice(0, displayingCount);
            toShow.forEach(card => card.hidden = false);

            // Hide sentinel if all items are shown
            if (sentinel) {
                sentinel.style.display = (displayingCount >= visibleCards.length || visibleCards.length === 0) ? 'none' : 'block';
            }
        }

        function loadMore() {
            if (isLoading || displayingCount >= visibleCards.length) return;
            
            isLoading = true;
            if (spinner) spinner.hidden = false;

            // Artificial delay for premium feel
            setTimeout(() => {
                displayingCount += STEP;
                updateDisplay();
                isLoading = false;
                if (spinner) spinner.hidden = true;
            }, 600);
        }

        /* --- Intersection Observer for Infinite Scroll --- */
        let observer: IntersectionObserver | null = null;
        if (sentinel) {
            observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            }, { rootMargin: '100px' });
            observer.observe(sentinel);
        }

        let searchTimer: NodeJS.Timeout;
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(applyFilters, 280);
            });
        }

        if (searchClear) {
            searchClear.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.focus();
                }
                applyFilters();
            });
        }

        // Initial run with a tiny delay to ensure cards are in DOM
        const initialTimer = setTimeout(() => {
            applyFilters();
        }, 100);
        
        return () => {
            clearTimeout(initialTimer);
            document.removeEventListener('click', closeAllDropdowns);
            if (observer) observer.disconnect();
        };

    }, []);

    return null;
};

export default SourceCodeLogic;
