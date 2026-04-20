'use client';
import { useEffect } from 'react';

export default function TipsLogic() {
  useEffect(() => {
    /* =====================================================
       ELEMENTS & STATE
       ===================================================== */
       const tipsFeed = document.getElementById('tips-feed');
       const dropdowns = document.querySelectorAll('.tips-dropdown');
       const allCards = Array.from(document.querySelectorAll('.tips-card'));
       const searchInput = document.getElementById('tips-search-input') as HTMLInputElement;
   
       if (!tipsFeed) return;
   
       /* =====================================================
          INFINITE SCROLL CONFIG
          ===================================================== */
       const CARDS_PER_PAGE = 6;
       const LOAD_MORE_BATCH = 3;
       let shownCount = CARDS_PER_PAGE;
       let isLoading = false;
   
       const spinnerEl = document.getElementById('tips-infinite-scroll-spinner');
       const sentinelEl = document.getElementById('tips-infinite-scroll-sentinel');
   
       /* =====================================================
          FILTER STATE
          ===================================================== */
       let activeFilters: Record<string, string | string[]> = {
           category: ['all'],
           year: ['all'],
           sort: 'newest',
           tags: ['all'],
           search: ''
       };
   
       /* =====================================================
          2. REFINED FILTERING LOGIC
          ===================================================== */
       function getMatchingCards() {
           const query = (searchInput?.value || '').toLowerCase().trim();
           
           return allCards.filter(card => {
               const el = card as HTMLElement;
               const cardCat = el.dataset.cat || '';
               const cardYear = el.dataset.year || '';
               const cardTags = (el.dataset.tags || '').split(',').map(t => t.trim());
               const title = el.querySelector('.tips-card-title')?.textContent?.toLowerCase() || '';
   
               const catMatch = activeFilters.category.includes('all') || activeFilters.category.includes(cardCat);
               const yearMatch = activeFilters.year.includes('all') || activeFilters.year.includes(cardYear);
               const tagMatch = activeFilters.tags.includes('all') || cardTags.some(t => activeFilters.tags.includes(t));
               const searchMatch = query === '' || title.includes(query);
   
               return catMatch && yearMatch && tagMatch && searchMatch;
           }).sort((a, b) => {
               const aYear = (a as HTMLElement).dataset.year || '';
               const bYear = (b as HTMLElement).dataset.year || '';
               if (activeFilters.sort === 'newest') return bYear > aYear ? 1 : -1;
               return aYear > bYear ? 1 : -1;
           });
       }
   
       function syncAndFilter() {
           shownCount = CARDS_PER_PAGE;
           isLoading = false;
           if (spinnerEl) spinnerEl.setAttribute('hidden', '');
   
           const matching = getMatchingCards();
   
           allCards.forEach(card => {
               (card as HTMLElement).style.display = 'none';
               card.classList.remove('is-visible');
           });
   
           const toShow = matching.slice(0, shownCount);
           toShow.forEach((card, i) => {
               (card as HTMLElement).style.display = 'block';
           });
   
           checkSentinelVisibility(matching.length);
           updateEmptyState(matching.length);
       }
   
       /* =====================================================
          3. INFINITE SCROLL ENGINE
          ===================================================== */
       function loadMoreTips() {
           const matching = getMatchingCards();
           if (shownCount >= matching.length || isLoading) return;
   
           isLoading = true;
           
           // Modern Loading: Inject Detailed Skeletons
           const skeletonContainer = document.getElementById('tips-skeletons');
           if (spinnerEl && skeletonContainer) {
               const countToLoad = Math.min(LOAD_MORE_BATCH, matching.length - shownCount);
               skeletonContainer.innerHTML = `
                   <div class="skeleton-card">
                       <div class="skeleton-image skeleton"></div>
                       <div class="skeleton-content">
                           <div class="skeleton-tag skeleton"></div>
                           <div class="skeleton-title skeleton"></div>
                           <div class="skeleton-title short skeleton"></div>
                           <div class="skeleton-text skeleton"></div>
                           <div class="skeleton-footer"><div class="skeleton-btn skeleton"></div></div>
                       </div>
                   </div>
               `.repeat(countToLoad);
               spinnerEl.removeAttribute('hidden');
           }
   
           setTimeout(() => {
               const nextBatch = matching.slice(shownCount, shownCount + LOAD_MORE_BATCH);
               nextBatch.forEach((card, i) => {
                   (card as HTMLElement).style.display = 'block';
               });
   
               shownCount += LOAD_MORE_BATCH;
               isLoading = false;
               
               if (spinnerEl) {
                   spinnerEl.setAttribute('hidden', '');
                   if (skeletonContainer) skeletonContainer.innerHTML = '';
               }
               
               checkSentinelVisibility(matching.length);
           }, 1000);
       }
   
       function checkSentinelVisibility(totalCount: number) {
           if (!sentinelEl) return;
           sentinelEl.style.display = shownCount < totalCount ? 'block' : 'none';
       }
   
       if (sentinelEl) {
           const sentinelObserver = new IntersectionObserver(entries => {
               if (entries[0].isIntersecting) loadMoreTips();
           }, { rootMargin: '0px 0px 200px 0px' });
           sentinelObserver.observe(sentinelEl);
       }
   
       /* =====================================================
          4. UI INTERACTION (Dropdowns & Mobile)
          ===================================================== */
       function handleOptionClick(item: Element, filterKey: string, isSingle: boolean, option: Element) {
           const input = option.querySelector('input') as HTMLInputElement;
           const val = input.value;
   
           if (isSingle) {
               item.querySelectorAll('.tips-option').forEach(opt => {
                   opt.classList.remove('active');
                   (opt.querySelector('input') as HTMLInputElement).checked = false;
               });
               option.classList.add('active');
               input.checked = true;
               activeFilters[filterKey] = val;
           } else {
               const options = item.querySelectorAll('.tips-option');
               if (val === 'all') {
                   options.forEach(opt => {
                       opt.classList.remove('active');
                       const optInput = opt.querySelector('input');
                       if (optInput) optInput.checked = false;
                   });
                   option.classList.add('active');
                   if (input) input.checked = true;
                   activeFilters[filterKey] = ['all'];
               } else {
                   const allOpt = (item.querySelector('input[value="all"]') as Element).closest('.tips-option');
                   if (allOpt) {
                       allOpt.classList.remove('active');
                       const allOptInput = allOpt.querySelector('input');
                       if (allOptInput) allOptInput.checked = false;
                   }
                   
                   if (input) {
                       input.checked = !input.checked;
                       option.classList.toggle('active', input.checked);
                   }
   
                   const checked = Array.from(item.querySelectorAll('input:checked')).map(i => (i as HTMLInputElement).value).filter(v => v !== 'all');
                   activeFilters[filterKey] = checked.length ? checked : ['all'];
                   
                   if (checked.length === 0 && allOpt) {
                       allOpt.classList.add('active');
                       const allOptInput = allOpt.querySelector('input');
                       if (allOptInput) allOptInput.checked = true;
                   }
               }
           }
           syncAndFilter();
           
           if (isSingle && !item.classList.contains('tips-drawer-item')) {
               const label = item.querySelector('.tips-dropdown-label');
               if (label && option.textContent) label.textContent = option.textContent.trim();
           }
       }
   
       dropdowns.forEach(dropdown => {
           const trigger = dropdown.querySelector('.tips-dropdown-trigger') as HTMLElement;
           const el = dropdown as HTMLElement;
           const filterKey = el.dataset.filter || '';
           const isSingle = el.dataset.single === 'true';
   
           if(trigger) {
               trigger.addEventListener('click', (e) => {
                   e.stopPropagation();
                   const wasActive = dropdown.classList.contains('active');
                   dropdowns.forEach(d => d.classList.remove('active'));
                   if (!wasActive) dropdown.classList.add('active');
               });
           }
   
           dropdown.querySelectorAll('.tips-option').forEach(option => {
               option.addEventListener('click', (e) => {
                   e.preventDefault();
                   handleOptionClick(dropdown, filterKey, isSingle, option);
               });
           });
       });
   
       const drawerItems = document.querySelectorAll('.tips-drawer-item');
       drawerItems.forEach(item => {
           const trigger = item.querySelector('.tips-drawer-trigger');
           const el = item as HTMLElement;
           const filterKey = el.dataset.filter || '';
           const isSingle = el.dataset.single === 'true';
   
           if(trigger) {
               trigger.addEventListener('click', () => {
                   const isActive = item.classList.contains('active');
                   drawerItems.forEach(i => i.classList.remove('active'));
                   if (!isActive) item.classList.add('active');
               });
           }
   
           item.querySelectorAll('.tips-option').forEach(option => {
               option.addEventListener('click', (e) => {
                   e.preventDefault();
                   handleOptionClick(item, filterKey, isSingle, option);
               });
           });
       });
   
       const closeDropdowns = () => dropdowns.forEach(d => d.classList.remove('active'));
       document.addEventListener('click', closeDropdowns);
   
       let searchTimer: NodeJS.Timeout;
       if (searchInput) {
           searchInput.addEventListener('input', () => {
               clearTimeout(searchTimer);
               searchTimer = setTimeout(syncAndFilter, 300);
           });
       }
   
       /* =====================================================
          5. VIEW TOGGLE & RESET
          ===================================================== */
       const gridBtn = document.getElementById('tips-grid-view');
       const listBtn = document.getElementById('tips-list-view');
   
       if (gridBtn && listBtn) {
           gridBtn.addEventListener('click', () => {
               gridBtn.classList.add('active');
               listBtn.classList.remove('active');
               if (tipsFeed) tipsFeed.classList.remove('list-view');
           });
           listBtn.addEventListener('click', () => {
               listBtn.classList.add('active');
               gridBtn.classList.remove('active');
               if (tipsFeed) tipsFeed.classList.add('list-view');
           });
       }
   
       function resetAll() {
           activeFilters = { category: ['all'], year: ['all'], sort: 'newest', tags: ['all'] };
           
           document.querySelectorAll('.tips-option').forEach(opt => {
               const input = opt.querySelector('input');
               if (input) {
                   const isAll = input.value === 'all' || input.value === 'newest';
                   input.checked = isAll;
                   opt.classList.toggle('active', isAll);
               }
           });
   
           dropdowns.forEach(d => {
               const el = d as HTMLElement;
               if (el.dataset.single === 'true') {
                   const label = d.querySelector('.tips-dropdown-label');
                   const firstOpt = d.querySelector('.tips-option:first-child');
                   if (label && firstOpt && firstOpt.textContent) label.textContent = firstOpt.textContent.trim();
               }
           });
   
           if (searchInput) searchInput.value = '';
           syncAndFilter();
       }
   
       const resetBtn = document.getElementById('tips-reset-btn');
       const resetBtnMob = document.getElementById('tips-reset-btn-mob');
       if (resetBtn) resetBtn.addEventListener('click', resetAll);
       if (resetBtnMob) resetBtnMob.addEventListener('click', resetAll);
   
       /* =====================================================
          6. MOBILE DRAWER OVERLAY
          ===================================================== */
       const drawer = document.getElementById('tips-filter-drawer');
       const overlay = document.getElementById('tips-filter-overlay');
       const toggleBtn = document.getElementById('tips-filter-toggle');
       const closeBtn = document.getElementById('tips-filter-close');
   
       if (toggleBtn && drawer && overlay) {
           toggleBtn.addEventListener('click', () => {
               drawer.classList.add('is-open');
               overlay.classList.add('is-open');
               document.body.style.overflow = 'hidden';
           });
       }
   
       const closeDrawer = () => {
           if (drawer) drawer.classList.remove('is-open');
           if (overlay) overlay.classList.remove('is-open');
           document.body.style.overflow = '';
       };
   
       if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
       if (overlay) overlay.addEventListener('click', closeDrawer);
   
       const applyBtnMob = document.getElementById('tips-apply-btn-mob');
       if (applyBtnMob) applyBtnMob.addEventListener('click', closeDrawer);
   
       /* =====================================================
          INIT
          ===================================================== */
       syncAndFilter();
   
       function updateEmptyState(count: number) {
           if (!tipsFeed) return;
           let empty = tipsFeed.querySelector('.tips-empty-state');
           if (count === 0) {
               if (!empty) {
                   empty = document.createElement('div');
                   empty.className = 'tips-empty-state text-center py-5 w-100';
                   empty.innerHTML = `<h3 class="mb-2">No matching tips found</h3><p class="text-muted">Try adjusting your filters or search query.</p>`;
                   tipsFeed.appendChild(empty);
               }
           } else if (empty) empty.remove();
       }

       return () => {
           document.removeEventListener('click', closeDropdowns);
       };
  }, []);

  return null;
}

