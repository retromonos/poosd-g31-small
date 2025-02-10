const urlBase = 'http://poosdsm31-2025.me/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// Read cookie when the page loads
window.onload = function() {
    readCookie();
};

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] === "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] === "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] === "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    } else {
        document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}

function addColor() {
    let newColor = document.getElementById("colorText").value;
    document.getElementById("colorAddResult").innerHTML = "";

    if (!newColor.trim()) {
        document.getElementById("colorAddResult").innerHTML = "Please enter a color.";
        return;
    }

    let tmp = { color: newColor, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddColor.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                document.getElementById("colorAddResult").innerHTML = "Color has been added.";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("colorAddResult").innerHTML = err.message;
    }
}

function searchColor() {
    let srch = document.getElementById("searchText").value;
    document.getElementById("colorSearchResult").innerHTML = "";

    if (!srch.trim()) {
        document.getElementById("colorSearchResult").innerHTML = "Please enter a color to search.";
        document.getElementById("colorSearchResult").style.display = "inline"; // Make it visible
        return;
    }

    let tmp = { search: srch, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchColors.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (!jsonObject.results || jsonObject.results.length === 0) {
                    document.getElementById("colorSearchResult").innerHTML = "No matching colors found.";
                    document.getElementById("colorSearchResult").style.display = "inline"; // Make it visible
                    return;
                }

                document.getElementById("colorSearchResult").innerHTML = "Color(s) found:";
                document.getElementById("colorSearchResult").style.display = "inline"; // Make it visible

                let colorList = "";
                for (let i = 0; i < jsonObject.results.length; i++) {
                    colorList += jsonObject.results[i] + "<br />";
                }

                document.getElementById("colorList").innerHTML = colorList;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("colorSearchResult").innerHTML = err.message;
        document.getElementById("colorSearchResult").style.display = "inline"; // Make it visible
    }
}
