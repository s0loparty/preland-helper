const input = document.querySelector('input')
const form = document.querySelector('form')
const res = document.querySelector('#results')

let inputValue = ''

form.addEventListener('submit', ev => {
	ev.preventDefault()

	const indexContent = ev.target[0].value
	const allImages = indexContent.match(/<img(.*?)([\s\S]*?)>/g)
	const allPictures = indexContent.match(/<picture.*?>/g)

	let __temp_index_content = indexContent

	if (!indexContent.length) return console.warn('Пустое поле инпута')
	if (!allImages) return console.warn('Не нашелся тег <img />')
	if (allPictures) alert('Осторожно! В шаблоне уже есть теги picture')

	allImages.some(img => {
		const pic = document.createElement('picture')
		const domElement = strToDom(img)
		console.log('domElement: ', domElement);

		if (domElement.src.split('.').pop().indexOf('svg') !== -1) return
		if (domElement.dataset.meowmeow) return
		domElement.dataset.meowmeow = true

		const src = domElement.getAttribute('src')
		// let stringAttrs = ''
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

				// stringAttrs += `${item.el}="${item.value}" `

				// удаляем все элементы у исходной картинки
				domElement.removeAttribute(item.el)
			}
		})

		const typeLength = src.split('.').pop().length + 1
		const webpSrc = inputValue.length 
			? `${inputValue}/${src.slice(0, -typeLength).split('/').pop()}.webp` 
			: `${src.slice(0, -typeLength)}.webp`

		console.log('webp src:', webpSrc);
		
		// pic.innerHTML = `<source srcset="${webpSrc}" type="image/webp" ${stringAttrs}>`
		pic.innerHTML = `<source srcset="${webpSrc}" type="image/webp">`
		pic.innerHTML += domElement.outerHTML

		__temp_index_content = __temp_index_content.replaceAll(img, pic.outerHTML)

		console.log(pic);
		console.log('=================');
	})

	res.value = __temp_index_content
})

input.addEventListener('input', ({ target }) => inputValue = target.value)

function strToDom(str, tag = 'img') {
	let parser = new DOMParser()
	let doc = parser.parseFromString(str, 'text/html')
	return doc.body.querySelector(tag)
}
