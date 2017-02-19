<?php
$r = kirby()->request();

if (true || $r->method() == 'POST') {
    $q = $r->data();

    $title = 'Siparis ' . date('d/m/Y-H:i:s') . ' ' . ucfirst($q['name']);


    try {
        $pageData = array(
            'title' => $title,
            'status' => 'new',
            'datetime' => date('Y-m-d H:i:00'),
            'name' => $q['name'],
            'email' => $q['email'],
            'tel' => $q['tel'],
            'address' => $q['address'],
            'note' => $q['note'],
        );

        $priceData = [];

        $priceData


         die(json_encode($q));

         //Create Structure
         $priceData = array(
             array(
                 'name' => '333333',
                 'quantity' => "33",
                 'color' => '#333333',
                 'price' => "33",
                 'subtotal' => '1'
             )
         );

        $p = $page->create('siparisler/' . strtolower($title), 'siparis', $pageData);


        $priceData = yaml::encode($priceData);
        $prices = $p->update(array('prices' => $priceData));

        if (!$prices) {
            throw new Exception('Fiyat Alanı Boş Olamaz');
        }

        $playerData = array(
            array(
                'name' => 'asdfa',
                'number' => "23",
                'goalkeeper' => 'true',
                'size' => 'XL',
                'socks' => 'true'
            )
        );

        $playerData = yaml::encode($playerData);
        $players = $p->update(array('players' => $playerData));

        if (!$players) {
            throw new Exception('Oyuncu Alanı Boş Olamaz');
        }


        if (count($r->files())) {
            $upload = new Upload($p->root() . DS . '{safeFilename}', array('input' => 'file', 'index' => 1));
            if($upload->file()){
                var_dump($upload->file());
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