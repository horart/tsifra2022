<?php
session_start();
$code = $_SESSION['code'];
$db = new PDO('mysql:host=localhost;dbname='.$DB_NAME, $DB_USER, $DB_PASS);
switch ($_GET['type']) {
    case 'reg':
        $code = $_POST['code'];
        $search = $db->prepare('SELECT is_regged FROM codes WHERE code = ?');
        $search->execute([$search]);
        $exists = count($search->fetchAll());
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
        $problem = $_POST['is_problem'];
        $file = $_POST['is_file'];
        if(!$file) {
            $content = $_POST['text'];
        }else{
            $content = uniqid();
            file_put_contents("attachments/$content.jpg", file_get_contents($_FILES['attachment']));
        }
        $message = $db->prepare('INSERT is_problem, house, is_image, content INTO messages VALUES (?, 
            (
                SELECT house FROM codes WHERE code = ?
            ),
        ?, ?)');
        $message->execute([$problem, $code, $file, $content]);
        break;
    case 'poll':
        if(!$code) {
            http_response_code(403);
            exit();
        }
        $last = $_POST['last'];
        
        break;
    default:
        # code...
        break;
}
?>