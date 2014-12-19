document.addEventListener('DOMContentLoaded', function() {
	//document.location.href = "clickityclack://"+eventid;

	document.getElementById('increment').onclick = function () {
		update(1)
	}
	document.getElementById('label').onclick = function () {
		update(0)
	}
	document.getElementById('decrement').onclick = function () {
		update(-1)
	}
	refresh()
	update(0)
})

function update(type) {
	var verb = 'GET'
	var route = 'get'

	document.getElementById('increment').disabled = (cur >= cap)
	document.getElementById('decrement').disabled = (cur <= 0)

	var guess = cur

	if (type != 0) {
		verb = 'POST'
		if (type > 0) {
			route = 'increment'
			guess++
			document.getElementById('count').textContent = cur+1
			document.getElementById('decrement').disabled = false
			document.getElementById('increment').disabled = (cur+1 >= cap)
		} else {
			route = 'decrement'
			guess--
			document.getElementById('count').textContent = cur-1
			document.getElementById('increment').disabled = false
			document.getElementById('decrement').disabled = (cur-1 <= 0)
		}
	}

	var xmlhttp = new XMLHttpRequest()
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var response = JSON.parse(xmlhttp.responseText)
			console.log(response.count)

			cap = parseInt(response.cap)
			cur = parseInt(response.count)

			if (guess != response.count) {
				console.log("Out of sync error. Guess was "+guess+" but response was "+response.count".")
				document.getElementById('count').textContent = response.count
			}
		}
	}

	xmlhttp.open(verb, eventid+'/'+route)
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
	xmlhttp.send()
}

function refresh() {
	setTimeout(function () {
		update(0)
		refresh()
	}, 1000)
}