<?php

$r = kirby()->request();

$playerMap = function ($jsPlayer){

    return Array(
        'name' => $jsPlayer['name'],
        'number' => $jsPlayer['number'],
        'goalkeeper' => $jsPlayer['goalkeeper'],
        'size' => $jsPlayer['size']
    );
};

$priceMap = function($product) use($site) {
    $colorStr = '';
    if(isset($product['colors'])){
        $colorStr = array_reduce( $product['colors'], function($p, $c){
            $p .= ' '. $c['name'] .' ('. $c['hex'] .')';
            return $p;
        },'');
    }

    $result = Array(
        'quantity' => $product['quantity'],
        'subtotal' => $product['totalPrice'],
        'color' =>    $colorStr
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

    try {

        $title = 'Siparis ' . date('d/m/Y H:i:s') . ' ' . ucfirst($q['name']);

        $playerData = array_map($playerMap, $q['players']);
        $playerData = yaml::encode($playerData);

        $priceData = array_map($priceMap, $q['products']);
        $priceData = yaml::encode($priceData);

        $pageData = array(
            'title' => $title,
            'visible' => true,
            'status' => 'new',
            'datetime' => date('Y-m-d H:i:00'),
            'name' => $q['name'],
            'tc' => $q['tc'],
            'email' => $q['email'],
            'tel' => $q['tel'],
            'address' => $q['address'],
            'note' => $q['note'],
            'players' => $playerData,
            'prices' => $priceData,
            'extra' => $q['extra']
        );


        $p = $page->create('siparisler' . DS . str::slug($title), 'siparis', $pageData);

        try {
            $p->sort(1);
        } catch(Exception $e) {

        }


        if(isset($q['logoFileInfo']) && count($r->files())){

            $upload = new Upload($p->root() . DS . 'logo', array('input' => 'logoData', 'overwrite' => true));

            if($file = $upload->file()){

            } else {
                throw(new Exception('Logo Dosyasi Yüklenemedi. Dosyayi kontrol ediniz.'));
            }
        }


        if(isset($q['chestLogoInfo']) && $q['chestLogoInfo']['type'] == 'blob' && count($r->files())){
            $upload = new Upload($p->root() . DS . 'sponsor-logosu', array('input' => 'chestLogoData', 'overwrite' => true));
            if(!$upload->file()){
                throw(new Exception('Sponsor Logo Dosyasi Yüklenemedi. Dosyayi kontrol ediniz.'));
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