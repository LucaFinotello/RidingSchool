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

		$checkup		= isset($request->checkup)		? $request->checkup		: null;

		if ($checkup) {
			$params = [isset($checkup->ch_id) ? $checkup->ch_id : 0];
			$sql = "SELECT
						al_path
						,al_descr
					FROM allegati
					INNER JOIN allegati_checkups ON ac_idallegato = al_id AND ac_idcheckup = ?
					WHERE NOT EXISTS(SELECT 1 FROM allegati_checkups_righe WHERE acr_idallegato = al_id)
					ORDER BY al_date DESC
					LIMIT 1";
			$query = query($beansMaps->AllegatoBean->dbh, $sql, $params);
			if ($query->status) {
				$allegato = $query->rows && count($query->rows) > 0 ? $query->rows[0] : null;
				if ($allegato) {
					if (file_exists(__DIR__ . "/$allegato->al_path")) {
						$response->response = (Object) [
							"path" => $allegato->al_path
							,"filename" => $allegato->al_descr
							,"type" => finfo_file(finfo_open(FILEINFO_MIME_TYPE), __DIR__ . "/". $allegato->al_path)
							,"base64" => base64_encode(file_get_contents(__DIR__ . "/". $allegato->al_path))
						];
						$response->status = true;
					} else {
						$response->response = "Allegato non trovato nel file system";
					}
				} else {
					$response->response = "Allegato non trovato nel database";
				}
			} else {
				$response->response = $query->error;
			}
		} else {
			$response->response = "checkup is null";
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