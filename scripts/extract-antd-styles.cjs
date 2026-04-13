/**
 * Генерирует статический CSS Ant Design для первого рендера (без FOUC).
 * Запуск: npm run extract-antd-styles
 *
 * При кастомной теме оберните дерево в ConfigProvider — см. README пакета
 * @ant-design/static-style-extract
 */
const fs = require('fs')
const path = require('path')

const { extractStyle } = require('@ant-design/static-style-extract')

const outFile = path.join(__dirname, '../src/styles/antd.design.scss')
const css = extractStyle()

fs.writeFileSync(outFile, css, 'utf8')
console.log(`Wrote ${outFile} (${(css.length / 1024).toFixed(1)} KiB)`)
