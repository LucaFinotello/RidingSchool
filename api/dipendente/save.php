<?php
ob_start();
require("../../config/config.php");
require("../session_recovery.php");
require("../base/fnQuery.php");
require("../base/fnSave.php");
require("../base/beansMaps.php");

$response = (Object) [
	"status" => false
	,"response" => "init"
];

try {
	if (isset($_SESSION[$session_logged])) {
		$postdata	= file_get_contents("php://input");
		$request	= json_decode($postdata);

		$dipendente		= isset($request->dipendente)		? $request->dipendente		: null;

		if ($dipendente) {
			beginTransaction([$dbh, $dbh_gestionale]);

			$save = save("DipendenteBean", $dipendente);
			if ($save->status) {
				$dipendenti = $save->response;
				$params = [
					$dipendenti[0]->di_idazienda
					,$dipendenti[0]->di_id
				];
				$sql = "UPDATE utenti SET ut_idazienda = ? WHERE ut_iddipendente = ?";
				$query = query($beansMaps->UtenteBean->dbh, $sql, $params);
				if ($query->status) {
					$response->response = $dipendenti;
					$response->status = true;
				} else {
					$response->response = $query->error;
				}
			} else {
				$response->response = $save->response;
			}

			$response->status ? commit([$dbh, $dbh_gestionale]) : rollBack([$dbh, $dbh_gestionale]);
		} else {
			$response->response = "dipendente is null";
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
$response->obStr = $obStr;
ob_end_clean();
echo json_encode($response);
?>