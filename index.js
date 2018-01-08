module.exports = function(babel) {
	function fillmap(map, path, level = 0) {
		const sub = map[path[level]] || (map[path[level]] = {})
		if (path.length - 1 > level) {
			fillmap(sub, path, level + 1)
		} else {
			sub.leaf = true
		}
		return map
	}

	function inmap(map, path) {
		for (let i = 0; i < path.length; i++) {
			if (!(map = map[path[i]])) return false
			if (map.leaf) return true
		}
		return false
	}

	function removeRef(spec, lib, refPath) {
		const { local, imported } = spec
		const parentPath = refPath.parentPath
		if (parentPath.isCallExpression()) {
			if (refPath.parentKey === 'callee' && inmap(lib, [imported])) {
				parentPath.remove()
				return true
			}
		} else if (parentPath.isMemberExpression()) {
			let rootPath = parentPath
			const path = [rootPath.node.object.name, rootPath.node.property.name]
			while (rootPath.parentPath.isMemberExpression()) {
				rootPath = rootPath.parentPath
				path.push(rootPath.node.property.name)
			}
			if (imported === '*') {
				path.shift()
				if (!inmap(lib, path)) return false
			} else {
				path[0] = imported
				if (!inmap(lib, path)) return false
			}
			if (rootPath.parentPath.isCallExpression()) {
				if (rootPath.parentKey === 'callee') {
					rootPath.parentPath.remove()
					return true
				}
			}
			if (rootPath.parentPath.isExpressionStatement()) {
				rootPath.parentPath.remove()
				return true
			}
		} else if (parentPath.isExpressionStatement()) {
			parentPath.remove()
			return true
		}
		return false
	}

	function formatSpecified(specified, lib) {
		if (!specified.length) return `import '${lib}'`
		if (specified.length === 1 && specified[0].imported === '*')
			return `import * as ${specified[0].local} from ${lib}`
		return `import {${specified.filter(info=>info.spec.removed).map(info=>{
      const {local, imported, spec} = info
      if(imported === 'default') return 'default as ' + local
      return local === imported ? local : local + ' as ' + imported
    }).join(', ')}} from ${lib}`
	}
	let libs
	return {
		name: "ast-transform", // not required
		visitor: {
			Program(nodePath, pluginPass) {
				const library = pluginPass.opts.library || {}
				libs = {}
				for (let libName in library) {
					let lib = library[libName]
					if (Array.isArray(lib)) {
						if (!lib.length) {
							lib = null
						} else {
							const map = {}
							lib.forEach(l => {
								if (typeof l !== 'string')
									throw new Error('require Array<String> or String library option')
								fillmap(map, l.split('.'))
							})
							lib = map
						}
					} else if (typeof lib === 'string') {
						lib = fillmap({}, lib.split('.'))
					} else if (lib !== true) {
						throw new Error('require Array<String> | String | true library option')
					}
					libs[libName] = lib || { '*': { leaf: true }, 'default': { leaf: true } }
				}
			},
			ImportDeclaration(nodePath, pluginPass) {
				const source = nodePath.get('source');
				const libName = source.node.value
				const lib = libs[libName]
				if (!lib) return

				const specified = nodePath.get('specifiers').map(spec => {
					const local = spec.get('local').node.name
					const imported = spec.isImportDefaultSpecifier() ?
						'default' : spec.isImportNamespaceSpecifier() ?
						'*' : spec.get('imported').node.name
					return {
						spec,
						local,
						imported
					}
				})

				specified.forEach(info => {
					const { local, imported, spec } = info
					let refs = spec.scope.bindings[local].referencePaths
					if (!refs.length) {
						spec.remove()
					} else if (imported === '*' || lib[imported]) {
						refs = refs.filter(ref => !removeRef(info, lib, ref))
						spec.scope.bindings[local].referencePaths = refs
						if (!refs.length) {
							spec.remove()
						}
					}
				})
				if (!nodePath.get('specifiers').length) {
					nodePath.remove()
				}
				console.log(`remove: ${formatSpecified(specified, libName)}`)
			}
		}
	}
}
