<?php
ob_start();
require(__DIR__ . "/../../config/config.php");
require(__DIR__ . "/../session_recovery.php");

$postdata	= file_get_contents("php://input");
$request	= json_decode($postdata);

$source		= isset($request->source)	? __DIR__ . "/". $request->source	: false;
$dest		= isset($request->dest)		? __DIR__ . "/". $request->dest		: false;

$response = (Object) [
	"status" => false
	,"response" => "init"
];

try {
	if (isset($_SESSION[$session_logged])) {
		if ($source && $dest) {
			//move
			if (file_exists($source)) {
				if (rename($source, $dest)) {
					$response->response = $dest;
					$response->status = true;
				} else {
					$response->response = "Impossibile rinominare/spostare il file da '$source' a '$dest'";
				}
			} else {
				$response->response = "Impossibile trovare il file '$source'";
			}
		} else if ($source) {
			//delete
			if (file_exists($source)) {
				if (unlink($source)) {
					$response->response = "";
					$response->status = true;
				} else {
					$response->response = "Impossibile eliminare il file '$source'";
				}
			} else {
				$response->response = true;
				$response->status = true;
			}
		} else {
			$response->response = "source is null";
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