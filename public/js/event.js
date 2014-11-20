document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('increment').onclick = function () {
		var xmlhttp = new XMLHttpRequest()
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				var response = JSON.parse(xmlhttp.responseText)
				console.log(response.count)
				document.getElementById('count').textContent = response.count
			}
		}

		xmlhttp.open('POST', eventid+'/increment')
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
		xmlhttp.send()
	}
	document.getElementById('decrement').onclick = function () {
		var xmlhttp = new XMLHttpRequest()
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				var response = JSON.parse(xmlhttp.responseText)
				console.log(response.count)
				document.getElementById('count').textContent = response.count
			}
		}

		xmlhttp.open('POST', eventid+'decrement')
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
		xmlhttp.send()
	}
})