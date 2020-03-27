<?php
ob_start();
require(__DIR__ . "/../../config/config.php");
require(__DIR__ . "/../session_recovery.php");
require(__DIR__ . "/../base/beansMaps.php");
require(__DIR__ . "/../base/fnQuery.php");
require(__DIR__ . "/../base/fnFind.php");

$response = (Object) [
	"status" => false
	,"response" => "init"
];

try {
	if (isset($_SESSION[$session_logged]) && isset($_SESSION[$session_logged]->username)) {
		$find = find("UtenteBean", [(Object) [
			"username" => $_SESSION[$session_logged]->username
			,"enabled" => "1"
		]]);
		if ($find->status) {
			$response->response = null;
			if ($find->response && count($find->response) > 0) {
				$_SESSION[$session_logged] = $find->response[0];
				$response->response = $_SESSION[$session_logged];
			}
			$response->status = true;
		} else {
			$response->response = $find->response;
		}
	} else {
		$response->response = null;
		$response->status = true;
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