
'use strict';

let itemsArray = []
let storagekey = "todo-liste"
let itemsJson = ""

document.addEventListener("DOMContentLoaded", () => {

    // ANCHOR Call loadItems 
    itemsArray = loadItems();
    //  itemsArray =[];
    // ANCHOR insert in HTML
    for (const item of itemsArray) {
        createHTML(item.name, item.status)
    }

    displayFooter();
    countTodo();




    // ANCHOR getInput
    // Reagieren auf Button
    let input = document.getElementById("input")
    let btnInput = document.getElementById("btn-input")
    btnInput.addEventListener("click", () => {
        newItem()
    })
    // Reagieren auf Enter Taste
    document.addEventListener("keypress", (event) => {
        if (event.key == "Enter") {
            newItem()
        }
    })

    const newItem = () => {
        if (input.value) {
            let exist = false
            for (const element of itemsArray) {

                if (element.name == input.value) {

                    alert("Dieses Todo existert schon !!!")
                    exist = true;
                    return
                }
            }
            if (!exist) {
                itemsArray.push({
                    "name": input.value,
                    "status": ""
                })
                // console.log(itemsArray)
                setItems(itemsArray)
                createHTML(input.value, "")

                
                countTodo()
                displayFooter()
            }
        }
    }

    // Button All
    const liElements = document.querySelectorAll("#ulTodo-list>li")
    const all = document.getElementById("all")
    const active = document.getElementById("active")
    const completed = document.getElementById("completed")
    all.addEventListener("click", () => {
        all.classList.add("selected")
        active.classList.remove("selected")
        completed.classList.remove("selected")
        for (const liElement of liElements) {
            if (liElement.classList.contains("display-none")) {
                liElement.classList.remove("display-none")
            }
        }
        displayFooter()
    })

    // Button active
    active.addEventListener("click", () => {
        all.classList.remove("selected")
        active.classList.add("selected")
        completed.classList.remove("selected")
        for (const liElement of liElements) {
            if (liElement.classList.contains("completed")) {
                liElement.classList.add("display-none")
            } else {
                liElement.classList.remove("display-none")
            }
        }
        displayFooter()
    })

    // Button completed
    completed.addEventListener("click", () => {
        all.classList.remove("selected")
        active.classList.remove("selected")
        completed.classList.add("selected")
        for (const liElement of liElements) {
            if (liElement.classList.contains("completed")) {
                liElement.classList.remove("display-none")
            } else {
                liElement.classList.add("display-none")
            }
        }
        displayFooter()
    })

    // Button Clear Completed
    const clearCompleted = document.getElementById("clear-completed")
    clearCompleted.addEventListener("click", () => {
        console.log(itemsArray.length)
        for (let i = itemsArray.length; i > 0; i--) {

            console.log(itemsArray[i - 1].status)
            if (itemsArray[i - 1].status == "completed") {
                itemsArray.splice(i - 1, 1)

            }
        }
        const liList = document.querySelectorAll("li.completed")
        for (const liElement of liList) {
            liElement.remove()
        }
        setItems(itemsArray)
        displayFooter()

    })



})

// ANCHOR Count Items to do
const countTodo = () => {
    const liNotCompleted = document.querySelectorAll("#ulTodo-list>li:not(.completed)")
    const todoCount = document.getElementById("todo-count")
    todoCount.innerText = liNotCompleted.length
}

// ANCHOR display Footer
const displayFooter = () => {
    // console.log("displayFooter")
    const lis = document.getElementsByClassName("todo")
    if (lis.length > 0) {
        const footer = document.getElementById("footer")

        footer.classList.remove("display-none")


    } else {
        footer.classList.add("display-none")
    }
    const button = document.getElementById("clear-completed")
    const completed = document.getElementsByClassName("completed")
    
    // clear completed ausblenden
    let active = document.getElementById("active")
    if (completed.length > 0 && !active.classList.contains("selected") ) {
        
        button.classList.remove("display-none")
    } else {
        button.classList.add("display-none")
    }
}

// ANCHOR toggle Completed
const toggleCompleted = (liElement) => {
    let checkbox = liElement.querySelector("input[type=checkbox]")

    checkbox.addEventListener("click", () => {

        checkbox.parentElement.classList.toggle("completed")
        let item = checkbox.nextElementSibling.innerText

        for (const element of itemsArray) {

            if (element.name == item) {

                if (element.status == "completed") {

                    element.status = ""
                } else {

                    element.status = "completed"
                }
            }
        }

        countTodo()
        setItems(itemsArray)
        displayFooter()
    })

}

// ANCHOR deleteBtnEvent
const deleteBtn = (liElement) => {
    let deleteBtn = liElement.querySelector(".delete")
    deleteBtn.addEventListener("click", () => {
        let item = deleteBtn.previousElementSibling.innerText
        // console.log(item)
        let completed = false
        for (const element of itemsArray) {
            if (element.name == item && element.status == "completed") {
                completed = true

                itemsArray.splice(itemsArray.indexOf(element), 1)
            }
        }
        if (completed) {
            deleteBtn.parentElement.remove()
            setItems(itemsArray)
        }
        displayFooter()
    })

}

// ANCHOR loadItems
const loadItems = () => {
    itemsJson = localStorage.getItem(storagekey)
    // console.log(itemsJson)
    if (itemsJson) {
        const items = JSON.parse(itemsJson)
        // console.log(items)     
        return items

    } else {
        return []
    }

}

// ANCHOR setItems
const setItems = (itemsArray) => {
    // console.log("items set")
    // console.log(itemsArray)  

    itemsJson = JSON.stringify(itemsArray)
    localStorage.setItem(storagekey, itemsJson)
}

// ANCHOR creat HTML

const createHTML = (itemName, status) => {

    let inputItem = document.getElementById("input")
    inputItem.value = "";
    let ulList = document.getElementById("ulTodo-list")

    let checkbox = document.createElement("input")
    checkbox.type = ("checkbox")
    if (status == "completed") {
        checkbox.setAttribute("checked", "")
    }

    let label = document.createElement("label")
    label.innerText = itemName;

    let input = document.createElement("input")
    input.type = ("image")
    input.classList.add("delete")
    input.setAttribute("src", "img/delete.png")
    input.setAttribute("alt", "delete")


    let liElement = document.createElement("li");
    liElement.classList.add("todo")

    if (status == "completed") {
        liElement.classList.add("completed")
    }

    liElement.appendChild(checkbox)
    liElement.appendChild(label)
    liElement.appendChild(input)
    // Eventlistener für Checkbox
    toggleCompleted(liElement)
    // Eventlistener für DeleteBtn
    deleteBtn(liElement)

    ulList.appendChild(liElement)



}





