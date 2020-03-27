<?php
ob_start();
require(__DIR__ . "/../../config/config.php");
require(__DIR__ . "/../session_recovery.php");
require(__DIR__ . "/../base/beansMaps.php");
require(__DIR__ . "/../base/fnQuery.php");

$response = (Object) [
	"status" => false
	,"response" => "init"
];
try {
	if (isset($_SESSION[$session_logged])) {
		if ($dbh) {
			$postdata	= file_get_contents("php://input");
			$request	= json_decode($postdata);

			$utente		= isset($request->utente)		? $request->utente		: null;

			if ($utente) {
				$params = [isset($utente->username) ? $utente->username : ""];
				$sql = "DELETE FROM utenti WHERE ut_username = ?";
				$query = query($dbh, $sql, $params);
				if ($query->status) {
					$response->response = $query->rowCount;
					$response->status = true;
				} else {
					$response->response = $query->error;
				}
			} else {
				$response->response = "utente is null";
			}
		} else {
			$response->response = "Connessione database fallita";
		}
	} else {
		$response->response = "Sessione scaduta";
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