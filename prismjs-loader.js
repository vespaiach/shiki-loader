;(async function () {
  if (typeof document === 'undefined') {
    return
  }

  // Guard against multiple executions
  if (window.__prismjsLoaderInitialized) {
    return
  }
  window.__prismjsLoaderInitialized = true

  const BASE_URL = 'https://cdn.jsdelivr.net/gh/PrismJS/prism@1.30.0'
  const ALL_THEMES = ['prism', 'prism-coy', 'prism-dark', 'prism-funky', 'prism-okaidia', 'prism-solarizedlight', 'prism-tomorrow', 'prism-twilight']
  const DEFAULT_THEME = ALL_THEMES[0]

  /**
   * Extracts the theme name and mode (dark or light) from a given class name.
   *
   * @param {string} className - The class name string to parse.
   * @returns {{ name: string, forDarkMode: boolean } | null} Parsed theme object or `null` if invalid.
   */
  function getThemeNameAndMode(className) {
    const raw = (className ?? '').toLowerCase()
    const name = raw.replace(/^(dark:|light:)/i, '')
    return ALL_THEMES.includes(name) ? { name, forDarkMode: raw.startsWith('dark:') } : null
  }

  /**
   * Parses a theme string and returns theme configuration.
   *
   * @param {string} theme - The theme string to parse.
   * @returns {{ dark?: string, light?: string }} Theme configuration object.
   */
  function parseTheme(theme) {
    const themeObject = getThemeNameAndMode(theme)
    return themeObject
      ? { dark: themeObject.forDarkMode ? themeObject.name : undefined, light: themeObject.forDarkMode ? undefined : themeObject.name }
      : { light: DEFAULT_THEME }
  }

  /**
   * Retrieves theme options for light and dark modes based on the current script's class list.
   *
   * @returns {{ dark?: string, light: string }} Theme options for light and dark modes.
   */
  function getThemeOptions() {
    const scriptElement = document.currentScript
    if (scriptElement?.tagName === 'SCRIPT') {
      if (scriptElement.classList.length === 0) {
        return { light: DEFAULT_THEME }
      }
      const option1 = parseTheme(scriptElement.classList[0])
      const option2 = parseTheme(scriptElement.classList[1])
      return { dark: option1.dark ?? option2.dark, light: option1.light ?? option2.light }
    }

    return { light: DEFAULT_THEME }
  }

  /**
   * Dynamically adds a script or stylesheet element to the document.
   *
   * @param {string} tagName - The type of element to create ('script' or 'link').
   * @param {string} src - The source URL for the script or stylesheet.
   * @returns {Promise<void>} Promise that resolves when the element is loaded.
   */
  function addElement({ tagName, src }) {
    return new Promise((resolve, reject) => {
      const element = document.createElement(tagName)
      element.onload = () => resolve()
      element.onerror = () => reject(new Error(`Failed to load ${tagName}: ${src}`))
      
      if (tagName === 'link') {
        element.rel = 'stylesheet'
        element.href = `${BASE_URL}${src}`
      } else if (tagName === 'script') {
        element.defer = true
        element.src = `${BASE_URL}${src}`
      }
      document.body.appendChild(element)
    })
  }

  // Stop Prism from auto-highlighting
  window.Prism = window.Prism || {}
  window.Prism.manual = true

  const themes = getThemeOptions()
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const coreScriptsToLoad = [
    { tagName: 'link', src: `/themes/${isDarkMode ? themes.dark ?? themes.light : themes.light}.min.css` },
    { tagName: 'link', src: '/plugins/line-numbers/prism-line-numbers.min.css' },
    { tagName: 'script', src: '/components/prism-core.min.js' }
  ]
  const pluginsToLoad = [
    { tagName: 'script', src: '/plugins/autoloader/prism-autoloader.min.js' },
    { tagName: 'script', src: '/plugins/line-numbers/prism-line-numbers.min.js' }
  ]

  // Timeout: 900 cycles at ~60fps = approximately 15 seconds
  const MAX_LOADING_CYCLES = 900

  /**
   * Polls for a condition to be met within a timeout period.
   *
   * @param {Function} isLoaded - Function that returns true when the condition is met.
   * @returns {Promise<void>} Promise that resolves when loaded or rejects on timeout.
   */
  function checkLoadingStatus(isLoaded) {
    return new Promise((resolve, reject) => {
      let cycle = 0
      const loop = () => {
        if (isLoaded()) {
          resolve()
        } else {
          cycle++
          if (cycle > MAX_LOADING_CYCLES) {
            reject(new Error('Prism failed to load within the expected time.'))
          } else {
            requestAnimationFrame(loop)
          }
        }
      }
      loop()
    })
  }

  try {
    document.body.classList.add('line-numbers')

    // Load core scripts sequentially (CSS first, then Prism core)
    for (const script of coreScriptsToLoad) {
      await addElement(script)
    }
    await checkLoadingStatus(() => !!window.Prism?.filename)

    // Load plugins in parallel for better performance
    await Promise.all(pluginsToLoad.map(plugin => addElement(plugin)))
    await checkLoadingStatus(() => !!window.Prism?.plugins?.autoloader)

    window.Prism.highlightAll()
  } catch (error) {
    console.error('Error loading PrismJS:', error)
  }
})()
