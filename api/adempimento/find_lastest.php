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

		$beanName		= isset($request->beanName)		? $request->beanName		: null;
		$model			= isset($request->model)		? $request->model			: null;

		$params = [];
		$sql = "SELECT
					ch_idazienda
					,MAX(DATE_FORMAT(ch_date, '%Y-%m-%dT%TZ')) AS ch_date
					,cr_idadempimento
					,ad_idargomento AS cr_idargomento
					,(
						SELECT cr_idstato
						FROM checkups AS checkup_stato
						LEFT JOIN checkups_righe AS checkup_riga_stato ON checkup_stato.ch_id = checkup_riga_stato.cr_idcheckup
						WHERE
							checkup_stato.ch_idazienda = checkups.ch_idazienda
							AND checkup_riga_stato.cr_idadempimento = checkups_righe.cr_idadempimento
						ORDER BY ch_date DESC
						LIMIT 1
					) AS cr_idstato
				FROM checkups
				LEFT JOIN checkups_righe ON cr_idcheckup = ch_id
				LEFT JOIN adempimenti ON ad_id = cr_idadempimento
				GROUP BY ch_idazienda, cr_idadempimento";
		$query = query($beansMaps->CheckupBean->dbh, $sql, $params);
		if ($query->status) {
			$response->response = $query->rows;
			$response->status = true;
		} else {
			$response->response = $query->error;
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