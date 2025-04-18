import { h } from "virtual-dom";
import attributeHook from "discourse-common/lib/attribute-hook";
import deprecated from "discourse-common/lib/deprecated";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
let _renderers = [];

const REPLACEMENTS = {
  "d-tracking": "circle",
  "d-muted": "times-circle",
  "d-regular": "far-circle",
  "d-watching": "exclamation-circle",
  "d-watching-first": "far-dot-circle",
  "d-drop-expanded": "caret-down",
  "d-drop-collapsed": "caret-right",
  "d-unliked": "far-heart",
  "d-liked": "heart",
  "notification.mentioned": "at",
  "notification.group_mentioned": "at",
  "notification.quoted": "quote-right",
  "notification.replied": "reply",
  "notification.posted": "reply",
  "notification.edited": "pencil-alt",
  "notification.liked": "heart",
  "notification.liked_2": "heart",
  "notification.liked_many": "heart",
  "notification.liked_consolidated": "heart",
  "notification.private_message": "far-envelope",
  "notification.invited_to_private_message": "far-envelope",
  "notification.invited_to_topic": "hand-point-right",
  "notification.invitee_accepted": "user",
  "notification.moved_post": "sign-out",
  "notification.linked": "link",
  "notification.granted_badge": "certificate",
  "notification.topic_reminder": "far-clock",
  "notification.watching_first_post": "far-dot-circle",
  "notification.group_message_summary": "users",
  "notification.post_approved": "check"
};

// TODO: use lib/svg_sprite/fa4-renames.json here
// Note: these should not be edited manually. They define the fa4-fa5 migration
const fa4Replacements = {
  "500px": "fab-500px",
  "address-book-o": "far-address-book",
  "address-card-o": "far-address-card",
  adn: "fab-adn",
  amazon: "fab-amazon",
  android: "fab-android",
  angellist: "fab-angellist",
  apple: "fab-apple",
  "area-chart": "chart-area",
  "arrow-circle-o-down": "far-arrow-alt-circle-down",
  "arrow-circle-o-left": "far-arrow-alt-circle-left",
  "arrow-circle-o-right": "far-arrow-alt-circle-right",
  "arrow-circle-o-up": "far-arrow-alt-circle-up",
  arrows: "arrows-alt",
  "arrows-alt": "expand-arrows-alt",
  "arrows-h": "arrows-alt-h",
  "arrows-v": "arrows-alt-v",
  "asl-interpreting": "american-sign-language-interpreting",
  automobile: "car",
  bandcamp: "fab-bandcamp",
  bank: "university",
  "bar-chart": "far-chart-bar",
  "bar-chart-o": "far-chart-bar",
  bathtub: "bath",
  battery: "battery-full",
  "battery-0": "battery-empty",
  "battery-1": "battery-quarter",
  "battery-2": "battery-half",
  "battery-3": "battery-three-quarters",
  "battery-4": "battery-full",
  behance: "fab-behance",
  "behance-square": "fab-behance-square",
  "bell-o": "far-bell",
  "bell-slash-o": "far-bell-slash",
  bitbucket: "fab-bitbucket",
  "bitbucket-square": "fab-bitbucket",
  bitcoin: "fab-btc",
  "black-tie": "fab-black-tie",
  bluetooth: "fab-bluetooth",
  "bluetooth-b": "fab-bluetooth-b",
  "bookmark-o": "far-bookmark",
  btc: "fab-btc",
  "building-o": "far-building",
  buysellads: "fab-buysellads",
  cab: "taxi",
  calendar: "calendar-alt",
  "calendar-check-o": "far-calendar-check",
  "calendar-minus-o": "far-calendar-minus",
  "calendar-o": "far-calendar",
  "calendar-plus-o": "far-calendar-plus",
  "calendar-times-o": "far-calendar-times",
  "caret-square-o-down": "far-caret-square-down",
  "caret-square-o-left": "far-caret-square-left",
  "caret-square-o-right": "far-caret-square-right",
  "caret-square-o-up": "far-caret-square-up",
  cc: "far-closed-captioning",
  "cc-amex": "fab-cc-amex",
  "cc-diners-club": "fab-cc-diners-club",
  "cc-discover": "fab-cc-discover",
  "cc-jcb": "fab-cc-jcb",
  "cc-mastercard": "fab-cc-mastercard",
  "cc-paypal": "fab-cc-paypal",
  "cc-stripe": "fab-cc-stripe",
  "cc-visa": "fab-cc-visa",
  chain: "link",
  "chain-broken": "unlink",
  "check-circle-o": "far-check-circle",
  "check-square-o": "far-check-square",
  chrome: "fab-chrome",
  "circle-o": "far-circle",
  "circle-o-notch": "circle-notch",
  "circle-thin": "far-circle",
  clipboard: "far-clipboard",
  "clock-o": "far-clock",
  clone: "far-clone",
  close: "times",
  "cloud-download": "cloud-download-alt",
  "cloud-upload": "cloud-upload-alt",
  cny: "yen-sign",
  "code-fork": "code-branch",
  codepen: "fab-codepen",
  codiepie: "fab-codiepie",
  "comment-o": "far-comment",
  commenting: "far-comment-dots",
  "commenting-o": "far-comment-dots",
  "comments-o": "far-comments",
  compass: "far-compass",
  connectdevelop: "fab-connectdevelop",
  contao: "fab-contao",
  copyright: "far-copyright",
  "creative-commons": "fab-creative-commons",
  "credit-card": "far-credit-card",
  "credit-card-alt": "credit-card",
  css3: "fab-css3",
  cutlery: "utensils",
  dashboard: "tachometer-alt",
  dashcube: "fab-dashcube",
  deafness: "deaf",
  dedent: "outdent",
  delicious: "fab-delicious",
  deviantart: "fab-deviantart",
  diamond: "far-gem",
  digg: "fab-digg",
  discord: "fab-discord",
  dollar: "dollar-sign",
  "dot-circle-o": "far-dot-circle",
  dribbble: "fab-dribbble",
  "drivers-license": "id-card",
  "drivers-license-o": "far-id-card",
  dropbox: "fab-dropbox",
  drupal: "fab-drupal",
  edge: "fab-edge",
  eercast: "fab-sellcast",
  empire: "fab-empire",
  "envelope-o": "far-envelope",
  "envelope-open-o": "far-envelope-open",
  envira: "fab-envira",
  etsy: "fab-etsy",
  eur: "euro-sign",
  euro: "euro-sign",
  exchange: "exchange-alt",
  expeditedssl: "fab-expeditedssl",
  "external-link": "external-link-alt",
  "external-link-square": "external-link-square-alt",
  eye: "far-eye",
  "eye-slash": "far-eye-slash",
  eyedropper: "eye-dropper",
  fa: "fab-font-awesome",
  facebook: "fab-facebook-f",
  "facebook-f": "fab-facebook-f",
  "facebook-official": "fab-facebook",
  "facebook-square": "fab-facebook-square",
  feed: "rss",
  "file-archive-o": "far-file-archive",
  "file-audio-o": "far-file-audio",
  "file-code-o": "far-file-code",
  "file-excel-o": "far-file-excel",
  "file-image-o": "far-file-image",
  "file-movie-o": "far-file-video",
  "file-o": "far-file",
  "file-pdf-o": "far-file-pdf",
  "file-photo-o": "far-file-image",
  "file-picture-o": "far-file-image",
  "file-powerpoint-o": "far-file-powerpoint",
  "file-sound-o": "far-file-audio",
  "file-text": "file-alt",
  "file-text-o": "far-file-alt",
  "file-video-o": "far-file-video",
  "file-word-o": "far-file-word",
  "file-zip-o": "far-file-archive",
  "files-o": "far-copy",
  firefox: "fab-firefox",
  "first-order": "fab-first-order",
  "flag-o": "far-flag",
  flash: "bolt",
  flickr: "fab-flickr",
  "floppy-o": "far-save",
  "folder-o": "far-folder",
  "folder-open-o": "far-folder-open",
  "font-awesome": "fab-font-awesome",
  fonticons: "fab-fonticons",
  "fort-awesome": "fab-fort-awesome",
  forumbee: "fab-forumbee",
  foursquare: "fab-foursquare",
  "free-code-camp": "fab-free-code-camp",
  "frown-o": "far-frown",
  "futbol-o": "far-futbol",
  gbp: "pound-sign",
  ge: "fab-empire",
  gear: "cog",
  gears: "cogs",
  "get-pocket": "fab-get-pocket",
  gg: "fab-gg",
  "gg-circle": "fab-gg-circle",
  git: "fab-git",
  "git-square": "fab-git-square",
  github: "fab-github",
  "github-alt": "fab-github-alt",
  "github-square": "fab-github-square",
  gitlab: "fab-gitlab",
  gittip: "fab-gratipay",
  glass: "glass-martini",
  glide: "fab-glide",
  "glide-g": "fab-glide-g",
  google: "fab-google",
  "google-plus": "fab-google-plus-g",
  "google-plus-circle": "fab-google-plus",
  "google-plus-official": "fab-google-plus",
  "google-plus-square": "fab-google-plus-square",
  "google-wallet": "fab-google-wallet",
  gratipay: "fab-gratipay",
  grav: "fab-grav",
  group: "users",
  "hacker-news": "fab-hacker-news",
  "hand-grab-o": "far-hand-rock",
  "hand-lizard-o": "far-hand-lizard",
  "hand-o-down": "far-hand-point-down",
  "hand-o-left": "far-hand-point-left",
  "hand-o-right": "far-hand-point-right",
  "hand-o-up": "far-hand-point-up",
  "hand-paper-o": "far-hand-paper",
  "hand-peace-o": "far-hand-peace",
  "hand-pointer-o": "far-hand-pointer",
  "hand-rock-o": "far-hand-rock",
  "hand-scissors-o": "far-hand-scissors",
  "hand-spock-o": "far-hand-spock",
  "hand-stop-o": "far-hand-paper",
  "handshake-o": "far-handshake",
  "hard-of-hearing": "deaf",
  "hdd-o": "far-hdd",
  header: "heading",
  "heart-o": "far-heart",
  "hospital-o": "far-hospital",
  hotel: "bed",
  "hourglass-1": "hourglass-start",
  "hourglass-2": "hourglass-half",
  "hourglass-3": "hourglass-end",
  "hourglass-o": "far-hourglass",
  houzz: "fab-houzz",
  html5: "fab-html5",
  "id-card-o": "far-id-card",
  ils: "shekel-sign",
  image: "far-image",
  imdb: "fab-imdb",
  inr: "rupee-sign",
  instagram: "fab-instagram",
  institution: "university",
  "internet-explorer": "fab-internet-explorer",
  intersex: "transgender",
  ioxhost: "fab-ioxhost",
  joomla: "fab-joomla",
  jpy: "yen-sign",
  jsfiddle: "fab-jsfiddle",
  "keyboard-o": "far-keyboard",
  krw: "won-sign",
  lastfm: "fab-lastfm",
  "lastfm-square": "fab-lastfm-square",
  leanpub: "fab-leanpub",
  legal: "gavel",
  "lemon-o": "far-lemon",
  "level-down": "level-down-alt",
  "level-up": "level-up-alt",
  "life-bouy": "far-life-ring",
  "life-buoy": "far-life-ring",
  "life-ring": "far-life-ring",
  "life-saver": "far-life-ring",
  "lightbulb-o": "far-lightbulb",
  "line-chart": "chart-line",
  linkedin: "fab-linkedin-in",
  "linkedin-square": "fab-linkedin",
  linode: "fab-linode",
  linux: "fab-linux",
  "list-alt": "far-list-alt",
  "long-arrow-down": "long-arrow-alt-down",
  "long-arrow-left": "long-arrow-alt-left",
  "long-arrow-right": "long-arrow-alt-right",
  "long-arrow-up": "long-arrow-alt-up",
  "mail-forward": "share",
  "mail-reply": "reply",
  "mail-reply-all": "reply-all",
  "map-marker": "map-marker-alt",
  "map-o": "far-map",
  maxcdn: "fab-maxcdn",
  meanpath: "fab-font-awesome",
  medium: "fab-medium",
  meetup: "fab-meetup",
  "meh-o": "far-meh",
  "minus-square-o": "far-minus-square",
  mixcloud: "fab-mixcloud",
  mobile: "mobile-alt",
  "mobile-phone": "mobile-alt",
  modx: "fab-modx",
  money: "far-money-bill-alt",
  "moon-o": "far-moon",
  "mortar-board": "graduation-cap",
  navicon: "bars",
  "newspaper-o": "far-newspaper",
  "object-group": "far-object-group",
  "object-ungroup": "far-object-ungroup",
  odnoklassniki: "fab-odnoklassniki",
  "odnoklassniki-square": "fab-odnoklassniki-square",
  opencart: "fab-opencart",
  openid: "fab-openid",
  opera: "fab-opera",
  "optin-monster": "fab-optin-monster",
  pagelines: "fab-pagelines",
  "paper-plane-o": "far-paper-plane",
  paste: "far-clipboard",
  patreon: "fab-patreon",
  "pause-circle-o": "far-pause-circle",
  paypal: "fab-paypal",
  pencil: "pencil-alt",
  "pencil-square": "pen-square",
  "pencil-square-o": "far-edit",
  photo: "far-image",
  "picture-o": "far-image",
  "pie-chart": "chart-pie",
  "pied-piper": "fab-pied-piper",
  "pied-piper-alt": "fab-pied-piper-alt",
  "pied-piper-pp": "fab-pied-piper-pp",
  pinterest: "fab-pinterest",
  "pinterest-p": "fab-pinterest-p",
  "pinterest-square": "fab-pinterest-square",
  "play-circle-o": "far-play-circle",
  "plus-square-o": "far-plus-square",
  "product-hunt": "fab-product-hunt",
  qq: "fab-qq",
  "question-circle-o": "far-question-circle",
  quora: "fab-quora",
  ra: "fab-rebel",
  ravelry: "fab-ravelry",
  rebel: "fab-rebel",
  reddit: "fab-reddit",
  "reddit-alien": "fab-reddit-alien",
  "reddit-square": "fab-reddit-square",
  refresh: "sync",
  registered: "far-registered",
  remove: "times",
  renren: "fab-renren",
  reorder: "bars",
  repeat: "redo",
  resistance: "fab-rebel",
  rmb: "yen-sign",
  "rotate-left": "undo",
  "rotate-right": "redo",
  rouble: "ruble-sign",
  rub: "ruble-sign",
  ruble: "ruble-sign",
  rupee: "rupee-sign",
  s15: "bath",
  safari: "fab-safari",
  scissors: "cut",
  scribd: "fab-scribd",
  sellsy: "fab-sellsy",
  send: "paper-plane",
  "send-o": "far-paper-plane",
  "share-square-o": "far-share-square",
  shekel: "shekel-sign",
  sheqel: "shekel-sign",
  shield: "shield-alt",
  shirtsinbulk: "fab-shirtsinbulk",
  "sign-in": "sign-in-alt",
  "sign-out": "sign-out-alt",
  signing: "sign-language",
  simplybuilt: "fab-simplybuilt",
  skyatlas: "fab-skyatlas",
  skype: "fab-skype",
  slack: "fab-slack",
  sliders: "sliders-h",
  slideshare: "fab-slideshare",
  "smile-o": "far-smile",
  snapchat: "fab-snapchat",
  "snapchat-ghost": "fab-snapchat-ghost",
  "snapchat-square": "fab-snapchat-square",
  "snowflake-o": "far-snowflake",
  "soccer-ball-o": "far-futbol",
  "sort-alpha-asc": "sort-alpha-down",
  "sort-alpha-desc": "sort-alpha-up",
  "sort-amount-asc": "sort-amount-down",
  "sort-amount-desc": "sort-amount-up",
  "sort-asc": "sort-up",
  "sort-desc": "sort-down",
  "sort-numeric-asc": "sort-numeric-down",
  "sort-numeric-desc": "sort-numeric-up",
  soundcloud: "fab-soundcloud",
  spoon: "utensil-spoon",
  spotify: "fab-spotify",
  "square-o": "far-square",
  "stack-exchange": "fab-stack-exchange",
  "stack-overflow": "fab-stack-overflow",
  "star-half-empty": "far-star-half",
  "star-half-full": "far-star-half",
  "star-half-o": "far-star-half",
  "star-o": "far-star",
  steam: "fab-steam",
  "steam-square": "fab-steam-square",
  "sticky-note-o": "far-sticky-note",
  "stop-circle-o": "far-stop-circle",
  stumbleupon: "fab-stumbleupon",
  "stumbleupon-circle": "fab-stumbleupon-circle",
  "sun-o": "far-sun",
  superpowers: "fab-superpowers",
  support: "far-life-ring",
  tablet: "tablet-alt",
  tachometer: "tachometer-alt",
  telegram: "fab-telegram",
  television: "tv",
  "tencent-weibo": "fab-tencent-weibo",
  themeisle: "fab-themeisle",
  thermometer: "thermometer-full",
  "thermometer-0": "thermometer-empty",
  "thermometer-1": "thermometer-quarter",
  "thermometer-2": "thermometer-half",
  "thermometer-3": "thermometer-three-quarters",
  "thermometer-4": "thermometer-full",
  "thumb-tack": "thumbtack",
  "thumbs-o-down": "far-thumbs-down",
  "thumbs-o-up": "far-thumbs-up",
  ticket: "ticket-alt",
  "times-circle-o": "far-times-circle",
  "times-rectangle": "window-close",
  "times-rectangle-o": "far-window-close",
  "toggle-down": "far-caret-square-down",
  "toggle-left": "far-caret-square-left",
  "toggle-right": "far-caret-square-right",
  "toggle-up": "far-caret-square-up",
  trash: "trash-alt",
  "trash-o": "far-trash-alt",
  trello: "fab-trello",
  tripadvisor: "fab-tripadvisor",
  try: "lira-sign",
  tumblr: "fab-tumblr",
  "tumblr-square": "fab-tumblr-square",
  "turkish-lira": "lira-sign",
  twitch: "fab-twitch",
  twitter: "fab-twitter",
  "twitter-square": "fab-twitter-square",
  unsorted: "sort",
  usb: "fab-usb",
  usd: "dollar-sign",
  "user-circle-o": "far-user-circle",
  "user-o": "far-user",
  vcard: "address-card",
  "vcard-o": "far-address-card",
  viacoin: "fab-viacoin",
  viadeo: "fab-viadeo",
  "viadeo-square": "fab-viadeo-square",
  "video-camera": "video",
  vimeo: "fab-vimeo-v",
  "vimeo-square": "fab-vimeo-square",
  vine: "fab-vine",
  vk: "fab-vk",
  vkontakte: "fab-vk",
  "volume-control-phone": "phone-volume",
  warning: "exclamation-triangle",
  wechat: "fab-weixin",
  weibo: "fab-weibo",
  weixin: "fab-weixin",
  whatsapp: "fab-whatsapp",
  "wheelchair-alt": "fab-accessible-icon",
  "wikipedia-w": "fab-wikipedia-w",
  "window-close-o": "far-window-close",
  "window-maximize": "far-window-maximize",
  "window-restore": "far-window-restore",
  windows: "fab-windows",
  won: "won-sign",
  wordpress: "fab-wordpress",
  wpbeginner: "fab-wpbeginner",
  wpexplorer: "fab-wpexplorer",
  wpforms: "fab-wpforms",
  xing: "fab-xing",
  "xing-square": "fab-xing-square",
  "y-combinator": "fab-y-combinator",
  "y-combinator-square": "fab-hacker-news",
  yahoo: "fab-yahoo",
  yc: "fab-y-combinator",
  "yc-square": "fab-hacker-news",
  yelp: "fab-yelp",
  yen: "yen-sign",
  yoast: "fab-yoast",
  youtube: "fab-youtube",
  "youtube-play": "fab-youtube",
  "youtube-square": "fab-youtube-square"
};

export function replaceIcon(source, destination) {
  REPLACEMENTS[source] = destination;
}

export function renderIcon(renderType, id, params) {
  for (let i = 0; i < _renderers.length; i++) {
    let renderer = _renderers[i];
    let rendererForType = renderer[renderType];

    if (rendererForType) {
      const icon = { id, replacementId: REPLACEMENTS[id] };
      let result = rendererForType(icon, params || {});
      if (result) {
        return result;
      }
    }
  }
}

export function iconHTML(id, params) {
  return renderIcon("string", id, params);
}

export function iconNode(id, params) {
  return renderIcon("node", id, params);
}

export function convertIconClass(icon) {
  return icon
    .replace("far fa-", "far-")
    .replace("fab fa-", "fab-")
    .replace("fas fa-", "")
    .replace("fa-", "")
    .trim();
}

// TODO: Improve how helpers are registered for vdom compliation
if (typeof Discourse !== "undefined") {
  Discourse.__widget_helpers.iconNode = iconNode;
}

export function registerIconRenderer(renderer) {
  _renderers.unshift(renderer);
}

function iconClasses(icon, params) {
  // "notification." is invalid syntax for classes, use replacement instead
  const dClass =
    icon.replacementId && icon.id.indexOf("notification.") > -1
      ? icon.replacementId
      : icon.id;

  let classNames = `fa d-icon d-icon-${dClass} svg-icon`;

  if (params && params["class"]) {
    classNames += " " + params["class"];
  }

  return classNames;
}

function warnIfMissing(id) {
  if (
    typeof Discourse !== "undefined" &&
    Discourse.Environment === "development" &&
    Discourse.SvgIconList &&
    Discourse.SvgIconList.indexOf(id) === -1
  ) {
    console.warn(`The icon "${id}" is missing from the SVG subset.`); // eslint-disable-line no-console
  }
}

function warnIfDeprecated(oldId, newId) {
  if (
    typeof Discourse !== "undefined" &&
    Discourse.Environment === "development" &&
    !Ember.testing
  ) {
    deprecated(`Icon "${oldId}" is now "${newId}".`);
  }
}

function handleIconId(icon) {
  let id = icon.replacementId || icon.id || "";

  if (fa4Replacements.hasOwnProperty(id)) {
    warnIfDeprecated(id, fa4Replacements[id]);
    id = fa4Replacements[id];
  }

  // TODO: clean up "thumbtack unpinned" at source instead of here
  id = id.replace(" unpinned", "");

  warnIfMissing(id);
  return id;
}

// default resolver is font awesome
registerIconRenderer({
  name: "font-awesome",

  string(icon, params) {
    const id = handleIconId(icon);
    if (icon['id'] === 'far-check-square-emoji') {
      return "✅"
    }  
    let html = `<svg class='${iconClasses(icon, params)} svg-string'`;

    if (params.label) {
      html += " aria-hidden='true'";
    }
    html += ` xmlns="${SVG_NAMESPACE}"><use xlink:href="#${id}" /></svg>`;
    if (params.label) {
      html += `<span class='sr-only'>${params.label}</span>`;
    }
    if (params.title) {
      html = `<span class="svg-icon-title" title='${I18n.t(
        params.title
      ).replace(/'/g, "&#39;")}'>${html}</span>`;
    }
    return html;
  },

  node(icon, params) {
    const id = handleIconId(icon);
    const classes = iconClasses(icon, params) + " svg-node";

    const svg = h(
      "svg",
      {
        attributes: { class: classes, "aria-hidden": true },
        namespace: SVG_NAMESPACE
      },
      [
        h("use", {
          "xlink:href": attributeHook("http://www.w3.org/1999/xlink", `#${id}`),
          namespace: SVG_NAMESPACE
        })
      ]
    );

    if (params.title) {
      return h(
        "span",
        {
          title: params.title,
          attributes: { class: "svg-icon-title" }
        },
        [svg]
      );
    } else {
      return svg;
    }
  }
});
