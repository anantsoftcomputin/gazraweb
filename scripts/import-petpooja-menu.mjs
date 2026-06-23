import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const now = new Date().toISOString();

const categories = [
  { slug: 'pine-mein', name: 'Pine Mein', order: 1 },
  { slug: 'nashte-mein', name: 'Nashte Mein', order: 2 },
  { slug: 'khane-mein', name: 'Khane Mein', order: 3 },
  { slug: 'meetha', name: 'Meetha', order: 4 },
  { slug: 'extra-item', name: 'Extra Item', order: 5 },
  { slug: 'sugras-product', name: 'Sugras Product', order: 6 },
  { slug: 'gazra-ki-dukan', name: 'Gazra Ki Dukan', order: 7 }
];

const menuItems = [
  ['pine-mein', 'Amba Variyali Sherbet', '₹195', 'A cooling mango and fennel sherbet with a soft floral sweetness, made for slow sips on warm afternoons.'],
  ['pine-mein', 'Alkaline Mineral Water', '₹200', 'Premium alkaline mineral water with a clean, crisp finish to refresh the palate between bold bites.'],
  ['pine-mein', 'Mogra Shikanji', '₹205', 'A fragrant shikanji lifted with enchanting mogra notes, bright citrus, and a delicate festive aroma.'],
  ['pine-mein', 'Pan Sherbet', '₹195', 'A playful paan-inspired sherbet with cooling betel leaf notes, gentle spice, and a sweet refreshing finish.'],
  ['pine-mein', 'Coffee', '₹200', 'Freshly brewed coffee with comforting roasted notes and a smooth, cafe-style finish.'],
  ['pine-mein', 'Cutting Chai', '₹105', 'Mumbai-style cutting chai brewed strong with milk, tea, and warming spice in every nostalgic sip.'],
  ['pine-mein', 'Fresh Lime Water', '₹130', 'A bright, thirst-quenching lime cooler balanced with a clean sweet-salty sparkle.'],
  ['pine-mein', 'Gulab E-Khas', '₹185', 'A rose-forward cooler with a velvety floral aroma and a gentle sweetness that feels instantly festive.'],
  ['pine-mein', 'Fresh Lime Soda', '₹145', 'Zesty lime soda with lively bubbles and a sharp, refreshing citrus lift.'],
  ['pine-mein', 'Sharbat Nimbu Goti', '₹155', 'A nostalgic lemon sharbat with tangy nimbu brightness and a playful street-style edge.'],
  ['pine-mein', 'Zinggy Aloobukhara', '₹195', 'A zingy plum cooler with sweet-tart aloobukhara depth and a refreshing fruity snap.'],
  ['pine-mein', 'Black Coffee', '₹120', 'Bold black coffee with clean roasted bitterness and a focused, no-fuss finish.'],
  ['nashte-mein', 'Idada Chutney', '₹185', 'Soft, steamed Gujarati idada served with lively chutney for a light, tangy, and comforting snack.'],
  ['nashte-mein', "Chef Ranveer Brar's Special Snack: Potato And Raw Mango", '₹235', 'A chef-special snack where creamy potato meets sharp raw mango for a vibrant, chatpata bite.'],
  ['nashte-mein', 'Falsa Guava Chilli Pani Puri', '₹215', 'Crisp puris filled with a sweet-tart falsa and guava chilli pani that bursts with fruit, spice, and crunch.'],
  ['nashte-mein', 'Shakarkandi Tuk', '₹195', 'Golden sweet potato bites tossed with warm spices for a crisp-edged, naturally sweet street-style snack.'],
  ['nashte-mein', 'Lotus Stem Bhel', '₹195', 'Crunchy lotus stem folded into tangy bhel masala with chutneys, sev, and a bright chaat finish.'],
  ['nashte-mein', 'Batata Vada (2pcs)', '₹100', 'Two classic potato vadas with a crisp gram-flour shell and a warmly spiced, fluffy center.'],
  ['nashte-mein', 'Bombay Vada Pav (2pcs)', '₹140', 'Two Bombay-style vada pavs packed with spicy potato vada, chutney, and soft pav comfort.'],
  ['nashte-mein', 'Dabeli Puff', '₹120', 'A flaky puff filled with dabeli-style spiced potato, sweet chutney, peanuts, and a hint of tang.'],
  ['nashte-mein', 'Dangelu', '₹185', 'A rustic Gujarati snack with comforting spice, crisp edges, and the homely warmth of regional cooking.'],
  ['nashte-mein', 'Bombay Toastie Sandwich', '₹195', 'A grilled Bombay toastie layered with spiced filling, chutney, and golden-crisp bread.'],
  ['nashte-mein', 'Kothimbir Vadi', '₹175', 'Coriander-rich Maharashtrian vadi with nutty besan, gentle spice, and a crisp pan-fried bite.'],
  ['nashte-mein', 'Khandvi Chaat', '₹170', 'Silky khandvi rolls turned into a playful chaat with chutneys, crunch, and a tangy finish.'],
  ['nashte-mein', 'Thecha Paneer Frankie', '₹165', 'Soft paneer wrapped with fiery Maharashtrian thecha for a bold, creamy, street-style frankie.'],
  ['nashte-mein', 'Tam-Tam', '₹155', 'A crunchy, chatpata snack mix layered with spice, tang, and addictive tea-time energy.'],
  ['nashte-mein', 'The Gujju Mezze', '₹220', 'A Gujarati-inspired mezze platter with snackable textures, chutney-led flavors, and generous sharing energy.'],
  ['nashte-mein', 'Sabudana Vada', '₹140', 'Crisp sabudana vadas with a tender sago and potato center, finished with peanut warmth.'],
  ['khane-mein', 'Aamras Puri', '₹285', 'Silky mango aamras served with puffed puris for a sweet, sunny, deeply nostalgic meal.'],
  ['khane-mein', 'Sevbhaji And Rice', '₹295', 'A hearty sev bhaji with comforting masala depth, served with rice for a satisfying homestyle plate.'],
  ['khane-mein', 'Pithla Bhakhar', '₹275', 'Rustic Maharashtrian pithla paired with bhakhar, full of earthy besan comfort and village-style warmth.'],
  ['khane-mein', 'Dhokli Nu Shak With Jawar No Rotlo', '₹260', 'Tender dhokli in a spiced shak served with jowar rotlo for a soulful Gujarati main.'],
  ['khane-mein', 'Bajni Dhapatte With Chawlichi Usal', '₹285', 'Nutritious bajni dhapatte paired with chawli usal, bringing grainy depth and hearty legume comfort.'],
  ['khane-mein', 'Vaghareli Fada Khichdi Platter', '₹305', 'Broken wheat khichdi tempered with aromatic vaghar and served as a wholesome, comforting platter.'],
  ['khane-mein', 'Puneri Misal Pav', '₹275', 'Puneri-style misal with spicy tari, crunchy farsan, sprouts, and pav for a bold Maharashtrian classic.'],
  ['meetha', 'Caramel Custard', '₹185', 'A silky caramel custard with a glossy bittersweet top and a soft, melt-away spoonful.'],
  ['meetha', 'Fruit Salad (Custard)', '₹255', 'Fresh fruit folded through creamy custard for a chilled, colorful, old-school dessert.'],
  ['meetha', 'Mango Sheera', '₹285', 'Warm, fragrant sheera enriched with mango sweetness and a soft ghee-kissed texture.'],
  ['meetha', 'Parsi Mawa Cake', '₹175', 'A tender mawa cake with buttery richness, milky sweetness, and bakery-style nostalgia.'],
  ['meetha', 'Puran Poli', '₹215', 'Soft poli stuffed with sweet lentil puran, perfumed with cardamom and finished with homely richness.'],
  ['meetha', 'Kokum Coconut Cake', '₹175', 'A tropical cake pairing kokum tang with coconut sweetness for a bright, regional dessert twist.'],
  ['extra-item', '1 Piece Vadapav', '₹70', 'One extra vada pav for when the craving asks for just one more warm, spicy bite.'],
  ['extra-item', 'Extra Falsa Pani', '₹90', 'An extra serving of fruity falsa pani to add more sweet-tart sparkle to your chaat.'],
  ['extra-item', 'Extra Guava Pani', '₹90', 'An extra pour of guava chilli pani with fruitiness, heat, and tang in perfect balance.'],
  ['extra-item', 'Extra Masala', '₹50', 'A punchy extra masala portion to turn up the spice and chaat-style depth.'],
  ['extra-item', 'Extra Aamras', '₹100', 'An extra bowl of smooth mango aamras for a richer, sweeter plate.'],
  ['extra-item', 'Roasted Papad', '₹50', 'Crisp roasted papad with a smoky crunch that pairs beautifully with homestyle mains.'],
  ['extra-item', 'Extra Green Thecha', '₹55', 'A fiery green chilli thecha for anyone who likes their plate bold and unapologetic.'],
  ['extra-item', 'Extra Pav (2pcs)', '₹40', 'Two extra soft pavs, ready to scoop up every last bit of misal, bhaji, or chutney.'],
  ['extra-item', 'Extra Salsa', '₹60', 'A fresh, tangy salsa add-on for a lively hit of brightness and crunch.'],
  ['extra-item', 'Extra Cheese Thecha', '₹95', 'Creamy cheese meets spicy thecha in an indulgent add-on with serious kick.'],
  ['extra-item', 'Extra Poori', '₹50', 'Extra puffed pooris to enjoy every spoonful of aamras or curry.'],
  ['extra-item', 'Extra Bhakhar', '₹55', 'An extra rustic bhakhar with earthy grain flavor and a satisfying bite.'],
  ['extra-item', 'Extra Dhapate', '₹60', 'Extra dhapate with hearty grain texture and a comforting homemade feel.'],
  ['extra-item', 'Extra Chivda', '₹30', 'A crunchy chivda add-on for extra texture, spice, and snackable joy.'],
  ['extra-item', 'Extra Cheese', '₹95', 'A generous cheese add-on for a creamy, indulgent finish.'],
  ['extra-item', 'Extra Ghee Gud', '₹40', 'A classic pairing of ghee and jaggery for a sweet, rich, traditional finish.'],
  ['sugras-product', 'Peanut Chutney', '₹120', 'A 250 gm jar of nutty peanut chutney with roasted depth and everyday meal-boosting spice.'],
  ['sugras-product', 'Coconut Garlic Chutney', '₹120', 'A 250 gm chutney with coconut richness, garlic warmth, and a bold Maharashtrian-style finish.'],
  ['sugras-product', 'Flax Seed Chutney', '₹120', 'A 200 gm flax seed chutney with earthy nuttiness, gentle spice, and wholesome crunch.'],
  ['sugras-product', 'Lemon Crush', '₹210', 'A 300 gm lemon crush with bright citrus intensity for coolers, sherbets, and quick refreshers.'],
  ['sugras-product', 'Kadi Patta Chutney', '₹120', 'A 200 gm curry leaf chutney with aromatic herbal depth and roasted savory notes.'],
  ['gazra-ki-dukan', '500 Ml Vetiver(Khus)', '₹725', 'A 500 ml vetiver khus bottle with earthy, cooling fragrance and a naturally refreshing character.'],
  ['gazra-ki-dukan', '1 Ltr Vetiver (Khus) Vlay Bottles', '₹870', 'A 1 litre vetiver khus bottle with deep cooling notes and a clean, traditional aroma.']
];

function loadEnv() {
  const env = {};
  const raw = fs.readFileSync('.env', 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    env[trimmed.slice(0, index)] = trimmed.slice(index + 1);
  }
  return env;
}

function getProjectId() {
  const env = loadEnv();
  return env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || env.VITE_FIREBASE_PROJECT_ID;
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getFirebaseCliAccessToken() {
  execFileSync('firebase', ['projects:list', '--json'], { stdio: 'ignore' });
  const configPath = `${process.env.HOME}/.config/configstore/firebase-tools.json`;
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config.tokens.access_token;
}

function firestoreValue(value) {
  if (value === null) return { nullValue: null };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: value } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(firestoreValue) } };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  return { stringValue: String(value) };
}

function firestoreFields(data) {
  return {
    fields: Object.fromEntries(Object.entries(data).map(([key, value]) => [key, firestoreValue(value)]))
  };
}

function fromFirestoreValue(value) {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(fromFirestoreValue);
  if ('timestampValue' in value) return value.timestampValue;
  return null;
}

function fromFirestoreDocument(document) {
  const id = document.name.split('/').pop();
  const fields = {};
  for (const [key, value] of Object.entries(document.fields || {})) {
    fields[key] = fromFirestoreValue(value);
  }
  return { id, path: document.name, ...fields };
}

async function firestoreRequest(path, options = {}) {
  const response = await fetch(`https://firestore.googleapis.com/v1/${path}`, {
    ...options,
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      ...(options.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${path} failed: ${JSON.stringify(body)}`);
  }
  return body;
}

async function listCollection(collectionName) {
  const body = await firestoreRequest(`${databasePath}/documents/${collectionName}?pageSize=1000`);
  return (body.documents || []).map(fromFirestoreDocument);
}

async function batchWrite(writes) {
  return firestoreRequest(`${databasePath}/documents:batchWrite`, {
    method: 'POST',
    body: JSON.stringify({ writes })
  });
}

const projectId = getProjectId();
if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env');
}

const token = getFirebaseCliAccessToken();
const databasePath = `projects/${projectId}/databases/(default)`;

console.log(`Using Firebase project ${projectId}`);
console.log('Reading existing cafe categories and menu items...');
const existingCategories = await listCollection('cafeCategories');
const existingItems = await listCollection('menuItems');
const writes = [];

let categoriesCreated = 0;
let categoriesUpdated = 0;
for (const category of categories) {
  const existing = existingCategories.find((item) => item.slug === category.slug);
  const documentPath = existing?.path || `${databasePath}/documents/cafeCategories/${category.slug}`;
  const data = { ...category, updatedAt: now };
  if (existing) {
    categoriesUpdated += 1;
  } else {
    data.createdAt = now;
    categoriesCreated += 1;
  }
  writes.push({ update: { name: documentPath, ...firestoreFields(data) } });
}

let itemsCreated = 0;
let itemsUpdated = 0;
const categoryItemOrder = {};
for (const [category, name, price, description] of menuItems) {
  categoryItemOrder[category] = (categoryItemOrder[category] || 0) + 1;
  const existing = existingItems.find((item) => (
    (item.name || '').trim().toLowerCase() === name.toLowerCase() &&
    item.category === category
  ));
  const documentPath = existing?.path || `${databasePath}/documents/menuItems/${category}-${slugify(name)}`;
  const data = {
    name,
    description,
    price,
    category,
    spiceLevel: 'none',
    images: [],
    image: '',
    tags: [],
    order: categoryItemOrder[category],
    popular: false,
    recommended: false,
    available: true,
    source: 'petpooja',
    sourceUrl: 'https://dinein.petpooja.com/orders/category/ey1mig5j/20',
    updatedAt: now
  };

  if (existing) {
    itemsUpdated += 1;
  } else {
    data.createdAt = now;
    itemsCreated += 1;
  }
  writes.push({ update: { name: documentPath, ...firestoreFields(data) } });
}

console.log(`Writing ${writes.length} category/menu documents...`);
await batchWrite(writes);

console.log(JSON.stringify({
  categoriesCreated,
  categoriesUpdated,
  itemsCreated,
  itemsUpdated,
  totalItems: menuItems.length
}, null, 2));
