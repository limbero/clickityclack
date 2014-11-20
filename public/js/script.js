document.addEventListener('DOMContentLoaded', function() {
	var numfield = document.getElementById('numberfield')
	var namefield = document.getElementById('namefield')
	namefield.onkeypress = function (e) {
		if(e.charCode == 13 && !numfield.classList.contains('invalid') && !namefield.classList.contains('invalid')) {
			var xmlhttp = new XMLHttpRequest()
			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState==4 && xmlhttp.status==200) {
					var response = JSON.parse(xmlhttp.responseText)
					document.location.href = '../'+response._id;
				}
			}

			xmlhttp.open('POST', 'create')
			xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
			xmlhttp.send( JSON.stringify( {name: namefield.value, cap: numfield.value} ) )
		}
	}
	namefield.oninput = function (e) {
		if(namefield.value === '') {
			if(!namefield.classList.contains('invalid')) {
				namefield.classList.add('invalid');
			}
		}
		else if(namefield.classList.contains('invalid')) {
			namefield.classList.remove('invalid');
		}
	}
	numfield.oninput = function (e) {
		if(numfield.value !== '' && isNaN(numfield.value)) {
			if(!numfield.classList.contains('invalid')) {
				numfield.classList.add('invalid');
			}
		}
		else if(numfield.classList.contains('invalid')) {
			numfield.classList.remove('invalid');
		}
	}
})