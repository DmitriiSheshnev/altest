<?
use Bitrix\Main\Loader; 
Loader::includeModule("highloadblock"); 
use Bitrix\Highloadblock as HL; 
use Bitrix\Main\Entity;
class hghloadAjax{
    private $data;
    private $hlblock;
    private $entity_data_class;
    private $session;
    
    public function __construct($data){
        $this->session = \Bitrix\Main\Application::getInstance()->getSession();
        $this->data = $data;
        $this->hlblock = $data['HLBLOCK'];
        $this->entity_data_class;
    }
    
    private function hlStart(){
        $hlblock = HL\HighloadBlockTable::getById($this->hlblock)->fetch();
        $entity = HL\HighloadBlockTable::compileEntity($hlblock); 
        $this->entity_data_class = $entity->getDataClass();
    }
    
    public function actionStart(){
        $this->hlStart();
        $rsData = $this->entity_data_class::getList(
            array(
                "select" => array("UF_XML_ID"), 
                "filter" => array("UF_XML_ID"=>$data['UF_XML_ID'])
            )
        );
        if($arData = $rsData->Fetch()){
            if($arData['UF_XML_ID'] && $arData['UF_XML_ID'] !== '')
                return false;
        }
        
        if($this->data['UF_DATE']) $this->data['UF_DATE'] = CDataBase::FormatDate($this->data['UF_DATE'], "Y-m-d H:i:s", "d.m.Y H:i:s");
        $objDateTime = new DateTime();
        $this->data['UF_DATE'] = $objDateTime->format("d.m.Y H:i:s");
        $this->data['UF_SESSION'] = $this->session->get('BX_SESSION_SIGN');
        $result = $this->entity_data_class::add($this->data);
        if($result->getId())
            $this->session->set('BX_VIZIT', $result->getId());
        else
            return false;
        $this->session->set('BX_VIZIT_NUM', $this->data['UF_XML_ID']);
        return $result->getId();
        
    }
    
    public function actionUpdate(){
        if($this->session->get('BX_VIZIT')){
            $this->hlStart();
            $resUpdate = $this->entity_data_class::update($this->session->get('BX_VIZIT'), $this->data);
            //echo '<pre>';print_r($resUpdate);echo '</pre>';
            return $resUpdate;
        }
    }
    
}