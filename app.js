const Modal = {
    open(){
        //Abrir modal - Add active mod
        const element = document.querySelector('.modal-overlay')
        element.classList.add('active')
    },
    close(){
        //Fechar modal - Rem active mod
        const element = document.querySelector('.modal-overlay')
        element.classList.remove('active')
        Form.clearFields()
    }
   
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transacions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transacions", JSON.stringify(transactions))
    },
}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    },


    incomes() {
        let sum = 0
        Transaction.all.forEach((transaction) => {
            if (transaction.amount >= 0) {
                sum = sum + transaction.amount 
            }
        })
        return sum
    },

    expenses(){
        let sum = 0
        Transaction.all.forEach((transaction) => {
            if (transaction.amount < 0) {
                sum = sum + transaction.amount
            }
        })
        return sum
    },

    total(){
        let total = Transaction.incomes() + Transaction.expenses()
        return total
    }
}

const DOM = {
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionContainer.insertBefore(tr, DOM.transactionContainer.firstChild)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSClass = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
            <td class="description">${transaction.description}</td>
            <td class=${CSSClass}>${amount}</td>
            <td class="data">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="assets/minus.svg" alt="Remover transação">
            </td>
        ` 

        return html
    },

    updateBalance(){
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
             
    },

    clearTransactions(){
        DOM.transactionContainer.innerHTML = ""
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
       
        value = String(value).replace(/\D/g, "")
       
        value = Number(value) / 100
       
        value = value.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value

    },

    formatAmount(value) {
        value = value * 100  
        return Math.round(value)    
    },

    formatDate(date) {
        const splitedDate = date.split("-")
        return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`
    }
}

const Form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),
    
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateField() {
        const {description, amount, date} = Form.getValues()
        
        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor, preencha todos os campus")            
        }
    },

    formateValues(){
        let {description, amount, date} = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date,
        }
    },

    saveTransaction(transaction) {
        Transaction.add(transaction)
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = "" 
    },

    submit(event){
        event.preventDefault()

        try {
            Form.validateField()
            const transaction = Form.formateValues()
            Form.saveTransaction(transaction)
            Form.clearFields()
            Modal.close()

        } catch(error){
            alert(error.message)
        }
    },
}

const App = {
    init(){
        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },

    reload(){
        DOM.clearTransactions()
        App.init()
    },
}

App.init()



