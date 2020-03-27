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

		$allegato_utente		= isset($request->allegato_utente)		? $request->allegato_utente		: null;

		if ($allegato_utente) {
			$params = [
				isset($allegato_utente->au_idallegato) ? $allegato_utente->au_idallegato : 0
				,isset($allegato_utente->au_idutente) ? $allegato_utente->au_idutente : ""
			];
			$sql = "DELETE FROM allegati_utenti
					WHERE
						au_idallegato = ?
						AND au_idutente = ?";
			$query = query($beansMaps->AllegatoUtenteBean->dbh, $sql, $params);
			if ($query->status) {
				$response->response = $query->rowCount;
				$response->status = true;
			} else {
				$response->response = $query->error;
			}
		} else {
			$response->response = "allegato_utente is null";
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