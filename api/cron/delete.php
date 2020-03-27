<?php
ob_start();
require("../../config/config.php");
require("../session_recovery.php");
require("../base/fnQuery.php");
require("../base/fnFind.php");
require("../base/fnCron.php");
require("../base/beansMaps.php");

$response = (Object) [
	"status" => false
	,"response" => "init"
];

try {
	if (isset($_SESSION[$session_logged])) {
		$postdata	= file_get_contents("php://input");
		$request	= json_decode($postdata);

		$cron		= isset($request->cron)			? $request->cron		: null;

		if ($cron) {
			beginTransaction([$dbh, $dbh_gestionale]);

			$params = [isset($cron->cr_id) ? $cron->cr_id : 0];
			$sql = "DELETE FROM crons WHERE cr_id = ?";
			$query = query($dbh, $sql, $params);
			if ($query->status) {
				$find = find("CronBean", [(Object) ["cr_fl_enabled" => "1"]]);
				if ($find->status) {
					$crons = $find->response;
					$file_content = "";
					foreach ($crons as $cron) {
						$file_content .= $file_content ? "\n" : "";
						$file_content .= $cron->cr_minute . " " . $cron->cr_hour . " " . $cron->cr_day . " " . $cron->cr_month . " " . $cron->cr_dow . " /usr/bin/php -q " . __DIR__ . "/cmds/" . $cron->cr_cmd . " >> " . __DIR__ . "/logs/" . $cron->cr_id . ".log";
					}
					$file_content .= "\n";
					$file_path = __DIR__ . "/running/www-data.cron";
					if (file_put_contents($file_path, $file_content)) {
						$cron = cron($file_path, "www-data");
						if ($cron->status) {
							$response->response = $query->rowCount;
							$response->status = true;
						} else {
							$response->response = $cron->response;
						}
					} else {
						$response->response = "Impossibile creare il file di cron";
					}
				} else {
					$response->response = $find->response;
				}
			} else {
				$response->response = $query->error;
			}

			$response->status ? commit([$dbh, $dbh_gestionale]) : rollBack([$dbh, $dbh_gestionale]);
		} else {
			$response->response = "cron is null";
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