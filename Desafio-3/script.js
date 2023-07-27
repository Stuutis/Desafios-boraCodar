const primaryButton = document.querySelector('.btn-primary')
const secondaryButton = document.querySelector('.btn-secondary')
const tertiaryButton = document.querySelector('.btn-tertiary')

function addDisabledClass(e) {
    let clickedButton = e.target
    clickedButton.classList.toggle('disabled')
}

const buttonContainer = document.querySelector('.interact')
buttonContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn')) {
        setTimeout(function () {
            addDisabledClass(e)
        }, 500)
    }
})