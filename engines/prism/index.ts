import BaseEngine from '@/engines/base';
import config from '@/engines/prism/config.yaml';
import type { EngineConfig, EngineInputs, PluginResource, Resource } from '@/type';
import { assertString, log, error as logError, warn } from '@/utils';

const prismConfig = config as EngineConfig;

export const supportedThemes = [
    ...Object.keys(prismConfig.builtIn.themes),
    ...(prismConfig.external ? Object.keys(prismConfig.external.themes) : []),
];

/**
 * Prism.js Engine
 * Syntax highlighting engine powered by Prism.js
 */
export default class PrismEngine extends BaseEngine {
    private resources: Resource[] = [];

    constructor(inputs: EngineInputs) {
        super();
        const { theme, darkMode } = inputs;

        log('Loaded config:', prismConfig);
        this.setTheme(theme, darkMode || '');
        this.setPlugins();
    }

    async initialize() {
        // Stop Prism from auto-highlighting
        if (!window.Prism) {
            window.Prism = { manual: true };
        } else {
            window.Prism.manual = true;
        }

        const load = async (resource: Resource) => {
            await this.loadResource(resource);
        };

        try {
            // Add core script
            await load({ script: `${prismConfig.builtIn.urlPrefix}/components/prism-core.min.js` });
            log('Core script loaded.');

            // Load all resources
            await Promise.all(this.resources.map(load));
            log('[Prism Engine] All resources loaded.', this.resources);
        } catch (er) {
            logError('Error during initialization:', er);
            log('Resources attempted to load:', this.resources);
        }
    }

    setTheme(theme: string, darkMode: string) {
        const addBuiltInResource = (src: string) => {
            this.resources.push({ link: `${prismConfig.builtIn.urlPrefix}${src}` });
        };
        const addExternalResource = (src: string) => {
            if (!prismConfig.external) return;
            this.resources.push({ link: `${prismConfig.external.urlPrefix}${src}` });
        };

        const isDarkMode = Boolean(darkMode) && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        if (isDarkMode && prismConfig.builtIn.themes[darkMode]) {
            addBuiltInResource(prismConfig.builtIn.themes[darkMode]);
            log(`[Prism Engine] Dark mode theme "${darkMode}" applied based on system preference.`);
            return;
        }
        if (!isDarkMode && prismConfig.builtIn.themes[theme]) {
            addBuiltInResource(prismConfig.builtIn.themes[theme]);
            log(`[Prism Engine] Theme "${theme}" applied based on system preference.`);
            return;
        }
        if (!isDarkMode && prismConfig.external?.themes[theme]) {
            addExternalResource(prismConfig.external.themes[theme]);
            log(`[Prism Engine] External theme "${theme}" applied based on system preference.`);
            return;
        }
        if (isDarkMode && prismConfig.external?.themes[darkMode]) {
            addExternalResource(prismConfig.external.themes[darkMode]);
            log(`[Prism Engine] External dark mode theme "${darkMode}" applied based on system preference.`);
            return;
        }

        addBuiltInResource(prismConfig.builtIn.themes.prism);
        warn(`[Prism Engine] Theme "${theme}" is not supported.`);
    }

    setPlugins() {
        // Add plugin
        prismConfig.builtIn.plugins?.forEach((plugin: PluginResource) => {
            this.resources.push({
                script: assertString(plugin.script)
                    ? `${prismConfig.builtIn.urlPrefix}${plugin.script}`
                    : undefined,
                link: assertString(plugin.link)
                    ? `${prismConfig.builtIn.urlPrefix}${plugin.link}`
                    : undefined,
                dependencies: plugin.dependencies?.map((dep: PluginResource) => ({
                    script: assertString(dep.script)
                        ? `${prismConfig.builtIn.urlPrefix}${dep.script}`
                        : undefined,
                    link: assertString(dep.link)
                        ? `${prismConfig.builtIn.urlPrefix}${dep.link}`
                        : undefined,
                })),
            });
        });
    }

    async highlight() {
        window.Prism?.highlightAll?.();
    }
}
