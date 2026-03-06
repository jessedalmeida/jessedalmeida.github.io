// ── Mobile nav ──
const burger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');
if (burger) {
  burger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ── Expandable cards (research) ──
document.querySelectorAll('.exp-card').forEach(card => {
  const toggle = card.querySelector('.exp-card-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      card.classList.toggle('open');
      const label = toggle.querySelector('.toggle-label');
      if (label) label.textContent = card.classList.contains('open') ? 'Collapse' : 'Expand';
    });
  }
});

// ── Expandable publication items ──
document.querySelectorAll('.pub-item.is-expandable[data-key]').forEach(item => {
  item.addEventListener('click', event => {
    if (event.target.closest('a')) return;
    const key = item.dataset.key;
    const expand = document.querySelector(`.pub-expand[data-key="${key}"]`);
    if (!expand) return;
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.pub-item.open').forEach(i => i.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});

// ── Expandable featured publication cards ──
document.querySelectorAll('.featured-pub-card').forEach(card => {
  const topToggle = card.querySelector('.featured-pub-toggle-top');
  const bottomToggle = card.querySelector('.featured-pub-toggle-bottom');
  if (!topToggle && !bottomToggle) return;

  let collapseTimer = null;

  const setExpandedState = (targetCard, expanded) => {
    targetCard.classList.remove('is-collapsing');
    targetCard.classList.toggle('open', expanded);
    const top = targetCard.querySelector('.featured-pub-toggle-top');
    const bottom = targetCard.querySelector('.featured-pub-toggle-bottom');
    if (top) top.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    if (bottom) bottom.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  };

  const collapseCard = targetCard => {
    if (collapseTimer) {
      clearTimeout(collapseTimer);
      collapseTimer = null;
    }

    targetCard.classList.add('is-collapsing');
    const top = targetCard.querySelector('.featured-pub-toggle-top');
    const bottom = targetCard.querySelector('.featured-pub-toggle-bottom');
    if (top) top.setAttribute('aria-expanded', 'false');
    if (bottom) bottom.setAttribute('aria-expanded', 'false');

    collapseTimer = setTimeout(() => {
      targetCard.classList.remove('open');
      targetCard.classList.remove('is-collapsing');
      collapseTimer = null;
    }, 320);
  };

  if (topToggle) {
    topToggle.addEventListener('click', () => {
      document.querySelectorAll('.featured-pub-card.open').forEach(openCard => {
        if (openCard !== card) {
          openCard.classList.remove('is-collapsing');
          openCard.classList.remove('open');
        }
      });
      setExpandedState(card, true);
    });
  }

  if (bottomToggle) {
    bottomToggle.addEventListener('click', () => {
      collapseCard(card);
    });
  }
});

// ── Publication filters + show more ──
const publicationRows = Array.from(document.querySelectorAll('.pub-row'));
const publicationFilterButtons = Array.from(document.querySelectorAll('.pub-filter-btn'));
const publicationSeeMoreButton = document.querySelector('#pub-see-more-btn');
const publicationSearchInput = document.querySelector('#pub-search-input');
const INITIAL_PUBLICATION_COUNT = 10;

let activePublicationFilter = 'all';
let publicationsExpanded = false;
let publicationSearchQuery = '';

const highlightSearchTargets = ['.pub-year', '.pub-title', '.pub-authors', '.pub-venue', '.pub-note'];

const clearHighlights = container => {
  container.querySelectorAll('mark.pub-highlight').forEach(mark => {
    const textNode = document.createTextNode(mark.textContent || '');
    mark.replaceWith(textNode);
  });
  container.normalize();
};

const highlightMatchesInElement = (element, regex) => {
  const textNodes = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || node.nodeValue.trim() === '') return NodeFilter.FILTER_REJECT;
      if (node.parentElement && node.parentElement.closest('mark.pub-highlight')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  let current = walker.nextNode();
  while (current) {
    textNodes.push(current);
    current = walker.nextNode();
  }

  textNodes.forEach(node => {
    const text = node.nodeValue;
    regex.lastIndex = 0;
    if (!regex.test(text)) return;

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    text.replace(regex, (match, offset) => {
      if (offset > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, offset)));
      }
      const mark = document.createElement('mark');
      mark.className = 'pub-highlight';
      mark.textContent = match;
      fragment.appendChild(mark);
      lastIndex = offset + match.length;
      return match;
    });

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    node.parentNode.replaceChild(fragment, node);
  });
};

const updatePublicationHighlights = () => {
  publicationRows.forEach(row => {
    highlightSearchTargets.forEach(selector => {
      row.querySelectorAll(selector).forEach(clearHighlights);
    });
  });

  if (!publicationSearchQuery) return;

  const safeQuery = publicationSearchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(safeQuery, 'gi');

  publicationRows.forEach(row => {
    highlightSearchTargets.forEach(selector => {
      row.querySelectorAll(selector).forEach(element => {
        highlightMatchesInElement(element, regex);
      });
    });
  });
};

const rowMatchesSearch = row => {
  if (!publicationSearchQuery) return true;
  const rowText = (row.textContent || '').toLowerCase();
  return rowText.includes(publicationSearchQuery);
};

const closeOpenPublicationRows = () => {
  document.querySelectorAll('.pub-item.open').forEach(item => item.classList.remove('open'));
};

const filteredPublicationRows = () => {
  return publicationRows.filter(row => {
    const matchesType = activePublicationFilter === 'all' || row.dataset.type === activePublicationFilter;
    return matchesType && rowMatchesSearch(row);
  });
};

const updatePublicationListView = () => {
  if (publicationRows.length === 0) return;

  const visibleRows = filteredPublicationRows();
  publicationRows.forEach(row => {
    row.style.display = 'none';
  });

  visibleRows.forEach((row, index) => {
    if (publicationsExpanded || index < INITIAL_PUBLICATION_COUNT) {
      row.style.display = '';
    }
  });

  if (!publicationSeeMoreButton) return;

  if (visibleRows.length <= INITIAL_PUBLICATION_COUNT) {
    publicationSeeMoreButton.style.display = 'none';
    publicationSeeMoreButton.setAttribute('aria-expanded', 'false');
    return;
  }

  publicationSeeMoreButton.style.display = 'inline-flex';
  publicationSeeMoreButton.setAttribute('aria-expanded', publicationsExpanded ? 'true' : 'false');
  publicationSeeMoreButton.textContent = publicationsExpanded
    ? 'Show fewer publications'
    : `See more publications (${visibleRows.length - INITIAL_PUBLICATION_COUNT} more)`;
};

publicationFilterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    publicationFilterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activePublicationFilter = btn.dataset.filter;
    publicationsExpanded = false;
    closeOpenPublicationRows();
    updatePublicationListView();
  });
});

if (publicationSeeMoreButton) {
  publicationSeeMoreButton.addEventListener('click', () => {
    publicationsExpanded = !publicationsExpanded;
    closeOpenPublicationRows();
    updatePublicationListView();
  });
}

if (publicationSearchInput) {
  publicationSearchInput.addEventListener('input', () => {
    publicationSearchQuery = publicationSearchInput.value.trim().toLowerCase();
    publicationsExpanded = false;
    closeOpenPublicationRows();
    updatePublicationHighlights();
    updatePublicationListView();
  });
}

updatePublicationHighlights();
updatePublicationListView();


