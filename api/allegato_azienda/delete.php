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

		$allegato_azienda		= isset($request->allegato_azienda)		? $request->allegato_azienda		: null;

		if ($allegato_azienda) {
			$params = [
				isset($allegato_azienda->aa_idallegato) ? $allegato_azienda->aa_idallegato : 0
				,isset($allegato_azienda->aa_idazienda) ? $allegato_azienda->aa_idazienda : 0
			];
			$sql = "DELETE FROM allegati_aziende
					WHERE
						aa_idallegato = ?
						AND aa_idazienda = ?";
			$query = query($beansMaps->AllegatoAziendaBean->dbh, $sql, $params);
			if ($query->status) {
				$response->response = $query->rowCount;
				$response->status = true;
			} else {
				$response->response = $query->error;
			}
		} else {
			$response->response = "allegato_azienda is null";
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