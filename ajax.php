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
            if(!($_POST['name'] && $_POST['surname'])) {
                http_response_code(400);
                exit();
            }else{
                $reg = $db->prepare('UPDATE codes SET name = ?, surname = ?, is_regged = 1 WHERE code = ?');
                $_SESSION['code'] = $code;
                $reg->execute([$_POST['name'], $_POST['surname'], $code]);
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
            file_put_contents("attachments/$content.jpg", file_get_contents($_FILES['attachment']['tmp_name']));
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
        if($_SESSION['last']) {
            $last = $_SESSION['last'];
        }else{
            $last = 0;
        }
        $pq = $db->prepare('SELECT id, content, is_image, date, codes.name
        FROM messages INNER JOIN codes ON codes.code = messages.code
        WHERE is_problem = 0 AND messages.house = (SELECT house FROM codes AS cc WHERE cc.code = ?)
        AND codes.code != ? AND id > ?
        ORDER BY date ASC');
        $pq->execute([$code, $code, $last]);
        $fa = $pq->fetchAll();
        if($i = count($fa)) {
            $_SESSION['last'] = $fa[$i-1]['id'];
        }
        if($last) {
            header('Content-Type: application/json');
            exit(json_encode($fa));
        }
        break;
    
    case 'init':
        if(!$code) {
            http_response_code(403);
            exit();
        }
        $pq = $db->prepare('SELECT content, is_image, date, codes.name, (codes.code = ?) AS mine
        FROM messages INNER JOIN codes ON codes.code = messages.code
        WHERE is_problem = 0 AND messages.house = (SELECT house FROM codes AS cc WHERE cc.code = ?)
        ORDER BY date ASC');
        $pq->execute([$code, $code]);
        $fa = $pq->fetchAll();
        header('Content-Type: application/json');
        exit(json_encode($fa));
        break;
    
    default:
        # code...
        break;
}
?>