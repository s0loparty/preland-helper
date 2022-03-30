export default function (str, tag = 'img') {
	let parser = new DOMParser()
	let doc = parser.parseFromString(str, 'text/html')
	return doc.body.querySelector(tag)
}