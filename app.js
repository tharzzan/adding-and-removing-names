/**
 * My solution to Guil's challenge
 * - add validation
 *   * blank not allowed -- line 96
 *   * duplicate not allowed -- line 101
 *
 * - checkbox confirm label change -- line 135
 *
 * - If filter applied, confirm checkbox is hidden -- line 36
 *
 * - Save registrants in local storage -- line 189
 */

const rsvpForm = document.querySelector('#registrar')
const rsvpInputBox = rsvpForm.firstElementChild
const mainDiv = document.querySelector('.main')
const ul = document.querySelector('ul')

// add filter
const filterDiv = document.createElement('div')
const filterLabel = document.createElement('label')
const filterCheckbox = document.createElement('input')

filterLabel.textContent = `Hide those who haven't responded`
filterCheckbox.type = 'checkbox'
filterDiv.appendChild(filterLabel)
filterDiv.appendChild(filterCheckbox)

mainDiv.insertBefore(filterDiv, ul)
// -------------------------------------

filterCheckbox.addEventListener('change', (event) => {
    const isFiltered = event.target.checked
    const lis = ul.children

    if (isFiltered) {
        for (let i = 0; i < lis.length; i++) {
            const individualLi = lis[i]
            const confirmLabel = individualLi.querySelector('label')
            
            if (individualLi.className === 'responded') {
                individualLi.style.display = ''
                confirmLabel.style.display = 'none'
            }
            else {
                individualLi.style.display = 'none'
            }
        }
    }
    else {
        for (let i = 0; i < lis.length; i++) {
            const individualLi = lis[i]
            const confirmLabel = individualLi.querySelector('label')

            individualLi.style.display = ''
            confirmLabel.style.display = ''
        }
    }
})


function createNewLi(newName) {
    // create new li if user put new name in the input box
    const newLi = document.createElement('li')

    function createElement(elementType, property, propertyValue) {
        const element = document.createElement(elementType)
        element[property] = propertyValue
        
        return element
    }

    function appendToLI(elementType, property, propertyValue) {
        const element = createElement(elementType, property, propertyValue)
        newLi.appendChild(element)

        return element
    }

    appendToLI('span', 'textContent', newName)    
    appendToLI('label', 'textContent', 'Confirm')
        .appendChild(createElement('input', 'type', 'checkbox'))

    appendToLI('button', 'textContent', 'edit')
    appendToLI('button', 'textContent', 'remove')

    return newLi
}

rsvpForm.addEventListener('submit', (event) => {
    event.preventDefault()
    
    const pastRegistrants = getRegistrants()
    const newName = rsvpInputBox.value

    if (newName === '') {
        // if blank, then show error
        alert(`Please input the person's name`)
    }
    else  {
        const lis = ul.children
        let isDuplicate = false

        for (let i = 0; i < lis.length; i++) {
            const insertedName = lis[i].firstElementChild.textContent

            if (newName.toLowerCase() === insertedName.toLowerCase()) {
                isDuplicate = true
                break
            }
        }

        if (isDuplicate) {
            // error if duplicate
            alert('This person is already registered')
        }
        else {
            rsvpInputBox.value = '' // clear the input box
        
            const newLi = createNewLi(newName)
            ul.appendChild(newLi)

            addRegistrants(newName)
        }
    }
})


ul.addEventListener('change', (event) => {
    const confirmCheckbox = event.target
    const isChecked = confirmCheckbox.checked
    const confirmLabel = confirmCheckbox.parentNode.firstChild // important to use firstChild here and not firstElementChild, because this text is on text Node. not element node.
    const li = confirmCheckbox.parentNode.parentNode

    if (isChecked) {
        li.className = 'responded'
        confirmLabel.textContent = 'Confirmed'
    }
    else {
        li.className = ''
        confirmLabel.textContent = 'Confirm'
    }
})


ul.addEventListener('click', (event) => {
    
    if (event.target.tagName === 'BUTTON') {
        const button = event.target
        const li = button.parentNode
        
        const nameAction = {
            remove: () => {
                const span = li.firstElementChild
                const initialText = span.textContent
                ul.removeChild(li)
                removeRegistrants(initialText)
            },
            edit:   () => {
                const span = li.firstElementChild
                const initialText = span.textContent
                
                const editBox = document.createElement('input')
                editBox.type = 'text'
                editBox.value = initialText
                li.insertBefore(editBox,span)
                li.removeChild(span)
                button.textContent = 'save'
            },
            save:   () => {
                const editBox = li.firstElementChild
                const editedText = editBox.value
                
                const newSpan = document.createElement('span')
                newSpan.textContent = editedText
                li.insertBefore(newSpan,editBox)
                li.removeChild(editBox)
                button.textContent = 'edit'
            }
        }

        const userAction = button.textContent

        // call the action based on button's name
        nameAction[userAction]()
    }
})

//#region *** This section is dedicated for localStorage ***

/**
 * return TRUE if:
 *  - 'localStorage' is supported on window object
 *  - window['localStorage'] is not null
 */
function isLocalStorageSupported() {
    return ('localStorage' in window) && (window['localStorage'] !== 'null')
}

function getRegistrants() {
    const registrants = localStorage.getItem('registrants')

    if (registrants) {
        return JSON.parse(registrants)
    }
    else {
        return []
    }
}

function addRegistrants(str) {
    const registrants = getRegistrants()

    registrants.push(str)
    localStorage.setItem('registrants', JSON.stringify(registrants))
}

function removeRegistrants(str) {
    const registrants = getRegistrants()
    const toBeRemovedIdx = registrants.indexOf(str)

    registrants.splice(toBeRemovedIdx,1)
    localStorage.setItem('registrants', JSON.stringify(registrants))
}
//#endregion

window.onload = () => {
    if (isLocalStorageSupported) {
        const pastRegistrants = getRegistrants()
        rsvpInputBox.value = '' // clear the input box
    
        // add to DOM what's in localStorage
        for (let i = 0; i < pastRegistrants.length; i++) {
            const newLi = createNewLi(pastRegistrants[i])
            ul.appendChild(newLi)
        }
    }
}