<?php
if($_SESSION['code']) header('Location: /messenger.html') else header('Location: /auth.html');
http_response_code(301);
?>