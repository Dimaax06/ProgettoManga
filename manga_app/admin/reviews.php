<?php
session_start();
require("../config/db.php");

// 🔒 controllo admin
if (!isset($_SESSION['id']) || $_SESSION['ruolo'] !== 'admin') {
    header("Location: ../login.php");
    exit();
}

// 📋 recensioni
$query = "
    SELECT 
        recensioni.id,
        recensioni.voto,
        recensioni.commento,
        recensioni.data_recensione,
        utenti.username,
        manga.titolo
    FROM recensioni
    JOIN utenti ON recensioni.id_utente = utenti.id
    JOIN manga ON recensioni.id_manga = manga.id
    ORDER BY recensioni.data_recensione DESC
";

$result = $conn->query($query);
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Gestione Recensioni</title>

    <link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body>

<div class="admin-container">

    <h1>💬 Gestione Recensioni</h1>

    <a href="dashboard.php" class="back-btn">⬅ Torna Dashboard</a>

    <div class="reviews-list">

        <?php while($row = $result->fetch_assoc()): ?>

            <div class="review-card">

                <div class="review-header">

                    <strong><?php echo $row['username']; ?></strong>

                    <span>⭐ <?php echo $row['voto']; ?>/5</span>

                </div>

                <p class="manga-title">
                    📚 <?php echo $row['titolo']; ?>
                </p>

                <p class="comment">
                    <?php echo nl2br($row['commento']); ?>
                </p>

                <small>
                    <?php echo $row['data_recensione']; ?>
                </small>

                <!-- 🗑️ DELETE FORM CREMOSO -->
                <form method="POST"
                      action="review_delete.php"
                      class="delete-form"
                      onsubmit="return confirmDelete(this);">

                    <input type="hidden" name="id" value="<?php echo $row['id']; ?>">

                    <button type="submit" class="delete-btn">
                        🗑️ Rimuovi
                    </button>

                </form>

            </div>

        <?php endwhile; ?>

    </div>

</div>

<!-- JS conferma -->
<script>
function confirmDelete(form) {

    const ok = confirm("Vuoi davvero eliminare questa recensione?");

    if (ok) {
        const card = form.closest('.review-card');
        card.style.transition = "0.3s";
        card.style.opacity = "0.3";
    }

    return ok;
}
</script>

</body>
</html>