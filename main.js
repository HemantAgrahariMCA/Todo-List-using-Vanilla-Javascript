//select element in dom

const form = document.querySelector("#itemForm");
const inputItem = document.querySelector("#itemInput");
const itemsList = document.querySelector("#itemsList");
const filter = document.querySelectorAll(".nav-item");
const alertDiv = document.querySelector("#message");


// create an empty items List
let todoItems = [];
const alertMessage = function(message,className){
    alertDiv.innerHTML=message;
    alertDiv.classList.add(className,"show");
    alertDiv.classList.remove("hide");
    setTimeout(()=>{
        alertDiv.classList.add("hide");
        alertDiv.classList.remove("show");
    },3000);
    return;
    
    
};


// Updateitem
const updateItem = function(currentItemIndex,value){
    const newItem = todoItems[currentItemIndex];
    newItem.name=value;
    todoItems.splice(currentItemIndex,1,newItem);
    setLocalStorage(todoItems);
}

// Delete
const removeItem = function(item){
    const removeIndex = todoItems.indexOf(item);
    todoItems.splice(removeIndex,1);
};

// filter items
const getItemsFilter = function(type){
    let filterItems = [];
    switch (type) {
        case "todo":
            filterItems=todoItems.filter((item)=> !item.isDone);
            
            break;

            case "done":
                filterItems=todoItems.filter((item)=> item.isDone);
                break;
    
        default:
            filterItems=todoItems;
            
    }
    getList(filterItems);

};
// handle event on action button
const hadleItem = function (itemData) {
  const items = document.querySelectorAll(".list-group-item");
  items.forEach((item) => {
    if (
      item.querySelector(".title").getAttribute("data-time") == itemData.addedAt
    ) {
      // Done
      item.querySelector("[data-done]").addEventListener("click", function (e) {
        e.preventDefault();
        const itemIndex = todoItems.indexOf(itemData);
        const currentItem = todoItems[itemIndex];
        const currentClass = currentItem.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";
        currentItem.isDone = currentItem.isDone ? false : true;

        todoItems.splice(itemIndex, 1, currentItem);
        setLocalStorage(todoItems);
        const iconClass = currentItem.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";
        this.firstElementChild.classList.replace(currentClass, iconClass);
        const filterType=document.querySelector('#tabValue').value;
        getItemsFilter(filterType);
      });

    //   Edit
    item.querySelector("[data-edit]").addEventListener("click", function (e) {
        e.preventDefault();
        inputItem.value=itemData.name;
        document.querySelector("#objIndex").value=todoItems.indexOf(itemData);

     
    });


      // Delete
      item.querySelector("[data-delete]").addEventListener("click", function (e) {
        e.preventDefault();
        if(confirm("Are you sure want to delete this item? "))
        {
            itemsList.removeChild(item);
            removeItem(item);
            setLocalStorage(todoItems);
            alertMessage("Item has been deleted.","alert-success");
            return todoItems.filter((item)=>item != itemData);
        }
        
    });

    }
  });
};
// get List Items
const getList = function (todoItems) {
  itemsList.innerHTML = "";
  if (todoItems.length > 0) {
    todoItems.forEach((item) => {
      const iconClass = item.isDone
        ? "bi-check-circle-fill"
        : "bi-check-circle";
      itemsList.insertAdjacentHTML(
        "beforeend",
        `<li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="title" data-time="${item.addedAt}">${item.name}</span>
            <span>
                <a href="#" data-done><i class="bi ${iconClass}  green"></i></a>
                <a href="#" data-edit><i class="bi bi-pencil-square blue"></i></a>
                <a href="#" data-delete><i class="bi bi-x-circle red"></i></a>
            </span>
        </li>`
      );
      hadleItem(item);
    });
  }
  else{
    itemsList.insertAdjacentHTML(
        "beforeend",
        `<li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="title" >No Record Found </span>
           
        </li>`
      );
  }
};

// set local storage
const setLocalStorage = function (todoItems) {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
};

// get localStorage from the page
const getLocalStorage = function () {
  const todoStorage = localStorage.getItem("todoItems");
  if (todoStorage === "undefined" || todoStorage === null) {
    todoItems = [];
  } else {
    todoItems = JSON.parse(todoStorage);
  }
//   console.log("item", todoItems);
  getList(todoItems);
};

document.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const itemName = inputItem.value.trim();
    if (itemName.length === 0) {
        alertMessage("Please Enter Name...","alert-danger");
    } else {
        const currentItemIndex = document.querySelector("#objIndex").value;
        if(currentItemIndex){
            // update
            updateItem(currentItemIndex,itemName);
            document.querySelector("#objIndex").value="";
            alertMessage("Item has been Updated.","alert-success");

        }
        else{
            // add
            const itemObj = {
                name: itemName,
                isDone: false,
                addedAt: new Date().getTime(),
            };
            todoItems.push(itemObj);
            setLocalStorage(todoItems);
            alertMessage("New item has been added.","alert-success");

        }
        getList(todoItems);
     
    }inputItem.value="";
  });

//   filter tab
filter.forEach((tab)=>{
    tab.addEventListener('click',function(e){
        e.preventDefault();
        const tabType = this.getAttribute("data-type");
        document.querySelectorAll(".nav-link").forEach((nav)=>{
            nav.classList.remove("active");
        });
        this.firstElementChild.classList.add("active");
        getItemsFilter(tabType);
        document.querySelector('#tabValue').value=tabType;
    });
});
  //load item
  getLocalStorage();
});
