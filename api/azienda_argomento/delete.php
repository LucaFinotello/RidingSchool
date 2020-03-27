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

		$azienda_argomento		= isset($request->azienda_argomento)		? $request->azienda_argomento		: null;

		if ($azienda_argomento) {
			$params = [
				isset($azienda_argomento->aa_idazienda) ? $azienda_argomento->aa_idazienda : 0
				,isset($azienda_argomento->aa_idargomento) ? $azienda_argomento->aa_idargomento : 0
			];
			$sql = "DELETE FROM aziende_argomenti
					WHERE aa_idazienda = ? AND aa_idargomento = ?";
			$query = query($beansMaps->AziendaArgomentoBean->dbh, $sql, $params);
			if ($query->status) {
				$response->response = $query->rowCount;
				$response->status = true;
			} else {
				$response->response = $query->error;
			}
		} else {
			$response->response = "azienda_argomento is null";
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