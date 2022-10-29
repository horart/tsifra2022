<?php
require('config.php');
session_start();
$code = $_SESSION['code'];
$db = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME", $DB_USER, $DB_PASS);
$db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
switch ($_GET['type']) {
    case 'reg':
        $code = $_POST['code'];
        $search = $db->prepare('SELECT is_regged FROM codes WHERE code = ?');
        $search->execute([$code]);
        $fa = $search->fetchAll();
        if(!count($fa)) {
            http_response_code(403);
            exit();
        }
        $exists = $fa[0]['is_regged'];
        if($exists) {
            http_response_code(301);
            $_SESSION['code'] = $code;
            exit();
        }else{
            if(!($_POST['name'] && $_POST['surname'] && $_FILES['avatar'])) {
                http_response_code(400);
                exit();
            }else{
                $reg = $db->prepare('UPDATE codes SET name = ?, surname = ?, avatar = ?, is_regged = 1 WHERE code = ?');
                $file = $_FILES['avatar'];
                $avatar = uniqid();
                file_put_contents("avatars/$avatar.jpg", file_get_contents($file['tmp_name']));
                $_SESSION['code'] = $code;
                $reg->execute([$_POST['name'], $_POST['surname'], $avatar, $code]);
                exit();
            }
        }
        break;
    case 'message':
        if(!$code) {
            http_response_code(403);
            exit();
        }
        $problem = $_POST['is_problem'] == '1';
        $file = $_POST['is_file'] == '1';
        if(!$file) {
            $content = $_POST['text'];
        }else{
            $content = uniqid();
            file_put_contents("attachments/$content.jpg", file_get_contents($_FILES['attachment']));
        }
        $message = $db->prepare('INSERT INTO messages (code, is_problem, house, is_image, content) VALUES (?, ?, 
            (
                SELECT house FROM codes WHERE code = ?
            ),
        ?, ?)');
        $message->execute([$code, $problem, $code, $file, $content]);
        break;
    case 'poll':
        if(!$code) {
            http_response_code(403);
            exit();
        }
        if(isset($_SESSION['last'])) {
            $last = $_SESSION['last'];
        }else{
            $last = 0;
        }
        $pq = $db->prepare('SELECT content, is_image, date, sender.name
        FROM messages INNER JOIN codes ON codes.house = messages.house INNER JOIN codes AS sender ON codes.code = messages.code
        WHERE is_problem = 0 AND codes.code = ? AND messages.date > ?
        ORDER BY date ASC');
        $pq->execute([$code, $last]);
        $fa = $pq->fetchAll();
        $_SESSION['last'] = time();
        header('Content-Type: application/json');
        exit(json_encode($fa));

        break;
    default:
        # code...
        break;
}
?>