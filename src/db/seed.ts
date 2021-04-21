import * as glob from 'glob'

const seedFiles: string[] = glob.sync(__dirname + '/**/seed.ts')
seedFiles.forEach(require)