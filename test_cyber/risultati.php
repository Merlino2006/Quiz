<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $nome = $_POST["nome"] ?? "Sconosciuto";
  $punteggio = $_POST["punteggio"] ?? 0;
  $percentuale = $_POST["percentuale"] ?? 0;
  $riga = "$nome;$punteggio;$percentuale;" . date("Y-m-d H:i:s") . "\n";
  file_put_contents("risultati.csv", $riga, FILE_APPEND | LOCK_EX);
}
?>