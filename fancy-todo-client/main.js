const baseUrl = `http://localhost:3000`

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
   $(`#main-page`).hide()
    if(localStorage.token){
        $(`#login-page`).hide()
        $(`#main-page`).show()
        fetchTodos()
        console.log("Sudah login")
    }
    else{
        $(`#login-page`).show()
        $(`#main-page`).hide()
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
        <th>Due date</th>
        <th>Action</th>

    </tr>`
        $(`#todosTable`).append(column)

       data.forEach((element,idx)=>{
        let template = `<tr>
        <td>${idx+1}</td>
        <td>${element.title}</td>
        <td>${element.description}</td>
        <td>${element.due_date}</td>
        <td>
        <button onclick="updatePage(${element.id})">Update</button> ||
        <button onclick="deleteTodo(${element.id})">Done</button>
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

function createTodo(){

    let title = $(`#title-input`).val()
    let description = $(`#description-input`).val()
    let due_date = $(`#dueDate-input`).val()
    let status = $(`#status-input`).val()


    $.ajax(`${baseUrl}/todos`,{
        method: "POST",
        data:{
            title,
            description,
            due_date,
            status,

        }
    })
    .done((data)=>{
        console.log(data)
    })
    .fail((err)=>{
        console.log(err)
    })
}

function deleteTodo (params){
  $.ajax(`${baseUrl}/todos/${params}`,{
      method:"DELETE"
  })
  .done((data)=>{
      checkAuth()
      console.log(data)
  })
}


function updatePage(params){
    $(`#home-page`).hide()
    $(`#updateTodo`).show()
    localStorage.id = params
}

function updateTodo(event){
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
        }
    })
    .done((data)=>{
        console.log(data)
    })
    .fail((err)=>{
        console.log(err)
    })
}

function registerPage(){

}


// function register(){
//     event.preventDefault()
   
//     let email = $(`#email-input`).val()
//     let password = $(`#password-input`).val()

//     $.ajax(`${baseUrl}/users/register`, {
//         method:`POST`,
//         data:{
//             email,
//             password
//         }
//     })
//     .done((data)=>{
//         localStorage.token = data.token
//         checkAuth()
//     })
//     .fail((err)=>{
//         console.log(err)
//     })  
// }


// function onSignIn(googleUser) {
//     let profile = googleUser.getBasicProfile()
//     console.log("ID: " + profile.getId())
//     console.log('Full Name: ' + profile.getName())
//     console.log('Given Name: ' + profile.getGivenName())
//     console.log('Family Name: ' + profile.getFamilyName())
//     console.log("Image URL: " + profile.getImageUrl())
//     console.log("Email: " + profile.getEmail())
  
//     let id_token = googleUser.getAuthResponse().id_token;
//     console.log("ID Token: " + id_token)
//     $.ajax({
//     method: 'POST',
//     url: `http://localhost:3000/user/tokensignin`,
//     data: { id_token: id_token }
//     })
//     .done((response)=>{
//       localStorage.setItem('token',response.token)
//       window.location.href = "dashboard.html"
//     })
//     .fail((jqXHR, textStatus)=>{
//       console.log(textStatus)
//     })
//   }