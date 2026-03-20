// VINEST YouTube Knowledge Base - Shared Logic
const DATA_PATH = '../data/entries.json';
let db = null;

// Load data
async function loadData() {
  if (db) return db;
  try {
    const res = await fetch(DATA_PATH + '?t=' + Date.now());
    db = await res.json();
    return db;
  } catch (e) {
    console.error('Failed to load data:', e);
    return { entries: [], companies: [], sectors: [], themes: [] };
  }
}

// Get URL params
function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    id: params.get('id'),
    company: params.get('company'),
    sector: params.get('sector'),
    theme: params.get('theme'),
    search: params.get('q') || ''
  };
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-HK', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Escape HTML
function esc(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// Render tags
function renderTags(items, type = '') {
  if (!items || !items.length) return '';
  return items.map(t => `<span class="tag ${type}">${esc(t)}</span>`).join('');
}

// Search entries
function searchEntries(entries, query) {
  if (!query) return entries;
  const q = query.toLowerCase();
  return entries.filter(e => {
    const text = [
      e.title, e.summary_short, e.summary_long,
      ...(e.companies||[]), ...(e.sectors||[]), ...(e.themes||[]),
      ...(e.key_points||[]), ...(e.bull_points||[]), ...(e.bear_points||[])
    ].join(' ').toLowerCase();
    return text.includes(q);
  });
}

// Filter entries
function filterEntries(entries, filters) {
  let result = entries;
  if (filters.company) {
    result = result.filter(e => (e.companies||[]).some(c => c.toLowerCase().includes(filters.company.toLowerCase())));
  }
  if (filters.sector) {
    result = result.filter(e => (e.sectors||[]).some(s => s.toLowerCase().includes(filters.sector.toLowerCase())));
  }
  if (filters.theme) {
    result = result.filter(e => (e.themes||[]).some(t => t.toLowerCase().includes(filters.theme.toLowerCase())));
  }
  if (filters.source) {
    result = result.filter(e => e.source_type === filters.source);
  }
  return result;
}

// Sort entries
function sortEntries(entries, sortBy = 'date') {
  const sorted = [...entries];
  if (sortBy === 'date') {
    sorted.sort((a,b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === 'updated') {
    sorted.sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at));
  }
  return sorted;
}

// Get related entries
function getRelatedEntries(entry, allEntries, limit = 5) {
  const related = allEntries.filter(e => {
    if (e.id === entry.id) return false;
    // Same company
    const sameCompany = (e.companies||[]).some(c => (entry.companies||[]).includes(c));
    // Same sector
    const sameSector = (e.sectors||[]).some(s => (entry.sectors||[]).includes(s));
    // Same theme
    const sameTheme = (e.themes||[]).some(t => (entry.themes||[]).includes(t));
    return sameCompany || sameSector || sameTheme;
  });
  return related.slice(0, limit);
}

// Get entity counts
function getEntityCounts(entries) {
  const companies = new Set();
  const sectors = new Set();
  const themes = new Set();
  entries.forEach(e => {
    (e.companies||[]).forEach(c => companies.add(c));
    (e.sectors||[]).forEach(s => sectors.add(s));
    (e.themes||[]).forEach(t => themes.add(t));
  });
  return { companies: companies.size, sectors: sectors.size, themes: themes.size };
}

// Get top entities
function getTopEntities(entries, field, limit = 5) {
  const counts = {};
  entries.forEach(e => {
    (e[field]||[]).forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .sort((a,b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

// Entry card HTML
function entryCardHTML(entry) {
  return `
    <div class="entry-card" onclick="window.location.href='entry.html?id=${entry.id}'">
      <h3>${esc(entry.title)}</h3>
      <div class="meta">
        <span>${formatDate(entry.date)}</span>
        <span>·</span>
        <span>${esc(entry.source_name)}</span>
      </div>
      <p class="summary">${esc(entry.summary_short)}</p>
      <div class="tags">
        ${renderTags(entry.companies, 'company')}
        ${renderTags(entry.sectors, 'sector')}
        ${renderTags(entry.themes, 'theme')}
      </div>
    </div>
  `;
}

// Entity card HTML
function entityCardHTML(name, count, link) {
  return `
    <div class="entity-card" onclick="window.location.href='${link}'">
      <h3>${esc(name)}</h3>
      <div class="count">${count} 條記錄</div>
    </div>
  `;
}

// Export for use
window.VINEST = {
  loadData, getParams, formatDate, esc, renderTags,
  searchEntries, filterEntries, sortEntries, getRelatedEntries,
  getEntityCounts, getTopEntities, entryCardHTML, entityCardHTML
};
