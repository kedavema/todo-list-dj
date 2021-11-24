$(document).ready(function(){
    const taskList = document.querySelector(".task-list");
    $("#createButton").click(function() {
        var serializedData = $("#createTaskForm").serialize();

        $.ajax({
            url: $("createTaskForm").data('url'),
            data: serializedData,
            type: 'post',
            success: function(response) {
                taskList.style.display = "block"
                $("#taskList").append('<div class="task-group" id="task-group" data-id="'+ response.task.id +'"><div class="task-title"><strong> - ' + response.task.title +'</strong></div><div class="task-time"><strong>' + response.tasktime + '</strong></div><div class="task-delete"><button data-id="'+ response.task.id +'" class="material-icons-round button-delete">delete</button></div></div><div class="separador" data-id="'+ response.task.id +'"><hr></div>')
            }
        })

        $("#createTaskForm")[0].reset();


    });
    const hayTask = document.querySelector(".task-group");
    if (!hayTask) {
        taskList.style.display = "none";
    };


});


function validation(){
    var emailVal = document.querySelector('#id_email').value;
    var emailField = document.querySelector('#id_email')
    var textError = document.querySelector('#emailError')
    // console.log(emailField)
    // console.log(emailVal)
    // console.log(textError)
    var expReg= /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    var esValido = expReg.test(emailVal)
    if (esValido==true){
        textError.style.display = 'none';
        emailField.className = 'new_email'
    }
    else {
        emailField.focus();
        textError.style.display = 'flex';
        emailField.className = 'invalid_email';
        textError.innerHTML = "El email ingresado no es válido"
    }
    if (emailVal=="") {
        emailField.focus();
        emailField.className = 'invalid_email';
        textError.style.display = 'flex';
        textError.innerHTML = "Este campo no puede quedar vacío"
    }
}


function check_password() {
    var pass1 = document.querySelector('#id_password1').value;
    var pass2 = document.querySelector('#id_password2').value;
    var pass1Field = document.querySelector('#id_password1');
    var pass2Field = document.querySelector('#id_password2');
    var passError = document.querySelector('#passError')
    if (pass1!=pass2) {
        // pass2Field.focus();
        passError.style.display = 'flex'
        pass2Field.className = 'invalid_password'
        pass1Field.style.border = '2px solid #FF0000'
    }else {
        passError.style.display = 'none'
        pass2Field.className = 'pass2'
        pass1Field.style.border = '1px solid #E5E5E5'
    }
}


$(document).ready(function() {
    $("#register-button").click(function(event) {
        event.preventDefault();
        setTimeout(function(){
            // console.log("Add class loading")
            $("#register-button").addClass("button-loading");
        }, 100);
        setTimeout(function() {
            // console.log("unbind the click")
            $("#register-button").unbind('click').click();
        }, 2000)
    });
    
});


$(document).ready(function() {
    $(".new_email").blur(function () {
        var email = document.querySelector(".new_email").value;
        var emailField = document.querySelector(".new_email");
        var emailError = document.querySelector("#emailError");
        $.ajax({
            url: $("#signup-form").data('url'),
            data: {
                'email': email
            },
            dataType: 'json',

            success: function (data) {
                if (data.is_taken) {
                    // alert("Email en uso")
                    emailField.focus();
                    emailError.style.display = 'flex';
                    emailField.className = 'invalid_email';
                    emailError.innerHTML = "El email ingresado ya existe, favor ingresar otro.";
                }
            }


        });

    });

});


// Añadir un objeto de atributos a un elemento
const addAttributes = (element, attrObj) => {
    for (let attr in attrObj) {
      if (attrObj.hasOwnProperty(attr)) element.setAttribute(attr,attrObj[attr])
    }
  };

// Crear elementos con atributos e hijo
const createCustomElement = (element,attributes,children) => {
    let customElement = document.createElement(element);
    if (children !== undefined) children.forEach(el => {
      if (el.nodeType) {
        if (el.nodeType === 1 || el.nodeType === 11) customElement.appendChild(el);
      } else {
        customElement.innerHTML += el;
      }
    });
    addAttributes(customElement,attributes);
    return customElement;
  };


// Funcion para imprimir modal
const printModal = content => {
    const modalContentElement = createCustomElement('div', {
        id: "modal-content",
        class: "modal-content"
    }, [content]);

    const modalContainerElement = createCustomElement('div', {
        id: "modal-container",
        class: "modal-container",
    }, [modalContentElement]);

    document.body.appendChild(modalContainerElement);

    const removeModal = () => document.body.removeChild(modalContainerElement);

    // Si se presiona el boton cancelar, se cierra el modal

    $("#cancel").click(function(){
        removeModal();
    });

}

// Imprimir modal para eliminar un tarea
$(".task-list").on("change", function(){
    console.log("=========")

    $("#delete").click(function(event){
        let csrfToken = $("input[name=csrfmiddlewaretoken]").val();
        // console.log("Entra a delete");
        event.stopPropagation();
        // var dataId = $(this).data('id');
        // console.log(dataId);
        $.ajax({
            url: '/tasks/' + dataId + '/delete/',
            data: {
                csrfmiddlewaretoken: csrfToken,
                id: dataId
            },
            type: 'post',
            dataType: 'json',
            success: function() {
                $('#task-group[data-id="' + dataId + '"]').remove();
                $('.separador[data-id="'+ dataId +'"').remove();
                if ($("#taskList").children().length == 0){
                    // console.log("DIV VACIO")
                    $("#taskList").remove();
                }
            }
        })
        
        let modal = document.querySelector("#modal-container");
        document.body.removeChild(modal);

    });
    
});

});

$(document).ready(function(){
    console.log("+++++++++++++++")
    $(".button-delete").click(function(event) {
        console.log("PROBANDO")
        var dataId = $(this).data('id');
        // console.log(dataId)
        var title = $(this).parent().parent().find(".task-title").text();
        // console.log(title);

        printModal(`<form id="delete-form" method="POST">
        <h3>Está seguro que desea eliminar?</h3>
        <div class="task-del">
            ${title}
        </div>
        <div class="buttons">
            <button id="cancel" class="button-modal" type="button">Cancelar</button>
            <button id="delete" class="button-modal" type="button">Eliminar</button>
        </div>
        </form>`);

        //Si se presiona el boton Eliminar, se elimina la tarea por el metodo ajax

        $("#delete").click(function(event){
            let csrfToken = $("input[name=csrfmiddlewaretoken]").val();
            // console.log("Entra a delete");
            event.stopPropagation();
            // var dataId = $(this).data('id');
            // console.log(dataId);
            $.ajax({
                url: '/tasks/' + dataId + '/delete/',
                data: {
                    csrfmiddlewaretoken: csrfToken,
                    id: dataId
                },
                type: 'post',
                dataType: 'json',
                success: function() {
                    $('#task-group[data-id="' + dataId + '"]').remove();
                    $('.separador[data-id="'+ dataId +'"').remove();
                    if ($("#taskList").children().length == 0){
                        // console.log("DIV VACIO")
                        $("#taskList").remove();
                    }
                }
            })
            
            let modal = document.querySelector("#modal-container");
            document.body.removeChild(modal);

        });
        
    });

});
