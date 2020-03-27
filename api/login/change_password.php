<?php
ob_start();
require(__DIR__ . "/../../config/config.php");
require(__DIR__ . "/../base/fnQuery.php");
require(__DIR__ . "/../session_recovery.php");

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$username		= isset($request->username)		? $request->username		: false;
$old_password	= isset($request->old_password)	? $request->old_password	: false;
$new_password	= isset($request->new_password)	? $request->new_password	: false;

$response = (Object) [
	"status" => false
	,"response" => "init"
];

try {
	if ($username && $new_password) {
		$params = [$username];
		$sql = "SELECT ut_password FROM utenti WHERE ut_username = ?";
		$query = query($dbh, $sql, $params);
		if ($query->status) {
			if (isset($query->rows) && count($query->rows) > 0) {
				if (!$old_password || password_verify($old_password, $query->rows[0]->ut_password)) {
					$new_password = password_hash($new_password, PASSWORD_DEFAULT);
					$params = [$new_password, $username];
					$sql = "UPDATE utenti SET ut_password = ? WHERE ut_username = ?";
					$query = query($dbh, $sql, $params);
					if ($query->status) {
						$response->response = "Password cambiata con successo";
						$response->status = true;
					} else {
						$response->response = $query->error;
					}
				} else {
					$response->response = "La vecchia password è errata";
				}
			} else {
				$response->response = "username does not exists";
			}
		} else {
			$response->response = $query->error;
		}
	} else if (!$username) {
		$response->response = "username is null";
	} else if (!$new_password) {
		$response->response = "new_password is null";
	}
} catch (Exception $e) {
	$response->response = "Fatal error";
	echo $e->getMessage();
}

$obStr = ob_get_clean();
$response->response = $response->status ? $response->response : $response->response . ($obStr ? ". More info: " . $obStr : "");
ob_end_clean();
echo json_encode($response);
?>