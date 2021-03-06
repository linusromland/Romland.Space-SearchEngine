async function changeContent() {
	let searchString = document.getElementById("searchbox").value;
	let search = await getJSON(searchString);
}
function changeSearch(searchResults) {
	let searchDiv = document.getElementById("searchResult");
	searchDiv.innerHTML = "";
	for (let index = 0; index < searchResults.length; index++) {
		let add =
			searchDiv.innerHTML +
			'<a class="searchItem" href="' +
			searchResults[index].link +
			'"><p class="resultName">' +
			searchResults[index].name +
			'<br><p class="resultDescription">' +
			searchResults[index].desc +
			"</p></a>";
		searchDiv.innerHTML = add;
	}
}
async function getJSON(search) {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			changeSearch(JSON.parse(xhttp.responseText));
		}
	};
	xhttp.open("GET", "/getSearch?search=" + search, true);
	xhttp.send();
}

setInterval(() => {
	changeContent();
}, 15000);
