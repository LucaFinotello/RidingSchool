<?php
ob_start();
require(__DIR__ . "/../../config/config.php");
require(__DIR__ . "/../session_recovery.php");
require(__DIR__ . "/../base/fnQuery.php");
require(__DIR__ . "/../base/beansMaps.php");

$response = (Object) [
	"status" => false
	,"response" => "init"
];

try {
	if (isset($_SESSION[$session_logged])) {
		$postdata	= file_get_contents("php://input");
		$request	= json_decode($postdata);

		$adempimento		= isset($request->adempimento)		? $request->adempimento		: null;

		if ($adempimento) {
			$params = [
				isset($adempimento->ch_idazienda) ? $adempimento->ch_idazienda : 0
				,isset($adempimento->cr_idadempimento) ? $adempimento->cr_idadempimento : 0
			];
			$sql = "SELECT
						ch_idazienda
						,DATE_FORMAT(ch_date, '%Y-%m-%dT%TZ') AS ch_date
						,ad_idargomento AS cr_idargomento
						,cr_idadempimento
						,cr_idstato
					FROM checkups
					LEFT JOIN checkups_righe ON cr_idcheckup = ch_id
					LEFT JOIN adempimenti ON ad_id = cr_idadempimento
					WHERE
						ch_idazienda = ?
						AND cr_idadempimento = ?";
			$query = query($beansMaps->CheckupBean->dbh, $sql, $params);
			if ($query->status) {
				$response->response = $query->rows;
				$response->status = true;
			} else {
				$response->response = $query->error;
			}
		} else {
			$response->response = "adempimento is null";
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