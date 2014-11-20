document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('namefield').onkeypress = function (e) {
		if(e.charCode == 13) {
			var newEventID = randomString()
			var xmlhttp = new XMLHttpRequest()
			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState==4 && xmlhttp.status==200) {
					var response = JSON.parse(xmlhttp.responseText)
					document.location.href = '../'+response._id;
				}
			}

			xmlhttp.open('POST', 'create')
			xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
			xmlhttp.send( JSON.stringify( {name: document.getElementById('namefield').value, cap: document.getElementById('numberfield').value, id: newEventID} ) )
		}
	}
})

// Additional functions
function randomString() {
	var length = 7
	var chars = '0123456789abcdefghijklmnopqrstuvwxyz'
	var result = ''
	for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))]
		return result
}
