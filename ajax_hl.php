 <?
define("NO_KEEP_STATISTIC", true);
define("NO_AGENT_CHECK", true);
define('PUBLIC_AJAX_MODE', true);
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");



if($_POST){
	$hlEnety = new hghloadAjax($_POST);
	if($_POST['ACTION']){
		switch($_POST['ACTION']){
			case 'GET_EXCEL':
				echo $hlEnety->getExcel(); 
				break;
			case 'GET_INFO':
				$hlEnety->falg = true;
				echo $hlEnety->getInfo();
				break;
			case 'REMOVE':
				echo $hlEnety->removeElem();
				break;
		}
	}
}

die();