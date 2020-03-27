<?php
ob_start();
require(__DIR__ . "/../../config/config.php");
require(__DIR__ . "/../session_recovery.php");

$postdata	= file_get_contents("php://input");
$request	= json_decode($postdata);

$labels		= isset($request->labels) && $request->labels	? $request->labels	: [];

/*$labels = [
	"^XA
	^FX
	^CF0,60
	^FO20,50^FDStarline S.r.l.^FS
	^CF0,30
	^FO20,120^FDArticolo: asdlalla^FS
	^FO530,120^FDData: asdlalla^FS
	^FO20,150^FDasdlalla^FS

	^CF0,30
	^FO20,180
	^FB750,2,0,L,0^FDasdlalla^FS
	^CF0,40
	^FO20,400^FDNro pezzi: asdlalla^FS

	^FO20,440^BY2,2.0^B3N,N,100,Y,N^FDasdlalla^FS
	^CF0,25
	^FO700,530^FDasdlalla^FS
	^XZ"
];*/

$response = (Object) [
	"status" => false
	,"response" => "init"
];

try {
	if (isset($_SESSION[$session_logged])) {
		$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
		if ($socket !== false) {
			$socketConnection = socket_connect($socket, $socket_host, $socket_port);
			if ($socketConnection !== false) {
				foreach ($labels as $label) {
					socket_write($socket, $label, strlen($label));
				}
				$response->response = true;
				$response->status = true;
			} else {
				$response->response = "socket_connect() failed.\nReason: ($socketConnection) " . socket_strerror(socket_last_error($socket));
			}
		} else {
			$response->response = "socket_create() failed: reason: " . socket_strerror(socket_last_error());
		}
		socket_close($socket);
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