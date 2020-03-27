<?php
ob_start();
require(__DIR__ . "/../../config/config.php");
require(__DIR__ . "/../session_recovery.php");
require(__DIR__ . "/../base/beansMaps.php");
require(__DIR__ . "/../base/fnQuery.php");
require(__DIR__ . "/../base/fnSave.php");

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

			if ($utente && $utente->username) {
				beginTransaction([$dbh, $dbh_gestionale]);

				$sql_chiavi_in_clause = "''";
				$params = [$utente->username];
				if (isset($utente->chiavi)) foreach ($utente->chiavi as $chiave) {
					$sql_chiavi_in_clause .= ",?";
					$params[] = $chiave->uc_chiave;
				}
				$sql = "DELETE FROM utenti_chiavi
						WHERE
							uc_idutente = ?
							AND uc_chiave NOT IN ($sql_chiavi_in_clause)
						";
				$query = query($dbh, $sql, $params);
				if ($query->status) {
					$response = save("UtenteBean", [$utente]);
				} else {
					$response->response = $query->error;
				}

				$response->status ? commit([$dbh, $dbh_gestionale]) : rollBack([$dbh, $dbh_gestionale]);
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