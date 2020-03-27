let http_https = "";
let subdomain = "";
let url = window.location.href.split("?")[0];
if (url.indexOf("https://") === 0) {
	http_https = "https://";
} else if (url.indexOf("http://") === 0) {
	http_https = "http://";
}
if (url.indexOf(http_https + "www.") === 0) {
	subdomain = "www.";
}

http_https	= http_https	? http_https	: "http://";
subdomain	= subdomain		? subdomain		: "";

url = "http://127.0.0.1/RidingSchool/";	//DEV
//url = "test.ubware.it/ubmanagement/";								//TEST
//url = "show.ubware.it/ubmanagement/";								//DEMO
//url = "https://www.teamracinglf.cloud/RidingSchool/";								//PROD
//url = "www.teamracinglf.cloud/RidingSchool/";							//PROD DNS

//url = http_https + subdomain + url;

let statusbar_backgroundcolor = "#ff0000";

let utenti_chiavi = undefined; // true | false | undefined	// usato nel login

let moduli = {
	scadenziario: true
	,allegati: true
	,report: true
	,gestione: true
};