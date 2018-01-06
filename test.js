import * as dev from 'devlevel'

import { log, assert } from 'devlevel'
import { debug, info, warn, error } from 'devlevel'

dev.assert(1, 'error msg')
dev.assert.num(1, 'error msg')

assert(1, 'error msg')
assert.num(1, 'error msg')

log.debug('debug')
log.debug.num(1, 'debug')


log.info('info')
log.info.num(1, 'info')


log.warn('warn')
log.warn.num(1, 'warn')

log.error('error')
log.error.num(1, 'error')

debug('debug')
debug.num(1, 'debug')
info('info')
info.num(1, 'info')
warn('warn')
warn.num(1, 'warn')
error('error')
error.num(1, 'error')
