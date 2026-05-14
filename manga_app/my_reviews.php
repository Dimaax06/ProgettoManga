<?php
session_start();
require("config/db.php");

if(!isset($_SESSION['id'])){
    header("Location: login.php");
    exit();
}

$id = $_SESSION['id'];

$query = "
    SELECT recensioni.*, manga.titolo
    FROM recensioni
    JOIN manga
        ON recensioni.id_manga = manga.id
    WHERE recensioni.id_utente = $id
    ORDER BY recensioni.data_recensione DESC
";

$result = $conn->query($query);
?>

<!DOCTYPE html>
<html lang="it">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Le mie recensioni</title>

<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/profile.css">

</head>
<body>

<div class="reviews-page">

    <h1>
        ⭐ Le mie recensioni
    </h1>

    <?php if($result->num_rows > 0): ?>

        <?php while($row = $result->fetch_assoc()): ?>

            <div class="review-card">

                <h2>
                    <?php echo $row['titolo']; ?>
                </h2>

                <div class="review-stars">

                    <?php for($i = 0; $i < $row['voto']; $i++): ?>
                        ⭐
                    <?php endfor; ?>

                </div>

                <p class="review-comment">
                    <?php echo $row['commento']; ?>
                </p>

                <small>
                    <?php echo $row['data_recensione']; ?>
                </small>

            </div>

        <?php endwhile; ?>

    <?php else: ?>

        <p>
            Nessuna recensione trovata.
        </p>

    <?php endif; ?>

</div>

</body>
</html>