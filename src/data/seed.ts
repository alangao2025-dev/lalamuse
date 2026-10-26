import type { Customer, Order, Post, Product, State } from "../types";

const day = 86400000;
const ago = (d: number) => new Date(Date.now() - d * day).toISOString();

const C = {
  blush: { name: "Blush", hex: "#E9C4BE" },
  ivory: { name: "Ivory", hex: "#F3EBDD" },
  black: { name: "Noir", hex: "#2B2326" },
  sage: { name: "Sage", hex: "#B9C2A8" },
  camel: { name: "Camel", hex: "#C49A6C" },
  gold: { name: "Gold", hex: "#D4B47C" },
  silver: { name: "Silver", hex: "#C9C9CC" },
  rose: { name: "Rosewood", hex: "#B97A7F" },
  sky: { name: "Mist Blue", hex: "#B8C7D6" },
  lilac: { name: "Lilac", hex: "#CDB9D8" },
};

const XS_XL = ["XS", "S", "M", "L", "XL"];
const SHOE = ["35", "36", "37", "38", "39", "40", "41"];

type Seed = Omit<Product, "images" | "status" | "createdAt" | "tags" | "isNew" | "isBest"> &
  Partial<Pick<Product, "tags" | "isNew" | "isBest">> & { age: number };

const seeds: Seed[] = [
  { id: "p1", name: "Camille Silk Slip Dress", category: "clothing", kind: "dress", price: 128, compareAt: 158, stock: 24, colors: [C.blush, C.black, C.ivory], sizes: XS_XL, description: "A bias-cut slip dress in washed mulberry silk that skims the body and moves beautifully. Adjustable straps and a softly draped cowl neckline.", material: "100% mulberry silk · Dry clean or cold hand wash", sold: 312, isBest: true, tags: ["silk", "date night"], age: 40 },
  { id: "p2", name: "Elodie Puff-Sleeve Blouse", category: "clothing", kind: "blouse", price: 69, stock: 40, colors: [C.ivory, C.sky], sizes: XS_XL, description: "Romantic puff sleeves, a delicate square neckline and covered buttons. Tuck into denim or a satin skirt.", material: "Cotton-voile blend · Machine wash cold", sold: 188, isNew: true, tags: ["workwear"], age: 5 },
  { id: "p3", name: "Margot Satin Midi Skirt", category: "clothing", kind: "skirt", price: 79, stock: 32, colors: [C.sage, C.camel, C.black], sizes: XS_XL, description: "A fluid satin midi skirt with a hidden elastic back waist. Day-to-night essential.", material: "Recycled satin · Cold hand wash", sold: 240, isBest: true, tags: ["capsule"], age: 30 },
  { id: "p4", name: "Saint-Germain Wool Coat", category: "clothing", kind: "coat", price: 238, compareAt: 289, stock: 12, colors: [C.camel, C.ivory], sizes: XS_XL, description: "A relaxed double-breasted coat in a soft wool blend. Dropped shoulders and deep pockets.", material: "70% wool, 30% recycled polyamide · Dry clean", sold: 96, isNew: true, tags: ["outerwear"], age: 3 },
  { id: "p5", name: "Ballerine Pointed Flats", category: "shoes", kind: "flats", price: 98, stock: 50, colors: [C.blush, C.black], sizes: SHOE, description: "Pointed-toe flats in buttery nappa leather with a cushioned insole for all-day comfort.", material: "Nappa leather · Leather lining", sold: 276, isBest: true, tags: ["everyday"], age: 60 },
  { id: "p6", name: "Odette Slingback Heels", category: "shoes", kind: "heels", price: 135, stock: 18, colors: [C.ivory, C.rose], sizes: SHOE, description: "A 6cm kitten heel slingback with a softly squared toe. Elegant and genuinely walkable.", material: "Patent leather · 6cm heel", sold: 150, isNew: true, tags: ["wedding guest"], age: 8 },
  { id: "p7", name: "Juliette Ankle Boots", category: "shoes", kind: "boots", price: 168, stock: 9, colors: [C.black, C.camel], sizes: SHOE, description: "Sleek ankle boots with a stacked block heel and side zip.", material: "Suede upper · Rubber sole", sold: 84, tags: ["autumn"], age: 25 },
  { id: "p8", name: "Riviera Woven Tote", category: "bags", kind: "tote", price: 112, stock: 30, colors: [C.camel, C.ivory], sizes: ["One size"], description: "A roomy hand-woven tote with leather handles — from market to beach.", material: "Raffia & leather", sold: 201, isBest: true, tags: ["summer"], age: 45 },
  { id: "p9", name: "Lune Mini Handbag", category: "bags", kind: "handbag", price: 148, compareAt: 178, stock: 15, colors: [C.blush, C.black, C.lilac], sizes: ["One size"], description: "A structured mini bag with a crescent top handle and detachable chain strap.", material: "Grained leather · Gold-tone hardware", sold: 167, isNew: true, tags: ["gift"], age: 2 },
  { id: "p10", name: "Soirée Pearl Clutch", category: "bags", kind: "clutch", price: 89, stock: 20, colors: [C.ivory], sizes: ["One size"], description: "A satin clutch with a faux-pearl clasp for evenings to remember.", material: "Satin · Faux pearl", sold: 73, tags: ["evening"], age: 50 },
  { id: "p11", name: "Perle Drop Earrings", category: "jewelry", kind: "earrings", price: 42, stock: 80, colors: [C.gold, C.silver], sizes: ["One size"], description: "Freshwater pearls suspended from fine 18k gold-plated hoops.", material: "18k gold plated sterling silver · Freshwater pearl", sold: 420, isBest: true, tags: ["pearl", "gift"], age: 70 },
  { id: "p12", name: "Étoile Layered Necklace", category: "jewelry", kind: "necklace", price: 56, stock: 60, colors: [C.gold], sizes: ["One size"], description: "Two delicate chains with a tiny star charm, pre-layered so they never tangle.", material: "18k gold plated · Hypoallergenic", sold: 233, isNew: true, tags: ["layering"], age: 4 },
  { id: "p13", name: "Aurore Stacking Ring Set", category: "jewelry", kind: "ring", price: 38, stock: 70, colors: [C.gold, C.silver], sizes: ["5", "6", "7", "8"], description: "A set of three slim rings — one plain, one twisted, one with a tiny crystal.", material: "Gold vermeil · Cubic zirconia", sold: 198, tags: ["stacking"], age: 35 },
  { id: "p14", name: "Ondine Chain Bracelet", category: "jewelry", kind: "bracelet", price: 34, stock: 0, colors: [C.gold], sizes: ["One size"], description: "A fluid herringbone chain bracelet that catches the light.", material: "18k gold plated brass", sold: 145, tags: ["everyday"], age: 55 },
  { id: "p15", name: "Fleur Silk Square Scarf", category: "accessories", kind: "scarf", price: 49, stock: 45, colors: [C.blush, C.sky], sizes: ["One size"], description: "A printed silk twill square — wear it in your hair, on your bag or around your neck.", material: "100% silk twill · 70×70cm", sold: 122, isNew: true, tags: ["silk", "gift"], age: 6 },
  { id: "p16", name: "Côte d'Azur Straw Hat", category: "accessories", kind: "hat", price: 58, stock: 25, colors: [C.camel], sizes: ["S/M", "M/L"], description: "A wide-brim straw hat with a grosgrain ribbon band.", material: "Paper straw · Grosgrain", sold: 90, tags: ["summer"], age: 20 },
  { id: "p17", name: "Gigi Cat-Eye Sunglasses", category: "accessories", kind: "sunglasses", price: 62, stock: 38, colors: [C.black, C.rose], sizes: ["One size"], description: "Retro cat-eye frames with UV400 gradient lenses.", material: "Acetate · UV400", sold: 177, isBest: true, tags: ["summer"], age: 28 },
];

const ZH_P: Record<string, Product["zh"]> = {
  p1: { name: "卡米尔真丝吊带裙", description: "水洗桑蚕丝斜裁吊带裙，轻贴身形、走动时垂坠灵动。可调节肩带，柔和的垂坠领口。", material: "100% 桑蚕丝 · 干洗或冷水手洗" },
  p2: { name: "埃洛蒂泡泡袖衬衫", description: "浪漫泡泡袖、精致方领与包扣设计。塞进牛仔裤或缎面半裙都好看。", material: "棉质巴里纱混纺 · 冷水机洗" },
  p3: { name: "玛戈缎面中长半裙", description: "垂顺的缎面中长裙，后腰隐形松紧。从白天到夜晚的必备单品。", material: "再生缎面 · 冷水手洗" },
  p4: { name: "圣日耳曼羊毛大衣", description: "宽松双排扣大衣，柔软羊毛混纺，落肩剪裁，深口袋。", material: "70% 羊毛，30% 再生锦纶 · 干洗" },
  p5: { name: "芭蕾尖头平底鞋", description: "柔软纳帕羊皮尖头平底鞋，缓震鞋垫，全天舒适。", material: "纳帕皮 · 真皮内里" },
  p6: { name: "奥黛特后空中跟鞋", description: "6 厘米猫跟后空鞋，柔和方头，优雅又真正好走。", material: "漆皮 · 6 厘米跟高" },
  p7: { name: "朱丽叶短靴", description: "利落短靴，叠层粗跟，侧拉链设计。", material: "麂皮鞋面 · 橡胶鞋底" },
  p8: { name: "里维埃拉编织托特包", description: "手工编织大容量托特包，皮革提手——从市集到海边。", material: "拉菲草 & 皮革" },
  p9: { name: "月光迷你手提包", description: "硬挺迷你包，新月形提手，附可拆卸链条肩带。", material: "颗粒皮 · 金色五金" },
  p10: { name: "晚宴珍珠手拿包", description: "缎面手拿包配仿珍珠搭扣，为难忘的夜晚而生。", material: "缎面 · 仿珍珠" },
  p11: { name: "珍珠吊坠耳环", description: "淡水珍珠悬挂于纤细的 18K 镀金耳圈。", material: "18K 镀金纯银 · 淡水珍珠" },
  p12: { name: "星光叠戴项链", description: "两条精致细链配小星星吊坠，预先叠好，永不缠绕。", material: "18K 镀金 · 低致敏" },
  p13: { name: "晨曦叠戴戒指套装", description: "三枚细戒：素圈、麻花与一颗小锆石。", material: "镀金纯银 · 立方氧化锆" },
  p14: { name: "温蒂妮链条手链", description: "流动感人字链手链，闪耀光泽。", material: "18K 镀金黄铜" },
  p15: { name: "花语真丝方巾", description: "印花真丝斜纹方巾——系发、挂包或围在颈间。", material: "100% 真丝斜纹 · 70×70cm" },
  p16: { name: "蔚蓝海岸草编帽", description: "宽檐草编帽，罗缎丝带装饰。", material: "纸草 · 罗缎" },
  p17: { name: "琪琪猫眼墨镜", description: "复古猫眼镜框，UV400 渐变镜片。", material: "板材 · UV400" },
};

export const seedProducts: Product[] = seeds.map(({ age, ...s }) => ({
  ...s,
  tags: s.tags ?? [],
  isNew: s.isNew ?? false,
  isBest: s.isBest ?? false,
  images: [],
  status: "active",
  createdAt: ago(age),
  zh: ZH_P[s.id],
}));

const ZH_A: Record<string, Post["zh"]> = {
  a1: { title: "巴黎胶囊衣橱：10 件单品，30 套穿搭", excerpt: "如何打造一个小而美、每天都能穿的衣橱——少买一点，多穿一点。",
    body: "法式随性风格的秘诀不是更大的衣柜，而是更小、更用心挑选的衣柜。\n\n## 从中性色打底\n选两三种你喜欢的基础色——象牙白、驼色和黑色永不过时——围绕它们搭建衣橱。每件单品都应能和至少三件其他单品搭配。\n\n## 投资面料\n一条真丝吊带裙、一件羊毛大衣和一双皮质平底鞋，能比十件潮流单品穿得更久。买之前摸一摸面料，品质是摸得出来的。\n\n## 加一个浪漫细节\n泡泡袖、一颗珍珠、一条丝巾。每套穿搭一个柔美细节，女人味十足又不显刻意。\n\n## 这 10 件单品\n吊带裙、泡泡袖衬衫、缎面中长裙、直筒牛仔裤、羊毛大衣、尖头平底鞋、后空高跟鞋、编织托特包、珍珠耳环、真丝方巾。" },
  a2: { title: "一条吊带裙，三种穿法", excerpt: "日常、通勤、晚宴——看一条真丝吊带裙如何用几件配饰切换风格。",
    body: "在这支 60 秒的穿搭视频里，我们带着卡米尔真丝吊带裙从早午餐走到晚餐。\n\n## 造型 1 — 周末\n内搭白 T，配平底鞋和编织托特包。\n\n## 造型 2 — 通勤\n外搭羊毛大衣，换上后空高跟鞋。\n\n## 造型 3 — 晚宴\n珍珠耳环、缎面手拿包，再加一抹红唇。" },
  a3: { title: "秋季趋势报告：柔和剪裁与暖调中性色", excerpt: "驼色、巧克力色和奶油色回归——教你穿出本季最温柔的趋势。",
    body: "这一季的剪裁变得松弛：落肩、垂坠长裤和能把自己裹起来的大衣。\n\n## 暖调中性色\n驼色、焦糖、奶油与可可色，同色系叠穿。\n\n## 质感就是一切\n麂皮靴配缎面裙，再加一件粗针毛衣，不靠颜色也有层次。" },
  a4: { title: "夏日婚礼穿什么", excerpt: "优雅、舒适、又不会抢新娘风头的完美宾客穿搭。",
    body: "夏日婚礼适合透气面料和柔和色彩。\n\n## 选一个粉彩色\n雾霾蓝、丁香紫和鼠尾草绿上镜好看，清新自然。\n\n## 舒适的鞋跟\n猫跟或粗跟，让你从仪式一路跳到舞池。\n\n## 以珍珠收尾\n珍珠耳环和缎面手拿包永远得体。" },
  a5: { title: "丝巾的 5 种系法", excerpt: "发带、领结、包挂……一个全年都用得上的快速教程。",
    body: "一条真丝方巾是你能拥有的最百搭的配饰。暂停视频，跟着一起系。\n\n## 本期单品\n花语真丝方巾，70×70cm。" },
  a6: { title: "镀金首饰如何保养", excerpt: "几个简单习惯，让你的首饰闪耀多年。",
    body: "镀金层很娇贵，但稍加呵护就能长久。\n\n## 最后戴上，最先摘下\n喷完香水、擦完乳液再戴首饰；游泳或运动前摘下。\n\n## 分开收纳\n每件首饰单独放入收纳袋，避免刮花和缠绕。" },
};

export const seedPosts: Post[] = [
  {
    id: "a1", type: "article", title: "The Parisian Capsule: 10 Pieces, 30 Outfits", column: "Capsule Wardrobe",
    excerpt: "How to build a small, beautiful wardrobe that works every day of the month — with less shopping and more wearing.",
    body: "The secret to effortless French style isn't a bigger closet — it's a smaller one, chosen with care.\n\n## Start with a neutral base\nChoose two or three base colours you love — ivory, camel and noir are timeless — and build around them. Every piece should work with at least three others.\n\n## Invest in fabric\nA silk slip dress, a wool coat and a pair of leather flats will outlive ten trend pieces. Touch the fabric before you buy; quality is something you can feel.\n\n## Add one romantic detail\nA puff sleeve, a pearl, a silk scarf. One soft detail per outfit keeps the look feminine without feeling costumey.\n\n## The 10 pieces\nSlip dress, puff-sleeve blouse, satin midi skirt, straight jeans, wool coat, pointed flats, slingback heels, woven tote, pearl earrings, silk scarf.",
    palette: ["#F3E3DC", "#E2C3B8"], art: "dress", productIds: ["p1", "p2", "p3", "p5", "p11"], status: "published", publishedAt: ago(3), author: "Claire M.", views: 4820,
  },
  {
    id: "a2", type: "video", title: "One Slip Dress, Three Ways", column: "Styling Tips",
    excerpt: "Day, office and evening — watch how a single silk slip dress changes with a few accessories.",
    body: "In this 60-second lookbook we take the Camille silk slip dress from brunch to dinner.\n\n## Look 1 — Weekend\nLayer a white tee underneath, add flats and the woven tote.\n\n## Look 2 — Office\nThrow on the wool coat and swap to slingback heels.\n\n## Look 3 — Evening\nPearl drop earrings, the satin clutch and a red lip.",
    palette: ["#EBD9E3", "#CDB9D8"], art: "heels", productIds: ["p1", "p6", "p10", "p11"], videoUrl: "", duration: "1:02", status: "published", publishedAt: ago(5), author: "Studio M&B", views: 12930,
  },
  {
    id: "a3", type: "article", title: "Autumn Trend Report: Soft Tailoring & Warm Neutrals", column: "Trend Report",
    excerpt: "Camel, chocolate and cream are back — here's how to wear this season's softest trend.",
    body: "This season tailoring relaxes: dropped shoulders, fluid trousers and coats you can wrap yourself in.\n\n## Warm neutrals\nThink camel, caramel, cream and cocoa worn tone-on-tone.\n\n## Texture is everything\nMix suede boots with a satin skirt and a chunky knit for depth without colour.",
    palette: ["#EFE2D2", "#D2B48C"], art: "coat", productIds: ["p4", "p7", "p3"], status: "published", publishedAt: ago(9), author: "Léa R.", views: 3110,
  },
  {
    id: "a4", type: "article", title: "What to Wear to a Summer Wedding", column: "Occasion Wear",
    excerpt: "Guest-perfect outfits that are elegant, comfortable and never upstage the bride.",
    body: "Summer weddings call for breathable fabrics and soft colour.\n\n## Choose a pastel\nMist blue, lilac and sage photograph beautifully and feel fresh.\n\n## Comfortable heels\nA kitten heel or block heel will get you through the ceremony and the dance floor.\n\n## Finish with pearls\nPearl earrings and a satin clutch are always appropriate.",
    palette: ["#E3E8EF", "#B8C7D6"], art: "clutch", productIds: ["p6", "p10", "p11", "p15"], status: "published", publishedAt: ago(14), author: "Claire M.", views: 2650,
  },
  {
    id: "a5", type: "video", title: "5 Ways to Tie a Silk Scarf", column: "Styling Tips",
    excerpt: "Hair bow, neck tie, bag charm and more — a quick tutorial you'll use all year.",
    body: "A silk square is the most versatile accessory you can own. Pause the video and follow along.\n\n## Featured\nThe Fleur silk square scarf, 70×70cm.",
    palette: ["#F4E1E1", "#E9C4BE"], art: "scarf", productIds: ["p15", "p9"], videoUrl: "", duration: "2:18", status: "published", publishedAt: ago(18), author: "Studio M&B", views: 8700,
  },
  {
    id: "a6", type: "article", title: "How to Care for Gold-Plated Jewelry", column: "Care Guide",
    excerpt: "Simple habits that keep your pieces shining for years.",
    body: "Gold plating is delicate, but with a little care it lasts.\n\n## Last on, first off\nPut jewelry on after perfume and lotion, and take it off before swimming or exercise.\n\n## Store separately\nKeep each piece in its own pouch to avoid scratches and tangles.",
    palette: ["#F2EAD8", "#D4B47C"], art: "necklace", productIds: ["p12", "p13", "p14"], status: "published", publishedAt: ago(25), author: "Léa R.", views: 1980,
  },
];

const names: [string, string, string][] = [
  ["Emma Johnson", "emma.j@example.com", "United States"],
  ["Sophie Martin", "sophie.m@example.com", "France"],
  ["Olivia Brown", "olivia.b@example.com", "United Kingdom"],
  ["Mia Schneider", "mia.s@example.com", "Germany"],
  ["Ava Wilson", "ava.w@example.com", "Canada"],
  ["Chloé Dubois", "chloe.d@example.com", "France"],
  ["Isabella Rossi", "isa.r@example.com", "Italy"],
  ["Grace Lee", "grace.l@example.com", "Australia"],
];

export const seedCustomers: Customer[] = names.map(([name, email, country], i) => ({
  id: `c${i + 1}`, name, email, country, subscribed: i % 3 !== 2, joinedAt: ago(10 + i * 7),
}));

const statuses: Order["status"][] = ["paid", "paid", "shipped", "completed", "shipped", "completed", "paid", "pending", "completed", "refunded", "shipped", "completed"];

export const seedOrders: Order[] = statuses.map((status, i) => {
  const c = seedCustomers[i % seedCustomers.length];
  const picks = [seedProducts[(i * 3) % 17], seedProducts[(i * 5 + 2) % 17]].slice(0, (i % 2) + 1);
  const items = picks.map((p) => ({ productId: p.id, name: p.name, price: p.price, qty: 1 + (i % 3 === 0 ? 1 : 0), color: p.colors[0].name, size: p.sizes[0] }));
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = subtotal >= 79 ? 0 : 8;
  return {
    id: `MB${10240 + i}`, email: c.email, name: c.name,
    address: { line1: `${12 + i} Rose Avenue`, city: ["New York", "Paris", "London", "Berlin", "Toronto", "Lyon", "Milan", "Sydney"][i % 8], zip: `${10001 + i}`, country: c.country },
    items, subtotal, shipping, discount: 0, total: subtotal + shipping,
    payment: (["card", "paypal", "applepay"] as const)[i % 3], shippingMethod: "standard", status,
    carrier: status === "shipped" || status === "completed" ? "DHL Express" : undefined,
    tracking: status === "shipped" || status === "completed" ? `JD01460${3000 + i}` : undefined,
    createdAt: new Date(Date.now() - (i * 0.6 + 0.1) * day).toISOString(),
  };
});

export function seedState(): State {
  return {
    products: seedProducts,
    posts: seedPosts.map((p) => ({ ...p, zh: ZH_A[p.id] })),
    orders: seedOrders,
    customers: seedCustomers,
    settings: {
      storeName: "Muse & Bloom",
      announcement: "Free worldwide shipping on orders over $79 · Use code BLOOM10 for 10% off your first order",
      freeShipThreshold: 79,
      standardShip: 8,
      expressShip: 18,
      payments: { card: true, paypal: true, applepay: true },
      coupons: [{ code: "BLOOM10", percent: 10 }, { code: "MUSE15", percent: 15 }],
      heroTitle: "Soft Romance, Everyday",
      heroSubtitle: "The new season edit — silk, pearls and quiet elegance.",
      zh: {
        announcement: "订单满 $79 全球免运费 · 首单使用优惠码 BLOOM10 立享 9 折",
        heroTitle: "温柔浪漫，日日可穿",
        heroSubtitle: "新季精选——真丝、珍珠与安静的优雅。",
        lookTitle: "里维埃拉的周末",
        lookSubtitle: "一键购齐整套造型",
      },
      look: { id: "look1", title: "The Riviera Weekend", subtitle: "Shop the complete look", palette: ["#F3E3DC", "#E9C4BE"], productIds: ["p2", "p3", "p8", "p17"] },
    },
    cart: [],
    wishlist: [],
    user: null,
    admin: false,
  };
}
