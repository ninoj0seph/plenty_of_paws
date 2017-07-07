<?php
class Petfinder{
    private $key, $zipCode, $animalType, $maxShelterResults, $baseUrl, $offset;
    function __construct(){
        try{
            require 'assets/requires/authKeys.php';
        } catch (Exception $e){
            trigger_error(sprintf('File containing API key not found! #%d: %s', $e->getCode(), $e->getMessage()), E_USER_ERROR);
        }
        // Default Stock Values
        $this->key = $PETFINDER_API_KEY;
        $this->maxShelterResults = "6";
        $this->baseUrl = 'https://api.petfinder.com/';

        // Values to be set by client / user
        $this->zipCode = "92801";
        $this->animalType = 'dog';
        $this->offset = '18';
    }

    public function initialize(){
        $pets = $this->getPets();
        for($i = 0; $i < count($pets); $i++){
            $pets[$i]->shelterInfo = $this->getShelterInfo($pets[$i]->shelterId)->shelter;
        }
        var_dump($pets);
    }

    private function getShelterInfo($id){
        return($this->curlCall(
            "{$this->baseUrl}shelter.get?key={$this->key}&id={$id}")); // returns a the property inside the return object.
    }

    private function getPets(){
        return ($this->curlCall(
            "{$this->baseUrl}pet.find?key={$this->key}&location={$this->zipCode}&animal={$this->animalType}&output=full&count={$this->maxShelterResults}&offset={$this->offset}"))
            ->pets->pet; // returns a the property inside the return object.
    }

    private function curlCall($url){
        try{
            $curl = curl_init();
            curl_setopt_array($curl, array(
                    CURLOPT_URL => $url,
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => "",
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 30,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_CUSTOMREQUEST => "GET",
                )
            );
            $response = curl_exec($curl);
            if (FALSE === $response)
                throw new Exception(curl_error($curl), curl_errno($curl));
            $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            if (200 != $http_status)
                throw new Exception($response, $http_status);
            curl_close($curl);
        } catch(Exception $e) {
            trigger_error(sprintf(
                'Curl failed with error #%d: %s',
                $e->getCode(), $e->getMessage()),
                E_USER_ERROR);
        }
        return json_decode(json_encode(simplexml_load_string($response)));
    }
}