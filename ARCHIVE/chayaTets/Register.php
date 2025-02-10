
<?php
	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
	
	
	$conn = new mysqli("localhost", "dbuser", "POOST31g", "poosd31"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );	
	}
	else
	{
		$stmt = $conn->prepare("SELECT Login FROM Users WHERE Login=?");
		$stmt->bind_param("s", $inData["login"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $result->fetch_assoc()["Login"] == $inData["login"] )
		{
			returnWithError("There was an error creating the account, or an account with this username already exists.");
		}
		else
		{
			$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) values (?, ?, ?, ?)");
	                $stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"]);
        	        $stmt->execute();
			$result = $stmt->get_result();
			
			returnSuccess();
		}

		$stmt->close();
		$conn->close();
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
		$retValue = '{"success":false,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnSuccess()
	{
		$retValue = '{"success":true,"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
