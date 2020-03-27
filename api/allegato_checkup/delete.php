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
		$postdata	= file_get_contents("php://input");
		$request	= json_decode($postdata);

		$allegato_checkup		= isset($request->allegato_checkup)		? $request->allegato_checkup		: null;

		if ($allegato_checkup) {
			$params = [
				isset($allegato_checkup->ac_idallegato) ? $allegato_checkup->ac_idallegato : 0
				,isset($allegato_checkup->ac_idcheckup) ? $allegato_checkup->ac_idcheckup : 0
			];
			$sql = "DELETE FROM allegati_checkups
					WHERE
						ac_idallegato = ?
						AND ac_idcheckup = ?";
			$query = query($beansMaps->AllegatoCheckupBean->dbh, $sql, $params);
			if ($query->status) {
				$response->response = $query->rowCount;
				$response->status = true;
			} else {
				$response->response = $query->error;
			}
		} else {
			$response->response = "allegato_checkup is null";
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