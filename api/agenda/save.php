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

			$agenda		= isset($request->agenda)		? $request->agenda		: null;

			if ($agenda) {
				beginTransaction([$dbh, $dbh_gestionale]);

				$sql_righe_in_clause = "''";
				$params = [isset($agenda->ch_id) ? $agenda->ch_id : "0"];
				if (isset($agenda->righe)) foreach ($agenda->righe as &$riga) {
					$sql_righe_in_clause .= ",?";
					$params[] = isset($riga->cr_id) ? $riga->cr_id : "0";
				}
				$sql = "DELETE FROM agendas_righe
						WHERE
							cr_idagenda = ?
							AND cr_id NOT IN ($sql_righe_in_clause)
						";
				$query = query($dbh, $sql, $params);
				if ($query->status) {
					$save = save("CheckupBean", [$agenda]);
					if ($save->status) {
						$agenda = $save->response[0];
						$allegati = [];
						foreach ($agenda->righe as &$riga) {
							if (isset($riga->allegati) && count($riga->allegati) > 0) foreach ($riga->allegati as &$allegato) {
								if (isset($allegato->al_path) && $allegato->al_path) {
									@$allegato->idutente = $agenda->ch_idutente;
									@$allegato->idagenda = $riga->cr_idagenda;
									@$allegato->idagenda_riga = $riga->cr_id;
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
							$allegati_agendas = [];
							$allegati_agendas_righe = [];
							if (isset($allegati) && count($allegati) > 0) foreach ($allegati as &$allegato) {
								$allegati_utenti[] = (Object) [
									"au_idallegato" => $allegato->al_id
									,"au_idutente" => $allegato->idutente
								];
								$allegati_agendas[] = (Object) [
									"ac_idallegato" => $allegato->al_id
									,"ac_idagenda" => $allegato->idagenda
								];
								$allegati_agendas_righe[] = (Object) [
									"acr_idallegato" => $allegato->al_id
									,"acr_idagenda_riga" => $allegato->idagenda_riga
								];
							}

							$toPdf = toPdf(
								"agenda.tmpl.html"
								,(Object) [
									"landscape" => true
									,"disable_links" => true
									# ,"disable_backgrounds" => true // non usare!!! toglie anche i css striped D:
									,"delay" => 2 # da 0 a 10
									,"use_print" => true
									,"format" => "A4"
								]
								,$agenda
							);
							if ($toPdf->status) {
								$pdf_allegato = (Object) [
									"al_descr" => "agenda_" . $agenda->ch_idazienda . "_" . (new DateTime())->format("Y_m_d_H_i") . ".pdf"
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
										,"au_idutente" => $_SESSION[$session_logged]->username # non lo prendo dal agenda perchè potrei essere in modifica di un agenda di un altro utente
									];
									$allegati_aziende[] = (Object) [
										"aa_idallegato" => $pdf_allegato->al_id
										,"aa_idazienda" => $agenda->ch_idazienda
									];
									$allegati_agendas[] = (Object) [
										"ac_idallegato" => $pdf_allegato->al_id
										,"ac_idagenda" => $agenda->ch_id
									];

									$save = save("AllegatoUtenteBean", $allegati_utenti);
									if ($save->status) {
										$save = save("AllegatoAziendaBean", $allegati_aziende);
										if ($save->status) {
											$save = save("AllegatoDipendenteBean", $allegati_dipendenti);
											if ($save->status) {
												$save = save("AllegatoCheckupBean", $allegati_agendas);
												if ($save->status) {
													$save = save("AllegatoCheckupRigaBean", $allegati_agendas_righe);
													if ($save->status) {
														@$agenda->allegati = $allegati;
														@$agenda->allegati_utenti = $allegati_utenti;
														@$agenda->allegati_aziende = $allegati_aziende;
														@$agenda->allegati_dipendenti = $allegati_dipendenti;
														@$agenda->allegati_agendas = $allegati_agendas;
														@$agenda->allegati_agendas_righe = $allegati_agendas_righe;
														$response->response = [$agenda];
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
				$response->response = "agenda is null";
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