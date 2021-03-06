const input = document.querySelector('input')
const form = document.querySelector('form')
const res = document.querySelector('#results')

let inputValue = ''

form.addEventListener('submit', ev => {
	ev.preventDefault()

	const indexContent = ev.target[0].value
	const allImages = indexContent.match(/<img(.*?)([\s\S]*?)>/g)
	const allPictures = indexContent.match(/<picture(.*?)([\s\S]*?)>([\s\S]*?)<\/picture>/g)

	let __temp_index_content = indexContent

	if (!indexContent.length) return console.warn('Пустое поле инпута')
	if (!allImages) return console.warn('Не нашелся тег <img />')
	if (allPictures) alert('Осторожно! В шаблоне уже есть <picture>!')

	// добавляем data-meowmeow ко всем img внутри всех существующих picture
	if (allPictures) {
		allPictures.forEach(pic => {
			const elementPic = strToDom(pic, 'picture')
			elementPic.querySelector('img').dataset.meowmeow = 'true'

			__temp_index_content = __temp_index_content.replaceAll(pic, elementPic.outerHTML)
		})
	}

	setTimeout(() => {
		allImages.some(img => {
			const pic = document.createElement('picture')
			const domElement = strToDom(img)

			if (
				domElement.src.split('.').pop().indexOf('svg') !== -1 || 
				domElement.src.split('.').pop().indexOf('gif') !== -1 ||
				domElement.src.split('.').pop().indexOf('webp') !== -1
			) return


			if (domElement.getAttribute('class')?.includes('wheel') || domElement?.getAttribute('src')?.includes('wheel')) {
				return console.error('its maybe >wheel<', domElement)
			}

			if (!domElement || domElement.dataset.meowmeow) return
			
			domElement.dataset.meowmeow = true

			const src = domElement.getAttribute('src')
			let stringAttrs = ''
			const attrs = [
				{el: 'class', value: domElement.getAttribute('class')},
				{el: 'style', value: domElement.getAttribute('style')},
				{el: 'width', value: domElement.getAttribute('width')},
				{el: 'height', value: domElement.getAttribute('height')},
				{el: 'alt', value: domElement.getAttribute('alt')}
			]

			attrs.forEach(item => {
				if (item.value !== null && item.value.length) {
					pic.setAttribute(item.el, item.value)

					stringAttrs += `${item.el}="${item.value}" `
				}
			})

			const typeLength = src.split('.').pop().length + 1
			const webpSrc = inputValue.length 
				? `${inputValue}/${src.slice(0, -typeLength).split('/').pop()}.webp` 
				: `${src.slice(0, -typeLength)}.webp`

			console.log('webp src:', webpSrc)
			
			pic.innerHTML = `<source srcset="${webpSrc}" type="image/webp" ${stringAttrs}>`
			pic.innerHTML += domElement.outerHTML

			__temp_index_content = __temp_index_content.replaceAll(img, pic.outerHTML)

			console.log(pic);
			console.log('=================');
		})

		res.value = __temp_index_content
	}, 0)
})

input.addEventListener('input', ({ target }) => inputValue = target.value)

function strToDom(str, tag = 'img') {
	let parser = new DOMParser()
	let doc = parser.parseFromString(str, 'text/html')
	return doc.body.querySelector(tag)
}
