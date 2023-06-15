export default function (text, tagName = 'img') {
	let parser = new DOMParser()
	let doc = parser.parseFromString(text, 'text/html')
	return doc.querySelector(tagName)
	// return doc.body.querySelector(tagName)
}