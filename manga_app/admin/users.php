<?php
session_start();
require("../config/db.php");

// 🔒 controllo admin
if (!isset($_SESSION['id']) || $_SESSION['ruolo'] !== 'admin') {
    header("Location: ../login.php");
    exit();
}

// 👤 utenti
$result = $conn->query("SELECT id, username, ruolo, banned FROM utenti ORDER BY id DESC");
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Gestione Utenti</title>

    <link rel="stylesheet" href="../assets/css/admin.css">
</head>

<body>

<div class="admin-container">

    <h1>👤 Gestione Utenti</h1>

    <a href="dashboard.php" class="back-btn">⬅ Torna Dashboard</a>

    <div class="users-list">

        <?php while($row = $result->fetch_assoc()): ?>

            <div class="user-card">

                <div class="user-info">

                    <strong><?= htmlspecialchars($row['username']) ?></strong>

                    <span><?= htmlspecialchars($row['ruolo']) ?></span>

                    <?php if ((int)$row['banned'] === 1): ?>
                        <span class="banned">🚫 Bannato</span>
                    <?php else: ?>
                        <span class="active">✅ Attivo</span>
                    <?php endif; ?>

                </div>

                <div class="user-actions">

                    <?php if ($row['ruolo'] === "user"): ?>

                        <?php if ((int)$row['banned'] === 0): ?>
                            <a href="user_ban.php?id=<?= $row['id'] ?>"
                               class="ban-btn"
                               onclick="return openModal(this.href, 'Bannare questo utente?');">
                                🚫 Ban
                            </a>
                        <?php else: ?>
                            <a href="user_unban.php?id=<?= $row['id'] ?>"
                               class="unban-btn"
                               onclick="return openModal(this.href, 'Riabilitare questo utente?');">
                                ♻️ Unban
                            </a>
                        <?php endif; ?>

                    <?php endif; ?>

                </div>

            </div>

        <?php endwhile; ?>

    </div>

</div>

<div id="confirmModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modalText">

    <div class="modal-content">

        <div class="modal-header">
            <h2 id="modalText">Sei sicuro?</h2>
        </div>

        <div class="modal-actions">

            <button id="confirmBtn" class="btn-confirm" type="button">
                Sì, conferma
            </button>

            <button type="button" class="btn-cancel" onclick="closeModal()">
                Annulla
            </button>

        </div>

    </div>

</div>

<script>
let targetUrl = "";

// apri modal
function openModal(url, message) {
    targetUrl = url;

    document.getElementById("modalText").textContent = message;

    const modal = document.getElementById("confirmModal");
    modal.style.display = "flex";

    return false; // blocca link
}

// chiudi modal
function closeModal() {
    document.getElementById("confirmModal").style.display = "none";
    targetUrl = "";
}

// conferma azione
document.getElementById("confirmBtn").addEventListener("click", function () {
    if (targetUrl) {
        window.location.href = targetUrl;
    }
});

// chiudi cliccando fuori dal box
document.getElementById("confirmModal").addEventListener("click", function (e) {
    if (e.target === this) {
        closeModal();
    }
});

// ESC per chiudere
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeModal();
    }
});
</script>

</body>
</html>