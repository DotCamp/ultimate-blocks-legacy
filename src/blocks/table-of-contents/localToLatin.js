import cyrillic from './languageTables/cyrillic';

const conversionTables = {cyrillic};

/**
 * Convert the local alphabets to their latin counterparts
 *
 * @param {string} local Local name in the conversion table, use 'all' to filter through all available local tables
 * @param {string} target Target string
 *
 * @return {string} formatted target
 */
function toLatin(local, target) {
	function convertAndReplace(l, t) {
		if (conversionTables[l]) {
			const currentTable = conversionTables[l];
			Object.keys(currentTable).map(key => {
				if (Object.prototype.hasOwnProperty.call(currentTable, key)) {
					t = t.replace(new RegExp(key ,'g'), currentTable[key]);
				}
			})
		}
		return t;
	}

	let rawTarget = target;
	if (local === 'all') {
		Object.keys(conversionTables).map(locale => {
			if(Object.prototype.hasOwnProperty.call(conversionTables, locale)){
				rawTarget = convertAndReplace(locale, rawTarget);
			}
		})
	} else {
		rawTarget = convertAndReplace(local, rawTarget);
	}
	return rawTarget;
}

export default toLatin;


