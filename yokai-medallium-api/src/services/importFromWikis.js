import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import { pool } from '../config/db.js';

dotenv.config();

const FANDOM_BASE_URL = process.env.FANDOM_BASE_URL || 'https://yokaiwatch.fandom.com';
const API_URL = `${FANDOM_BASE_URL}/api.php`;

const CATEGORY_CANDIDATES = [
  'Category:Yo-kai',
  'Category:Yo-kai_Watch_characters',
  'Category:Yo-kai_Watch_1_Yo-kai'
];

const LIST_PAGE_CANDIDATES = [
  'Yo-kai Medallium',
  'List of Yo-kai by Medallium Number (Yo-kai Watch)',
  'List of Yo-kai by Medallium Number (Yo-kai Watch 2)',
  'List of Yo-kai by Medallium Number (Yo-kai Watch 3)',
  'List of Yo-kai by Medallium Number (Yo-kai Watch Blasters)',
  'List of Yo-kai by Medallium Number (Yo-kai Watch Busters 2)',
  'List of Yo-kai by Medallium Number (Yo-kai Watch: Wibble Wobble)',
  'List of Yo-kai by Medallium Number (Yo-kai Watch World)',
  'List of Yo-kai by Medallium Number (Yo-kai Sangokushi)'
];

const BAD_TITLE_PATTERNS = [
  /^Category:/i,
  /^File:/i,
  /^Template:/i,
  /^Episode/i,
  /^EP\d+/i,
  /\(anime\)/i,
  /\(merchandise\)/i,
  /^Yo-kai Watch\s*\(/i,
  /^List of /i,
  /^Yo-kai Medals/i,
  /^Yo-kai Pad/i,
  /^Nathan Adams$/i,
  /^Lily Adams$/i,
  /^Recap Time$/i
];

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const cleanText = (value = '') =>
  value
    .replace(/\s+/g, ' ')
    .replace(/\[[^\]]*\]/g, '')
    .trim();

const parseInfobox = ($) => {
  const data = {};
  $('aside.portable-infobox section.pi-item').each((_, element) => {
    const label = cleanText($(element).find('.pi-data-label').text()).toLowerCase();
    const content = cleanText($(element).find('.pi-data-value').text());
    if (label && content) {
      data[label] = content;
    }
  });
  return data;
};

const parseYoKaiPage = async (title) => {
  const response = await axios.get(API_URL, {
    params: {
      action: 'parse',
      page: title,
      prop: 'text|images',
      format: 'json'
    }
  });

  const html = response.data?.parse?.text?.['*'];
  if (!html) return null;

  const $ = cheerio.load(html);
  const infobox = parseInfobox($);

  const articleParagraph = cleanText($('.mw-parser-output > p').first().text());
  const rawImage = $('aside.portable-infobox img').first().attr('src') || '';
  const imageUrl = rawImage.startsWith('http') ? rawImage : rawImage ? `https:${rawImage}` : null;

  const medalCandidate = $('img[src*="Medal"], img[alt*="medal" i]').first().attr('src') || null;
  const medalImageUrl = medalCandidate
    ? medalCandidate.startsWith('http')
      ? medalCandidate
      : `https:${medalCandidate}`
    : null;

  const tribe = infobox['tribe'] || infobox['tribes'] || null;
  const rankCode = infobox['rank'] || infobox['ranking'] || null;
  const medalNumber = infobox['medallium no.'] || infobox['medallium #'] || infobox['medal no.'] || null;

  return {
    slug: slugify(title),
    name: title.replace(/_/g, ' '),
    tribe,
    rankCode,
    medalNumber,
    descriptionText: articleParagraph || null,
    imageUrl,
    medalImageUrl,
    wikiUrl: `${FANDOM_BASE_URL}/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
    metadataJson: JSON.stringify({ infobox })
  };
};

const fetchCategoryMembers = async (categoryTitle, limit = 500) => {
  const members = [];
  let continueToken;

  do {
    const response = await axios.get(API_URL, {
      params: {
        action: 'query',
        list: 'categorymembers',
        cmtitle: categoryTitle,
        cmlimit: 500,
        cmtype: 'page',
        format: 'json',
        cmcontinue: continueToken
      }
    });

    const batch = response.data?.query?.categorymembers || [];
    batch.forEach((entry) => {
      if (!entry.title.startsWith('Category:') && !entry.title.includes('(disambiguation)')) {
        members.push(entry.title);
      }
    });

    continueToken = response.data?.continue?.cmcontinue;
    if (members.length >= limit) break;
  } while (continueToken);

  return members.slice(0, limit);
};

const fetchPageLinks = async (pageTitle) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        action: 'parse',
        page: pageTitle,
        prop: 'links',
        format: 'json'
      }
    });

    const links = response.data?.parse?.links || [];
    return links
      .map((entry) => entry['*'])
      .filter(Boolean)
      .filter((title) => !BAD_TITLE_PATTERNS.some((pattern) => pattern.test(title)));
  } catch {
    return [];
  }
};

const upsertYoKai = async (record) => {
  await pool.query(
    `INSERT INTO yokai (slug, name, tribe, rank_code, medal_number, description_text, image_url, medal_image_url, wiki_url, metadata_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       tribe = VALUES(tribe),
       rank_code = VALUES(rank_code),
       medal_number = VALUES(medal_number),
       description_text = VALUES(description_text),
       image_url = VALUES(image_url),
       medal_image_url = VALUES(medal_image_url),
       wiki_url = VALUES(wiki_url),
       metadata_json = VALUES(metadata_json)`,
    [
      record.slug,
      record.name,
      record.tribe,
      record.rankCode,
      record.medalNumber,
      record.descriptionText,
      record.imageUrl,
      record.medalImageUrl,
      record.wikiUrl,
      record.metadataJson
    ]
  );
};

export const runImport = async ({ limit = 300 } = {}) => {
  const uniqueTitles = new Set();

  for (const category of CATEGORY_CANDIDATES) {
    const members = await fetchCategoryMembers(category, limit);
    members.forEach((title) => uniqueTitles.add(title));
  }

  for (const listPage of LIST_PAGE_CANDIDATES) {
    const links = await fetchPageLinks(listPage);
    links.forEach((title) => uniqueTitles.add(title));
  }

  const titles = Array.from(uniqueTitles)
    .filter((title) => !BAD_TITLE_PATTERNS.some((pattern) => pattern.test(title)))
    .slice(0, limit);
  let imported = 0;

  for (const title of titles) {
    try {
      const parsed = await parseYoKaiPage(title);
      if (parsed) {
        await upsertYoKai(parsed);
        imported += 1;
      }
    } catch (error) {
      console.warn(`Import ignoré pour ${title}:`, error.message);
    }
  }

  return { scanned: titles.length, imported };
};

if (process.argv[1]?.includes('importFromWikis.js')) {
  runImport({ limit: Number(process.env.IMPORT_LIMIT || 300) })
    .then((result) => {
      console.log('Import terminé:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Erreur import wiki:', error);
      process.exit(1);
    });
}
