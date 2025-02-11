<?php

    $inData = getRequestInfo();

    $id = $inData["id"];

	$conn = new mysqli("localhost", "dbuser", "POOST31g", "poosd31");

	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = "DELETE FROM Contacts WHERE ID = ".$id;

        if($conn->query($stmt) == TRUE){
            echo "Contact delete successfully!";
        } else {
            echo "Error deleting record: " . $conn->error;
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
