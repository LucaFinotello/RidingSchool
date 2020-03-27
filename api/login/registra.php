<?php
ob_start();
require(__DIR__ . "/../../config/config.php");
require(__DIR__ . "/../base/fnQuery.php");
require(__DIR__ . "/../session_recovery.php");

require(__DIR__ . "/../lib/PHPMailer-6.0.1/src/Exception.php");
require(__DIR__ . "/../lib/PHPMailer-6.0.1/src/PHPMailer.php");
require(__DIR__ . "/../lib/PHPMailer-6.0.1/src/SMTP.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$response = (Object) [
	"status" => false
	,"response" => "init"
];

try {
	if ($dbh) {
		$postdata	= file_get_contents("php://input");
		$request	= json_decode($postdata);

		$username	= isset($request->username)		? $request->username	: false;
		$password	= isset($request->password)		? $request->password	: false;
		$mail		= isset($request->mail)			? $request->mail		: false;

		if ($username && $password) {
			beginTransaction([$dbh, $dbh_gestionale]);
			if (PHPMailer::ValidateAddress($mail)) {
				$params = [$username];
				$sql = "SELECT NULL
						FROM utenti
						WHERE ut_username = ?";
				$query = query($dbh, $sql, $params);
		
				if ($query->status) {
					if ($query->rows && count($query->rows) > 0) {
						$response->response = "Nome utente già utilizzato";
					} else {
						$password = password_hash($password, PASSWORD_DEFAULT);
						$token = password_hash(date("U"), PASSWORD_DEFAULT);
						$params = [$username, $password, $token];
						$sql = "INSERT INTO utenti (
									ut_username
									,ut_password
									,ut_token
								) VALUES (
									?
									,?
									,?
								)";
						$query = query($dbh, $sql, $params);
						if ($query->status) {
							$params = [$username, $mail, $mail];
							$sql = "INSERT INTO utenti_profili (
										up_idutente
										,up_mail
										,up_flConsensoDatiSensibili
										,up_flMexPromozionali
										,up_flMexAmministrativi
										,up_flMexOrganizzativi
										,up_flMexReply
									) VALUES (
										?
										,?
										,1
										,1
										,1
										,1
										,1
									) ON DUPLICATE KEY UPDATE
										up_mail = ?
									";
							$query = query($dbh, $sql, $params);
							if ($query->status) {
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
								$mail_smtp->addAddress($mail, $username);

								$confirm_url = $url . "api/login/confirm.php?token=$token";

								//Content
								$mail_smtp->isHTML(true);							// Set email format to HTML
								$mail_smtp->Subject = "Conferma registrazione";
								$mail_smtp->Body	= "Per completare la registrazione clicca su questo link:<br/><br/>\r\n\r\n\t<a href=\"$confirm_url\">$confirm_url</a>";

								if ($mail_smtp->send()) {
									$response->response = $confirm_url;
									$response->status = true;
								} else {
									$response->response = "Impossibile inviare la mail di conferma. Riprovare più tardi.";
								}
							} else {
								$response->response = $query->error;
							}
						} else {
							$response->response = $query->error;
						}
					}
				} else {
					$response->response = $query->error;
				}
			} else {
				$response->response = "E-Mail non valida";
			}
			$response->status ? commit([$dbh, $dbh_gestionale]) : rollBack([$dbh, $dbh_gestionale]);
		} else {
			$response->response = "Dati non validi";
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
echo json_encode($response);
?>