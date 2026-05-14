<?php
session_start();
require("../config/db.php");

if ($_SESSION['ruolo'] != 'admin') {
    header("Location: ../index.php");
    exit();
}

$sql = "SELECT * FROM manga";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Gestione Manga</title>
    <link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body>

<div class="admin-header">
    <h1>📚 Gestione Manga</h1>
</div>

<div class="admin-container">

<a class="admin-btn" href="manga_add.php">➕ Aggiungi Manga</a>
<a class="admin-btn" href="dashboard.php">← Torna indietro</a>

<table class="admin-table">

<tr>
    <th>ID</th>
    <th>Titolo</th>
    <th>Azioni</th>
</tr>

<?php while($row = $result->fetch_assoc()): ?>
<tr>
    <td><?php echo $row['id']; ?></td>
    <td><?php echo $row['titolo']; ?></td>
    <td>
        <a class="action-link" href="manga_edit.php?id=<?php echo $row['id']; ?>">✏️ Modifica</a>
        <a class="action-link" href="manga_delete.php?id=<?php echo $row['id']; ?>">❌ Elimina</a>
    </td>
</tr>
<?php endwhile; ?>

</table>

</div>

</body>
</html>