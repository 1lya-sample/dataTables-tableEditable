# dataTables.tableEditable v1.4.0
Plugin for dataTables by me
Depends: JQuery, DataTables, Bootstrap (Optional)

Demo: https://1lya-sample.ml/tableEditable

## 1. Installing
1. Install dependency scripts to the page
```
<!-- Datatables -->
<link href="/css/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css">
<link href="/css/buttons.bootstrap4.min.css" rel="stylesheet" type="text/css">
<link href="/css/tableEditable.css" rel="stylesheet" type="text/css">

<!-- Required datatable js -->
<script src="/js/jquery.dataTables.min.js"></script>
<script src="/js/dataTables.bootstrap4.min.js"></script>
<script src="/js/tableEditable.js"></script>
```
2. Create table (You can use any table identifier)
```
<table id="table_1">
 <thead>
  <tr>
   <th data-name="id" data-editable="0">ID</th>
   <th data-name="name">Name</th>
   <th data-name="email">Email</th>
   <th data-name="roleID" data-select="1" data-selector="selector1">Role</th>
   <th></th>
  </tr>
 </thead>
 <tbody></tbody>
</table>
```
data-name is using to sending it with the post requests, but you can remove this and th will be only decoration

data-editable is using to block editable. Use one or more on-editable th'es to identify your table entry in the ajax files

This th is required for buttons Edit and Delete, don't forget it
> <th></th>
3. Setup dataTable in variable with an endpoint for getting data in a table
```
const dataTable = $("#table_1").DataTable({
 ajax: {
  url: "get.php",
   dataSrc: ""
 },
 columnDefs: [
  {
    targets: [4],
    orderable: false,
  },
 ],
});
```
In columnDefs insert the index of your column in the table in which the buttons are provided, previously we left it empty to avoid bad sorting behind identical fields

Example PDO table get data endpoint:
```
<?php
include "connection.php";

$data = [];
$query = $db->prepare("SELECT * FROM tableEditable");
$query->execute();
$result = $query->fetchAll();
foreach($result as &$user){
	$data[] = [
		$user["id"],
		$user["name"],
		$user['email'],
		$user['roleID'],
		''
	];
}

echo json_encode($data, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);
?>
```
4. Make api for your editable table (Add, Edit, Delete endpoints) and initialize tableEditable plugin and setup endpoints

All requests are sent as POST to the endpoints you specified in the ajax object.
```
<script>
$("#table_1").tableEditable({
  ajax: {
    add: "ajax/add.php",
    edit: "ajax/edit.php",
    delete: ajax/delete.php"
  },
});
</script>
```
 
Example Add endpoint:
```
<?php
include "connection.php";

if(!empty($_POST['name']) && !empty($_POST['email'])){
	$query = $db->prepare("INSERT INTO tableEditable (name, email, roleID, registerDate) VALUES (:name, :email, :roleID, :time)");
	$query->execute([':name' => $_POST['name'], ':email' => $_POST['email'], ':roleID' => $_POST['roleID'], ':time' => time()]);
	exit(json_encode(array("success" => true)));
}
?>
```
All responses plugin perceives by {"success": *status*}. If it's not true, nothing will happen.

Example Edit endpoint:
```
<?php
include "incl/connection.php";

if(!empty($_POST['id']) && !empty($_POST['name']) && !empty($_POST['email']) && isset($_POST['roleID'])){
	$query = $db->prepare("UPDATE tableEditable SET name = :name, email = :email, roleID = :roleID WHERE id = :id");
	$query->execute([':name' => $_POST['name'], ':email' => $_POST['email'], ':roleID' => $_POST['roleID'], ':id' => $_POST['id']]);
	exit(json_encode(array("success" => true)));
}

?>
```

Example Delete endpoint:
```
<?php
include "../../incl/connection.php";

if(!empty($_POST['id'])){
	$query = $db->prepare("DELETE FROM tableEditable WHERE id = :id");
	$query->execute([':id' => $_POST['id']]);
	exit(json_encode(array("success" => true)));
}
?>
```

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

### Options
You can turn off, and turn on some options on plugin.
```
options: {
  add: false
},
```

### Strings
All strings you can change in the tableEditable.js, but I also added the ability to change the string that is displayed in the 'confirm' window when you click the delete button in the table. Just add this to the plugin options:
```
strings: {
  confirm: "Your string"
},
```

Thank you for using plugin! :3
