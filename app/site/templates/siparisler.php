<?php

$r = kirby()->request();

$playerMap = function ($jsPlayer){
    if(!$jsPlayer['name'])
        throw new Exception('Oyuncu ismi boş verilemez');

    return Array(
        'name' => $jsPlayer['name'],
        'number' => $jsPlayer['number'],
        'goalkeeper' => $jsPlayer['goalkeeper'],
        'size' => $jsPlayer['size']
    );
};

$productFilter = function($product){
    return $product['type'] != 'tax';
};

$priceMap = function($product) use($site) {

    $result = Array(
        'quantity' => $product['quantity'],
        'subtotal' => $product['totalPrice'],
        'color' =>    $product['color']
    );

    switch($product['type']){
        case 'tshirt':
            $page = $site->find('formalar')->children()->findBy('uid', $product['uid']);
            $result['name'] = $page->title()->toString();
            $result['price'] = $page->price()->float();
            break;
        case 'gkUniform':
            $page = $site->find('kaleci-formalari')->children()->findBy('uid', $product['uid']);
            $result['name'] = $page->title()->toString();
            $result['price'] = $page->price()->float();
            break;

        case 'shorts':
            $page = $site->find('sortlar')->children()->findBy('uid', $product['uid']);
            $result['name'] = $page->title()->toString();
            $result['price'] = $page->price()->float();
            break;

        case 'socks':
            $result['name'] = 'Çorap';
            $result['price'] = 5;
            break;
        default:
            break;
    }

    return $result;
};

if (true || $r->method() == 'POST') {
    $q = $r->data();

    $title = 'Siparis ' . date('d/m/Y H:i:s') . ' ' . ucfirst($q['name']);

    $playerData = array_map($playerMap, $q['players']);
    $playerData = yaml::encode($playerData);

    $priceData = array_map($priceMap, array_filter($q['products'], $productFilter));
    $priceData = yaml::encode($priceData);


    try {
        $pageData = array(
            'title' => $title,
            'status' => 'new',
            'datetime' => date('Y-m-d H:i:00'),
            'name' => $q['name'],
            'tc' => $q['tc'],
            'email' => $q['email'],
            'tel' => $q['tel'],
            'address' => $q['address'],
            'note' => $q['note'],
            'players' => $playerData,
            'prices' => $priceData
        );

        $p = $page->create('siparisler' . DS . str::slug($title), 'siparis', $pageData);

//        var_dump($_FILES);exit;


        if(isset($q['logoInfo']) && $q['logoInfo']['type'] == 'blob' && count($r->files())){
            $upload = new Upload($p->root() . DS . 'logo', array('input' => 'logoData', 'overwrite' => true));
            if($file = $upload->file()){
                dump(array(
                    'file'     => $file->filename(),
                    'mime'     => $file->mime(),
                    'size'     => $file->size(),
                    'niceSize' => $file->niceSize()
                ));
            } else {
                echo $upload->error();
                throw(new Exception('Logo Dosyasi Yüklenemedi. Dosyayi kontrol ediniz.'));
            }
        }


        if(isset($q['chestLogoInfo']) && $q['chestLogoInfo']['type'] == 'blob' && count($r->files())){
            $upload = new Upload($p->root() . DS . 'gogus-logosu', array('input' => 'chestLogoData', 'overwrite' => true));
            if(!$upload->file()){
                echo $upload->error();
                throw(new Exception('Göğüs Logosu Dosyasi Yüklenemedi. Dosyayi kontrol ediniz.'));
            }
        }

        die(json_encode(
            array(
                'status' => 'success',
                'data' => $p->uid()
            )
        ));
    } catch (Exception $e) {

        die(json_encode(
            array(
                'status' => 'fail',
                'data' => $e->getMessage()
            )
        ));
    }

}else{
    die(json_encode(
        array(
            'status' => 'fail',
            'data' => 'Beklenmeyen bir hata oluştu!'
        )
    ));
}
?>