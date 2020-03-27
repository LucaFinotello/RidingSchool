<?php
ob_start();
require(__DIR__ . "/../../config/config.php");
require(__DIR__ . "/../session_recovery.php");
require(__DIR__ . "/../base/beansMaps.php");
require(__DIR__ . "/../base/fnQuery.php");
require(__DIR__ . "/../base/fnSave.php");
require(__DIR__ . "/../base/fnToPdf.php");

$response = (Object) [
	"status" => false
	,"response" => "init"
];
try {
	if (isset($_SESSION[$session_logged])) {
		if ($dbh) {
			$postdata	= file_get_contents("php://input");
			$request	= json_decode($postdata);

			$checkup		= isset($request->checkup)		? $request->checkup		: null;

			if ($checkup) {
				beginTransaction([$dbh, $dbh_gestionale]);

				$sql_righe_in_clause = "''";
				$params = [isset($checkup->ch_id) ? $checkup->ch_id : "0"];
				if (isset($checkup->righe)) foreach ($checkup->righe as &$riga) {
					$sql_righe_in_clause .= ",?";
					$params[] = isset($riga->cr_id) ? $riga->cr_id : "0";
				}
				$sql = "DELETE FROM checkups_righe
						WHERE
							cr_idcheckup = ?
							AND cr_id NOT IN ($sql_righe_in_clause)
						";
				$query = query($dbh, $sql, $params);
				if ($query->status) {
					$save = save("CheckupBean", [$checkup]);
					if ($save->status) {
						$checkup = $save->response[0];
						$allegati = [];
						foreach ($checkup->righe as &$riga) {
							if (isset($riga->allegati) && count($riga->allegati) > 0) foreach ($riga->allegati as &$allegato) {
								if (isset($allegato->al_path) && $allegato->al_path) {
									@$allegato->idutente = $checkup->ch_idutente;
									@$allegato->idcheckup = $riga->cr_idcheckup;
									@$allegato->idcheckup_riga = $riga->cr_id;
									$allegati[] = $allegato;
								}
							}
							@$riga->allegati = null;
						}

						$save = save("AllegatoBean", $allegati);
						if ($save->status) {
							$allegati = $save->response;
							$allegati_utenti = [];
							$allegati_aziende = [];
							$allegati_dipendenti = [];
							$allegati_checkups = [];
							$allegati_checkups_righe = [];
							if (isset($allegati) && count($allegati) > 0) foreach ($allegati as &$allegato) {
								$allegati_utenti[] = (Object) [
									"au_idallegato" => $allegato->al_id
									,"au_idutente" => $allegato->idutente
								];
								$allegati_checkups[] = (Object) [
									"ac_idallegato" => $allegato->al_id
									,"ac_idcheckup" => $allegato->idcheckup
								];
								$allegati_checkups_righe[] = (Object) [
									"acr_idallegato" => $allegato->al_id
									,"acr_idcheckup_riga" => $allegato->idcheckup_riga
								];
							}

							$toPdf = toPdf(
								"checkup.tmpl.html"
								,(Object) [
									"landscape" => true
									,"disable_links" => true
									# ,"disable_backgrounds" => true // non usare!!! toglie anche i css striped D:
									,"delay" => 2 # da 0 a 10
									,"use_print" => true
									,"format" => "A4"
								]
								,$checkup
							);
							if ($toPdf->status) {
								$pdf_allegato = (Object) [
									"al_descr" => "checkup_" . $checkup->ch_idazienda . "_" . (new DateTime())->format("Y_m_d_H_i") . ".pdf"
									,"al_path" => "../../file/allegati/" . $_SESSION[$session_logged]->username . "_" . (new DateTime())->format("U")
									,"al_type" => "application/pdf"
									,"al_size" => strlen($toPdf->response)
									,"al_date" => (new DateTime())->format("c")
									,"blob_base64" => base64_encode($toPdf->response)
								];

								$save = save("AllegatoBean", [$pdf_allegato]);
								if ($save->status) {
									@$pdf_allegato->al_id = $save->response[0]->al_id;
									@$pdf_allegato->blob_base64 = null;
									$allegati[] = $pdf_allegato;

									$allegati_utenti[] = (Object) [
										"au_idallegato" => $pdf_allegato->al_id
										,"au_idutente" => $_SESSION[$session_logged]->username # non lo prendo dal checkup perchè potrei essere in modifica di un checkup di un altro utente
									];
									$allegati_aziende[] = (Object) [
										"aa_idallegato" => $pdf_allegato->al_id
										,"aa_idazienda" => $checkup->ch_idazienda
									];
									$allegati_checkups[] = (Object) [
										"ac_idallegato" => $pdf_allegato->al_id
										,"ac_idcheckup" => $checkup->ch_id
									];

									$save = save("AllegatoUtenteBean", $allegati_utenti);
									if ($save->status) {
										$save = save("AllegatoAziendaBean", $allegati_aziende);
										if ($save->status) {
											$save = save("AllegatoDipendenteBean", $allegati_dipendenti);
											if ($save->status) {
												$save = save("AllegatoCheckupBean", $allegati_checkups);
												if ($save->status) {
													$save = save("AllegatoCheckupRigaBean", $allegati_checkups_righe);
													if ($save->status) {
														@$checkup->allegati = $allegati;
														@$checkup->allegati_utenti = $allegati_utenti;
														@$checkup->allegati_aziende = $allegati_aziende;
														@$checkup->allegati_dipendenti = $allegati_dipendenti;
														@$checkup->allegati_checkups = $allegati_checkups;
														@$checkup->allegati_checkups_righe = $allegati_checkups_righe;
														$response->response = [$checkup];
														$response->status = true;
													} else {
														$response->response = $save->response;
													}
												} else {
													$response->response = $save->response;
												}
											} else {
												$response->response = $save->response;
											}
										} else {
											$response->response = $save->response;
										}
									} else {
										$response->response = $save->response;
									}
								} else {
									$response->response = $save->response;
								}
							} else {
								$response->response = $toPdf->response;
							}
						} else {
							$response->response = $save->response;
						}
					} else {
						$response->response = $save->response;
					}
				} else {
					$response->response = $query->error;
				}

				$response->status ? commit([$dbh, $dbh_gestionale]) : rollBack([$dbh, $dbh_gestionale]);
			} else {
				$response->response = "checkup is null";
			}
		} else {
			$response->response = "Connessione database fallita";
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