<?php
ob_start();
require(__DIR__ . "/../../config/config.php");
require(__DIR__ . "/../session_recovery.php");

$postdata	= file_get_contents("php://input");
$request	= json_decode($postdata);

$path		= isset($request->path) && $request->path		? $request->path		: null;

$response = (Object) [
	"status" => false
	,"response" => "init"
];

try {
	if (isset($_SESSION[$session_logged])) {
		if (__DIR__ . "/". $path) {
			if (file_exists(__DIR__ . "/". $path)) {
				$response->response = (Object) [
					"path" => $path
					,"filename" => basename(__DIR__ . "/". $path)
					,"type" => finfo_file(finfo_open(FILEINFO_MIME_TYPE), __DIR__ . "/". $path)
					,"base64" => base64_encode(file_get_contents(__DIR__ . "/". $path))
				];
				$response->status = true;
			} else {
				$response->response = "file not found";
			}
		} else {
			$response->response = "path is null";
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