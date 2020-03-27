<?php
function cron($path, $user) {
	$response = (Object) [
		"status" => false
		,"response" => "init"
	];

	$user = $user ? " -u $user" : "";
	try {
		$shell_exec = shell_exec("crontab$user -r");
		echo "crontab$user -r\n";
		if ($path) {
			$shell_exec = shell_exec("crontab$user $path");
			echo "crontab$user $path\n";
		}
		$shell_exec = shell_exec("crontab$user -l");
		echo "crontab$user -l\n";
		$response->response = $shell_exec;
		$response->status = true;
	} catch (Exception $e) {
		$response->response = $e->getMessage();
	}
	
	return $response;
}
?>