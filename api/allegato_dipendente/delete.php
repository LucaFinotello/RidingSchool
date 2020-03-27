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

		$allegato_dipendente		= isset($request->allegato_dipendente)		? $request->allegato_dipendente		: null;

		if ($allegato_dipendente) {
			$params = [
				isset($allegato_dipendente->ad_idallegato) ? $allegato_dipendente->ad_idallegato : 0
				,isset($allegato_dipendente->ad_iddipendente) ? $allegato_dipendente->ad_iddipendente : 0
			];
			$sql = "DELETE FROM allegati_dipendenti
					WHERE
						ad_idallegato = ?
						AND ad_iddipendente = ?";
			$query = query($beansMaps->AllegatoDipendenteBean->dbh, $sql, $params);
			if ($query->status) {
				$response->response = $query->rowCount;
				$response->status = true;
			} else {
				$response->response = $query->error;
			}
		} else {
			$response->response = "allegato_dipendente is null";
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