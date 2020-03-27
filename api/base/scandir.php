<?php
ob_start();
require(__DIR__ . "/../../config/config.php");
require(__DIR__ . "/../session_recovery.php");

$response = (Object) [
	"status" => false
	,"response" => "init"
];

try {
	if (isset($_SESSION[$session_logged])) {
		$postdata	= file_get_contents("php://input");
		$request	= json_decode($postdata);

		$path				= isset($request->path)								? __DIR__ . "/". $request->path			: null; # es: "../img/icons/"
		$sorting_order		= isset($request->sorting_order)					? intval($request->sorting_order)		: 0;
		$fl_files			= isset($request->fl_files) && $request->fl_files;
		$fl_dirs			= isset($request->fl_dirs) && $request->fl_dirs;
		$fl_skip_hiddens	= isset($request->fl_skip_hiddens) && $request->fl_skip_hiddens;

		if ($path) {
			$response->response = [];
	
			$files = scandir($path);
			$files = $files ? $files : [];
	
			foreach ($files as $file) { //substr($file, 0, 1) != "."
				if (
					$file && (
						($fl_files && is_file("$path$file"))
						|| ($fl_dirs && !is_file("$path$file"))
					) && (
						!$fl_skip_hiddens
						|| ($fl_skip_hiddens && substr($file, 0, 1) != ".")
					)
				) {
					$response->response[] = $file;
				}
			}
	
			$response->status = true;
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