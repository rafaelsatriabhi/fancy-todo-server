const baseUrl = `http://localhost:3000`

let GoogleAuth;
let SCOPE = 'https://www.googleapis.com/auth/drive.metadata.readonly';


$(document).ready(()=>{
    checkAuth()
})

function login(event){
   event.preventDefault()
   
    let email = $(`#email-input`).val()
    let password = $(`#password-input`).val()

    $.ajax(`${baseUrl}/users/login`, {
        method:`POST`,
        data:{
            email,
            password
        }
    })
    .done((data)=>{
        localStorage.token = data.token
        checkAuth()
    })
    .fail((err)=>{
        console.log(err)
    })
}
function checkAuth(){
    $(`#login-page`).show()
    $(`#home-page`).hide()
    $(`#register-page`).hide()
    if(localStorage.token){
        $(`#login-page`).hide()
        $(`#home-page`).show()
        $(`#createTodo`).hide()
        $(`#updateTodo`).hide()


        fetchTodos()
        console.log("Sudah login")
    }
    else{
        $(`#login-page`).show()
        $(`#home-page`).hide()
        $(`#createTodo`).hide()
        $(`#updateTodo`).hide()
        console.log("Belum login")
    }
}

function logout(){
    localStorage.clear()
    checkAuth()
}

function fetchTodos(){
    $.ajax(`${baseUrl}/todos`,{
        method:"GET",
        headers:{
            token: localStorage.token
        }
    })
    .done((data)=>{
        $(`#todosTable`).empty()
        let column = `<tr>
        <th>No</th>
        <th>Title</th>
        <th>Descrption</th>
        <th>Status</th>
        <th>Due date</th>
        <th>Action</th>
    </tr>`

        $(`#todosTable`).append(column)

       data.forEach((element,idx)=>{
        let template = `<tr>
        <td>${idx+1}</td>
        <td>${element.title}</td>
        <td>${element.description}</td>
        <td>${element.status}</td>
        <td>${element.due_date}</td>
        <td>
        <button class="btn btn-info" onclick="updatePage(${element.id})">Update</button> ||
        <button class="btn btn-outline-success" onclick="deleteTodo(${element.id})">Done</button>
        </td>
    </tr>`
        $(`#todosTable`).append(template)
       })
    })
    .fail((err)=>{
        console.log(err)
    })
}

function addTodoPage(){
    $(`#home-page`).hide()
    $(`#createTodo`).show()
}

function createTodo(event){

    event.preventDefault()

    let title = $(`#title-input`).val()
    let description = $(`#description-input`).val()
    let due_date = $(`#dueDate-input`).val()


    $.ajax(`${baseUrl}/todos`,{
        method: "POST",
        data:{
            title,
            description,
            due_date,
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done(()=>{
        $(`#title-input`).val('')
        $(`#description-input`).val('')
        $(`#dueDate-input`).val('')

        $(`#home-page`).show()
        $(`#createTodo`).hide()
        fetchTodos()
    })
    .fail((err)=>{
        console.log(err)
    })
}

function deleteTodo (params){
  $.ajax(`${baseUrl}/todos/${params}`,{
      method:"DELETE",
      headers: {
          token: localStorage.getItem('token')
      }
  })
  .done((data)=>{
      checkAuth()
  })
}


function updatePage(params){
    $(`#home-page`).hide()
    $(`#updateTodo`).show()
    localStorage.id = params
}

function updateTodo(event){
   event.preventDefault()
    let title = $(`#title-update`).val()
    let description = $(`#description-update`).val()
    let due_date = $(`#dueDate-update`).val()
    let status = $(`#status-update`).val()


    $.ajax(`${baseUrl}/todos/${localStorage.id}`,{
        method: "PUT",
        data:{
            title,
            description,
            due_date,
            status,
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done((data)=>{
        //clear column
        $(`#title-update`).val('')
        $(`#description-update`).val('')
        $(`#dueDate-update`).val('')
        $(`#status-update`).val('')
        fetchTodos()
        $(`#home-page`).show()
        $(`#updateTodo`).hide()

    })
    .fail((err)=>{
        console.log(err)
    })
}

function toRegisterPage(){
    $(`#login-page`).hide()
    $(`#register-page`).show()
}


function register(event){
    event.preventDefault()
   
    let email = $(`#email-register`).val()
    let password = $(`#password-register`).val()

    $.ajax(`${baseUrl}/users/register`, {
        method:`POST`,
        data:{
            email,
            password
        }
    })
    .done((data)=>{
        $(`#email-register`).val('')
        $(`#password-register`).val('')
        checkAuth()
    })
    .fail((err)=>{
        console.log(err)
    })  
}

function cancelToRegister () {
    $('#login-page').show()
    $('#register-page').hide()
}

function cancelToCreate() {
    $('#createTodo').hide()
    $('#home-page').show()
}