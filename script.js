const url = 'https://pixabay.com/api/?key=23750657-883c5501b12cb3a6f316b13c9&page=1&per-page=12'
const form = document.forms.namedItem('queryLine');
const contentWrapper = document.querySelector('.content_wrapper')
let query = ''
let extQuery1 = ''
let perPage = 8
let totalPages
let pageCounter = 1



form.addEventListener('submit', e => {
    e.preventDefault()
    pageCounter = 1
    paginationControl()
})


const queryField = document.getElementById('queryField')
    // выбор категорий
const radioBtn = document.querySelectorAll("input[name='popular_new']")
radioBtn.forEach(e => {
    e.addEventListener('change', (chckb) => {
        extQuery1 = chckb.target.value
    })
})

const paginationWrapper = document.querySelector('.pagination_wrapper')
const pageLeft = document.getElementById('page_left')
const pageRight = document.getElementById('page_right')

const fullScreen = function() {

}



radioBtn.forEach(e => {
    e.addEventListener('change', (chckb) => {
        extQuery1 = chckb.target.value
    })
})

queryField.oninput = (e) => {
    query = e.target.value
}

// пагинация
form.onsubmit = () => sendRequest()

function paginationControl(type) {
    if (type == 'fwd') {
        pageCounter += 1
    }
    if (type == 'back') {
        pageCounter -= 1
    }


    paginationWrapper.innerHTML = `
        ${pageCounter <= 1 ? `<span class="page_number" id="page_left"></span>` : `<span onclick="paginationControl('back')" class="page_number" id="page_left">&larr;</span>`}
        <span class="page_number">${pageCounter <= 1 ? '' : pageCounter-1}</span>
        <span class="page_number active_page">${pageCounter}</span>
        <span class="page_number">${pageCounter+1}</span>
        ${pageCounter == totalPages ? `<span class="page_number" id="page_right"></span>` : `<span onclick="paginationControl('fwd')" class="page_number" id="page_right">&rarr;</span>`}
    `
    sendRequest(pageCounter, false)
}


//вывод галереи
function sendRequest(pageNumber = 1,initialLoad) {
    if(initialLoad == false) localStorage.setItem('lastRequest', query)

    fetch(url + `&q=${query}&order=${extQuery1 || 'popular'}&page=${pageNumber}`).then(response1 => {
        return response1.json()
    }).then(response2 => {
        const contentObject = response2.hits
        totalPages = Math.ceil(response2.total/perPage)
        if(initialLoad) {
            paginationControl()
        }
        contentWrapper.innerHTML = ''
        contentObject.forEach(elementObject => {
            const wrapperElement = document.createElement('div')

            wrapperElement.classList.add('wrapperElement')
            wrapperElement.style.backgroundImage = `url(${elementObject.webformatURL})`
            contentWrapper.appendChild(wrapperElement)
            wrapperElement.onclick = () => {

                // создание поп-ап окна с картинкой
                const fullScreen = document.createElement('div')
                fullScreen.classList.add('fullScreen')
                fullScreen.innerHTML = `<img src=${elementObject.largeImageURL}/>`
                document.body.appendChild(fullScreen)

                // закрытие поп-апа с картинкой
                fullScreen.addEventListener('click', (e) => {
                    if (e.target == fullScreen) {
                        fullScreen.remove()
                    }
                }, { once: true })

            }

        })
    })
}