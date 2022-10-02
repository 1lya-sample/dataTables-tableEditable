(function($) {

	$.fn.tableEditable = function(options) {
		var add = options.ajax.add;
		var edit = options.ajax.edit;
		var del = options.ajax.delete;
		
		var delconfirm = 'Are you sure?';
		if(options.strings){
			if(options.strings.confirm){
				delconfirm = options.strings.confirm;
			}
		}
		
		var dataTable = $(this).DataTable();
		var elem = '#' + $(this)[0].id;
		var filter = elem + "_filter";
		$(filter).append('<a class="btn" id="add">+</a>');
		
		function update() {
			$(elem +' > thead  > tr > th').each(function(index, th) {
				if($(this).data("select") == true){
					var selector = options.json[$(this).data('selector')];
					var trs = $(elem +' > tbody').find('tr');
					$.each(trs, function(){
						var tds = $(this).children('td');
						$.each(tds, function(){
							var cellindex = $(this).parent().children().index($(this));
							if(index == cellindex){
								var id = $(this).text();
								var td = $(this);
								selector.forEach(function(obj){
									if(obj.id == id){
										$(td).html(obj.name);
									}
								});
							}
						});
					});
				}
			});
		}
		
		$(this).on('init.dt', update);
		
		$(this).on('click', '#edit', function(){
			$(this).attr("id", "save");
			
			var tds = $(this).closest("tr").find('td').not(':last');
			$.each(tds, function(){
				var cellindex = $(this).parent().children().index($(this));
				var editable = true;
				var select = false;
				$(elem +' > thead  > tr > th').each(function(index, th) { 
					if(index == cellindex){
						if($(this).data("editable") == false){
							editable = false;
						}
						if($(this).data("select") == true){
							select = true;
						}
					}
				});
				
				var val = $(this).html();
				if(editable){
					if(select){
						var input = "<select class='form-control'>";
						var selector = options.json.selector1;
						selector.forEach(function(obj){
							var selected = "";
							if(obj.name == val){
								selected = "selected";
							}
							input += "<option value='" + obj.id + "'" + selected + ">" + obj.name + "</option>";
						});
						input += "</select>";
					}else{
						var input = "<input type='text' name='name' class='form-control' value='"+val+"'>";
					}
				}else{
					var input = "<input type='text' class='form-control' value='"+val+"' readonly>";
				}
				$(this).html(input);
			});
			
			$(this).html('<i class="fa fa-check"></i>');
		});
		$(this).on('click', '#save', function(){
			var tr = $(this).closest('tr');
			var tds = $(tr).find('td').not(':last');
			
			var array = {};
		  
			$.each(tds, function(){
				if(!$(this).children().is("select")){
					var input = $(this).children().val();
					var value = input;
				}else{
					var input = $(this).children().find(":selected").text();
					var value = $(this).children().find(":selected").val();
				}
				$(this).html(input);
				var cellindex = $(this).parent().children().index($(this));
				$(elem + ' > thead  > tr > th').each(function(index, th) { 
					if(index == cellindex && $(this).data("name")){
						array[$(this).data("name")] = value;
					}
				});
			});
			
			var dataString = "&data=" + encodeURIComponent(JSON.stringify(array));

			$.ajax({
				type: 'POST',
				url: edit,
				data: dataString,
				dataType: 'json',
				success: function(response){
					value = response.success;
					if(value == true){
						dataTable.ajax.reload(function(){ 
							update();
						});
					}
				}
			});
			$(this).attr("id", "edit");
			$(this).html('<i class="fa fa-edit"></i>');
		});
		$(this).on('click', '#delete', function(){
			if (confirm(delconfirm) == true) {
				var tr = $(this).closest('tr');
				var tds = $(tr).find('td').not(':last');
				
				var array = {};
			  
				$.each(tds, function(){
					var value = $(this).text();
					var cellindex = $(this).parent().children().index($(this));
					$(elem + ' > thead  > tr > th').each(function(index, th) {
						if(index == cellindex && $(this).data("name")){
							array[$(this).data("name")] = value;
						}
					});
				});

				var dataString = "&data=" + encodeURIComponent(JSON.stringify(array));
				$.ajax({
					type: 'POST',
					url: del,
					data: dataString,
					dataType: 'json',
					success: function(response){
						value = response.success;
						if(value == true){
							tr.remove();
							dataTable.ajax.reload(function(){ 
								update();
							});
						}
					}
				});
			}
		});
		$('#add').click(function() { 
			var table = $('#table_1');
			
			var body = '<tr>';
			
			$(elem + ' > thead  > tr > th').not(':last').each(function(index, th) {
				body += "<td>";
				if($(this).data("editable") == 0){
					body += "<input type='text' class='form-control' value='' readonly>";
				}else{
					body += "<input type='text' name='name' class='form-control' value=''>";
				}
				body += "</td>"
			});
			body += '<td><a class="btn" id="save_new"><i class="fa fa-check"></i></a> <a class="btn" id="delete_new"><i class="fa fa-trash"></i></a></td>'
			body += '</tr>';
		
			table.prepend($(body));
		});
		$(this).on('click', '#save_new', function() {
			var tr = $(this).closest('tr');
			var tds = $(tr).find('td').not(':last');
			
			var array = {};
		  
			$.each(tds, function(){
				if(!$(this).children().is("select")){
					var input = $(this).children().val();
					var value = input;
				}else{
					var input = $(this).children().find(":selected").text();
					var value = $(this).children().find(":selected").val();
				}
				$(this).html(input);
				var cellindex = $(this).parent().children().index($(this));
				$('#table_1 > thead  > tr > th').each(function(index, th) { 
					if(index == cellindex && $(this).data("name")){
						array[$(this).data("name")] = value;
					}
				});
			});
			
			var dataString = "&data=" + encodeURIComponent(JSON.stringify(array));

			$.ajax({
				type: 'POST',
				url: add,
				data: dataString,
				dataType: 'json',
				success: function(response){
					value = response.success;
					if(value == true){
						dataTable.ajax.reload(function(){ 
							update();
						});
					}
				}
			});
			$(this).attr("id", "edit");
			$(this).html('<i class="fa fa-edit"></i>');
		});
		$(this).on('click', '#delete_new', function() {
			var tr = $(this).closest('tr');
			tr.remove();
		});
	}
}(jQuery));
