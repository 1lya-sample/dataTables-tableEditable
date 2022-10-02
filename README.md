# tableEditable v1.3 dataTables
Plugin for dataTables - tableEditable by me

## 1. Installing
1. Download dataTables lib and install a dataTable in var with ajax getting data
```
var dataTable = $("#table_1").DataTable({
  ajax: {
    url: "get.php",
    dataSrc: ""
  },
});
```
2. Modify your table's thead:
```
<th data-name="id" data-editable="0">ID</th>
<th data-name="name">Name</th>
<th data-name="email">Email</th>
```
data-name is using to sending it with the post requests, but you can remove this and th will be only decoration

data-editable of course, using to block editable. Use one or more on-editable th'es to identify your table entry in the ajax files

Also add this to end of thead:
```
<th></th>
```
3. Create file that can pass data to dataTable. In last array string add:
```
<a class='btn' id='edit'><i class='fa fa-edit'></i></a> <a class='btn' id='delete'><i class='fa fa-trash'></i></a>
```
For example with PDO:
```
<?php
include "connection.php";
$data = array();
$query = $db->prepare("SELECT * FROM users");
$query->execute();
$result = $query->fetchAll();
foreach($result as &$user){
	$data[] = array($user["id"], $user['name'], $user['email'], "<a class='btn' id='edit'><i class='fa fa-edit'></i></a> <a class='btn' id='delete'><i class='fa fa-trash'></i></a>");
}
echo json_encode($data, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);
?>
```
2. Download tableEditable plugin and set scripts after jquery's && dataTable's links
```
<!-- Datatables -->
<link href="tableEditable.css" rel="stylesheet" type="text/css">
<script src="tableEditable.js"></script>
```
3. Initialize tableEditable plugin and setup path to ajax. After taking actions in the table using the plugin, all relevant POST requests will be sent there
```
<script>
$("#table_1").tableEditable({
  ajax: {
    add: "add.php",
    edit: "edit.php",
    delete: delete.php"
  },
});
</script>
```
4. Create that files. For example file edit.php:
```
<?php
include "connection.php";
if(!empty($_POST['data'])){
	$data = json_decode($_POST['data'],true);
	if(!empty($data['id']) && !empty($data['login']) && isset($data['roleID'])){
		$query = $db->prepare("UPDATE users SET name = :name, email = :email WHERE id = :id");
		$query->execute([':name' => $data['name'], ':email' => $data['email'], ':id' => $data['id']]);
		echo json_encode(array("success" => true));
	}
}
?>
```
The plugin sends to $_POST['data'] all the data specified in the table. This was done to avoid ajax conflicts with special characters like "&", "+", etc.

All responses plugin tableEditable perceives by {"success": *status*}. If it's not *true*, nothing will happen.

5. Also you can block ordering by last column with buttons, but this doesn't affect the operation of the plugin, only visually.

Add in tableEditable({}) this after ajax string:
```
columnDefs: [
  {
    targets: [3],
    orderable: false,
  },
],
```
where 3 may be your count column number starting from 0. If you specify a number that is greater than the number of columns of the table, it will not work (in my experience).
## 2. Custom
Since the plugin is open source, you can change anything in it if you understand javascript of course. I just made a start model of what you might need.

### If you wan't selectors in table
For example, I will add a roles to a table. I also want to note, when you add or remove any columns in the table, then delete them in ajax files too, so that everything works properly. There is nothing difficult in this.

Role values must be passed through get.php. Now let's do the necessary steps for the selector to work. Add Add required values to th in thead of table:
```
<th data-name="roleID" data-select="1" data-selector="selector1">Role</th>
```
Here we set data-select="1" so that the plugin understands that it works with the selector, and also set data-selector="select1", which we will configure in the plugin options that we already set earlier. You can use any name. Add in tableEditable({}) this:
```
json: {
  selector1: [
    {
      id: 0, 
      name: "User"
    },
    {
      id: 1, 
      name: "Moder"
    },
    {
      id: 2,
      name: "Admin"
    }
  ]
}
```
You can add entries, change the id and name as you like, the main thing is that the two keys id and name remain. Selector1 - it's name that you indicated in thead. Id 
should equal what values you pass through get.php to dataTable, cause the plugin, when it is launched, substitutes the names that we just indicated into the table.

### Strings
All strings you can change in the tableEditable.js, but I also added the ability to change the string that is displayed in the 'confirm' window when you click the delete button in the table. Just add this to the plugin options:
```
strings: {
  confirm: "Your string"
},
```

Thank you for using plugin! :3
