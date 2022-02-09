const input = document.querySelector('input')
const form = document.querySelector('form')
const res = document.querySelector('#results')

let inputValue = ''

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
		// const classes = domElement.getAttribute('class') ? `class="${domElement.getAttribute('class')}"` : ''
		// const style = domElement.getAttribute('style') ? `style="${domElement.getAttribute('style')}"` : ''
		// const w = domElement.getAttribute('width') ? `width="${domElement.getAttribute('width')}"` : ''
		// const h = domElement.getAttribute('height') ? `height="${domElement.getAttribute('height')}"` : ''
		// const alt = domElement.getAttribute('alt') ? `alt="${domElement.getAttribute('alt')}"` : ''

		let stringAttrs = ''
		const attrs = [
			{el: 'class', value: domElement.getAttribute('class')},
			{el: 'style', value: domElement.getAttribute('style')},
			{el: 'width', value: domElement.getAttribute('width')},
			{el: 'height', value: domElement.getAttribute('height')},
			{el: 'alt', value: domElement.getAttribute('alt')}
		]

		attrs.forEach(item => {
			if (item.value !== null && item.value.length && item.value.indexOf('wheel-img') === -1) {
				pic.setAttribute(item.el, item.value)

				stringAttrs += `${item.el}="${item.value}" `
			}
		})

		const typeLength = src.split('.').pop().length + 1
		const webpSrc = inputValue.length 
			? `${inputValue}/${src.slice(0, -typeLength).split('/').pop()}.webp` 
			: `${src.slice(0, -typeLength)}.webp`
		console.log('webp src:', webpSrc);
		
		pic.innerHTML = `<source srcset="${webpSrc}" type="image/webp" ${stringAttrs}>`
		pic.innerHTML += img

		__temp_index_content = __temp_index_content.replaceAll(img, pic.outerHTML)

		console.log(pic);
		console.log('=================');
	})

	res.value = __temp_index_content
})

input.addEventListener('input', ({ target }) => inputValue = target.value)

function strToDom(str) {
	let parser = new DOMParser()
	let doc = parser.parseFromString(str, 'text/html')
	return doc.body.querySelector('img')
}
