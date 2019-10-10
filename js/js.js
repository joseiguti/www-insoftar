let uri = 'http://0.0.0.0:8082'

let url = '/api/users'

let nombre = 'hola'
	
let urlfind = '/api/find-user-by'

var labels = {
	'nombre' : 'First name',
	'apellidos' : 'Last name',
	'cedula' : 'Indentification',
	'correo' : 'Email',
	'telefono' : 'Phone',
};

var existUser = 'false'

function setGlobalVar (value){
	
	existUser = value

}	

function getGlobalVar (){
	
	return existUser
}

let globalCedula = ''
	
let globalCorreo = ''
	
function clearForm (){
	
	$("#register_id").val('')
	
	$("#register_name").val('')

	$("#register_lastname").val('')

	$("#register_identification").val('')

	$("#register_email").val('')

	$("#register_phone").val('')
}	

function loadDataEdit(url){
	
	$.ajax({

		url : url,

		type : 'GET',

		timeout : 30000,

		success : function(data, status, xhr) {
			
			$("#register_id").val(data.id)
			
			$("#register_name").val(data.nombre)

			$("#register_lastname").val(data.apellidos)

			$("#register_identification").val(data.cedula)
			
			globalCedula = data.cedula

			$("#register_email").val(data.correo)
			
			globalCorreo = data.correo

			$("#register_phone").val(data.telefono)
		},
		
		error : function(xhr, ajaxOptions, thrownError) {

			console.log(xhr)
		},

	})
}

function existBy (dataParameter){
	
	$.ajax({

		url : uri + urlfind,

		type : 'POST',

		dataType : "json",

		async : false,

		timeout : 30000,

		data : dataParameter,

		success : function(data, status, xhr) {
				
			setGlobalVar('true')
		},
			
		error : function(xhr, ajaxOptions, thrownError) {

			setGlobalVar('false')
		},

	})
		
}

function ajaxErrorHandler(xhr, ajaxOptions, thrownError) {

	console.log(xhr.responseJSON)

	console.log(xhr.status)

	let msg = ''

	if (xhr.responseJSON.detail != 'User not found')	
		
		msg += '<b>' + xhr.responseJSON.detail + '</b>'
		
	else
		
		msg += '<b>No changes detected</b>'

	msg += '<ul>'

	$.each(xhr.responseJSON.parameters, function(field, data) {

		$.each(data, function(errorType, error) {

			msg += '<li><b>' + labels[field] + '</b>: ' + error + '</li>'

		})

	})

	msg += '</ul>'

	$('#exampleModalCenter').modal('show')

	$('#content_message').html(msg)
}

function addRow(data) {
	
	let toreturn = ''

	toreturn += '<tr id="usuario_tr_' + data.id + '">'

	toreturn += '<th scope="row">' + data.id + '</th>'

	toreturn += '<td>' + data.nombre + '</td>'

	toreturn += '<td>' + data.apellidos + '</td>'

	toreturn += '<td>' + data.cedula + '</td>'

	toreturn += '<td>' + data.correo + '</td>'

	toreturn += '<td>' + data.telefono + '</td>'
	
	toreturn += '<td><a href="#" onclick="loadDataEdit(\'' + data._links.self.href + '\')">Edit</a></td>'

	toreturn += '</tr>'

	return toreturn
}

$(document).ready(function() {

	existUser = 'false'
	
	$.ajax({

		url : uri + url,

		type : 'GET',

		async : true,

		timeout : 10000,

		success : function(data, status, xhr) {

			$.each(data._embedded.users, function(id, row) {

				$("#register_records tbody").append(addRow(row))

			})

		}

	})

	$("#button_cancel").click(function() {
		
		$('#exampleModalCenter').modal('show')

		$('#content_message').html('You\'ve canceled the process for new record or update record')
		
		clearForm()
	})
	
	$("#button_save").click(function() {

		// Desea actualizar un registro
		if ($("#register_id").val()!=''){
			
			var cedulaIsOk = 'true'
				
			var correoIsOk = 'true'
			
			// Si esta actualizando la cedula, se debe validar que no exista
			if (globalCedula != $("#register_identification").val()){
			
				setGlobalVar('false')
				
				existBy({cedula : $("#register_identification").val()})
				
				if (getGlobalVar() == 'true'){
					
					// Cedula ya existe
					$('#exampleModalCenter').modal('show')

					$('#content_message').html('Identification number already exists')
					
					cedulaIsOk = 'false'
						
				}
				
			}
			
			// Si esta actualizando el correo, se debe validar que no exista
			if (globalCorreo != $("#register_email").val()){
				
				setGlobalVar('false')
				
				existBy({correo : $("#register_email").val()})
				
				if (getGlobalVar() == 'true'){
					
					$('#exampleModalCenter').modal('show')

					$('#content_message').html('Email address already exists')
					
					correoIsOk = 'false'	
						
				}
				
			}
			
			if (cedulaIsOk == 'true' && correoIsOk == 'true'){

				$.ajax({

					type : 'PUT',
								
					url : uri + url + '/' + $("#register_id").val(),

					dataType : "json",

					async : true,

					timeout : 30000,
								
					data : {

						nombre : $("#register_name").val(),

						apellidos : $("#register_lastname").val(),

						cedula : $("#register_identification").val(),

						correo : $("#register_email").val(),

						telefono : $("#register_phone").val()

					},
								
					success : function(data, status, xhr) {

						clearForm()
						
						$('#exampleModalCenter').modal('show')

						$('#content_message').html('User updated')

						console.log(data)
						
						var thId = '#usuario_tr_' + data.id
						
						$(thId).find("th").eq(0).html(data.id)
							
						$(thId).find("td").eq(0).html(data.nombre)
							
						$(thId).find("td").eq(1).html(data.apellidos)
							
						$(thId).find("td").eq(2).html(data.cedula)
							
						$(thId).find("td").eq(3).html(data.correo)
							
						$(thId).find("td").eq(4).html(data.telefono)
						
					},

					error : ajaxErrorHandler

				})
				
			}
			
		// Ingresar nuevo registro				
		}else{
			
			// Preguntamos si la cedula no existe
			setGlobalVar('false')
			
			if ($("#register_identification").val().trim() != '')
			
				existBy({cedula : $("#register_identification").val()})
						
			if (getGlobalVar() == 'false'){
			
				// Preguntamos si el correo no existe
				setGlobalVar('false')
				
				if ($("#register_email").val().trim() != '')
				
					existBy({correo : $("#register_email").val()})
							
				if (getGlobalVar() == 'false'){

					$.ajax({

						url : uri + url,

						type : 'POST',

						dataType : "json",

						async : true,

						timeout : 30000,

						data : {

							nombre : $("#register_name").val(),

							apellidos : $("#register_lastname").val(),

							cedula : $("#register_identification").val(),

							correo : $("#register_email").val(),

							telefono : $("#register_phone").val()

						},

						success : function(data, status, xhr) {

							clearForm()
							
							$('#exampleModalCenter').modal('show')

							$('#content_message').html('User registered')

							$("#register_records tbody").append(addRow(data))
						},

						error : ajaxErrorHandler

					})
								
				}else{
								
					$('#exampleModalCenter').modal('show')

					$('#content_message').html('Email address already exists')
				}
							
			}else{
							
				$('#exampleModalCenter').modal('show')

				$('#content_message').html('Identification number already exists')
			}
						
		}
		
	})

});
