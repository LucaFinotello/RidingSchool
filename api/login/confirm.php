<?php
ob_start();
require(__DIR__ . "/../../config/config.php");
require(__DIR__ . "/../base/fnQuery.php");
require(__DIR__ . "/../session_recovery.php");

$response = (Object) [
	"status" => false
	,"response" => "init"
];

try {
	if ($dbh) {
		$token = isset($_GET["token"]) ? $_GET["token"] : false;

		if ($token) {
			$params = [$token];
			$sql = "SELECT up_mail
					FROM utenti
					LEFT JOIN utenti_profili ON
						up_idutente = ut_username
					WHERE ut_token = ?"
			$query = query($dbh, $sql, $params);
			if ($query->status) {
				if ($query->rows && count($query->rows) > 0) {
					$mail = $query->rows[0]["up_mail"];
					$params = [$token];
					$sql = "UPDATE utenti SET
								ut_token = ''
								,ut_flEnabled = 1
							WHERE ut_token = ?";
					$query = query($dbh, $sql, $params);
					if ($query->status) {
						if (PHPMailer::ValidateAddress($mail)) {
							$mail_smtp = new PHPMailer(true);
							$mail_smtp->IsSMTP();
							$mail_smtp->CharSet	= "UTF-8";

							$mail_smtp->Host		= $smtp_Host;
							$mail_smtp->SMTPDebug	= $smtp_SMTPDebug;
							$mail_smtp->SMTPAuth	= $smtp_SMTPAuth;
							$mail_smtp->SMTPSecure	= "ssl";
							//$mail_smtp->SMTPOptions = ["ssl"=> ["allow_self_signed" => true]];
							$mail_smtp->Port		= $smtp_Port;
							$mail_smtp->Username	= $smtp_Username;
							$mail_smtp->Password	= $smtp_Password;
			
							$mail_smtp->setFrom($mail_noreply, $nome_noreply);
							$mail_smtp->addAddress($mail, $to->mt_to);

							$mail_smtp->isHTML(true);			// Set email format to HTML

							$mail_smtp->Subject = "Registrazione completata";
							$mail_smtp->Body	= "<p>Registrazione completata</p><p>Potete accedere al portale web dal link <a href=\"$url\">$url</a></p>";

							if (!$mail_smtp->send()) {
								$response->response = "Impossibile inviare la mail di avvenuta registrazione";
							}
						}

						$reponse->response = $token;
						$reponse->status = true;
					} else {
						$response->response = $query->error;
					}
				} else {
					$reponse->response = "Token non valido";
				}
			} else {
				$response->response = $query->error;
			}
		} else {
			$response->response = "token is null";
		}
	} else {
		$response->response = "Connessione database fallita";
	}
} catch (Exception $e) {
	$response->response = "Fatal error";
	echo $e->getMessage();
}

$obStr = ob_get_clean();
$response->response = $response->status ? $response->response : $response->response . ($obStr ? ". More info: " . $obStr : "");
ob_end_clean();
//echo json_encode($response);
header("location:$url?confirm=".$reponse->status);
?>