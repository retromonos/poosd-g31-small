<?php 
    $inData = getRequestInfo();
	
	$userId = $inData["userId"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$description = $inData["description"];

	$conn = new mysqli("localhost", "dbuser", "POOST31g", "poosd31");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = "UPDATE Contacts SET FirstName = $firstName, LastName = $lastName, Phone = $phone, Email = $email, Descript = $description WHERE userID = $userID";
		
        if($conn->query($stmt) === TRUE){
            echo "Contact successfully updated!";
        }else{
            echo "Error updating record: " .$conn->error;
        }
		$conn->close();
		returnWithError("");
	}

    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}






?>