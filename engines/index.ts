import HighlightEngine, { supportedThemes as highlightThemes } from './highlight/index.js';
import PrismEngine, { supportedThemes as prismThemes } from './prism/index.js';
import ShikiEngine, { supportedThemes as shikiThemes } from './shiki/index.js';

export const supportedThemes = {
    prism: prismThemes,
    highlight: highlightThemes,
    shiki: shikiThemes,
};

export {
    PrismEngine,
    HighlightEngine,
    ShikiEngine,
};
