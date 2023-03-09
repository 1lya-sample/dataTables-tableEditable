(function($) {

	$.fn.tableEditable = function(options) {
		const table = this;
		var dataTable = table.DataTable();

		table.on('init.dt', function (){
			if(options.options.add != false){
				table.closest('.dataTables_wrapper').find('.dataTables_filter').append(options.buttons.add);
			}
			
			update();
		});
		
		function update() {
			$.each(table.find('tbody tr'), function(){
				if(dataTable.data().any()){
					$(this).children('td:last').html(options.buttons.default);
				}
			});
			$.each(table.find('thead tr th').not(':last'), function(index, th) {
				if($(this).data("select") == true){
					var selector = options.json[$(this).data('selector')];
					$.each(table.find('tbody tr'), function(){
						$.each($(this).children('td'), function(){
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
		
		table.on('click', '#edit', function(){
			$(this).attr("id", "save");

			$.each($(this).closest('tr').find('td').not(':last'), function(){
				var cellindex = $(this).parent().children().index($(this));
				var editable = true;
				var select = false;
				var selector = '';
				$.each(table.find('thead tr th').not(':last'), function(index, th) {
					if(index == cellindex){
						if($(this).data("editable") == false){
							editable = false;
						}
						
						if($(this).data("select") == true){
							select = true;
							selector = options.json[$(this).data('selector')];
						}
					}
				});
				
				var input = '';
				var val = $(this).html();
				if(editable == true){
					if(select == true){
						input = "<select class='form-control'>";
						selector.forEach(function(obj){
							var selected = "";
							if(obj.name == val){
								selected = "selected";
							}
							input += "<option value='" + obj.id + "'" + selected + ">" + obj.name + "</option>";
						});
						input += "</select>";
					}else{
						input = "<input type='text' name='name' class='form-control' value='"+val+"'>";
					}
				}else{
					input = "<input type='text' class='form-control' value='"+val+"' readonly>";
				}
				$(this).html(input);
			});
			
			$(this).closest('td').html(options.buttons.editing);
		});
		
		table.on('click', '#save', function(){
			var formData = new FormData();
			$.each($(this).closest('tr').find('td').not(':last'), function(){
				if(!$(this).children().is("select")){
					var input = $(this).children().val();
					var value = input;
				}else{
					var input = $(this).children().find(":selected").text();
					var value = $(this).children().find(":selected").val();
				}
				
				$(this).html(input);
				var cellindex = $(this).parent().children().index($(this));
				$.each(table.find('thead tr th').not(':last'), function(index, th) {
					if(index == cellindex && $(this).data("name")){
						formData.append($(this).data("name"), value);
					}
				});
			});
			
			$.ajax({
				type: 'POST',
				url: options.ajax.edit,
				data: formData,
				dataType: 'json',
				processData: false,
				contentType: false,
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
			$(this).closest('td').html(options.buttons.default);
		});
		table.on('click', '#delete', function(){
			var confirm_delete = options.strings && options.strings.confirm != '' ? options.strings.confirm : 'Are you sure?';
			
			var tr = $(this).closest('tr');
			if (confirm(confirm_delete) == true) {				
				var formData = new FormData();
				$.each(tr.find('td').not(':last'), function(){
					var value = $(this).text();
					var cellindex = $(this).parent().children().index($(this));
					$.each(table.find('thead tr th').not(':last'), function(index, th) {
						if(index == cellindex && $(this).data("name")){
							formData.append($(this).data("name"), value);
						}
					});
				});
				
				$.ajax({
					type: 'POST',
					url: options.ajax.delete,
					data: formData,
					dataType: 'json',
					processData: false,
					contentType: false,
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
		
		table.closest('.dataTables_wrapper').on('click', '#add', function(){
			var tr = '<tr>';
			
			$.each(table.find('thead tr th').not(':last'), function(index, th) {
				tr += "<td>";
				var editable = $(this).data("editable") == false ? false : true;
				var select = $(this).data("select") == true ? true : false;

				if(editable == true){
					if(select == true){
						tr += "<select class='form-control'>";
						var selector = options.json[$(this).data('selector')];
						selector.forEach(function(obj){
							tr += "<option value='" + obj.id + "'>" + obj.name + "</option>";
						});
						tr += "</select>";
					}else{
						tr += "<input type='text' name='name' class='form-control' value=''>";
					}
				}else{
					tr += "<input type='text' class='form-control' value='' readonly>";
				}
				tr += "</td>"
			});
			tr += '<td>'+options.buttons.adding+'</td></tr>';
		
			table.prepend(tr);
		});
		$(this).on('click', '#save_new', function() {
			var formData = new FormData();
			$.each($(this).closest('tr').find('td').not(':last'), function(){
				if(!$(this).children().is("select")){
					var input = $(this).children().val();
					var value = input;
				}else{
					var input = $(this).children().find(":selected").text();
					var value = $(this).children().find(":selected").val();
				}
				
				$(this).html(input);
				var cellindex = $(this).parent().children().index($(this));
				$.each(table.find('thead tr th').not(':last'), function(index, th) {
					if(index == cellindex && $(this).data("name")){
						formData.append($(this).data("name"), value);
					}
				});
			});
			
			$.ajax({
				type: 'POST',
				url: options.ajax.add,
				data: formData,
				dataType: 'json',
				processData: false,
				contentType: false,
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
			$(this).closest('td').html(options.buttons.default);
		});

		table.on('click', '#delete_new', function() {
			$(this).closest('tr').remove();
		});
	}
}(jQuery));
