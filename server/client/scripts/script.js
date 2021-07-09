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
			'<a class="card w-100" title="No of hits: ' + searchResults[index].hits + '" href="/redirect?link=' +
			searchResults[index].link +
			'"><p class="resultName">' +
			searchResults[index].name +
			'<br><p class="resultDescription">' +
			searchResults[index].desc +
			"</p></a>";
			checkFavicon(searchResults[index].link)
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

function escapeRegExp(string) {
	return string.replace(/\/\/([^\/,\s]+\.[^\/,\s]+?)(?=\/|,|\s|$|\?|#)/g, '\\$&'); // $& means the whole matched string
}
  
function checkFavicon(input){
	console.log(escapeRegExp(input) + "favicon.ico")
}