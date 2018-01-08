import { log, assert } from 'devlevel'
import { debug, info, warn, error } from 'devlevel'
import * as dev from 'devlevel'

assert(1, 'error msg')
assert.num(1, 'error msg')

debug('debug')
debug.num(1, 'debug')
info('info')
info.num(1, 'info')
warn('warn')
warn.num(1, 'warn')
error('error')
error.num(1, 'error')

dev.assert(1, 'error msg')
dev.assert.num(1, 'error msg')

log.debug('debug')
log.debug.num(1, 'debug')
log.info('info')
log.info.num(1, 'info')
log.warn('warn')
log.warn.num(1, 'warn')
log.error('error')
log.error.num(1, 'error')

dev.debug('debug')
dev.debug.num(1, 'debug')
dev.info('info')
dev.info.num(1, 'info')
dev.warn('warn')
dev.warn.num(1, 'warn')
dev.error('error')
dev.error.num(1, 'error')


dev.info.debug('debug')
dev.info.debug.num(1, 'debug')
dev.info.info('info')
dev.info.info.num(1, 'info')
dev.info.warn('warn')
dev.info.warn.num(1, 'warn')
dev.info.error('error')
dev.info.error.num(1, 'error')
