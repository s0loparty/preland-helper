import stringParser from './stringToElements.js'

const FORM_MAIN = document.querySelector('#formMain')
const BTN_COPY = document.querySelector('#btnCopy')

function main() {
	const INPUT_LINK_HASH = document.querySelector('#newLinkHash')
	const INPUT_OFFER_NAME_OLD = document.querySelector('#inputOfferNameOld')
	const INPUT_OFFER_NAME_NEW = document.querySelector('#inputOfferNameNew')
	const CHECKBOX_REMOVE_LINK_TARGET = document.querySelector('#removeLinkTarget')
	const CHECKBOX_CONVERT_IMG_TO_PIC = document.querySelector('#convertImgToPicture')
	const TEXTAREA_CODE = document.querySelector('#textareaCode')
	const TEXTAREA_WRAP = document.querySelector('.textarea-wrap')

	// FUNC
	function run() {
		// пустой textarea
		if (!TEXTAREA_CODE.value.length) {
			return alert('InputCode is empty!')
		}

		TEXTAREA_WRAP.classList.add('loading')

		setTimeout(() => {
			// заменить название оффера
			if (INPUT_OFFER_NAME_OLD.value.length && INPUT_OFFER_NAME_NEW.value.length) {
				TEXTAREA_CODE.value = replaceWords(TEXTAREA_CODE.value)
			}

			// замены #hash
			if (INPUT_LINK_HASH.value.length) {
				TEXTAREA_CODE.value = replaceHashLinks(TEXTAREA_CODE.value)
			}

			if (CHECKBOX_CONVERT_IMG_TO_PIC.checked) {
				TEXTAREA_CODE.value = replaceImgTag(TEXTAREA_CODE.value)
			}

			TEXTAREA_WRAP.classList.remove('loading')
		}, 2000)
	}

	// заменить hash ссылок, удалить target
	function replaceHashLinks(text = '') {
		const re = /<a\b[^>]*>([\s\S]*?)<\/a>/gmi
		const elements = text.match(re) ? [...new Set(text.match(re))] : []
			
		elements.forEach(el => {
			const replacedElement = stringParser(el, 'a')
			replacedElement.setAttribute('href', `#${INPUT_LINK_HASH.value}`)

			if (CHECKBOX_REMOVE_LINK_TARGET.checked) {
				replacedElement.removeAttribute('target')
			}

			text = text.replaceAll(el, replacedElement.outerHTML)
		})
	
		return text
	}

	// заменить названия оффера
	function replaceWords(text = '') {
		// если название оффера из нескольктх слов
		const query = (INPUT_OFFER_NAME_OLD.value.split(' ').length > 1) 
			? INPUT_OFFER_NAME_OLD.value.split(' ').join('\n').replaceAll('\t', '')
			: INPUT_OFFER_NAME_OLD.value

		const re = new RegExp(query.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&").split("\n").join("\\s+"), "gi");

		const elements = text.match(re) ? [...new Set(text.match(re))] : []

		console.log(elements);

		elements.forEach(item => {
			text = text.replaceAll(item, INPUT_OFFER_NAME_NEW.value)
		})

		return text
	}

	// заменяем IMG на PICTURE
	function replaceImgTag(text = '') {

		// поиск существующих тэгов picture
		// и добавление к ним атрибута meowmeow
		const re = /<picture\b[^>]*>([\s\S]*?)<\/picture>/gi;
		const elements = text.match(re) ? [...new Set(text.match(re))] : []

		if (elements.length) {
			elements.forEach(item => {
				const pic = stringParser(item, 'picture')
				const innerImg = pic.querySelector('img')

				innerImg.dataset.meowmeow = true
				text = text.replaceAll(item, pic.outerHTML)
			})
		}


		// замена всех img на picture
		const regexp = /<img\b((?!\bdata-meowmeow\b)[^>]*)>/gi;
		const imgElements = text.match(regexp) ? [...new Set(text.match(regexp))] : []
		
		try {
			imgElements.some(element => {
				const img = stringParser(element, 'img')
				const newPicture = document.createElement('picture')
				const continueAttrs = [img.getAttribute('class'), img.getAttribute('src')];



				// какие то проверки
				if ((!img || img.dataset.meowmeow) || continueAttrs.some(i => i && i.includes('wheel'))) {
					return
				}



				// выборка атрибутов
				const src = img.getAttribute('src')
				if (!src) {
					throw 'replaceImgTag: attribute "src" is empty - ' + img.outerHTML
				}

				let stringAttrs = ''
				const attrs = [
					{ el: 'class', value: img.getAttribute('class') },
					{ el: 'style', value: img.getAttribute('style') },
					{ el: 'width', value: img.getAttribute('width') },
					{ el: 'height', value: img.getAttribute('height') },
					{ el: 'alt', value: img.getAttribute('alt') }
				]

				const typeLength = src.split('.').pop().length + 1
				const webpSrc = `${src.slice(0, -typeLength)}.webp`

				// добавление атрибутов
				attrs.forEach(item => {
					if (item.value !== null && item.value.length) {
						newPicture.setAttribute(item.el, item.value)

						stringAttrs += `${item.el}="${item.value}" `
					}
				})

				img.dataset.meowmeow = true

				newPicture.innerHTML += `<source srcset="${webpSrc}" type="image/webp" ${stringAttrs}>`
				newPicture.innerHTML += img.outerHTML

				text = text.replaceAll(element, newPicture.outerHTML)
			})
		} catch (error) {
			console.warn(error)
		}

		return text
	}


	run()
}

FORM_MAIN.addEventListener('submit', ev => {
	ev.preventDefault()
	main()
})


BTN_COPY.addEventListener('click', () => {
	const textareaCode = document.querySelector('#textareaCode')
	textareaCode.select()
	textareaCode.setSelectionRange(0, 99999)
	navigator.clipboard.writeText(textareaCode.value)
})
