import { readFileSync, writeFileSync, existsSync } from 'fs'

const knexPkgPath = 'node_modules/@adonisjs/lucid/node_modules/knex/package.json'

if (existsSync(knexPkgPath)) {
  const pkg = JSON.parse(readFileSync(knexPkgPath, 'utf-8'))
  pkg.exports = {
    '.': {
      require: './knex.js',
      import: './knex.js',
      default: './knex.js',
    },
  }
  writeFileSync(knexPkgPath, JSON.stringify(pkg, null, 2))
  console.log('✅ knex patched')
} else {
  console.log('⚠️ knex nested not found, trying root...')
  const rootKnex = 'node_modules/knex/package.json'
  if (existsSync(rootKnex)) {
    const pkg = JSON.parse(readFileSync(rootKnex, 'utf-8'))
    pkg.exports = {
      '.': {
        require: './knex.js',
        import: './knex.js',
        default: './knex.js',
      },
    }
    writeFileSync(rootKnex, JSON.stringify(pkg, null, 2))
    console.log('✅ root knex patched')
  }
}