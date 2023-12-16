/* empty css                           */import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, s as spreadAttributes, b as addAttribute, u as unescapeHTML, d as renderComponent, F as Fragment, e as renderHead, f as renderSlot } from '../astro.c1418b6c.mjs';
import { about, work, projects, education, achievements, contact, name, designation, location } from './content.js.c01eca11.mjs';
import { optimize } from 'svgo';
import 'cookie';
import '@astrojs/internal-helpers/path';
import 'kleur/colors';
import 'path-to-regexp';
import 'mime';
import 'html-escaper';
import 'string-width';

const SPRITESHEET_NAMESPACE = `astroicon`;

const baseURL = "https://api.astroicon.dev/v1/";
const requests = /* @__PURE__ */ new Map();
const fetchCache = /* @__PURE__ */ new Map();
async function get(pack, name) {
  const url = new URL(`./${pack}/${name}`, baseURL).toString();
  if (requests.has(url)) {
    return await requests.get(url);
  }
  if (fetchCache.has(url)) {
    return fetchCache.get(url);
  }
  let request = async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const contentType = res.headers.get("Content-Type");
    if (!contentType.includes("svg")) {
      throw new Error(`[astro-icon] Unable to load "${name}" because it did not resolve to an SVG!

Recieved the following "Content-Type":
${contentType}`);
    }
    const svg = await res.text();
    fetchCache.set(url, svg);
    requests.delete(url);
    return svg;
  };
  let promise = request();
  requests.set(url, promise);
  return await promise;
}

const splitAttrsTokenizer = /([a-z0-9_\:\-]*)\s*?=\s*?(['"]?)(.*?)\2\s+/gim;
const domParserTokenizer = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!\[CDATA\[)([\s\S]*?)(\]\]>))/gm;
const splitAttrs = (str) => {
  let res = {};
  let token;
  if (str) {
    splitAttrsTokenizer.lastIndex = 0;
    str = " " + (str || "") + " ";
    while (token = splitAttrsTokenizer.exec(str)) {
      res[token[1]] = token[3];
    }
  }
  return res;
};
function optimizeSvg(contents, name, options) {
  return optimize(contents, {
    plugins: [
      "removeDoctype",
      "removeXMLProcInst",
      "removeComments",
      "removeMetadata",
      "removeXMLNS",
      "removeEditorsNSData",
      "cleanupAttrs",
      "minifyStyles",
      "convertStyleToAttrs",
      {
        name: "cleanupIDs",
        params: { prefix: `${SPRITESHEET_NAMESPACE}:${name}` }
      },
      "removeRasterImages",
      "removeUselessDefs",
      "cleanupNumericValues",
      "cleanupListOfValues",
      "convertColors",
      "removeUnknownsAndDefaults",
      "removeNonInheritableGroupAttrs",
      "removeUselessStrokeAndFill",
      "removeViewBox",
      "cleanupEnableBackground",
      "removeHiddenElems",
      "removeEmptyText",
      "convertShapeToPath",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "collapseGroups",
      "convertPathData",
      "convertTransform",
      "removeEmptyAttrs",
      "removeEmptyContainers",
      "mergePaths",
      "removeUnusedNS",
      "sortAttrs",
      "removeTitle",
      "removeDesc",
      "removeDimensions",
      "removeStyleElement",
      "removeScriptElement"
    ]
  }).data;
}
const preprocessCache = /* @__PURE__ */ new Map();
function preprocess(contents, name, { optimize }) {
  if (preprocessCache.has(contents)) {
    return preprocessCache.get(contents);
  }
  if (optimize) {
    contents = optimizeSvg(contents, name);
  }
  domParserTokenizer.lastIndex = 0;
  let result = contents;
  let token;
  if (contents) {
    while (token = domParserTokenizer.exec(contents)) {
      const tag = token[2];
      if (tag === "svg") {
        const attrs = splitAttrs(token[3]);
        result = contents.slice(domParserTokenizer.lastIndex).replace(/<\/svg>/gim, "").trim();
        const value = { innerHTML: result, defaultProps: attrs };
        preprocessCache.set(contents, value);
        return value;
      }
    }
  }
}
function normalizeProps(inputProps) {
  const size = inputProps.size;
  delete inputProps.size;
  const w = inputProps.width ?? size;
  const h = inputProps.height ?? size;
  const width = w ? toAttributeSize(w) : void 0;
  const height = h ? toAttributeSize(h) : void 0;
  return { ...inputProps, width, height };
}
const toAttributeSize = (size) => String(size).replace(/(?<=[0-9])x$/, "em");
async function load(name, inputProps, optimize) {
  const key = name;
  if (!name) {
    throw new Error("<Icon> requires a name!");
  }
  let svg = "";
  let filepath = "";
  if (name.includes(":")) {
    const [pack, ..._name] = name.split(":");
    name = _name.join(":");
    filepath = `/src/icons/${pack}`;
    let get$1;
    try {
      const files = /* #__PURE__ */ Object.assign({

});
      const keys = Object.fromEntries(
        Object.keys(files).map((key2) => [key2.replace(/\.[cm]?[jt]s$/, ""), key2])
      );
      if (!(filepath in keys)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const mod = files[keys[filepath]];
      if (typeof mod.default !== "function") {
        throw new Error(
          `[astro-icon] "${filepath}" did not export a default function!`
        );
      }
      get$1 = mod.default;
    } catch (e) {
    }
    if (typeof get$1 === "undefined") {
      get$1 = get.bind(null, pack);
    }
    const contents = await get$1(name, inputProps);
    if (!contents) {
      throw new Error(
        `<Icon pack="${pack}" name="${name}" /> did not return an icon!`
      );
    }
    if (!/<svg/gim.test(contents)) {
      throw new Error(
        `Unable to process "<Icon pack="${pack}" name="${name}" />" because an SVG string was not returned!

Recieved the following content:
${contents}`
      );
    }
    svg = contents;
  } else {
    filepath = `/src/icons/${name}.svg`;
    try {
      const files = /* #__PURE__ */ Object.assign({});
      if (!(filepath in files)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const contents = files[filepath];
      if (!/<svg/gim.test(contents)) {
        throw new Error(
          `Unable to process "${filepath}" because it is not an SVG!

Recieved the following content:
${contents}`
        );
      }
      svg = contents;
    } catch (e) {
      throw new Error(
        `[astro-icon] Unable to load "${filepath}". Does the file exist?`
      );
    }
  }
  const { innerHTML, defaultProps } = preprocess(svg, key, { optimize });
  if (!innerHTML.trim()) {
    throw new Error(`Unable to parse "${filepath}"!`);
  }
  return {
    innerHTML,
    props: { ...defaultProps, ...normalizeProps(inputProps) }
  };
}

const $$Astro$a = createAstro("https://astronaut.github.io");
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Icon;
  let { name, pack, title, optimize = true, class: className, ...inputProps } = Astro2.props;
  let props = {};
  if (pack) {
    name = `${pack}:${name}`;
  }
  let innerHTML = "";
  try {
    const svg = await load(name, { ...inputProps, class: className }, optimize);
    innerHTML = svg.innerHTML;
    props = svg.props;
  } catch (e) {
    {
      throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
    }
  }
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(props)}${addAttribute(name, "astro-icon")}>${unescapeHTML((title ? `<title>${title}</title>` : "") + innerHTML)}</svg>`;
}, "/home/labib/codes/projects/astro-vitae/node_modules/astro-icon/lib/Icon.astro");

const sprites = /* @__PURE__ */ new WeakMap();
function trackSprite(request, name) {
  let currentSet = sprites.get(request);
  if (!currentSet) {
    currentSet = /* @__PURE__ */ new Set([name]);
  } else {
    currentSet.add(name);
  }
  sprites.set(request, currentSet);
}
const warned = /* @__PURE__ */ new Set();
async function getUsedSprites(request) {
  const currentSet = sprites.get(request);
  if (currentSet) {
    return Array.from(currentSet);
  }
  if (!warned.has(request)) {
    const { pathname } = new URL(request.url);
    console.log(`[astro-icon] No sprites found while rendering "${pathname}"`);
    warned.add(request);
  }
  return [];
}

const $$Astro$9 = createAstro("https://astronaut.github.io");
const $$Spritesheet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Spritesheet;
  const { optimize = true, style, ...props } = Astro2.props;
  const names = await getUsedSprites(Astro2.request);
  const icons = await Promise.all(names.map((name) => {
    return load(name, {}, optimize).then((res) => ({ ...res, name })).catch((e) => {
      {
        throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
      }
    });
  }));
  return renderTemplate`${maybeRenderHead()}<svg${addAttribute(`position: absolute; width: 0; height: 0; overflow: hidden; ${style ?? ""}`.trim(), "style")}${spreadAttributes({ "aria-hidden": true, ...props })} astro-icon-spritesheet>
    ${icons.map((icon) => renderTemplate`<symbol${spreadAttributes(icon.props)}${addAttribute(`${SPRITESHEET_NAMESPACE}:${icon.name}`, "id")}>${unescapeHTML(icon.innerHTML)}</symbol>`)}
</svg>`;
}, "/home/labib/codes/projects/astro-vitae/node_modules/astro-icon/lib/Spritesheet.astro");

const $$Astro$8 = createAstro("https://astronaut.github.io");
const $$SpriteProvider = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$SpriteProvider;
  const content = await Astro2.slots.render("default");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(content)}` })}
${renderComponent($$result, "Spritesheet", $$Spritesheet, {})}`;
}, "/home/labib/codes/projects/astro-vitae/node_modules/astro-icon/lib/SpriteProvider.astro");

const $$Astro$7 = createAstro("https://astronaut.github.io");
const $$Sprite = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Sprite;
  let { name, pack, title, class: className, x, y, ...inputProps } = Astro2.props;
  const props = normalizeProps(inputProps);
  if (pack) {
    name = `${pack}:${name}`;
  }
  const href = `#${SPRITESHEET_NAMESPACE}:${name}`;
  trackSprite(Astro2.request, name);
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(props)}${addAttribute(className, "class")}${addAttribute(name, "astro-icon")}>
    ${title ? renderTemplate`<title>${title}</title>` : ""}
    <use${spreadAttributes({ "xlink:href": href, width: props.width, height: props.height, x, y })}></use>
</svg>`;
}, "/home/labib/codes/projects/astro-vitae/node_modules/astro-icon/lib/Sprite.astro");

Object.assign($$Sprite, { Provider: $$SpriteProvider });

const $$Astro$6 = createAstro("https://astronaut.github.io");
const $$BaseLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  return renderTemplate`<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV Template</title>
${renderHead()}</head>
<body>
    ${renderSlot($$result, $$slots["default"])}
</body></html>`;
}, "/home/labib/codes/projects/astro-vitae/src/layouts/BaseLayout.astro");

const $$Astro$5 = createAstro("https://astronaut.github.io");
const $$AccordionLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$AccordionLayout;
  const { title, icon } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate`
    ${maybeRenderHead()}<li class="relative border-b border-text/30" x-data="{selected:null}">
  <button type="button" class="w-full px-3 py-3 text-left" @click="selected !== 1 ? selected = 1 : selected = null">
    <div class="flex items-center justify-between">
      <h4 class="text-2xl font-mono text-text/80 hover:text-text/95 flex justify-center items-start">
        ${renderComponent($$result2, "Icon", $$Icon, { "name": icon, "class": "w-8 h-8 mr-4" })}
        ${title}
      </h4>

      ${renderComponent($$result2, "Icon", $$Icon, { "name": "ic:baseline-arrow-drop-down", "class": "w-5 h-5", "x-bind:style": "selected ==1 ? 'rotate:'+' 180deg' : ''" })}
    </div>
  </button>

  <div class="relative overflow-hidden transition-all max-h-0 duration-700" style="" x-ref="container1" x-bind:style="selected == 1 ? 'max-height: ' + $refs.container1.scrollHeight + 'px' : ''">
    <div class="py-4 px-2 text-text/60">
      ${renderSlot($$result2, $$slots["default"])}
    </div>
  </div>
</li>

` })}`;
}, "/home/labib/codes/projects/astro-vitae/src/layouts/AccordionLayout.astro");

const $$Astro$4 = createAstro("https://astronaut.github.io");
const $$Card = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Card;
  const { timeframe, title, description, url, tags, url_name } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="grid grid-cols-3 grid-rows-1 w-full p-2 place-items-center border-b-[1px] border-dashed py-8 border-text/25">
    <div class="self-start justify-self-start">
        <p class="text-text/50 text-base">
            ${timeframe}
        </p>
    </div>

    <div class="self-start justify-self-start text-left">
        <p class="text-lg text-text/80">${title}</p>
        <p class="text-sm text-text/70">${description}</p>
        <sub class="text-xs text-text/60">${tags}</sub>
    </div>

    <div class="self-start justify-self-end">
        <a${addAttribute(url, "href")} target="_blank" class="text-base text-right text-text/60 hover:text-text/80 flex justify-center items-center">
            ${url_name}
            ${url !== "#" && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": "icon-park-outline:unlink", "class": "w-4 h-4 ml-2" })}`}
        </a>
    </div>
</div>`;
}, "/home/labib/codes/projects/astro-vitae/src/components/Card.astro");

const $$Astro$3 = createAstro("https://astronaut.github.io");
const $$Container = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Container;
  return renderTemplate`${maybeRenderHead()}<ul class="shadow-box">
  ${renderComponent($$result, "AccordionLayout", $$AccordionLayout, { "title": "About", "icon": "mdi:account-badge-outline" }, { "default": ($$result2) => renderTemplate`${about}` })}
    ${renderComponent($$result, "AccordionLayout", $$AccordionLayout, { "title": "Work", "icon": "ic:baseline-work-outline" }, { "default": ($$result2) => renderTemplate`${work.map((item) => {
    return renderTemplate`${renderComponent($$result2, "Card", $$Card, { "title": item.role, "timeframe": `${item.from} - ${item.to}`, "description": item.location, "tags": item.skills, "url": item.org_url, "url_name": item.org })}`;
  })}` })}

    ${renderComponent($$result, "AccordionLayout", $$AccordionLayout, { "title": "Projects", "icon": "ion:md-build" }, { "default": ($$result2) => renderTemplate`${projects.map((item) => {
    return renderTemplate`${renderComponent($$result2, "Card", $$Card, { "title": item.title, "timeframe": "2022-2023", "description": item.description, "tags": item.tech, "url": item.url, "url_name": "Open Project" })}`;
  })}` })}

    ${renderComponent($$result, "AccordionLayout", $$AccordionLayout, { "title": "Education", "icon": "carbon:education" }, { "default": ($$result2) => renderTemplate`${education.map((item) => {
    return renderTemplate`${renderComponent($$result2, "Card", $$Card, { "title": item.course, "timeframe": `${item.from} - ${item.to}`, "description": item.location, "tags": "", "url": "#", "url_name": item.institute })}`;
  })}` })}

    <!-- <AccordionLayout title={"Certifications"} icon={"carbon:certificate"}> -->
    <!--   { -->
    <!--     CONTENT.certificates.map((item) => { -->
    <!--       return ( -->
    <!--         <Card -->
    <!--           title={item.title} -->
    <!--           timeframe={item.issued} -->
    <!--           description={item.org} -->
    <!--           tags={item.description} -->
    <!--           url={item.url} -->
    <!--           url_name={"View Certificate"} -->
    <!--         /> -->
    <!--       ); -->
    <!--     }) -->
    <!--   } -->
    <!-- </AccordionLayout> -->

    <!-- <AccordionLayout title={"Blogs/Writings"} icon={"ic:round-edit-note"}> -->
    <!--   { -->
    <!--     CONTENT.blogs.map((item) => { -->
    <!--       return ( -->
    <!--         <Card -->
    <!--           title={item.title} -->
    <!--           timeframe={item.date} -->
    <!--           description={item.description} -->
    <!--           tags="" -->
    <!--           url={item.url} -->
    <!--           url_name={item.publisher} -->
    <!--         /> -->
    <!--       ); -->
    <!--     }) -->
    <!--   } -->
    <!-- </AccordionLayout> -->

    ${renderComponent($$result, "AccordionLayout", $$AccordionLayout, { "title": "Achievements", "icon": "mdi:trophy-award" }, { "default": ($$result2) => renderTemplate`${achievements.map((item) => {
    return renderTemplate`${renderComponent($$result2, "Card", $$Card, { "title": item.title, "timeframe": item.year, "description": item.decription, "tags": "", "url": "#", "url_name": "" })}`;
  })}` })}

    ${renderComponent($$result, "AccordionLayout", $$AccordionLayout, { "title": "Contact", "icon": "ri:contacts-book-fill" }, { "default": ($$result2) => renderTemplate`${contact.map((item) => {
    return renderTemplate`${renderComponent($$result2, "Card", $$Card, { "title": "", "timeframe": "", "description": "", "tags": "", "url": item.source, "url_name": item.source_name })}`;
  })}` })}
</ul>`;
}, "/home/labib/codes/projects/astro-vitae/src/components/Container.astro");

const $$Astro$2 = createAstro("https://astronaut.github.io");
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Header;
  return renderTemplate`<!-- Hero section -->${maybeRenderHead()}<header class="mx-auto py-8">
  <article class="grid grid-cols-3 grid-rows-1 place-items-center w-[98vw] max-w-2xl">
    <div class="rounded-full border-primary self-end shadow-2xl md:w-24 w-20 aspect-square">
      <img src="/profile.jpg" alt="profile_picture" class="object-cover w-full h-full rounded-full grayscale-[50] hover:grayscale-0">
    </div>

    <div class="grid text-center self-center whitespace-nowrap">
      <h1 class="text-3xl text-text">${name}</h1>
      <h3 class="text-lg text-text/90">${designation}</h3>
      <h5 class="text-sm text-text/80">${location}</h5>
    </div>

    <div class="md:grid text-right self-end hidden">
      <h6 class="text-sm text-text/70">${undefined}</h6>
      <a${addAttribute(undefined, "href")} target="_blank" class="hover:text-blue-300 flex items-center justify-center">
        ${undefined}
      </a>
    </div>
  </article>
</header>`;
}, "/home/labib/codes/projects/astro-vitae/src/components/Header.astro");

const $$Astro$1 = createAstro("https://astronaut.github.io");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead()}<footer class="bg-background/5 flex justify-between items-center px-2 py-1 astro-SZ7XMLTE">
    <p class="astro-SZ7XMLTE">© 2023 Shahnewaz Labib</p>

    <p class="astro-SZ7XMLTE">
        <a href="https://github.com/uskhokhar/astro-vitae" target="_blank" class="underline underline-offset-2 hover:no-underline astro-SZ7XMLTE">
            Astro-Vitae Template
        </a>
        developed by 
        <a href="https://uskhokhar.me" target="_blank" class="underline underline-offset-2 hover:no-underline astro-SZ7XMLTE">
            U.S.Khokhar 🤓
        </a>
    </p>
</footer>`;
}, "/home/labib/codes/projects/astro-vitae/src/components/Footer.astro");

const $$Astro = createAstro("https://astronaut.github.io");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`<html lang="en">
	<head>
		<meta charset="utf-8">
		<link rel="icon" type="image/svg+xml" href="/favicon.svg">
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500&display=swap" rel="stylesheet">
		<meta name="viewport" content="width=device-width">
		<meta name="generator"${addAttribute(Astro2.generator, "content")}>
		<title>CV | ${name}</title>
	${renderHead()}</head>
	<body class="bg-background text-text flex flex-col min-h-screen">

		${renderComponent($$result, "Header", $$Header, {})}

		<!-- Bar Effect -->
		<article class="mx-auto h-fit max-w-3xl w-[95vw] flex flex-nowrap bg-slate-400">
				<div class="bg-slate-900 hover:scale-x-[2] w-full h-1.5" id="one"></div>
				<div class="bg-red-900 hover:scale-x-[2] w-full h-1.5" id="two"></div>
				<div class="bg-blue-900 hover:scale-x-[2] w-full h-1.5" id="three"></div>
		</article>

		<main class="mx-auto flex-grow max-h-[90vh] md:max-h-[70vh] max-w-3xl overflow-y-scroll grid gap-5 p-5 w-[95vw]">
			${renderComponent($$result, "Container", $$Container, {})}
		</main>

		${renderComponent($$result, "Footer", $$Footer, {})}
	</body></html>`;
}, "/home/labib/codes/projects/astro-vitae/src/pages/index.astro");

const $$file = "/home/labib/codes/projects/astro-vitae/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
