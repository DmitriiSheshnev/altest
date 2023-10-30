class SessionSetInfo {
	constructor() {
		sbjs.init({
			promocode: {
				min: 1000000, 
				max: 9999999
			}
		});
		this.allInfo = sbjs.get;
		this.parseUrl = {};
		this.sendData = {};
		if(this.allInfo.promo.code){
			$('#session-info-num').text(this.allInfo.promo.code);
			if($('input').is('[name="SESSION_CODE"]')){
				var codeSet = this.allInfo.promo.code;
				$('input[name="SESSION_CODE"]').each(function(){
					$(this).val(codeSet);
				})
			}
		}
		this.getUrlVars();
	}
	request(dataSend){
		$.ajax({
			type: "POST",
			url: "/ajax/user_session.php",
			data: {dataSend},
			success: function(data){
				console.log(data);
			}
		})
	}
	getUrlVars(){
		if(this.allInfo.first_add.ep != ''){
			var firstUrl = this.allInfo.first_add.ep,
				hashes = firstUrl.slice(firstUrl.indexOf('?') + 1).split('&'),
				_this = this;
			
			$.each(hashes, function(i,v){
				var arrKeyVal = v.split('=');
				if(arrKeyVal.length == 2 && $.isArray(arrKeyVal)){
					_this.parseUrl[arrKeyVal[0]] = arrKeyVal[1];
				}
			})
			this.parseUrl = _this.parseUrl;
		}
	}
	startAll(){
		if(this.allInfo.session.pgs == 1){
			var typePer = '';
			
			if(this.allInfo.current.src == "yandex_direct")
				typePer = '10';
			else if(this.allInfo.current.src == "(direct)")
				typePer = '11';
			else
				typePer = '12';
			
			var splitContent = this.allInfo.first.cnt.split('_');
			this.sendData = {
				'UF_DATE' : this.allInfo.first_add.fd,
				'UF_STARTPAGE' : this.allInfo.first_add.ep,
				'UF_REFER' : this.allInfo.first_add.rf,
				'UF_XML_ID' : this.allInfo.promo.code,
				'UF_UAG' : this.allInfo.udata.uag,
				'UF_UIP' : this.allInfo.udata.uip,
				'UF_VST' : this.allInfo.udata.vst,
				'UF_UTM_SOURCE' : this.allInfo.current.src,
				'UF_UTM_MEDIUM' : this.allInfo.current.mdm,
				'UF_UTM_CAMPAIGN' : this.allInfo.current.cmp,
				'UF_UTM_TERM' : this.allInfo.current.trm,
				'UF_TYPE' : typePer,
				'UF_STRINGINFO' : JSON.stringify(this.allInfo),
				'UF_UTM_CONTENT' : this.allInfo.current.cnt,
				'UF_UTM_CONTENT_GBID' : splitContent[0] ? splitContent[0] : '',
				'UF_UTM_CONTENT_BANNER_ID' : splitContent[1] ? splitContent[1] : '',
				'UF_UTM_CONTENT_PHRASE_ID' : splitContent[2] ? splitContent[2] : '',
				'UF_UTM_CONTENT_RETARGETING_ID' : splitContent[3] ? splitContent[3] : '',
				'UF_UTM_CONTENT_ADDPHRASES' : splitContent[4] ? splitContent[4] : '',
				'UF_UTM_CONTENT_DEVICE_TYPE' : splitContent[5] ? splitContent[5] : '',
				'UF_UTM_CONTENT_POSITION_TYPE' : splitContent[6] ? splitContent[6] : '',
				'UF_UTM_CONTENT_REGION_ID' : splitContent[7] ? splitContent[7] : '',
				'ACTION' : 'START',
				'UF_CTX' : this.parseUrl['ctx']
			}
		}else{
			this.sendData = {
				'UF_COUNTLIST' : this.allInfo.session.pgs,
				'UF_LASTPAGE' : this.allInfo.session.cpg,
				'UF_STRINGINFO' : JSON.stringify(this.allInfo),
				'ACTION' : 'UPDATE',
			}
		}
		var this_ = this;
		if(typeof ym != undefined){
			ym(1021532, 'getClientID', function(clientID) {
				this_.sendData['UF_YA_USER_ID'] = clientID;
				this_.sendData['HLBLOCK'] = '14';
				this_.request(this_.sendData);
				return;
			});
		}else{
			this.sendData['HLBLOCK'] = '14';
			this.request(this.sendData);
		}
	}
	sendEvent(event){
		
	}
}

var sessionInfo = new SessionSetInfo();
$(document).ready(function(){
	sessionInfo.startAll();
});



/*
first.typ
UF_UTM_SOURCE : this.allInfo.first.src
UF_UTM_MEDIUM : this.allInfo.first.mdm
UF_UTM_CAMPAIGN : this.allInfo.first.cmp
UF_UTM_CONTENT : this.allInfo.first.cnt
UF_UTM_TERM : this.allInfo.first.trm


{
  "current": {
    "typ": "referral",
    "src": "go.mail.ru",
    "mdm": "referral",
    "cmp": "(none)",
    "cnt": "/",
    "trm": "(none)"
  },
  "current_add": {
    "fd": "2022-04-20 16:01:10",
    "ep": "https://www.textiletorg.ru/",
    "rf": "https://go.mail.ru/"
  },
  "first": {
    "typ": "referral",
    "src": "go.mail.ru",
    "mdm": "referral",
    "cmp": "(none)",
    "cnt": "/",
    "trm": "(none)"
  },
  "first_add": {
    "fd": "2022-04-20 16:01:10",
    "ep": "https://www.textiletorg.ru/",
    "rf": "https://go.mail.ru/"
  },
  "session": {
    "pgs": "34",
    "cpg": "https://www.textiletorg.ru/catalog/vse-dlya-shitya/shveynye-mashiny/shveynaya-mashina-janome-7524a.html"
  },
  "udata": {
    "vst": "1",
    "uip": "(none)",
    "uag": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36"
  },
  "promo": {
    "code": "4009476"
  }
}

*/