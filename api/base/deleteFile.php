<?php
ob_start();
require(__DIR__ . "/../../config/config.php");
require(__DIR__ . "/../session_recovery.php");

$postdata	= file_get_contents("php://input");
$request	= json_decode($postdata);

$path	= isset($request->path) ? __DIR__ . "/". $request->path : false;

$response = (Object) [
	"status" => false
	,"response" => "init"
];

try {
	if (isset($_SESSION[$session_logged])) {
		if ($path) {
			if (file_exists($path)) {
				if (unlink($path)) {
					$response->response = true;
					$response->status = true;
				} else {
					$response->response = "Impossibile eliminare il file";
				}
			} else {
				$response->response = true;
				$response->status = true;
			}
		} else {
			$response->response = "pathPdf is null";
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