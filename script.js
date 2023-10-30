$(document).ready(function(){
	var sesInfoList = new SessionShowInfoList();
})

class SessionShowInfoList {
	constructor() {
		var this_ = this;
		$('body').on('click', '.btn-action', function(){
			$(this).addClass('ajax-load');
			var action = $(this).attr('action');
			switch (action) {
				case 'clear':
					this_.clearFilter();
					break;
				case 'filter':
					$('form.filter-hl-form').submit();
					break;
				case 'excel':
					this_.getExcel($(this));
					break;
				case 'getinfo':
					this_.getInfo($(this));
					break;
				case 'openshore':
					this_.openShore($(this));
					break;
				case 'remove':
					this_.removeElem($(this));
					break;
				case 'closefancy':
					//console.log('123');
					$.fancybox.close(true);
					break;
			}
		});
		this.sendData = this.getFormData($('form.filter-hl-form'));
	}
	openShore(elem){
		var dataIblock = elem.attr('data-iblock'),
			dataId = elem.attr('data-id'),
			dataElemName = elem.attr('data-elemname');
		var data = '<div class="detail-list-info shore"><div class="align">';
				data +='<p class="title">Вы уверены что хотите удалить элемент <span>'+dataElemName+'</span>?</p>';
				data +='<div class="btns-row">';
					data +='<a data-iblock="'+dataIblock+'" data-id="'+dataId+'" action="remove" class="btn btn-1 btn-action">Да</a>';
					data +='<a action="closefancy" class="btn btn-2 btn-action">Нет</a>';
				data +='</div>';
			data += '</div>';
		this.fancyopen(data,elem);
	}
	fancyopen(data, elem){
		$.fancybox.open(data, {
			fitToView: false,
			autoSize: false,
			closeClick: false,
			openEffect: 'none',
			closeEffect: 'none',
			afterShow: function(){
				elem.removeClass('ajax-load');
			}
		});
	}
	removeElem(elem){
		var sendExel = {};
			sendExel['HLBLOCK'] = elem.attr('data-iblock');
			sendExel['ID'] = elem.attr('data-id');
			sendExel['ACTION'] = 'REMOVE';
		var reqFunction = function(data){
			//console.log(data);
			if(data){
				location.reload();
			}else{
				var dataNone = '<div class="detail-list-info shore"><div class="align">';
						dataNone +='<p class="title">Ошибка при удалении. Попробуйте ещё раз.</p>';
					dataNone += '</div>';
				this.fancyopen(dataNone,elem);
			}
		}
		this.request(sendExel,reqFunction);
	}
	getInfo(elem){
		var sendExel = {},
			this_ = this;
			sendExel['HLBLOCK'] = elem.attr('data-iblock');
			sendExel['ID'] = elem.attr('data-id');
			sendExel['ACTION'] = 'GET_INFO';
		var reqFunction = function(data){
			this_.fancyopen(data,elem);
			elem.removeClass('ajax-load');
		}
		
		this.request(sendExel,reqFunction);
	}
	getExcel(elem){
		var sendExel = {};
			sendExel['ALL_FILEDS'] = allFileds;
			sendExel['FILTER'] = this.sendData;
			sendExel['HLBLOCK'] = elem.attr('dadata-iblock');
			sendExel['ACTION'] = 'GET_EXCEL';
		var reqFunction = function(data){
			elem.removeClass('ajax-load');
		}
		this.requestFile(sendExel, reqFunction);
	}
	clearFilter(){
		$('form.filter-hl-form').find('input').each(function(){
			$(this).val('');
		});
		$('form.filter-hl-form').submit();
	}
	requestFile(dataSend, func){
		$.ajax({
			type: "POST",
			url: "/ajax/ajax_hl.php",
			data: dataSend,
			success: function(data) {
				if(data !== false){
					//console.log(data);
					var link = document.createElement('a');
					link.setAttribute('href', data);
					link.setAttribute('traget', '_blank');
					link.click();
					link.remove();
					func(data);
				}
			}
		})
	}
	request(dataSend, func){
		$.ajax({
			type: "POST",
			url: "/ajax/ajax_hl.php",
			data: dataSend,
			success: function(data) {
				func(data);
			}
		})
	}	
	getFormData($form){
		var unindexed_array = $form.serializeArray();
		var indexed_array = {};
		$.map(unindexed_array, function(n, i){
			indexed_array[n['name']] = n['value'];
		});
		return indexed_array;
	}
}
