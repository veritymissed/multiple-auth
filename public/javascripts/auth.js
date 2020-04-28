var userArray = []
fetch('/api/users')
  .then(function(response) {
    return response.json();
  })
  .then(function(resObject) {
    userArray = resObject
    renderUserListHTML(userArray)
  });

$('body').on("click", ".delete-user", function() {
  var targetId = $(this).parent().parent().attr("value")
  console.log("targetId", targetId);

  fetch(`/api/user/${targetId}`, {
    method: 'DELETE'
  })
  .then((response) => response.json())
  .then((res) => {
    console.log("res", res);
    if (res.length >= 0) renderUserListHTML(res)
  })
  .catch((err) => {
    console.error("err", err);
  })
})

function renderUser(user, index) {
  return `<tr value="${user._id}">
    <th scope="row">${index+1}</th>
    <td>${user.email}</td>
    <td>${user.updated}</td>
    <td><button class="btn delete-user"><i class="fas fa-trash-alt"></i></button></td>
  </tr>`
}

function renderUserListHTML(userArray) {
  if(userArray.length === 0) {
    $("#userList > table > tbody").children().remove()
    return
  }
  var list = userArray.map((user, index) => {
    return renderUser(user, index)
  }).reduce((accu, curr) => {
    return accu + curr
  })
  var productListHTML = $.parseHTML(list);
  $("#userList > table > tbody").children().remove()
  $("#userList > table > tbody").append(productListHTML)
}
