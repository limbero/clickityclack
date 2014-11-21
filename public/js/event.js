document.addEventListener('DOMContentLoaded', function() {
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
})

function update(type) {
	var verb = 'GET'
	var route = 'get'

	if (type != 0) {
		verb = 'POST'
		if (type > 0)
			route = 'increment'
		else
			route = 'decrement'
	}

	var xmlhttp = new XMLHttpRequest()
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				var response = JSON.parse(xmlhttp.responseText)
				console.log(response.count)
				
				document.getElementById('count').textContent = response.count
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

window.odometerOptions = {
  auto: true,
  format: '( ddd).dd', // Change how digit groups are formatted, and how many digits are shown after the decimal point
  duration: 500, // Change how long the javascript expects the CSS animation to take
}