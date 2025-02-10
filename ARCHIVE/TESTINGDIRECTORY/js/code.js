const urlBase = 'http://poosdsm31-2025.me/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function goToRegister()
{
	window.location.href = 'register.html';
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}


function doRegister()
{
	let firstName = document.getElementById("registerFirst").value;
	let lastName = document.getElementById("registerLast").value;
	let login = document.getElementById("registerName").value;
	let password = document.getElementById("registerPassword").value;

	document.getElementById("registerResult").innerHTML = "";
//	var hash = md5( password );
	
	let tmp = {firstName: firstName, lastName: lastName, login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
		
				if( jsonObject.success )
					document.getElementById("registerResult").innerHTML = "Account successfully created!";
				else
					document.getElementById("registerResult").innerHTML = jsonObject.error;

				return;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("addPal").addEventListener("click", function () {
        document.getElementById("createPal").style.display = "flex";
        document.getElementById("overlay").style.display = "block";
    });

    document.getElementById("closePal").addEventListener("click", closePal);
    document.getElementById("savePal").addEventListener("click", savePal);
    document.getElementById("searchButton").addEventListener("click", searchContacts);
});

function closePal() {
    document.getElementById("createPal").style.display = "none";
    document.getElementById("editPawPal").style.display = "none";
    document.getElementById("deletePawPal").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

/* function getCookie(name) {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
            return cookie.split("=")[1];
	}
    }
    return "";
} */

function savePal() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const number = document.getElementById("number").value;
    const email = document.getElementById("email").value;

    /* const userId = readCookie("userId");

    if (!userId) {
        alert("Error: User not logged in.");
        return;
    } */

    const userId = 1;

    fetch("LAMPAPI/AddContact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, number, email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closePal();
        } else {
            alert("Error adding contact");
        }
    })
    .catch(error => {
        alert("An error occurred while adding contact.");
        console.error("Error:", error);
    });
}

function searchContacts() {
    const query = document.getElementById("search").value.toLowerCase();
    if (query.length === 0) {
        document.getElementById("pawPalTable").getElementsByTagName("tbody")[0].innerHTML = "";
        return;
    }

    fetch("LAMPAPI/SearchContacts.php?query=" + encodeURIComponent(query))
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("pawPalTable").getElementsByTagName("tbody")[0];
            tableBody.innerHTML = "";
            data.forEach(contact => {
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${contact.firstName}</td>
                    <td>${contact.lastName}</td>
                    <td>${contact.number}</td>
                    <td>${contact.email}</td>
                    <td><button class='edit-button' onclick='editPal(${contact.id})'><img src='files/edit.png' alt='Edit'></button></td>
                    <td><button class='delete-button' onclick='deletePal(${contact.id})'><img src='files/delete.png' alt='Delete'></button></td>
                `;
            });
        })
        .catch(error => {
            alert("An error occurred while searching contacts.");
            console.error("Error searching contacts:", error);
        });
}
