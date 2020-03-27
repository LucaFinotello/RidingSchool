<?php
$beansMaps = (Object) [
	/* questa assegnazione iniziale serve per inizializzare la mappa in modo che
	non lanci warning quando successivamente verranno inseriti i bean */
	# "BaseBean" => => null, 
	"UtenteBean" => null
	,"DipendenteBean" => null
	,"AziendaBean" => null
	,"AziendaActivityBean" => null
	,"ArgomentoBean" => null
	,"AziendaArgomentoBean" => null
	,"AdempimentoBean" => null
	,"FormazioneBean" => null
	,"AziendaFormazioneBean" => null
	,"DipendenteFormazioneBean" => null
	,"AllegatoBean" => null
	,"AllegatoUtenteBean" => null
	,"AllegatoAziendaBean" => null
	,"AllegatoDipendenteBean" => null
	,"AllegatoCheckupBean" => null
	,"AllegatoCheckupRigaBean" => null
	,"CheckupBean" => null
	,"CheckupRigaBean" => null
	,"CheckupRigaSanzioneBean" => null
    ,"AgendaBean" => null
];
# BaseBean
/*
$beansMaps->BaseBean = (Object) [
	"dbh" => PDO
	,"sqlTableName" => "sqlTableName"
	,"sqlFieldsMap" => (Object) [
		"jsFieldName" => (Object) [
			"name" => "sqlFieldName"
			,"options" => (Object) [
				"type" => null | "date" | "base64"
				,"path" => jsFieldNamePath	# obbligatorio per type base64
			]
		]
	]
	,"pksMap" => [
		"jsFieldName" => (Object) [
			"options" => (Object) [
				"autoincrement" => true | false
			]
		]
	]
	,"children" => [
		"jsFieldName" => (Object) [
			"beanName" => "beanChildName"
			,"fksMap" => (Object) [
				"jsChildField" => (Object) [
					"name" => "jsFatherField"
				]
			]
			,"flGetFirst" => true | false
			,"flReadOnly" => true | false
		]
	]
]
*/
# UtenteBean
$beansMaps->UtenteBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "utenti"
	,"sqlFieldsMap" => (Object) [
		"username" => (Object) [
			"name" => "ut_username"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"admin" => (Object) [
			"name" => "ut_flAdmin"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"enabled" => (Object) [
			"name" => "ut_flEnabled"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"fl_gestione" => (Object) [
			"name" => "ut_flGestione"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"fl_scadenziario" => (Object) [
			"name" => "ut_flScadenziario"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"fl_allegati" => (Object) [
			"name" => "ut_flAllegati"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"fl_report" => (Object) [
			"name" => "ut_flReport"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"cognome" => (Object) [
			"name" => "ut_cognome"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"nome" => (Object) [
			"name" => "ut_nome"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"iddipendente" => (Object) [
			"name" => "ut_iddipendente"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"idazienda" => (Object) [
			"name" => "ut_idazienda"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"username" => (Object) [
			"options" => (Object) [
				"autoincrement" => false
			]
		]
	]
	,"children" => [
		"dipendente" => (Object) [
			"beanName" => "DipendenteBean"
			,"fksMap" => (Object) [
				"di_id" => (Object) [
					"name" => "iddipendente"
				]
			]
			,"flGetFirst" => true
			,"flReadOnly" => true
		]
		,"azienda" => (Object) [
			"beanName" => "AziendaBean"
			,"fksMap" => (Object) [
				"az_id" => (Object) [
					"name" => "idazienda"
				]
			]
			,"flGetFirst" => true
			,"flReadOnly" => true
		]
	]
];
# DipendenteBean
$beansMaps->DipendenteBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "dipendenti"
	,"sqlFieldsMap" => (Object) [
		"di_id" => (Object) [
			"name" => "di_id"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"di_idazienda" => (Object) [
			"name" => "di_idazienda"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"di_descr" => (Object) [
			"name" => "di_descr"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"di_note" => (Object) [
			"name" => "di_note"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"di_note_interne" => (Object) [
			"name" => "di_note_interne"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"di_id" => (Object) [
			"options" => (Object) [
				"autoincrement" => true
			]
		]
	]
];
# AziendaBean
$beansMaps->AziendaBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "aziende"
	,"sqlFieldsMap" => (Object) [
		"az_id" => (Object) [
			"name" => "az_id"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"az_descr" => (Object) [
			"name" => "az_descr"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"az_note" => (Object) [
			"name" => "az_note"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"az_note_interne" => (Object) [
			"name" => "az_note_interne"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"az_flsocio" => (Object) [
			"name" => "az_flsocio"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"az_flcontratto" => (Object) [
			"name" => "az_flcontratto"
			,"options" => (Object) [
				"type" => null
			]
		]
        ,"az_flmondiale" => (Object) [
            "name" => "az_flmondiale"
            ,"options" => (Object) [
                "type" => null
            ]
        ]
	]
	,"pksMap" => [
		"az_id" => (Object) [
			"options" => (Object) [
				"autoincrement" => true
			]
		]
	]
];
# AziendaActivityBean
$beansMaps->AziendaActivityBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "aziende_activities"
	,"sqlFieldsMap" => (Object) [
		"aa_id" => (Object) [
			"name" => "aa_id"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"aa_idazienda" => (Object) [
			"name" => "aa_idazienda"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"aa_idutente" => (Object) [
			"name" => "aa_idutente"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"aa_pres_ant" => (Object) [
			"name" => "aa_pres_ant"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"aa_date" => (Object) [
			"name" => "aa_date"
			,"options" => (Object) [
				"type" => "date"
			]
		]
		,"aa_pres_post" => (Object) [
			"name" => "aa_pres_post"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"aa_gradi" => (Object) [
			"name" => "aa_gradi"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"aa_moto" => (Object) [
			"name" => "aa_moto"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"aa_post" => (Object) [
			"name" => "aa_post"
			,"options" => (Object) [
				"type" => null
			]
		],"aa_ant" => (Object) [
			"name" => "aa_ant"
			,"options" => (Object) [
				"type" => null
			]
		],"aa_pre_ant" => (Object) [
			"name" => "aa_pre_ant"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"aa_id" => (Object) [
			"options" => (Object) [
				"autoincrement" => true
			]
		]
	]
];
# ArgomentoBean
$beansMaps->ArgomentoBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "argomenti"
	,"sqlFieldsMap" => (Object) [
		"ar_id" => (Object) [
			"name" => "ar_id"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"ar_descr" => (Object) [
			"name" => "ar_descr"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"ar_note" => (Object) [
			"name" => "ar_note"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"ar_id" => (Object) [
			"options" => (Object) [
				"autoincrement" => true
			]
		]
	]
	,"children" => [
		"adempimenti" => (Object) [
			"beanName" => "AdempimentoBean"
			,"fksMap" => (Object) [
				"ad_idargomento" => (Object) [
					"name" => "ar_id"
				]
			]
			,"flGetFirst" => false
			,"flReadOnly" => false
		]
	]
];
# AziendaArgomentoBean
$beansMaps->AziendaArgomentoBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "aziende_argomenti"
	,"sqlFieldsMap" => (Object) [
		"aa_idazienda" => (Object) [
			"name" => "aa_idazienda"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"aa_idargomento" => (Object) [
			"name" => "aa_idargomento"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"aa_idazienda" => (Object) [
			"options" => (Object) [
				"autoincrement" => false
			]
		]
		,"aa_idargomento" => (Object) [
			"options" => (Object) [
				"autoincrement" => false
			]
		]
	]
];
# AdempimentoBean
$beansMaps->AdempimentoBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "adempimenti"
	,"sqlFieldsMap" => (Object) [
		"ad_id" => (Object) [
			"name" => "ad_id"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"ad_idargomento" => (Object) [
			"name" => "ad_idargomento"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"ad_descr" => (Object) [
			"name" => "ad_descr"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"ad_note" => (Object) [
			"name" => "ad_note"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"ad_id" => (Object) [
			"options" => (Object) [
				"autoincrement" => true
			]
		]
	]
	,"children" => [
		"stati" => (Object) [
			"beanName" => "StatoBean"
			,"fksMap" => (Object) [
				"st_idadempimento" => (Object) [
					"name" => "ad_id"
				]
			]
			,"flGetFirst" => false
			,"flReadOnly" => false
		]
	]
];
# StatoBean
$beansMaps->StatoBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "stati"
	,"sqlFieldsMap" => (Object) [
		"st_id" => (Object) [
			"name" => "st_id"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"st_idadempimento" => (Object) [
			"name" => "st_idadempimento"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"st_descr" => (Object) [
			"name" => "st_descr"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"st_note" => (Object) [
			"name" => "st_note"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"st_id" => (Object) [
			"options" => (Object) [
				"autoincrement" => true
			]
		]
	]
	,"children" => [
		"sanzioni" => (Object) [
			"beanName" => "SanzioneBean"
			,"fksMap" => (Object) [
				"sa_idstato" => (Object) [
					"name" => "st_id"
				]
			]
			,"flGetFirst" => false
			,"flReadOnly" => false
		]
	]
];
# SanzioneBean
$beansMaps->SanzioneBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "sanzioni"
	,"sqlFieldsMap" => (Object) [
		"sa_id" => (Object) [
			"name" => "sa_id"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"sa_idstato" => (Object) [
			"name" => "sa_idstato"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"sa_descr" => (Object) [
			"name" => "sa_descr"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"sa_note" => (Object) [
			"name" => "sa_note"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"sa_id" => (Object) [
			"options" => (Object) [
				"autoincrement" => true
			]
		]
	]
];
# FormazioneBean
$beansMaps->FormazioneBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "formazioni"
	,"sqlFieldsMap" => (Object) [
		"fo_id" => (Object) [
			"name" => "fo_id"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"fo_descr" => (Object) [
			"name" => "fo_descr"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"fo_note" => (Object) [
			"name" => "fo_note"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"fo_ggvalidita" => (Object) [
			"name" => "fo_ggvalidita"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"fo_id" => (Object) [
			"options" => (Object) [
				"autoincrement" => true
			]
		]
	]
];
# AziendaFormazioneBean
$beansMaps->AziendaFormazioneBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "aziende_formazioni"
	,"sqlFieldsMap" => (Object) [
		"af_id" => (Object) [
			"name" => "af_id"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"af_idazienda" => (Object) [
			"name" => "af_idazienda"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"af_idformazione" => (Object) [
			"name" => "af_idformazione"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"af_data_richiesta" => (Object) [
			"name" => "af_data_richiesta"
			,"options" => (Object) [
				"type" => "date"
			]
		]
		,"af_data_evasione" => (Object) [
			"name" => "af_data_evasione"
			,"options" => (Object) [
				"type" => "date"
			]
		]
		,"af_note" => (Object) [
			"name" => "af_note"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"af_id" => (Object) [
			"options" => (Object) [
				"autoincrement" => true
			]
		]
	]
];
# DipendenteFormazioneBean
$beansMaps->DipendenteFormazioneBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "dipendenti_formazioni"
	,"sqlFieldsMap" => (Object) [
		"df_id" => (Object) [
			"name" => "df_id"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"df_iddipendente" => (Object) [
			"name" => "df_iddipendente"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"df_idformazione" => (Object) [
			"name" => "df_idformazione"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"df_data_esecuzione" => (Object) [
			"name" => "df_data_esecuzione"
			,"options" => (Object) [
				"type" => "date"
			]
		]
		,"df_data_scadenza" => (Object) [
			"name" => "df_data_scadenza"
			,"options" => (Object) [
				"type" => "date"
			]
		]
		,"df_docente" => (Object) [
			"name" => "df_docente"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"df_note" => (Object) [
			"name" => "df_note"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"df_id" => (Object) [
			"options" => (Object) [
				"autoincrement" => true
			]
		]
	]
];
# AllegatoBean
$beansMaps->AllegatoBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "allegati"
	,"sqlFieldsMap" => (Object) [
		"al_id" => (Object) [
			"name" => "al_id"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"al_descr" => (Object) [
			"name" => "al_descr"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"al_path" => (Object) [
			"name" => "al_path"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"al_type" => (Object) [
			"name" => "al_type"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"al_size" => (Object) [
			"name" => "al_size"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"al_date" => (Object) [
			"name" => "al_date"
			,"options" => (Object) [
				"type" => "date"
			]
		]
		,"al_note" => (Object) [
			"name" => "al_note"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"al_note_interne" => (Object) [
			"name" => "al_note_interne"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"blob_base64" => (Object) [
			"name" => "al_note_interne"
			,"options" => (Object) [
				"type" => "base64"
				,"path" => "al_path"
			]
		]
	]
	,"pksMap" => [
		"al_id" => (Object) [
			"options" => (Object) [
				"autoincrement" => true
			]
		]
	]
];
# AllegatoUtenteBean
$beansMaps->AllegatoUtenteBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "allegati_utenti"
	,"sqlFieldsMap" => (Object) [
		"au_idallegato" => (Object) [
			"name" => "au_idallegato"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"au_idutente" => (Object) [
			"name" => "au_idutente"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"au_idallegato" => (Object) [
			"options" => (Object) [
				"autoincrement" => false
			]
		]
		,"au_idutente" => (Object) [
			"options" => (Object) [
				"autoincrement" => false
			]
		]
	]
];
# AllegatoAziendaBean
$beansMaps->AllegatoAziendaBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "allegati_aziende"
	,"sqlFieldsMap" => (Object) [
		"aa_idallegato" => (Object) [
			"name" => "aa_idallegato"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"aa_idazienda" => (Object) [
			"name" => "aa_idazienda"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"aa_idallegato" => (Object) [
			"options" => (Object) [
				"autoincrement" => false
			]
		]
		,"aa_idazienda" => (Object) [
			"options" => (Object) [
				"autoincrement" => false
			]
		]
	]
];
# AllegatoDipendenteBean
$beansMaps->AllegatoDipendenteBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "allegati_dipendenti"
	,"sqlFieldsMap" => (Object) [
		"ad_idallegato" => (Object) [
			"name" => "ad_idallegato"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"ad_iddipendente" => (Object) [
			"name" => "ad_iddipendente"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"ad_idallegato" => (Object) [
			"options" => (Object) [
				"autoincrement" => false
			]
		]
		,"ad_iddipendente" => (Object) [
			"options" => (Object) [
				"autoincrement" => false
			]
		]
	]
];
# AllegatoCheckupBean
$beansMaps->AllegatoCheckupBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "allegati_checkups"
	,"sqlFieldsMap" => (Object) [
		"ac_idallegato" => (Object) [
			"name" => "ac_idallegato"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"ac_idcheckup" => (Object) [
			"name" => "ac_idcheckup"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"ac_idallegato" => (Object) [
			"options" => (Object) [
				"autoincrement" => false
			]
		]
		,"ac_idcheckup" => (Object) [
			"options" => (Object) [
				"autoincrement" => false
			]
		]
	]
];
# AllegatoCheckupRigaBean
$beansMaps->AllegatoCheckupRigaBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "allegati_checkups_righe"
	,"sqlFieldsMap" => (Object) [
		"acr_idallegato" => (Object) [
			"name" => "acr_idallegato"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"acr_idcheckup_riga" => (Object) [
			"name" => "acr_idcheckup_riga"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"acr_idallegato" => (Object) [
			"options" => (Object) [
				"autoincrement" => false
			]
		]
		,"acr_idcheckup_riga" => (Object) [
			"options" => (Object) [
				"autoincrement" => false
			]
		]
	]
];
# CheckupBean
$beansMaps->CheckupBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "checkups"
	,"sqlFieldsMap" => (Object) [
		"ch_id" => (Object) [
			"name" => "ch_id"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"ch_idutente" => (Object) [
			"name" => "ch_idutente"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"ch_idazienda" => (Object) [
			"name" => "ch_idazienda"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"ch_date" => (Object) [
			"name" => "ch_date"
			,"options" => (Object) [
				"type" => "date"
			]
		]
		,"ch_descr" => (Object) [
			"name" => "ch_descr"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"ch_note" => (Object) [
			"name" => "ch_note"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"ch_note_interne" => (Object) [
			"name" => "ch_note_interne"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"ch_note_utente" => (Object) [
			"name" => "ch_note_utente"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"ch_id" => (Object) [
			"options" => (Object) [
				"autoincrement" => true
			]
		]
	]
	,"children" => [
		"righe" => (Object) [
			"beanName" => "CheckupRigaBean"
			,"fksMap" => (Object) [
				"cr_idcheckup" => (Object) [
					"name" => "ch_id"
				]
			]
			,"flGetFirst" => false
			,"flReadOnly" => false
		]
	]
];
# CheckupRigaBean
$beansMaps->CheckupRigaBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "checkups_righe"
	,"sqlFieldsMap" => (Object) [
		"cr_id" => (Object) [
			"name" => "cr_id"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"cr_idcheckup" => (Object) [
			"name" => "cr_idcheckup"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"cr_idadempimento" => (Object) [
			"name" => "cr_idadempimento"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"cr_idargomento" => (Object) [
			"name" => "cr_idargomento"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"cr_idstato" => (Object) [
			"name" => "cr_idstato"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"cr_data_esecuzione" => (Object) [
			"name" => "cr_data_esecuzione"
			,"options" => (Object) [
				"type" => "date"
			]
		]
		,"cr_data_scadenza" => (Object) [
			"name" => "cr_data_scadenza"
			,"options" => (Object) [
				"type" => "date"
			]
		]
		,"cr_note" => (Object) [
			"name" => "cr_note"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"cr_note_interne" => (Object) [
			"name" => "cr_note_interne"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"cr_note_utente" => (Object) [
			"name" => "cr_note_utente"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"cr_id" => (Object) [
			"options" => (Object) [
				"autoincrement" => true
			]
		]
	]
	,"children" => [
		"sanzioni" => (Object) [
			"beanName" => "CheckupRigaSanzioneBean"
			,"fksMap" => (Object) [
				"crs_idcheckup_riga" => (Object) [
					"name" => "cr_id"
				]
			]
			,"flGetFirst" => false
			,"flReadOnly" => false
		]
		/* TODO
		,"servizi" => (Object) [
			"beanName" => "ServizioBean"
			,"fksMap" => (Object) [
				"al_id" => (Object) [
					"name" => "cr_id"
				]
			]
			,"flGetFirst" => false
			,"flReadOnly" => false
		]
		*/
	]
];
# CheckupRigaSanzioneBean
$beansMaps->CheckupRigaSanzioneBean = (Object) [
	"dbh" => $dbh
	,"sqlTableName" => "checkups_righe_sanzioni"
	,"sqlFieldsMap" => (Object) [
		"crs_id" => (Object) [
			"name" => "crs_id"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"crs_idcheckup_riga" => (Object) [
			"name" => "crs_idcheckup_riga"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"crs_idsanzione" => (Object) [
			"name" => "crs_idsanzione"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"crs_descr" => (Object) [
			"name" => "crs_descr"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"crs_note" => (Object) [
			"name" => "crs_note"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"crs_note_interne" => (Object) [
			"name" => "crs_note_interne"
			,"options" => (Object) [
				"type" => null
			]
		]
		,"crs_note_utente" => (Object) [
			"name" => "crs_note_utente"
			,"options" => (Object) [
				"type" => null
			]
		]
	]
	,"pksMap" => [
		"crs_id" => (Object) [
			"options" => (Object) [
				"autoincrement" => true
			]
		]
	]
];
# AgendaBean
$beansMaps->AgendaBean = (Object) [
    "dbh" => $dbh
    ,"sqlTableName" => "agenda"
    ,"sqlFieldsMap" => (Object) [
        "az_id" => (Object) [
            "name" => "ag_id"
            ,"options" => (Object) [
                "type" => null
            ]
        ]
        ,"ag_sopAnt" => (Object) [
            "name" => "ag_sopAnt"
            ,"options" => (Object) [
                "type" => null
            ]
        ]
        ,"ag_mono" => (Object) [
            "name" => "ag_mono"
            ,"options" => (Object) [
                "type" => null
            ]
        ]
        ,"ag_preAnt" => (Object) [
            "name" => "ag_preAnt"
            ,"options" => (Object) [
                "type" => null
            ]
        ]
        ,"ag_prePost" => (Object) [
            "name" => "ag_prePost"
            ,"options" => (Object) [
                "type" => null
            ]
        ]
        ,"ag_presAnt" => (Object) [
            "name" => "ag_presAnt"
            ,"options" => (Object) [
                "type" => null
            ]
        ]
        ,"ag_presPost" => (Object) [
            "name" => "ag_presPost"
            ,"options" => (Object) [
                "type" => null
            ]
        ]
        ,"ag_temp" => (Object) [
            "name" => "ag_temp"
            ,"options" => (Object) [
                "type" => null
            ]
        ]
        ,"ag_moto" => (Object) [
            "name" => "ag_moto"
            ,"options" => (Object) [
                "type" => null
            ]
        ]
        ,"ag_data" => (Object) [
            "name" => "ag_data"
            ,"options" => (Object) [
                "type" => null
            ]
        ]
    ]
    ,"pksMap" => [
        "ag_id" => (Object) [
            "options" => (Object) [
                "autoincrement" => true
            ]
        ]
    ]
];
?>