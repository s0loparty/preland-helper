const form = document.querySelector('form')
const res = document.querySelector('#results')

form.addEventListener('submit', ev => {
	ev.preventDefault()

	const indexContent = ev.target[0].value
	const allImages = indexContent.match(/<img.*?>/g)

	let __temp_index_content = indexContent

	if (!indexContent.length) return console.warn('Пустое поле инпута')
	if (!allImages) return console.warn('Не нашелся тег <img />')

	allImages.forEach(img => {
		const pic = document.createElement('picture')
		const domElement = strToDom(img)
		console.log('domElement: ', domElement);

		const src = domElement.getAttribute('src')
		const classes = domElement.getAttribute('class') ? `class="${domElement.getAttribute('class')}"` : ''
		const style = domElement.getAttribute('style') ? `style="${domElement.getAttribute('style')}"` : ''
		const w = domElement.getAttribute('width') ? `width="${domElement.getAttribute('width')}"` : ''
		const h = domElement.getAttribute('height') ? `height="${domElement.getAttribute('height')}"` : ''
		const alt = domElement.getAttribute('alt') ? `alt="${domElement.getAttribute('alt')}"` : ''

		const typeLength = src.split('.').pop().length + 1
		pic.innerHTML = `<source srcset="${src.slice(0, -typeLength)}.webp" type="image/webp" ${classes} ${style} ${w} ${h} ${alt}>`
		pic.innerHTML += img

		__temp_index_content = __temp_index_content.replaceAll(img, pic.outerHTML)

		console.log(pic);
		console.log('=================');
	})

	res.value = __temp_index_content
})

function strToDom(str) {
	let parser = new DOMParser()
	let doc = parser.parseFromString(str, 'text/html')
	return doc.body.querySelector('img')
}
