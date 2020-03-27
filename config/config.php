<?php

/**
 * 0 = DEV
 * 1 = TEST
 * 2 = DEMO
 * 3 = PROD
 */
$fl_prod = 0;

# DEV
# URL
$url						= "http://127.0.0.1/RidingSchool/";
# DB
$db_host					= "127.0.0.1";
$db_name					= "ridingschool";
$db_user					= "root";
$db_pass					= "";
# DB gestionale
$db_host_gestionale			= "192.168.50.224\SQL2014";
$db_user_gestionale			= "sa";
$db_pass_gestionale			= "Busine55";
$db_name_gestionale			= "ubmanagement";
# SESSION
$session_logged				= "ubmanagement_user";
# TIMEZONE
echo date_default_timezone_set("UTC") ? "" : "timezone_identifier is not valid.<br/>\n";
# SMTP
$smtp_Host					= "authsmtp.ubware.it";	// SMTP server example
$smtp_SMTPDebug				= 2;					// enables SMTP debug information (for testing)
$smtp_SMTPAuth				= true;					// enable SMTP authentication
$smtp_Port					= 25;					// set the SMTP port for the GMAIL server
$smtp_Username				= "smtp@ubware.it";
$smtp_Password				= "UBW-smtp";
# FTP
$ftp_host					= "192.168.50.224";
$ftp_user					= "ubware";
$ftp_pass					= "ubware";
# stampantina etichette
$socket_host				= "xxx.xxx.xxx.xxx";
$socket_port				= "xxx";
# PDFShift
$pdfshift_api_key = "7063a4545d524ba49eefdb9237705625";


if ($fl_prod == 1) { # TEST
	# URL
	$url					= "https://test.ubware.it/ubmanagement_confartigianato/";
	# DB
	$db_host				= "localhost";
	$db_name				= "ubmanagement_confartigianato";
	$db_user				= "root";
	$db_pass				= "Ubw,2011";
	# DB gestionale
	$db_host_gestionale		= "xxx.xxx.xxx.xxx";
	$db_user_gestionale		= "xxx";
	$db_pass_gestionale		= "xxx";
	$db_name_gestionale		= "xxx";
} else if ($fl_prod == 2) { # DEMO
	# URL
	$url =					"https://demo.ubware.it/ubmanagement_confartigianato/";
	# DB
	$db_host				= "xxx";
	$db_name				= "xxx";
	$db_user				= "xxx";
	$db_pass				= "xxx";
	# DB gestionale
	$db_host_gestionale		= "xxx.xxx.xxx.xxx";
	$db_user_gestionale		= "xxx";
	$db_pass_gestionale		= "xxx";
	$db_name_gestionale		= "xxx";
} else if ($fl_prod == 3) { # PROD
	# URL
	$url =					"https://www.teamracinglf.cloud/";
	# DB
	$db_host				= "89.46.111.108";
	$db_name				= "Sql1344355_2";
	$db_user				= "Sql1344355";
	$db_pass				= "m6477r3814";
	# DB gestionale
	$db_host_gestionale		= "xxx.xxx.xxx.xxx";
	$db_user_gestionale		= "xxx";
	$db_pass_gestionale		= "xxx";
	$db_name_gestionale		= "xxx";
}

$dbh = null;
try {
	# $dbh = new PDO("dblib:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
	# $dbh = new PDO("sqlsrv:Server=$db_host;Database=$db_name", "$db_user", "$db_pass");
	$dbh = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass, [PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"]);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$dbh->setAttribute(PDO::ATTR_ORACLE_NULLS, PDO::NULL_NATURAL);
} catch (PDOException $e) {
	echo "dbh -> " . $e->getMessage() . ".<br/>\n";
}

$dbh_gestionale = null;
try {
	/*
	$dbh_gestionale = new PDO("dblib:host=$db_host_gestionale;dbname=$db_name_gestionale;charset=utf8", $db_user_gestionale, $db_pass_gestionale);
	# $dbh_gestionale = new PDO("sqlsrv:Server=$db_host_gestionale;Database=$db_name_gestionale", "$db_user_gestionale", "$db_pass_gestionale");
	# $dbh_gestionale = new PDO("mysql:host=$db_host_gestionale;dbname=$db_name_gestionale", $db_user_gestionale, $db_pass_gestionale, [PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"]);
	$dbh_gestionale->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$dbh_gestionale->setAttribute(PDO::ATTR_ORACLE_NULLS, PDO::NULL_NATURAL);
	*/
} catch (PDOException $e) {
	echo "dbh_gestionale -> " . $e->getMessage() . ".<br/>\n";
}

if (session_status() == PHP_SESSION_NONE) {
	session_start();
}
?>