// Registers the module hooks in hooks.mjs. Loaded through `node --import` (see the "test" script).
import { register } from 'node:module'

register('./hooks.mjs', import.meta.url)
