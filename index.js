import strToDOM from './strToDOM.js'

const inputPathWebp = document.querySelector('#inputPathWebp')
const inputOldOffer = document.querySelector('#inputOlfOffer')
const inputNewOffer = document.querySelector('#inputNewOffer')
const replaceHash = document.querySelector('#replaceHash')

const form = document.querySelector('form')
const res = document.querySelector('#results')
const buttonCopyCode = document.querySelector('#buttonCopyCode')


// bootstrap
const toastContainer = document.querySelector('.toast-container')

let inputValue = ''

form.addEventListener('submit', ev => {
	ev.preventDefault()

	const indexContent = ev.target[0].value
	const allImages = indexContent.match(/<img(.*?)([\s\S]*?)>/g)
	const allPictures = indexContent.match(/<picture(.*?)([\s\S]*?)>([\s\S]*?)<\/picture>/g)

	let __temp_index_content = indexContent

	if (!indexContent.length) 
		return createToast('Нужно вставить код', 'danger')
	
	if (!allImages)
		return createToast('Не нашелся тэг <b>< img ></b>', 'warning')
	
	if (allPictures)
		createToast('Осторожно! В шаблоне уже есть <b>< picture ></b>!', 'warning')

	// добавляем data-meowmeow ко всем img внутри всех существующих picture
	if (allPictures) {
		allPictures.forEach(pic => {
			const elementPic = strToDOM(pic, 'picture')
			elementPic.querySelector('img').dataset.meowmeow = 'true'

			__temp_index_content = __temp_index_content.replaceAll(pic, elementPic.outerHTML)
		})
	}

	// меняем названия оффера
	if (inputOldOffer.value.length && inputNewOffer.value.length) {
		// https://learn.javascript.ru/regexp-specials
		__temp_index_content = __temp_index_content.replaceAll(inputOldOffer.value, inputNewOffer.value)
	}

	// заменяем хэш/якорь в ссылках
	// удаляем target="..."
	// if (replaceHash.checked) {
	// 	const allLinks = __temp_index_content.match(/<a(.*?)([\s\S]*?)>([\s\S]*?)<\/a>/g)

	// 	if (!allLinks) return
	// 	allLinks.forEach(link => {
	// 		const elementLink = strToDOM(link, 'a')
			
	// 		if (elementLink.getAttribute('href')) {
	// 			elementLink.href = '#roulette'
	// 		} else {
	// 			elementLink.setAttribute('href', '#roulette')
	// 		}
	// 		if (elementLink.getAttribute('target')) {
	// 			elementLink.removeAttribute('target')
	// 		}

	// 		__temp_index_content = __temp_index_content.replace(link, elementLink.outerHTML)
	// 	})
	// }

	try {
		allImages.some(img => {
			const pic = document.createElement('picture')
			const domElement = strToDOM(img)

			if (
				domElement.src
					.split('.')
					.pop()
					.indexOf('svg') !== -1 ||
				domElement.src
					.split('.')
					.pop()
					.indexOf('gif') !== -1 ||
				domElement.src
					.split('.')
					.pop()
					.indexOf('webp') !== -1
			)
				return

			if (
				domElement.getAttribute('class')?.includes('wheel') ||
				domElement?.getAttribute('src')?.includes('wheel')
			) {
				return console.error('its maybe >wheel<', domElement)
			}

			if (!domElement || domElement.dataset.meowmeow) return

			domElement.dataset.meowmeow = true

			const src = domElement.getAttribute('src')
			let stringAttrs = ''
			const attrs = [
				{ el: 'class', value: domElement.getAttribute('class') },
				{ el: 'style', value: domElement.getAttribute('style') },
				{ el: 'width', value: domElement.getAttribute('width') },
				{ el: 'height', value: domElement.getAttribute('height') },
				{ el: 'alt', value: domElement.getAttribute('alt') }
			]

			attrs.forEach(item => {
				if (item.value !== null && item.value.length) {
					pic.setAttribute(item.el, item.value)

					stringAttrs += `${item.el}="${item.value}" `
				}
			})

			if (!src) {
				return createToast('Нет атрибута src ' + domElement, 'danger')
			}
			
			const typeLength = src.split('.').pop().length + 1
			const webpSrc = inputValue.length
				? `${inputValue}/${src
						.slice(0, -typeLength)
						.split('/')
						.pop()}.webp`
				: `${src.slice(0, -typeLength)}.webp`

			// console.log('webp src:', webpSrc)

			pic.innerHTML = `<source srcset="${webpSrc}" type="image/webp" ${stringAttrs}>`
			pic.innerHTML += domElement.outerHTML

			__temp_index_content = __temp_index_content.replaceAll(img, pic.outerHTML)

			// console.log(pic);
			// console.log('=================');
		})
	} catch (error) {
		createToast(error + '<hr class="my-1"><b>Check error in console</b>', 'danger')
		console.log(error)
	}

	res.value = __temp_index_content
})

const createToast = (text, type = 'primary') => {
	const toast = document.createElement('div')
	toast.classList.add(
		'toast',
		'align-items-center',
		'text-white',
		`bg-${type}`
	)

	toast.innerHTML = `<div class="d-flex">
      <div class="toast-body">${text}</div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
   </div>`

	toastContainer.append(toast)
	new bootstrap.Toast(toast).show()
	setTimeout(() => toast.remove(), 6000)
}

// BOOTSTRAP
const tooltipTriggerList = [].slice.call(
	document.querySelectorAll('[data-bs-toggle="tooltip"]')
)
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	return new bootstrap.Tooltip(tooltipTriggerEl)
})

// LISTENERS
inputPathWebp.addEventListener('input', ({ target }) => (inputValue = target.value))
buttonCopyCode.addEventListener('click', () => {
	const copyText = document.getElementById('results')
	copyText.select()
	copyText.setSelectionRange(0, 99999)
	navigator.clipboard.writeText(copyText.value)
	document.querySelector('.tooltip-inner').textContent = 'Copied!'
})
