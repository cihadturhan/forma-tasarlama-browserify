<!doctype html>
<html ng-app="main" lang="tr-TR">

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forma Tasarlama</title>
    <link rel="icon" type="image/x-icon" href="/img/favicon.ico">
    <link rel="stylesheet" href="/css/angular-colorpicker.css">
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="/css/app.css">
    <base href="/">
</head>

<body>

<div class="container">
    <div class="row" ng-controller="navCtrl">
        <div class="col-xs-12 text-center">
            <ol class="breadcrumb" >
                <li ui-sref-active="active">
                    <a ui-sref="collar">
                        <i class="glyphicon glyphicon-menu-down"></i>

                        <div class="title">1. Yaka Seçimi</div>
                    </a>
                </li>
                <li ui-sref-active="active" ng-class="{disabled: !sp.collar}">
                    <a ui-sref="uniform(sp)" >
                        <i class="glyphicon glyphicon-th"></i>

                        <div class="title">2. Model Seçimi</div>
                    </a>
                </li>
                <li ui-sref-active="active" ng-class="{disabled: !sp.colorUuid}">
                    <a ui-sref="color(sp)">
                        <i class="glyphicon glyphicon-blackboard"></i>

                        <div class="title">3. Forma Detayları</div>
                    </a>
                </li>
                <li ng-class="{disabled: !sp.paymentUuid}" ui-sref-active="active">
                    <a ui-sref="payment(sp)">
                        <i class="glyphicon glyphicon-list"></i>

                        <div class="title">4. Oyuncu Bilgileri</div>
                    </a>
                </li>
                <li class="disabled" ui-sref-active="active">
                    <a ui-sref="summary">
                        <i class="glyphicon glyphicon-shopping-cart"></i>

                        <div class="title">5. Sipariş</div>
                    </a>
                </li>
            </ol>

        </div>
    </div>

    <ui-view class="row">

    </ui-view>

</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-animate.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-sanitize.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.0/ui-bootstrap-tpls.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/4.3.0/min/dropzone.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.3.4/pixi.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/16.6.0/Tween.min.js"></script>
<script src="dist/app.js"></script>

</body>
</html>
