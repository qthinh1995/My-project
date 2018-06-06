import { forEach } from 'lodash'
/* getCookie('key') */
export function getCookie(name) {
	const re = new RegExp(name + '=([^;]+)');
	const value = re.exec(document.cookie);
	return (value != null) ? unescape(value[1]) : null;
}

export function arrToObj({arr = [], key = 'id'}) {
	const obj = {}
	forEach(arr, (o) => {
		obj[o[key]] = o
	})
	return obj
}
