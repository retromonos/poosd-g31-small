<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "dbuser", "POOST31g", "poosd31");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		
		$stmt = $conn->prepare("select FirstName, LastName, Phone, Email, Description, ID from Contacts where (FirstName like ? or LastName like ?) and UserID=?");
		$colorName = "%" . $inData["search"] . "%";
		
		$stmt->bind_param("ssi", $colorName, $colorName, $inData["userID"]);
		
		$stmt->execute();
		

		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"firstName": "' . $row["FirstName"] . '", "lastName": "' . $row["LastName"] . '", "phone": "'.$row["Phone"].'", "email": "'.$row["Email"].'", "description": "'.$row["Description"].'", "id": '.$row["ID"].'}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found again" );
		}
		else
		{
			returnWithInfo( $searchResults );
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
		$retValue = '{"id":'.$inData["userId"].',"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
