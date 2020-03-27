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

		$token		= isset($request->token)		? $request->token		: false;
		$password	= isset($request->password)		? $request->password	: false;
		$username	= isset($request->username)		? $request->username	: false;
		$ricordami	= isset($request->ricordami) && $request->ricordami;

		if ($token && $password) {
			$password = password_hash($password, PASSWORD_DEFAULT);
			$params = [$password, $token];
			$sql = "UPDATE utenti SET
						ut_token = ''
						,ut_password = ?
					WHERE ut_token = ?";
			$query = query($dbh, $sql, $params);
			if ($query->status) {
				$response->response = "Password modificata con successo";
				$response->status = true;
			} else {
				$response->response = $query->error;
			}
		} else if ($username) {
			$params = [$username];
			$sql = "SELECT up_mail
					FROM utenti_profili
					WHERE up_idutente = ?";
			$query = query($dbh, $sql, $params);
			if ($query->status) {
				if ($query->rows && count($query->rows) > 0) {
					$mail = $query->rows[0]["up_mail"];
					if ($mail && PHPMailer::ValidateAddress($mail)) {
						beginTransaction([$dbh, $dbh_gestionale]);
						$token = password_hash(date("U"), PASSWORD_DEFAULT);

						$params = [$token, $username];
						$sql = "UPDATE utenti SET
									ut_token = ?
								WHERE ut_username = ?";
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

							$confirm_url = "$url?recupera=$token";

							//Content
							$mail_smtp->isHTML(true);							// Set email format to HTML
							$mail_smtp->Subject = "Recupera password";
							$mail_smtp->Body	= "Per recuperare tua password d'accesso clicca su questo link:<br/><br/>\r\n\r\n\t<a href=\"$confirm_url\">$confirm_url</a>";
	
							if ($mail_smtp->send()) {
								$response->response = "Controlla la tua casella email per completare il recupero";
								$response->status = true;
							} else {
								$response->response = "Impossibile inviare la mail di recupero. Riprovare più tardi.";
							}
						} else {
							$response->response = $query->error;
						}
						$response->status ? commit([$dbh, $dbh_gestionale]) : rollBack([$dbh, $dbh_gestionale]);
					} else {
						$response->response = "Errore interno. Impossibile procedere con il recupero.";
					}
				} else {
					$response->response = "Non è stato trovato nessun indirizzo e-mail associato all'utente $username";
				}
			} else {
				$response->response = $query->error;
			}
		} else {
			$response->response = "Errore interno. Impossibile procedere con il recupero.";
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