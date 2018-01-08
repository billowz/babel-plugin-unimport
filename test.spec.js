const transformFileSync = require('babel-core').transformFileSync
const babelOptions = {
	babelrc: false,
	presets: [require('babel-preset-env'), require("babel-preset-stage-2")],
	plugins: [
		[require('./index.js'), {
			library: {
				devlevel: ['debug', 'warn', 'error', 'log.info']
			}
		}]
	]
}
describe('undevlevel', () => {
	it("unassert", () => {
		const result = transformFileSync('./testfile.js', babelOptions);
		expect(result.code).toMatch(/info/)
		expect(result.code).toMatch(/assert/g)
		expect(result.code).toMatch(/dev\.assert/g)

		expect(result.code).not.toMatch(/log\.info/g)
		expect(result.code).not.toMatch(/\\ndebug/g)
		expect(result.code).not.toMatch(/\\nwarn/g)
		expect(result.code).not.toMatch(/\\nerror/g)
		console.debug(result.code)
	})
})
