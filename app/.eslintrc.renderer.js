module.exports = {
	extends: [
		// add more generic rulesets here, such as:
		'eslint:recommended',
		'plugin:vue/essential',
		'plugin:vue/recommended',
	],
	rules: {
		// override/add rules settings here, such as:
		// 'vue/no-unused-vars': 'error'
		'vue/html-indent': [
			'error',
			'tab',
			{
				attribute: 1,
			},
		],
		'vue/max-attributes-per-line': ['ignore'],
		'vue/html-self-closing': 0,
	},
};
