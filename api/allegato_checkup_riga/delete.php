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

		$allegato_checkup_riga		= isset($request->allegato_checkup_riga)		? $request->allegato_checkup_riga		: null;

		if ($allegato_checkup_riga) {
			$params = [
				isset($allegato_checkup_riga->acr_idallegato) ? $allegato_checkup_riga->acr_idallegato : 0
				,isset($allegato_checkup_riga->acr_idcheckup_riga) ? $allegato_checkup_riga->acr_idcheckup_riga : 0
			];
			$sql = "DELETE FROM allegati_checkups_righe
					WHERE
						acr_idallegato = ?
						AND acr_idcheckup_riga = ?";
			$query = query($beansMaps->AllegatoCheckupRigaBean->dbh, $sql, $params);
			if ($query->status) {
				$response->response = $query->rowCount;
				$response->status = true;
			} else {
				$response->response = $query->error;
			}
		} else {
			$response->response = "allegato_checkup_riga is null";
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