var Modal = {
    open(){
        //Abrir modal - Add active mod
        const element = document.querySelector('.modal-overlay')
        element.classList.add('active')
    },
    close(){
        //Fechar modal - Rem active mod
        const element = document.querySelector('.modal-overlay')
        element.classList.remove('active')
    }
}