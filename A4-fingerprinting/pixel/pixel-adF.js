// ======= adF — Config parametrizable =======
(function () {
  const DEFAULT_CONFIG = {
    pixelName:    'CHANGE_ME.js',
    pixelVersion: 'CHANGE_ME',
    wsPort:       'PORT_NUMBER',
    wsHost:       null,
  };

  function getCurrentScript() {
    const cs = document.currentScript;
    if (cs) return cs;
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1] || null;
  }

  function parseQuery(qs) {
    const out = {};
    if (!qs) return out;
    const q = qs.replace(/^[^?]*\?/, '');
    if (!q) return out;
    for (const part of q.split('&')) {
      const [k, v] = part.split('=');
      if (!k) continue;
      out[decodeURIComponent(k)] = v ? decodeURIComponent(v.replace(/\+/g, ' ')) : '';
    }
    return out;
  }

  function resolveConfig() {
    const cfg = { ...DEFAULT_CONFIG, ...(window.__ADNPM_CONFIG__ || {}) };
    const s = getCurrentScript();

    // data-* en el <script>
    if (s && s.dataset) {
      const d = s.dataset;
      if (d.pixelName)    cfg.pixelName    = d.pixelName;
      if (d.pixelVersion) cfg.pixelVersion = d.pixelVersion;
      if (d.wsPort)       cfg.wsPort       = d.wsPort;
      if (d.wsHost)       cfg.wsHost       = d.wsHost;
    }

    // Query params del src (?pixelName=&wsPort=&wsHost=...)
    if (s && s.src) {
      const q = parseQuery(s.src);
      if (q.pixelName)    cfg.pixelName    = q.pixelName;
      if (q.pixelVersion) cfg.pixelVersion = q.pixelVersion;
      if (q.wsPort)       cfg.wsPort       = q.wsPort;
      if (q.wsHost)       cfg.wsHost       = q.wsHost;
    }

    return cfg;
  }

  window.__ADNPM_CFG__ = resolveConfig();
})();

// ======= Valores de config usados por el pixel =======
const {
  pixelName,
  pixelVersion,
  wsPort,
  wsHost
} = window.__ADNPM_CFG__;


// ---- helpers básicos ----

function getUserAgent() {
    const ua = 'userAgent' in navigator ? navigator.userAgent : 'NA';
    return ua;
};

function getReferer() {
    const ref = 'referrer' in document ? document.referrer : 'NA';
    return ref;
};

function getURL() {
    const url = 'URL' in document ? document.URL : 'NA';
    return url;
};

function getHeader() {
    let contEncoding = 'NA';
    let contType = 'NA';
    if (!document.location.href.startsWith('file:///')) {
        const req = new XMLHttpRequest();
        req.open('GET', document.location, false);
        req.send(null);
        const headers = req.getAllResponseHeaders().toLowerCase().split("\r\n");

        if (headers.length > 0) {
            for (let i = 0; i < headers.length; i++) {
                if (headers[i].startsWith('content-encoding:')) {
                    contEncoding = headers[i].slice(18);
                }
                if (headers[i].startsWith('content-type:')) {
                    contType = headers[i].slice(14);
                }
            }
        }
    }

    return {
        contEncoding,
        contType
    }
};
const header = getHeader();

function getHardwareConcurrency() {
    const numCPU = 'hardwareConcurrency' in navigator ? navigator.hardwareConcurrency : 'NA';
    return numCPU;
};

function getDeviceMemory() {
    const devMemo = 'deviceMemory' in navigator ? navigator.deviceMemory : 'NA';
    return devMemo;
};

function getScreenSettings() {
    const screenColorDepth = 'colorDepth' in screen ? screen.colorDepth : 'NA';
    const screenOrientation = 'orientation' in screen ? screen.orientation : 'NA';
    if(!window.screenLeft) {
        window.screenLeft = window.screenX;
    }
    const screenLeft = 'screenLeft' in window ? window.screenLeft : 'NA'; //window.screenX
    const innerWidth = 'innerWidth' in window ? window.innerWidth : 'NA';
    const innerHeight = 'innerHeight' in window ? window.innerHeight : 'NA';
    const outerWidth = 'outerWidth' in window ? window.outerWidth : 'NA';
    const outerHeight = 'outerHeight' in window ? window.outerHeight : 'NA';
    return {
        screenColorDepth,
        screenOrientation,
        screenLeft,
        innerWidth,
        innerHeight,
        outerWidth,
        outerHeight,
    };
};
const screenSettings = getScreenSettings();

async function getBatteryStatus() {
    const batteryStatus = 'getBattery' in navigator ? await navigator.getBattery() : 'NA';
    return batteryStatus;
};

function getTouchPoint() {
    const numOfTouchPoint = 'maxTouchPoints' in navigator ? navigator.maxTouchPoints : 'NA';
    return numOfTouchPoint
};

function getLanguages() {
    const languages = 'languages' in navigator ? navigator.languages : 'NA';
    return languages;
};

function getDNTsettings() {
    if ('doNotTrack' in navigator || 'doNotTrack' in window || 'msDoNotTrack' in navigator) {
        if (navigator.doNotTrack == "yes" || navigator.doNotTrack == "1" || window.doNotTrack == "1" || navigator.msDoNotTrack == "1") {
            return 'enabled';
        } else {
            return 'disabled';
        }
    } else {
        return 'NA';
    }
};

function getPDFviewerEnabled() {
    const PDFviewerEnabled = 'pdfViewerEnabled' in navigator ? navigator.pdfViewerEnabled : 'NA';
    return PDFviewerEnabled;
};

function getDisplayWindow() {
    const availWidth = 'availWidth' in screen ? screen.availWidth : 'NA';
    const availHeight = 'availHeight' in screen ? screen.availHeight : 'NA';
    const availLeft = 'availLeft' in screen ? screen.availLeft : 'NA';
    const availTop = 'availTop' in screen ? screen.availTop : 'NA';

    const fullScreenEnabled = 'fullscreenEnabled' in document ? document.fullscreenEnabled : 'NA';
    
    return {
        availWidth,
        availHeight,
        availLeft,
        availTop,
        fullScreenEnabled
    };
};
const displayWindow = getDisplayWindow();

async function getEstimateStorage() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        return await navigator.storage.estimate();
    }
    
    if ('webkitTemporaryStorage' in navigator && 'queryUsageAndQuota' in navigator.webkitTemporaryStorage) {
        return new Promise(function(resolve, reject) {
            navigator.webkitTemporaryStorage.queryUsageAndQuota(
                function(quota) {resolve({quota: quota})},
                reject);
        });
    }
    
    return Promise.resolve({quota: 'NA'});
};

function getNavigatorProperties() {
    const navigatorProperties = [];
    try {
        if ('navigator' in window) {
            for (var k in navigator) navigatorProperties.push(k);
        }
        return navigatorProperties;
    } catch {
        return navigatorProperties;
    }
};

function getTimeZOffset() {
    const tZoneOffset = 'getTimezoneOffset' in new Date() ? new Date().getTimezoneOffset() : 'NA';
    return tZoneOffset;
};
const timeZOffset = getTimeZOffset();

function getCanvas() {
    const canvas = document.createElement('canvas');
    canvas.height = 60;
    canvas.width = 400;
    canvas.style.display = "inline";

    const canvasCtx = canvas.getContext('2d');
    canvasCtx.textBaseline = "alphabetic";
    canvasCtx.rotate(.05);

    const txt = 'Cwm fjordbank glyphs vext quiz, \ud83d\ude03';

    canvasCtx.fillStyle = "#f60";
    canvasCtx.fillRect(125, 1, 62, 20);

    canvasCtx.fillStyle = "#f60";
    canvasCtx.font = "11pt no-real-font-123";
    canvasCtx.fillText(txt, 2, 15);

    canvasCtx.fillStyle = "rgba(102, 204, 0, 0.7)";
    canvasCtx.font = "18pt Arial";
    canvasCtx.fillText(txt, 4, 45);

    const canvasData = canvas.toDataURL();

    return canvasData
};
const canvas = getCanvas();

function getPlugins() {
    const pluginCheck = new Set([
        'Flash', 'Windows Media Player', 'Adobe Acrobat', 'Adobe Acrobat Reader', 'Silverlight', 'Moonlight', 'Quicktime', 'Shockwave', 'Realplayer', 'VLC Player', 'Devalvr', 'SVG Viewer', 'Java', 'Bukkit Plugins', 'HP Print Service', 'Samsung Print Service', 'WordPress'
    ].sort());

    const pluginAvailable = new Set();

    const numPlugins = navigator.plugins.length;
    if (numPlugins > 0) {

        const plugins = '';
        for(let i = 0; i < numPlugins; i++) {
            pluginAvailable.add(navigator.plugins[i].name)
        }

        for (const plugin of pluginCheck.values()) {
            if (navigator.plugins.namedItem(`${plugin}`)) {
                pluginAvailable.add(plugin);
            }
        }
        
    }

    const avaiPlugins = (pluginAvailable.size > 0) ? [...pluginAvailable.values()] : 'NA';
    return avaiPlugins;
};

function getCookieSettings() {
    const cookieEnabled = 'cookieEnabled' in navigator ? navigator.cookieEnabled : 'NA';
    const cookies = 'cookie' in document ? document.cookie : 'NA';
    return {
        cookieEnabled,
        cookies
    }
};
const cookieSettings = getCookieSettings();

function getMIMEtype() {
    try {
        const mimeTypes = [];
        if (navigator.mimeTypes && navigator.mimeTypes.length > 0) {
            const mimes = navigator.mimeTypes;
            for (let i = 0; i < mimes.length; i++) {
                mimeTypes.push(mimes[i].type);
            }
        }
        const avaiMIMETypes = (mimeTypes.length > 0) ? mimeTypes : 'NA';
        return avaiMIMETypes;
    } catch {
        return 'NA';
    }
};

async function getBluetoothAvailability() {
    const bluetoothAvailability = 'bluetooth' in navigator ? await navigator.bluetooth.getAvailability() : 'NA';
    return bluetoothAvailability;
};

function getFonts() {
	
	const fontCheck = new Set([
        'Agency FB','Algerian','Arial','Arial Black','Arial Narrow','Arial Nova','Arial Nova Light','Arial Unicode MS','Bahnschrift','Baskerville Old Face','Bauhaus 93','Bell MT','Berlin Sans FB','Bernard MT Condensed','Blackadder ITC','Bodoni MT','Bodoni MT Black','Book Antiqua','Bookman Old Style','Bookshelf Symbol 7','Bradley Hand ITC','Broadway','Brush Script MT','Calibri','Calibri Light','Californian FB','Calisto MT','Cambria','Cambria Math','Candara','Candara Light','Carlito','Castellar','Centaur','Century','Century Gothic','Century Schoolbook','Chiller','Colonna MT','Comic Sans MS','Consolas','Constantia','Cooper Black','Corbel','Corbel Light','Courier','Courier New','Curlz MT','DejaVu Sans','DejaVu Sans Mono','DejaVu Serif','Ebrima','Edwardian Script ITC','Elephant','Engravers MT','Felix Titling','Footlight MT Light','Forte','Franklin Gothic Book','Franklin Gothic Medium','Freestyle Script','French Script MT','Gabriola','Gadugi','Garamond','Gentium Basic','Gentium Book Basic','Georgia','Georgia Pro','Georgia Pro Black','Georgia Pro Light','Georgia Pro Semibold','Gigi','Gill Sans MT','Gill Sans MT Condensed','Gill Sans Nova','Gill Sans Nova Light','Goudy Old Style','Goudy Stout','Haettenschweiler','Harrington','High Tower Text','HoloLens MDL2 Assets','Impact','Imprint MT Shadow','Informal Roman','Ink Free','Javanese Text','Jokerman','Juice ITC','KacstBook','KacstOffice','Kristen ITC','Kunstler Script','Leelawadee','Leelawadee UI','Liberation Mono','Liberation Sans','Liberation Sans Narrow','Liberation Serif','Lucida Bright','Lucida Bright Demibold','Lucida Calligraphy','Lucida Console','Lucida Fax','Lucida Fax Demibold','Lucida Fax Regular','Lucida Handwriting','Lucida Sans','Lucida Sans Typewriter','Lucida Sans Unicode','MS Gothic','MS Outlook','MS PGothic','MS Reference Sans Serif','MS Reference Specialty','MS Sans Serif','MS Serif','MS UI Gothic','MT Extra','MV Boli','Magneto','Maiandra GD','Malgun Gothic','Marlett','Matura MT Script Capitals','Meiryo','Meiryo UI','Microsoft Himalaya','Microsoft JhengHei','Microsoft JhengHei Light','Microsoft JhengHei Regular','Microsoft JhengHei UI','Microsoft JhengHei UI Light','Microsoft JhengHei UI Regular','Microsoft New Tai Lue','Microsoft PhagsPa','Microsoft Sans Serif','Microsoft Tai Le','Microsoft Uighur','Microsoft YaHei','Microsoft YaHei Light','Microsoft YaHei UI','Microsoft YaHei UI Light','Microsoft Yi Baiti','MingLiU-ExtB','MingLiU_HKSCS-ExtB','Mistral','Modern No. 20','Mongolian Baiti','Monotype Corsiva','Myanmar Text','NSimSun','Neue Haas Grotesk Text Pro','Neue Haas Grotesk Text Pro Medium','Niagara Engraved','Niagara Solid','Nirmala UI','Noto Mono','Noto Naskh Arabic','Noto Sans','Noto Sans Armenian','Noto Sans Armenian Black','Noto Sans Armenian ExtraBold','Noto Sans Armenian ExtraLight','Noto Sans Armenian Light','Noto Sans Armenian Medium','Noto Sans Armenian Regular','Noto Sans Armenian SemiBold','Noto Sans Armenian Thin','Noto Sans Georgian','Noto Sans Hebrew','Noto Sans Lao','Noto Sans Lisu Regular','Noto Serif','Old English Text MT','Onyx','OpenSymbol','PMingLiU-ExtB','Palace Script MT','Palatino Linotype','Papyrus','Papyrus Condensed','Parchment','Perpetua','Perpetua Titling MT','Playbill','Poor Richard','Pristina','Ravie','Rockwell','Rockwell Condensed','Rockwell Nova','Rockwell Nova Light','Segoe MDL2 Assets','Segoe Print','Segoe Script','Segoe UI','Segoe UI Black','Segoe UI Emoji','Segoe UI Historic','Segoe UI Light','Segoe UI Semibold','Segoe UI Symbol','Showcard Gothic','SimSun','SimSun-ExtB','Sitka Banner','Sitka Banner Semibold','Sitka Display','Sitka Display Semibold','Sitka Heading','Sitka Heading Semibold','Sitka Small','Sitka Small Semibold','Sitka Subheading','Sitka Subheading Semibold','Sitka Text','Sitka Text Semibold','Snap ITC','Source Code Pro','Stencil','Sylfaen','Symbol','Tahoma','Tempus Sans ITC','Times','Times New Roman','Trebuchet MS','Tw Cen MT','Verdana','Verdana Pro','Verdana Pro Black','Verdana Pro Light','Verdana Pro SemiBold','Viner Hand ITC','Vivaldi','Vladimir Script','Webdings','Wide Latin','Wingdings','Wingdings 2','Wingdings 3','Yu Gothic','Yu Gothic Light','Yu Gothic Medium','Yu Gothic Regular','Yu Gothic UI Light','Yu Gothic UI Regular','Yu Gothic UI Semibold','Ubuntu','Ubuntu Condensed','Ubuntu Light','Ubuntu Medium','Ubuntu Regular','.Aqua Kana','.Helvetica LT MM','.Times LT MM','Academy Engraved LET','Al Bayan','Al Nile','Al Tarikh','American Typewriter','Andale Mono','Apple Braille','Apple Chancery','Apple Color Emoji','Apple SD Gothic Neo','Apple Symbols','AppleGothic','AppleMyungjo','AquaKana','Arial Hebrew','Arial Hebrew Scholar','Arial Rounded MT Bold','Avenir','Avenir Black','Avenir Black Oblique','Avenir Book','Avenir Heavy','Avenir Light','Avenir Medium','Avenir Next','Avenir Next Condensed','Avenir Next Condensed Demi Bold','Avenir Next Condensed Heavy','Avenir Next Condensed Medium','Avenir Next Condensed Ultra Light','Avenir Next Demi Bold','Avenir Next Heavy','Avenir Next Medium','Avenir Next Ultra Light','Ayuthaya','Baghdad','Bangla MN','Bangla Sangam MN','Baskerville','Bebas Neue','Beirut','Big Caslon','Bodoni 72','Bodoni 72 Oldstyle','Bodoni 72 Smallcaps','Bodoni Ornaments','Bradley Hand','Chalkboard','Chalkboard SE','Chalkduster','Charter','Charter Black','Cochin','Copperplate','Corsiva Hebrew','DIN Alternate','DIN Condensed','Damascus','DecoType Naskh','Devanagari MT','Devanagari Sangam MN','Didot','Diwan Kufi','Diwan Thuluth','Euphemia UCAS','Farah','Farisi','Futura','GB18030 Bitmap','Galvji','Geeza Pro','Geneva','Gill Sans','Gujarati MT','Gujarati Sangam MN','Gurmukhi MN','Gurmukhi MT','Gurmukhi Sangam MN','Heiti SC','Heiti TC','Helvetica','Helvetica Neue','Herculanum','Hiragino Kaku Gothic Pro W3','Hiragino Kaku Gothic Pro W6','Hiragino Kaku Gothic ProN','Hiragino Kaku Gothic ProN W3','Hiragino Kaku Gothic ProN W6','Hiragino Kaku Gothic Std W8','Hiragino Kaku Gothic StdN W8','Hiragino Maru Gothic Pro W4','Hiragino Maru Gothic ProN W4','Hiragino Mincho Pro W3','Hiragino Mincho Pro W6','Hiragino Mincho ProN','Hiragino Mincho ProN W3','Hiragino Mincho ProN W6','Hiragino Sans','Hiragino Sans GB W3','Hiragino Sans GB W6','Hiragino Sans W0','Hiragino Sans W1','Hiragino Sans W2','Hiragino Sans W3','Hiragino Sans W4','Hiragino Sans W5','Hiragino Sans W6','Hiragino Sans W7','Hiragino Sans W8','Hiragino Sans W9','Hoefler Text','Hoefler Text Ornaments','ITF Devanagari','ITF Devanagari Marathi','InaiMathi','Iowan Old Style','Iowan Old Style Black','Kailasa','Kannada MN','Kannada Sangam MN','Kefa','Khmer MN','Khmer Sangam MN','KhmerSangamMN','Kohinoor Bangla','Kohinoor Devanagari','Kohinoor Telugu','Kokonor','Krungthep','KufiStandardGK','Lao MN','Lao Sangam MN','LaoSangamMN','LastResort','Lucida Grande','Luminari','Malayalam MN','Malayalam Sangam MN','Marion','Marker Felt','Menlo','Mishafi','Mishafi Gold','Monaco','Mshtakan','MuktaMahee Bold','MuktaMahee Light','MuktaMahee Medium','MuktaMahee Regular','MuktaMahee SemiBold','Muna','Myanmar MN','Myanmar Sangam MN','Nadeem','New Peninim MT','Noteworthy','Noto Nastaliq Urdu','Noto Sans Cypriot','Noto Sans Egyptian Hieroglyphs','Noto Sans Glagolitic','Noto Sans Kannada','Noto Sans Kannada Black','Noto Sans Kannada ExtraBold','Noto Sans Kannada ExtraLight','Noto Sans Kannada Light','Noto Sans Kannada Medium','Noto Sans Kannada SemiBold','Noto Sans Kannada Thin','Noto Sans Mongolian','Noto Sans Myanmar','Noto Sans Myanmar Light','Noto Sans Myanmar Thin','Noto Sans Oriya','Noto Sans Tai Tham','Noto Sans Yi','Noto Sans Zawgyi Light','Noto Sans Zawgyi Thin','Optima','Oriya MN','Oriya Sangam MN','PT Mono','PT Sans','PT Sans Caption','PT Sans Narrow','PT Serif','PT Serif Caption','Palatino','Party LET','Phosphate','PingFang HK','PingFang SC','PingFang TC','Plantagenet Cherokee','Raanana','Roboto','STIXGeneral','STIXGeneral-Bold','STIXGeneral-BoldItalic','STIXGeneral-Italic','STIXGeneral-Regular','STIXIntegralsD','STIXIntegralsD-Bold','STIXIntegralsD-Regular','STIXIntegralsSm','STIXIntegralsSm-Bold','STIXIntegralsSm-Regular','STIXIntegralsUp','STIXIntegralsUp-Bold','STIXIntegralsUp-Regular','STIXIntegralsUpD','STIXIntegralsUpD-Bold','STIXIntegralsUpD-Regular','STIXIntegralsUpSm','STIXIntegralsUpSm-Bold','STIXIntegralsUpSm-Regular','STIXNonUnicode','STIXNonUnicode-Bold','STIXNonUnicode-BoldItalic','STIXNonUnicode-Italic','STIXNonUnicode-Regular','STIXSizeFiveSym','STIXSizeFiveSym-Regular','STIXSizeFourSym','STIXSizeFourSym-Bold','STIXSizeFourSym-Regular','STIXSizeOneSym','STIXSizeOneSym-Bold','STIXSizeOneSym-Regular','STIXSizeThreeSym','STIXSizeThreeSym-Bold','STIXSizeThreeSym-Regular','STIXSizeTwoSym','STIXSizeTwoSym-Bold','STIXSizeTwoSym-Regular','STIXVariants','STIXVariants-Bold','STIXVariants-Regular','STSong','Sana','Sathu','Savoye Let','Seravek','Seravek ExtraLight','Seravek Light','Seravek Medium','Shree Devanagari 714','SignPainter-HouseScript','Silom','Sinhala MN','Sinhala Sangam MN','Skia','Snell Roundhand','Songti SC','Songti TC','Sukhumvit Set','Superclarendon','Tamil MN','Tamil Sangam MN','Telugu MN','Telugu Sangam MN','Thonburi','Trattatello','Waseem','Zapf Dingbats','Zapfino','Arimo','AR BERKLEY','AR JULIAN','Aharoni','Aldhabi','Andalus','Angsana New','AngsanaUPC','Aparajita','Arabic Typesetting','Batang','BatangChe','Browallia New','BrowalliaUPC','Cordia New','CordiaUPC','DFKai-SB','DaunPenh','David','DilleniaUPC','DokChampa','Dotum','DotumChe','Estrangelo Edessa','EucrosiaUPC','Euphemia','FangSong','FrankRuehl','FreesiaUPC','Gautami','Gisha','Gulim','GulimChe','Gungsuh','GungsuhChe','IrisUPC','Iskoola Pota','JasmineUPC','KaiTi','Kalinga','Kartika','Khmer UI','KodchiangUPC','Kokila','Lao UI','Latha','Levenim MT','LilyUPC','MS Mincho','MS PMincho','Mangal','MingLiU','MingLiU_HKSCS','Miriam','Miriam Fixed','MoolBoran','Narkisim','Nyala','PMingLiU','Raavi','Rod','Sakkal Majalla','Shonar Bangla','Shruti','SimHei','Simplified Arabic','Simplified Arabic Fixed','Traditional Arabic','Tunga','Urdu Typesetting','Utsaah','Vani','Vijaya','Vrinda','Yu Mincho','Yu Mincho Demibold','Yu Mincho Light','Yu Mincho Regular','Adobe Arabic','Birch Std','Blackoak Std','Brush Script Std','Chaparral Pro','Chaparral Pro Light','Charlemagne Std','Hobo Std','Letter Gothic Std','Lithos Pro Regular','Minion Pro','Myriad Arabic','Myriad Arabic Black','Myriad Arabic Light','Myriad Arabic Semibold','Myriad Hebrew','Myriad Pro','Nueva Std','OCR A Std','Orator Std','Poplar Std','Prestige Elite Std','Segoe UI Semilight','Tekton Pro','Brussels','BiauKai','Gotu','HeadlineA','Hei','Hiragino Sans CNS W3','Hiragino Sans CNS W6','Jaini','Jaini Purva','Kai','Kaiti SC','Klee Demibold','Klee Medium','Lahore Gurmukhi Bold','Lahore Gurmukhi Light','Lahore Gurmukhi Medium','Lahore Gurmukhi SemiBold','LiHei Pro','LiSong Pro','Modak','Mukta Bold','Mukta ExtraBold','Mukta ExtraLight','Mukta Light','Mukta Malar Bold','Mukta Malar ExtraBold','Mukta Malar ExtraLight','Mukta Malar Light','Mukta Malar Medium','Mukta Malar Regular','Mukta Malar SemiBold','Mukta Medium','Mukta Regular','Mukta SemiBold','Mukta Vaani Bold','Mukta Vaani ExtraBold','Mukta Vaani ExtraLight','Mukta Vaani Light','Mukta Vaani Medium','Mukta Vaani Regular','Mukta Vaani SemiBold','Nanum Brush Script','Nanum Gothic','Nanum Myeongjo','Nanum Pen Script','NanumGothic','NanumGothic ExtraBold','NanumMyeongjo','Noto Serif Kannada Black','Noto Serif Kannada ExtraBold','Noto Serif Kannada ExtraLight','Noto Serif Kannada Light','Noto Serif Kannada Medium','Noto Serif Kannada SemiBold','Noto Serif Kannada Thin','Osaka','Osaka-Mono','PSL Ornanong Pro','STFangsong','STHeiti','STKaiti','STXihei','Shobhika Bold','Shobhika Regular','Tiro Bangla','Tiro Gurmukhi','Tiro Hindi','Tiro Kannada','Tiro Marathi','Tiro Sanskrit','Tiro Tamil','Tiro Telugu','Toppan Bunkyu Gothic Regular','Toppan Bunkyu Midashi Gothic Extrabold','Toppan Bunkyu Midashi Mincho Extrabold','Toppan Bunkyu Mincho Regular','Tsukushi A Round Gothic Bold','Tsukushi A Round Gothic Regular','Tsukushi B Round Gothic Bold','Tsukushi B Round Gothic Regular','Weibei TC Bold','YuGothic Bold','YuGothic Medium','YuMincho +36p Kana Demibold','YuMincho +36p Kana Extrabold','YuMincho +36p Kana Medium','YuMincho Demibold','YuMincho Extrabold','YuMincho Medium','Yuppy SC','Yuppy TC','Ubuntu Mono','Cooper Std Black','Giddyup Std','Mesquite Std','Rosewood Std Regular','Stencil Std','Trajan Pro','Segoe Fluent Icons','Droid Serif','Clarendon','Eurostile','Goudy','Helvetica Light','Hoefler Text Black','Optima Regular','DecoType Naskh Regular','Helvetica Neue Light','Helvetica Neue Medium','Helvetica Neue Thin','Helvetica Neue UltraLight','SWGamekeys MT','BIZ UDGothic','BIZ UDMincho Medium','BIZ UDPGothic','BIZ UDPMincho Medium','DengXian','DengXian Light','Sanskrit Text','UD Digi Kyokasho N-B','UD Digi Kyokasho N-R','UD Digi Kyokasho NK-B','UD Digi Kyokasho NK-R','UD Digi Kyokasho NP-B','UD Digi Kyokasho NP-R','ITC Stone Serif','Monospace','Serif','Abadi MT Condensed Extra Bold','Abadi MT Condensed Light','Braggadocio','Britannic Bold','Copperplate Gothic Bold','Desdemona','Gloucester MT Extra Condensed','Kino MT','Kohinoor Telugu Bold','Kohinoor Telugu Light','Kohinoor Telugu Medium','Kohinoor Telugu Semibold','Kozuka Gothic Pr6N B','Lucida Blackletter','Monotype Sorts','News Gothic MT','Nueva Std Cond','Rockwell Extra Bold','System Font','Tekton Pro Cond','Tekton Pro Ext','Dancing Script','Droid Sans','Droid Sans Mono','Luxi Mono','Baskerville SemiBold','FreeMono','FreeSerif','Roboto Light','Roboto Medium','Roboto Regular','Droid Sans Fallback','FreeSans','Sans','Sans Serif','Capitals','Mona Lisa Solid ITC TT','PortagoITC TT','Princetown LET','SchoolHouse Cursive B','SchoolHouse Printed A','Synchro LET','18thCentury','AcmeFont','Alfredo','Alien Encounters','Almonte Snow','Amethyst','Asimov','Autumn','BN Jinx','BN Machine','BOUTON International Symbols','Baby Kruffy','Balthazar','Bastion','Bobcat','BolsterBold','Borealis','Brandish','Calligraphic','Calvin','Candles','Chinyen','Colbert','Commons','Coolsville','Corporate','Cracked Johnnie','Creepygirl','Dayton','Deneane','Detente','Digifit','Distant Galaxy','Dominican','Emmett','Enliven','Ethnocentric','Fingerpop','Flubber','Frankfurter Venetian TT','Gazzarelli','Geotype TT','Glockenspiel','Good Times','Greek Diner Inline TT','Hand Me Down S (BRK)','Hansen','Harvest','HarvestItal','Haxton Logos TT','Heavy Heap','Hollywood Hills','Hombre','Huxley Titling','Induction','Italianate','LetterOMatic!','Limousine','LittleLordFontleroy','Mael','Manorly','Martina','MelodBold','Minerva','Moonbeam','Mycalc','Nasalization','Neon Lights','Notram','November','OpineHeavy','PR Celtic Narrow','Parry Hotter','PenultimateLight','PhrasticMedium','Pirate','QuiverItal','Roland','Rondalo','RowdyHeavy','Russel Write TT','SF Movie Poster','Salina','Skinny','Snowdrift','Splash','Stephen','Tarzan','Terminator Two','Toledo','Valken','Vivian','Waverly','Whimsy TT','Woodcut','X-Files','Year supply of fairy cakes','NanumBarunGothic','Futura Medium','Utopia','Aakar','Abyssinica SIL','Ani','AnjaliOldLipi','Chandas','Chilanka','Dyuthi','Garuda','Gubbi','Jamrul','KacstArt','KacstDecorative','KacstDigital','KacstFarsi','KacstLetter','KacstNaskh','KacstOne','KacstPen','KacstPoster','KacstQurn','KacstScreen','KacstTitle','KacstTitleL','Kalapi','Kalimati','Karumbi','Keraleeyam','Khmer OS','Khmer OS System','Kinnari','Laksaman','Likhan','Lohit Assamese','Lohit Bengali','Lohit Devanagari','Lohit Gujarati','Lohit Gurmukhi','Lohit Kannada','Lohit Malayalam','Lohit Odia','Lohit Tamil','Lohit Tamil Classical','Lohit Telugu','Loma','Meera','Mukti Narrow','Nakula','Navilu','Norasi','Noto Color Emoji','Noto Sans Bengali','Noto Sans Canadian Aboriginal','Noto Sans Cherokee','Noto Sans Devanagari','Noto Sans Ethiopic','Noto Sans Gujarati','Noto Sans Gurmukhi','Noto Sans Khmer','Noto Sans Malayalam','Noto Sans Sinhala','Noto Sans Symbols','Noto Sans Tamil','Noto Sans Telugu','Noto Sans Thai','Padauk','Padauk Book','Padmaa','Pagul','Phetsarath OT','Pothana2000','Purisa','Rachana','RaghuMalayalam','Rekha','Saab','Sahadeva','Samanata','Samyak Devanagari','Samyak Gujarati','Samyak Malayalam','Samyak Tamil','Sarai','Sawasdee','Suruma','Tibetan Machine Uni','Tlwg Mono','Tlwg Typewriter','Tlwg Typist','Tlwg Typo','Umpush','Uroob','Utkal','Vemana2000','Waree','lklug','mry_KacstQurn','ori1Uni','WenQuanYi Zen Hei','Avenir Next Regular','Bitstream Vera Sans','Helvetica LT Std','Baloo Regular','Arabic Transparent','Brush Script','Nina','Athelas Regular','Cutive Mono','Droid','Noto Sans JP','Baloo Thambi Regular','Carrois Gothic SC','Fira Sans','Fira Sans ExtraLight','Fira Sans Light','Fira Sans Medium','Fira Sans Regular','Gill Sans Light','Gill Sans SemiBold','Gill Sans UltraBold','Maku Bold','Superclarendon Black','Superclarendon Light','Superclarendon Regular','BM DoHyeon OTF','BM HANNA 11yrs old OTF','BM HANNA Air OTF','BM HANNA Pro OTF','BM JUA OTF','BM KIRANGHAERANG OTF','BM YEONSUNG OTF','Gill Sans Ultra Bold','NanumMyeongjo ExtraBold','Noto Sans KR','Noto Sans SC','Lohit Punjabi','Charcoal CY','Eras Bold ITC','Forgotten Futurist Shadow','Franklin Gothic Medium Cond','Geneva CY','Gill Sans MT Ext Condensed Bold','Gill Sans Ultra Bold Condensed','OCR A Extended','Rage Italic','Script MT Bold','American Typewriter Condensed','American Typewriter Light','American Typewriter Semibold','BlairMdITC TT Medium','Copperplate Light','Marker Felt Thin','TakaoPGothic','Keyboard','Terminal','Corsiva','Bellerose','Forgotten Futurist Regular','Gentium','GentiumAlt','Stone Sans Sem ITC TT Semi','Menlo Regular','Nimbus Sans L','STIX Two Math','STIX Two Text','Big Caslon Medium','Sukhumvit Set Light','Sukhumvit Set Medium','Sukhumvit Set Text','Sukhumvit Set Thin','Times Roman','Ume Gothic','Ume Mincho','Ume P Gothic','Ume P Mincho','Ume UI Gothic','UnBatang','UnDinaru','UnDotum','UnGraphic','UnGungseo','UnPilgi','WenQuanYi Micro Hei','WenQuanYi Micro Hei Mono','Bank Gothic Light','Bank Gothic Medium','Script','Druk Wide Medium','Calibri Light Italic','Modern','DejaVu LGC Sans','MotoyaLMaru','Arial CE','Noto Sans TC','Baloo Bhai Regular','Noto Emoji',
    	].sort());
	const fontAvailable = new Set();
	
	h = document.getElementsByTagName("BODY")[0];
	d = document.createElement("DIV");
	s = document.createElement("SPAN");
	d.appendChild(s);
	
	d.style.fontFamily = 'fake-font-n123';
	s.style.fontFamily = 'fake-font-n123';
	s.style.fontSize = "72px";
	s.innerHTML = "font_detection";
	h.appendChild(d);
		
	baseline_textWidth = s.offsetWidth;
	baseline_textHeight = s.offsetHeight;

	for (const font of fontCheck.values()) {	
		
		d.style.fontFamily = font;
		s.style.fontFamily = font;
		s.style.fontSize = "72px";
		s.innerHTML = "font_detection";
		h.appendChild(d);
		
		textWidth = s.offsetWidth;
		textHeight = s.offsetHeight;
		
		if ((textWidth != baseline_textWidth) || (textHeight != baseline_textHeight)) {
			fontAvailable.add(font);
		}

	}
	
	h.removeChild(d);
	
	return [...fontAvailable.values()];
};
const fonts = getFonts();

async function getMediaDevices() {
    try {
        const medDev = [];
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        for (let i = 0; i < mediaDevices.length; i++) {
            medDev.push({
                kind: mediaDevices[i].kind,
                deviceId: mediaDevices[i].deviceId,
                groupId: mediaDevices[i].groupId,
                label: mediaDevices[i].label
            });
        }
        const avaimedDev = (medDev.length > 0) ? medDev : {
            kind:'NA',
            deviceId: 'NA',
            groupId: 'NA',
            label: 'NA'
        };
        return avaimedDev;

    } catch {
        return {
            kind:'NA',
            deviceId: 'NA',
            groupId: 'NA',
            label: 'NA'
        };
    }
};

async function getPermissions() {
    const permissionName = [
        "accelerometer",
        "background-fetch",
        "background-sync",
        "camera",
        "clipboard-read",
        "clipboard-write",
        "display-capture",
        "geolocation",
        "gyroscope",
        "magnetometer",
        "microphone",
        "midi",
        "nfc",
        "notifications",
        "payment-handler",
        "persistent-storage",
        "screen-wake-lock"
    ];

    const permState = [];
    for (const perm of permissionName) {
        try {
            const { state } = await navigator.permissions.query(Object.assign({name: perm}));
            permState.push(state);
        } catch {
            permState.push('unsupported');
        }
    }

    return permState;
};

function getWebGLData() {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    const ext = gl.getExtension("WEBGL_debug_renderer_info");

    const webglRenderer = ((ext !== null && 'getParameter' in gl) ? (gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || gl.getParameter(gl.RENDERER)) : 'NA');

    const webglExtensions = 'getSupportedExtensions' in gl ? gl.getSupportedExtensions() : 'NA';

    const webglContextAttributes = gl.getContextAttributes()
    const isInWebglAttributes = !gl.isContextLost() && 'getContextAttributes' in gl

    const webglAttributes_powerPreference = isInWebglAttributes && 'powerPreference' in webglContextAttributes ? webglContextAttributes.powerPreference : 'NA'

    const paramName = [
        gl.ALIASED_LINE_WIDTH_RANGE,
        gl.ALIASED_POINT_SIZE_RANGE,
        gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS,
        gl.MAX_CUBE_MAP_TEXTURE_SIZE,
        gl.MAX_FRAGMENT_UNIFORM_VECTORS,
        gl.MAX_RENDERBUFFER_SIZE,
        gl.MAX_VARYING_VECTORS,
        gl.MAX_VERTEX_ATTRIBS,
        gl.MAX_VERTEX_UNIFORM_VECTORS,
        gl.MAX_VIEWPORT_DIMS,
        gl.SAMPLES,
        gl.STENCIL_VALUE_MASK,
        gl.SUBPIXEL_BITS,
    ];
    const webglParameters = [];
    let localValue = '';
    for (const pname of paramName) {
        try {
            if (gl.getParameter(pname) != null) {
                if ((pname == gl.ALIASED_LINE_WIDTH_RANGE) || (pname == gl.ALIASED_POINT_SIZE_RANGE) || (pname == gl.MAX_VIEWPORT_DIMS)) {
                    localValue = gl.getParameter(pname);
                    if (localValue.length > 0) {
                        webglParameters.push(`[${localValue[0]},${localValue[1]}]`);
                    } else {
                        webglParameters.push('unsupported');
                    }
                } else {
                    webglParameters.push(gl.getParameter(pname));
                }
            }
        } catch {
            webglParameters.push('unsupported');
        }
    }

    const precisionTypeFRAGMENT_SHADER = [
        gl.HIGH_INT
    ];
    const getLengthOfObject = (obj) => { 
        let length0fObject = 0;
        for(let key in obj){
          length0fObject++;
        }
        return length0fObject;
    }
    const webglShaderPrecision = [];

    for (const ptype of precisionTypeFRAGMENT_SHADER) {
        try {
            if (gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, ptype) != null && getLengthOfObject(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, ptype)) > 0) {
                webglShaderPrecision.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, ptype));
            } else {
                webglShaderPrecision.push('unsupported');
            }
        } catch {
            webglShaderPrecision.push('unsupported');
        }
    }

    return {
        webglRenderer,
        webglExtensions,
        webglAttributes_powerPreference,
        webglParameters,
        webglShaderPrecision
    };
};
const webGLData = getWebGLData();

function getAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();

    const isInAudioCtx = ('baseLatency', 'sampleRate', 'state') in audioCtx

    const audioCtx_baseLatency = isInAudioCtx ? audioCtx.baseLatency : 'NA'
    const audioCtx_maxChannelCount = 'maxChannelCount' in audioCtx.destination ? audioCtx.destination.maxChannelCount : 'NA'
    const audioCtx_sampleRate = isInAudioCtx ? audioCtx.sampleRate : 'NA'
    const audioCtx_state = isInAudioCtx ? audioCtx.state : 'NA'

    return {
        audioCtx_baseLatency,
        audioCtx_maxChannelCount,
        audioCtx_sampleRate,
        audioCtx_state,
    };
};
const audioContext = getAudioContext();

async function getAudioFormats() {
    const contentTypeName = [
        "audio/aac",
        "audio/aacp",
	];
	
	const contentTypeState = [];
	for (const contentType of contentTypeName) {
		try {
			const audioFo = await navigator.mediaCapabilities.decodingInfo({
				type : 'file',
				audio : {
					contentType : contentType
				 }
			});
			contentTypeState.push(audioFo);
		} catch {
            contentTypeState.push(
                {
                    powerEfficient: 'unsupported',
                    smooth: 'unsupported',
                    supported: 'unsupported'
                }
            );
		}
	}
	
    return contentTypeState;
};

function getMacrosBid() {
    let urlScript;
    let currentScript;
    let params = {};
    let uuid = 'NA';
    let publisherName = 'NA';
    let publisherID = 'NA';
    let scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        urlScript = scripts[i].getAttribute("src");
        if (urlScript) {
            if (urlScript.indexOf(pixelName) > -1) {
                currentScript = scripts[i];
            }
        }
    }
    if (currentScript) {
        let queryString = currentScript.src.replace(/^[^?]+\??/, '');
        let Pairs = queryString.split(/[&]/);
        for (let i = 0; i < Pairs.length; i++) {
            let KeyVal = Pairs[i].split('=');
            if (!KeyVal || KeyVal.length !== 2) continue;
            let key = decodeURIComponent(KeyVal[0]);
            let val = decodeURIComponent(KeyVal[1]);
            val = val.replace(/\+/g, ' ');
            params[key] = val;
        }
        uuid = params.uuid;
        publisherName = params.publisherName;
        publisherID = params.publisherID;
    }
    return {
        uuid,
        publisherName,
        publisherID
    }
};
 const macrosBid = getMacrosBid();

const idAd = new Date().valueOf() + Math.random().toFixed(14).substring(2);


const __wsURL = (() => {
  const h = wsHost || location.host;
  if (/^wss?:\/\//i.test(h)) {
    const hasPort = /:[0-9]+$/.test(h);
    return hasPort || !wsPort ? h : `${h}:${wsPort}`;
  }
  const scheme = location.protocol === 'https:' ? 'wss://' : 'ws://';
  return scheme + h + (wsPort ? ':' + wsPort : '');
})();
const ws = new WebSocket(__wsURL);

ws.addEventListener('open', () => {
    doSendJSONdata0();
    doSendJSONdata1();
    doSendJSONdata2();
    doSendJSONdata3();
    doSendJSONdata4();
    doSendJSONdata5();
});

function doSendJSONdata0() {
    const JSONdata0 = {

        "idAd": idAd,
        "uuid": macrosBid.uuid,
        "publisherName": macrosBid.publisherName,
        "publisherID": macrosBid.publisherID,
        "vPixel": pixelVersion,
        "ua": getUserAgent(),
        "contEncoding": header.contEncoding,
        "contType": header.contType,
        "numCPU": getHardwareConcurrency(),
        "devMemo": getDeviceMemory(),
        "screen": {
            "screenColorDepth": screenSettings.screenColorDepth,
            "screenOrientation": {
                "angle": (screenSettings.screenOrientation && screenSettings.screenOrientation.angle) ? screenSettings.screenOrientation.angle : null,
                "type":  (screenSettings.screenOrientation && screenSettings.screenOrientation.type)  ? screenSettings.screenOrientation.type  : null,
            },
            "screenLeft": screenSettings.screenLeft,
            "screenInnerWidth": screenSettings.innerWidth,
            "screenInnerHeight": screenSettings.innerHeight,
            "screenOuterWidth": screenSettings.outerWidth,
            "screenOuterHeight": screenSettings.outerHeight,
        },
        "numOfTouchPoint": getTouchPoint(),
        "languages": getLanguages(),
        "dnt": getDNTsettings(),
        "displayWindow": {
            "availWidth": displayWindow.availWidth,
            "availHeight": displayWindow.availHeight,
            "availLeft": displayWindow.availLeft,
            "availTop": displayWindow.availTop,
            "fullScreenEnabled": displayWindow.fullScreenEnabled,
        },
        "PDFviewerEnabled": getPDFviewerEnabled(),
        "navigatorProperties": getNavigatorProperties(),
        "plugins": getPlugins(),
        "cookieEnabled": cookieSettings.cookieEnabled,
        "cookies": cookieSettings.cookies,
        "MIMEtype": getMIMEtype(),
        "tZoneOffset": getTimeZOffset(),
    }
    ws.send(JSON.stringify(JSONdata0));
};

async function doSendJSONdata1() {
    try {
        const mediaDevices = await getMediaDevices()
        const permissions = await getPermissions()
        const storageEstimate = await getEstimateStorage()

        const res1 = await Promise.all([
            mediaDevices,
            permissions,
            storageEstimate
        ]);

        return sendJSONdata1(res1[0], res1[1], res1[2])
    } catch {}
}
function sendJSONdata1(outcomeAvaimedDev, outcomePermissions, outcomeEstimate) {
    const JSONdata1 = {

        "idAd": idAd,
        "mediaDev": outcomeAvaimedDev,
        "permissions": {
            "accelerometer": outcomePermissions[0],
            "backgroundFetch": outcomePermissions[1],
            "backgroundSync": outcomePermissions[2],
            "camera": outcomePermissions[3],
            "clipboardRead": outcomePermissions[4],
            "clipboardWrite": outcomePermissions[5],
            "displayCapture": outcomePermissions[6],
            "geolocation": outcomePermissions[7],
            "gyroscope": outcomePermissions[8],
            "magnetometer": outcomePermissions[9],
            "microphone": outcomePermissions[10],
            "midi": outcomePermissions[11],
            "nfc": outcomePermissions[12],
            "notifications": outcomePermissions[13],
            "paymentHandler": outcomePermissions[14],
            "persistentStorage": outcomePermissions[15],
            "screenWakeLock": outcomePermissions[16],
        },
        "storage": {
            "quota": outcomeEstimate.quota,
        },
    }
    ws.send(JSON.stringify(JSONdata1));
};

function doSendJSONdata2() {
    const JSONdata2 = {

        "idAd": idAd,
        "webGL": {
            "webGLRenderer": webGLData.webglRenderer,
            "webGLExtensions": webGLData.webglExtensions,
            "webGLAttributes": {
                "powerPreference": webGLData.webglAttributes_powerPreference,
            },
            "webGLParameters": {
                "ALIASED_LINE_WIDTH_RANGE": webGLData.webglParameters[0],
                "ALIASED_POINT_SIZE_RANGE": webGLData.webglParameters[1],
                "MAX_COMBINED_TEXTURE_IMAGE_UNITS": webGLData.webglParameters[2],
                "MAX_CUBE_MAP_TEXTURE_SIZE": webGLData.webglParameters[3],
                "MAX_FRAGMENT_UNIFORM_VECTORS": webGLData.webglParameters[4],
                "MAX_RENDERBUFFER_SIZE": webGLData.webglParameters[5],
                "MAX_VARYING_VECTORS": webGLData.webglParameters[6],
                "MAX_VERTEX_ATTRIBS": webGLData.webglParameters[7],
                "MAX_VERTEX_UNIFORM_VECTORS": webGLData.webglParameters[8],
                "MAX_VIEWPORT_DIMS": webGLData.webglParameters[9],
                "SAMPLES": webGLData.webglParameters[10],
                "STENCIL_VALUE_MASK": webGLData.webglParameters[11],
                "SUBPIXEL_BITS": webGLData.webglParameters[12],
            },
            "webglShaderPrecision": {
                "FRAGMENT_SHADER_HIGH_INT": {
                    "rangeMax": webGLData.webglShaderPrecision[0].rangeMax,
                },
            },
        },
    }
    ws.send(JSON.stringify(JSONdata2));
};

function doSendJSONdata3() {
    const JSONdata3 = {

        "idAd": idAd,
        "canvasData": canvas,
    }
    ws.send(JSON.stringify(JSONdata3));
};

function doSendJSONdata4() {
    const JSONdata4 = {

        "idAd": idAd,
        "fonts": fonts,
    }
    ws.send(JSON.stringify(JSONdata4));
};

async function doSendJSONdata5() {
    try {
        const batteryStatus = await getBatteryStatus()
        const bluetoothAvailability = await getBluetoothAvailability()
        const audioFormats = await getAudioFormats()

        const res2 = await Promise.all([
            batteryStatus,
            bluetoothAvailability,
            audioFormats
        ]);

        return sendJSONdata5(res2[0], res2[1], res2[2])
    } catch {}
}
function sendJSONdata5(outcomeBatteryStatus, outcomeBluetoothAvailability, outcomeAudioFormat) {

    const isGetBatteryInNavigator = 'getBattery' in navigator;

    const JSONdata5 = {

        "idAd": idAd,
        "ref": getReferer(),
        "url": getURL(),   
        "batteryStatus": {
            "charging": (isGetBatteryInNavigator ? outcomeBatteryStatus.charging : 'NA'),
        },
        "bluetoothAvailability": outcomeBluetoothAvailability,
        "audioFormats": {
            "auFoAcc": {
                "supported": outcomeAudioFormat[0].supported,
            },
            "auFoAacp": {
                "supported": outcomeAudioFormat[1].supported,
            },
        },
        "audioContext": {
            "baseLatency": audioContext.audioCtx_baseLatency,
            "maxChannelCount": audioContext.audioCtx_maxChannelCount,
            "sampleRate": audioContext.audioCtx_sampleRate,
            "state": audioContext.audioCtx_state
        },
    }
    ws.send(JSON.stringify(JSONdata5));
};
