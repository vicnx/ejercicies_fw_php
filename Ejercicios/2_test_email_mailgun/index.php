<?php
    //https://github.com/mailgun/mailgun-php
    //Authorized Recipients -> afegir a 'yomogan@gmail.com'
    
    function send_mailgun($email){
		$data = file_get_contents("apis.json"); //obtengo el contenido de apis.json
		$apis= json_decode($data,true); //lo convierto en array
		$api_mailgun=$apis[0]['api_mailgun'];//obtengo el campo api_mailgun
		$api_mailgun_url=$apis[0]['api_mailgun_url'];//obtengo el campo api_mailgun_url

    	$config = array();
    	$config['api_key'] =$api_mailgun; //API Key
    	$config['api_url'] =$api_mailgun_url; //API Base URL

    	$message = array();
    	$message['from'] = "admin@vicezon.com";
    	$message['to'] = $email;
    	$message['h:Reply-To'] = "admin@vicezon.com";
    	$message['subject'] = "Hello, this is a test";
    	$message['html'] = 'Hello ' . $email . ',</br></br> This is a test';
     
    	$ch = curl_init();
    	curl_setopt($ch, CURLOPT_URL, $config['api_url']);
    	curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    	curl_setopt($ch, CURLOPT_USERPWD, "api:{$config['api_key']}");
    	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    	curl_setopt($ch, CURLOPT_POST, true); 
    	curl_setopt($ch, CURLOPT_POSTFIELDS,$message);
    	$result = curl_exec($ch);
    	curl_close($ch);
    	return $result;
    }
    
    $json = send_mailgun('andanivicente@gmail.com');
	print_r($json);
	// print_r($apis[0]['api_mailgun']);
?>