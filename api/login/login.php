<?php
ob_start();
require(__DIR__ . "/../../config/config.php");
require(__DIR__ . "/../base/fnQuery.php");
require(__DIR__ . "/../session_recovery.php");

$response = (Object) [
	"status" => false
	,"response" => "init"
];

try {
	if ($dbh) {
		$postdata	= file_get_contents("php://input");
		$request	= json_decode($postdata);

		$username	= isset($request->username)		? $request->username	: null;
		$password	= isset($request->password)		? $request->password	: null;
		$ricordami	= isset($request->ricordami) && $request->ricordami;

		if (isset($username)) {
			$params = [$username];
			$sql = "";
			if (isset($password)) {
				$sql = "SELECT
							ut_username AS username
							,ut_password AS password
							,ut_flEnabled AS fl_enabled
						FROM utenti
						WHERE ut_username = ?";
			} else {
				$sql = "SELECT
							ut_username AS username
							,ut_password AS password
							,ut_flEnabled AS fl_enabled
						FROM utenti
						LEFT JOIN utenti_chiavi ON uc_idutente = ut_username
						WHERE uc_chiave = ?";
			}
			$query = query($dbh, $sql, $params);
	
			if ($query->status) {
				if ($query->rows && count($query->rows) > 0) {
					$utente = $query->rows[0];

					if ($utente->fl_enabled == 0) {
						$response->response = "Utente non abilitato. Se non hai completato la registrazione, controlla la tua casella email";
					} else if (!isset($password) || (isset($password) && password_verify($password, $utente->password))) {
						# rimuovo la password dall oggetto altrimenti rimarrebbe nel cookie
						unset($utente->password);

						$_SESSION[$session_logged] = $utente;
						if ($ricordami) {
							setcookie($session_logged, serialize($utente), time() + (86400*365), "/"); // 86400 = 1 day
						} else {
							unset($_COOKIE[$session_logged]);
							setcookie($session_logged, "", time()-1, "/");
						}

						$response->response = $utente;
						$response->status = true;
					} else {
						$response->response = "Login errato";
					}
				} else {
					$response->response = "Login errato";
				}
			} else {
				$response->response = $query->error;
			}
		} else {
			$response->response = "Login errato";
		}
	} else {
		$response->response = "Connessione database fallita";
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