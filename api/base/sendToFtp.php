<?php
ob_start();
require(__DIR__ . "/../../config/config.php");
require(__DIR__ . "/../session_recovery.php");

$postdata	= file_get_contents("php://input");
$request	= json_decode($postdata);

$localPath		= isset($request->localPath)		? __DIR__ . "/". $request->localPath		: false;
$remotePath		= isset($request->remotePath)		? $request->remotePath						: false;

$response = (Object) [
	"status" => false
	,"response" => "init"
];

try {
	if (isset($_SESSION[$session_logged])) {
		if ($localPath && $remotePath) {
			if (file_exists($localPath)) {
				$ftp_conn = ftp_ssl_connect($ftp_host);
				$ftp_login = $ftp_conn && ftp_login($ftp_conn, $ftp_user, $ftp_pass);
				if (!$ftp_login) {
					if ($ftp_conn) {
						ftp_close($ftp_conn);
					}
					$ftp_conn = ftp_connect($ftp_host);
					$ftp_login = $ftp_conn && ftp_login($ftp_conn, $ftp_user, $ftp_pass);
				}

				if ($ftp_conn && $ftp_login) {
						ftp_pasv($ftp_conn, true);
						if (ftp_put($ftp_conn, $remotePath, $localPath, FTP_BINARY)) {
							$response->response = $remotePath;
							$response->status = true;
						} else {
							$response->response = "File non inviato";
						}
						ftp_close($ftp_conn);
				} else if ($ftp_conn) {
					$response->response = "Credenziali FTP errate";
					ftp_close($ftp_conn);
				} else {
					$response->response = "Impossibile raggiungere l'host FTP";
				}
			} else {
				$response->response = "Impossibile trovare il file '$localPath'";
			}
		} else {
			$response->response = "Sessione scaduta";
		}
	} else {
		$response->response = "InvalidParamsException";
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