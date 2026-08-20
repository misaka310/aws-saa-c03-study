import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hostingPath = path.join(root, '.openai', 'hosting.json');

function existingProjectId() {
  if (!fs.existsSync(hostingPath)) return null;
  try {
    const value = JSON.parse(fs.readFileSync(hostingPath, 'utf8')).project_id;
    return typeof value === 'string' && value.startsWith('appgprj_') ? value : null;
  } catch {
    return null;
  }
}

const projectId = process.env.SITES_PROJECT_ID || process.argv[2] || existingProjectId();
if (!projectId || !projectId.startsWith('appgprj_')) {
  throw new Error('Sites project ID is missing. Create/bind the Site first or set SITES_PROJECT_ID.');
}
const dist = path.join(root, 'dist');
const client = path.join(dist, 'client');
const server = path.join(dist, 'server');
const portal = path.join(root, 'sites', 'portal');

const documentSpecs = [
  ['01-start-here.md', '01-start-here', '01 はじめる'],
  ['02-service-selection.md', '02-service-selection', '02 サービス選択'],
  ['03-secure-architectures.md', '03-secure-architectures', '03 Secure'],
  ['04-resilient-architectures.md', '04-resilient-architectures', '04 Resilient'],
  ['05-high-performing-architectures.md', '05-high-performing-architectures', '05 High-Performing'],
  ['06-cost-optimized-architectures.md', '06-cost-optimized-architectures', '06 Cost-Optimized'],
  ['07-exam-strategy.md', '07-exam-strategy', '07 試験戦略'],
  ['08-final-review.md', '08-final-review', '08 最終確認'],
  ['09-visual-review.md', '09-visual-review', '09 図解復習'],
  ['references.md', 'references', 'References'],
];

function ensureCleanDirectory(directory) {
  fs.rmSync(directory, { recursive: true, force: true });
  fs.mkdirSync(directory, { recursive: true });
}

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) copyDirectory(from, to);
    else fs.copyFileSync(from, to);
  }
}

function writePublicQuestionsAsset(source, destination) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(source, 'utf8'), sandbox, { filename: source });
  const { SAA_EXAM_BLUEPRINT: blueprint, SAA_LATEST_BATCH: latestBatch, SAA_QUESTIONS: questions } = sandbox.window;
  if (!Array.isArray(questions) || questions.length !== 105) {
    throw new Error(`Public question bank must contain exactly 105 questions; got ${questions?.length ?? 'unknown'}.`);
  }
  const output = [
    `window.SAA_EXAM_BLUEPRINT = ${JSON.stringify(blueprint)};`,
    `window.SAA_LATEST_BATCH = ${JSON.stringify(latestBatch)};`,
    `window.SAA_QUESTIONS = Object.freeze(${JSON.stringify(questions)});`,
    '',
  ].join('\n');
  fs.writeFileSync(destination, output, 'utf8');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function docIdFromHref(href) {
  const clean = href.split('#')[0].replace(/^\.\//, '');
  const file = path.basename(clean);
  const spec = documentSpecs.find(([source]) => source.toLocaleLowerCase() === file.toLocaleLowerCase());
  return spec?.[1] || null;
}

function normalizeImageHref(href) {
  if (/^https?:/i.test(href)) return href;
  const clean = href.replace(/^\.\//, '').replace(/^\.\.\//, '');
  const file = path.basename(clean);
  return `./images/${encodeURI(file)}`;
}

function renderInline(raw) {
  const tokens = [];
  const reserve = (html) => {
    const key = `@@TOKEN${tokens.length}@@`;
    tokens.push(html);
    return key;
  };
  let source = String(raw);
  source = source.replace(/`([^`]+)`/g, (_, code) => reserve(`<code>${escapeHtml(code)}</code>`));
  source = source.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, href) => reserve(`<img src="${normalizeImageHref(href.trim())}" alt="${escapeHtml(alt)}" loading="lazy">`));
  source = source.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const cleanHref = href.trim();
    const docId = cleanHref.toLocaleLowerCase().includes('.md') ? docIdFromHref(cleanHref) : null;
    if (docId) return reserve(`<a href="?doc=${encodeURIComponent(docId)}" data-doc-link="${escapeHtml(docId)}">${escapeHtml(label)}</a>`);
    const safeHref = /^(https?:|mailto:)/i.test(cleanHref) ? cleanHref : cleanHref.replace(/^\.\//, './');
    const external = /^https?:/i.test(cleanHref) ? ' target="_blank" rel="noreferrer"' : '';
    return reserve(`<a href="${escapeHtml(safeHref)}"${external}>${escapeHtml(label)}</a>`);
  });
  source = escapeHtml(source)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>')
    .replace(/(^|\s)\*([^*]+)\*(?=\s|$)/g, '$1<em>$2</em>');
  return source.replace(/@@TOKEN(\d+)@@/g, (_, index) => tokens[Number(index)]);
}

function slugify(text, index) {
  const slug = String(text).toLocaleLowerCase('ja-JP')
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
  return slug || `section-${index}`;
}

function splitTableRow(line) {
  return line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
}

function isTableSeparator(line) {
  const cells = splitTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const output = [];
  let paragraph = [];
  let listType = null;
  let inCode = false;
  let codeLanguage = '';
  let codeLines = [];
  let headingIndex = 0;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    output.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (!listType) return;
    output.push(`</${listType}>`);
    listType = null;
  };
  const flushCode = () => {
    output.push(`<pre><code${codeLanguage ? ` class="language-${escapeHtml(codeLanguage)}"` : ''}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
    codeLines = [];
    codeLanguage = '';
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (inCode) {
      if (/^```/.test(trimmed)) {
        inCode = false;
        flushCode();
      } else codeLines.push(line);
      continue;
    }
    const fence = trimmed.match(/^```\s*([\w-]*)/);
    if (fence) {
      flushParagraph(); closeList();
      inCode = true;
      codeLanguage = fence[1] || '';
      continue;
    }
    if (!trimmed) {
      flushParagraph(); closeList();
      continue;
    }
    if (index + 1 < lines.length && line.includes('|') && isTableSeparator(lines[index + 1])) {
      flushParagraph(); closeList();
      const headers = splitTableRow(line);
      const rows = [];
      index += 2;
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }
      index -= 1;
      output.push(`<div class="table-wrap"><table><thead><tr>${headers.map((cell) => `<th>${renderInline(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${headers.map((_, cellIndex) => `<td>${renderInline(row[cellIndex] || '')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph(); closeList();
      headingIndex += 1;
      const level = heading[1].length;
      const rendered = renderInline(heading[2]);
      output.push(`<h${level} id="${slugify(heading[2], headingIndex)}">${rendered}</h${level}>`);
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushParagraph(); closeList(); output.push('<hr>'); continue;
    }
    if (/^>\s?/.test(line)) {
      flushParagraph(); closeList(); output.push(`<blockquote>${renderInline(line.replace(/^>\s?/, ''))}</blockquote>`); continue;
    }
    const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const nextType = unordered ? 'ul' : 'ol';
      if (listType && listType !== nextType) closeList();
      if (!listType) { listType = nextType; output.push(`<${listType}>`); }
      output.push(`<li>${renderInline((unordered || ordered)[1])}</li>`);
      continue;
    }
    paragraph.push(trimmed);
  }
  if (inCode) flushCode();
  flushParagraph(); closeList();
  return output.join('\n');
}

function extractTitle(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].replace(/[*`]/g, '').trim() : fallback;
}

ensureCleanDirectory(dist);
fs.mkdirSync(client, { recursive: true });
fs.mkdirSync(server, { recursive: true });
fs.mkdirSync(path.join(dist, '.openai'), { recursive: true });

for (const file of ['index.html', 'styles.css', 'app.js']) {
  fs.copyFileSync(path.join(portal, file), path.join(client, file));
}
copyDirectory(path.join(root, 'quiz'), path.join(client, 'quiz'));
writePublicQuestionsAsset(path.join(root, 'quiz', 'questions.js'), path.join(client, 'quiz', 'questions.js'));
const publicImageFiles = fs.readdirSync(path.join(root, 'images'))
  .filter((name) => /\.(png|jpe?g|webp|gif)$/i.test(name))
  .filter((name) => !/^mock[23]-/i.test(name))
  .sort();
fs.mkdirSync(path.join(client, 'images'), { recursive: true });
for (const file of publicImageFiles) fs.copyFileSync(path.join(root, 'images', file), path.join(client, 'images', file));

const documents = documentSpecs.map(([source, id, category]) => {
  const markdown = fs.readFileSync(path.join(root, source), 'utf8');
  return {
    id,
    source,
    category,
    title: extractTitle(markdown, category),
    searchText: markdown.replace(/[`#*_[\]()|>-]/g, ' ').replace(/\s+/g, ' ').slice(0, 12000),
    html: renderMarkdown(markdown),
  };
});
const images = publicImageFiles.map((file) => ({
  file,
  label: file.replace(/\.(png|jpe?g|webp|gif)$/i, '').replace(/[-_]+/g, ' '),
}));
fs.writeFileSync(path.join(client, 'content.json'), JSON.stringify({ documents, images }, null, 2), 'utf8');

const hosting = { project_id: projectId, d1: null, r2: null };
fs.mkdirSync(path.join(root, '.openai'), { recursive: true });
fs.writeFileSync(path.join(root, '.openai', 'hosting.json'), `${JSON.stringify(hosting, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(dist, '.openai', 'hosting.json'), `${JSON.stringify(hosting, null, 2)}\n`, 'utf8');

fs.writeFileSync(path.join(server, 'index.js'), `export default {\n  async fetch(request, env) {\n    const response = await env.ASSETS.fetch(request);\n    const headers = new Headers(response.headers);\n    headers.set('cache-control', 'private, no-store');\n    headers.set('x-content-type-options', 'nosniff');\n    headers.set('referrer-policy', 'no-referrer');\n    headers.set('x-frame-options', 'DENY');\n    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });\n  }\n};\n`, 'utf8');
fs.writeFileSync(path.join(server, 'wrangler.json'), `${JSON.stringify({
  main: 'index.js',
  compatibility_date: '2026-08-01',
  assets: { directory: '../client', binding: 'ASSETS', not_found_handling: 'single-page-application' },
}, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({ documents: documents.length, images: images.length, questionsAssets: fs.readdirSync(path.join(client, 'quiz')).length, projectId }, null, 2));
