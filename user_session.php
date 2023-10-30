 <?
define("NO_KEEP_STATISTIC", true);
define("NO_AGENT_CHECK", true);
define('PUBLIC_AJAX_MODE', true);
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");

use Bitrix\Main\Loader; 
Loader::includeModule("highloadblock"); 
use Bitrix\Highloadblock as HL; 
use Bitrix\Main\Entity;

if($_POST['dataSend']){
	$hlEnetyOut = new hghloadAjax($_POST['dataSend']);
	if($_POST['dataSend']['ACTION']){
		switch($_POST['dataSend']['ACTION']){
			case 'START':
				echo $hlEnetyOut->actionStart(); 
				break;
			case 'UPDATE':
				$hlEnetyOut->actionUpdate();
				echo '1';
				break;
		}
	}
}
die();