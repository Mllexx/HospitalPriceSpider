const path = require('path');
const fs = require('fs');
const Institutions = require('../database/models').Institutions;
const Services = require('../database/models').Services;

module.exports = class CsvProcessor {
    constructor(folderPath) {
        this.$csvPath = folderPath;
    }
    getFileInfo(){
        var $institutions;
        var $list = Institutions.findAll({
            attributes: ['rId', 'hospitalName', 'itemColumnName', 'avgPriceColumnName',
                'priceSampleSizeColumnName', 'extraColumnName', 'categoryColumnName',
                'medianPricingColumnName', 'outPatientPriceColumnName', 'inPatientPriceColumnName','removedHeaderRowsForCSV',
            'savedRepoTableName'],
            raw: true
        }).then(function($institutions){
            $institutions.forEach($file => {
                console.log($file.hospitalName);
                var $fname = $file.hospitalName;
            });
        });
    }


    getFileList($csvPath) {
        var $f = fs.readdirSync(this.$csvPath);
        return $f.filter(el => /\.csv$/.test(el));
    }
    getFileHeader($filePath) {
        try{
            var $content = fs.readFileSync(this.$csvPath + '\\' + $filePath, 'utf8');
            //console.log($content);
            var $lines = $content.split('\n');
            var $linecount = $lines.length - 1;
            var $midfile = Math.round($linecount / 2, 0);
            var $testline = $lines[$midfile];
            //remove line breaks and split by delimiter (comma)
            var $t = $testline.replace(/(\r\n|\n|\r)/gm, "");
            var $tt = $t.match(/(?:[^\,"]+|"[^"]*")+/g);
            // Get derived column count
            var $colCount = $tt.length;
            // get header row (check the first 10 lines)
            var $counter = 0;
            var $header = null;
            while ($counter < 10) {
                var $headertest = $lines[$counter];
                var $a = $headertest.replace(/(\r\n|\n|\r)/gm, "");
                var $aa = $a.match(/(?:[^\,"]+|"[^"]*")+/g);
                if ($aa !== null && $aa.length === $colCount) {
                    $header = $aa;
                    break;
                }
                $counter++;
            }
            //do some cleanup (trim/remove whitespace and special chars)
            return {'line':$counter,'row':$header};
        }catch($err){
            switch ($err.code) {
                case 'ENOENT':
                    console.log("File not found!");
                    console.log($err);
                    return false;
                    break;
                default:
                    console.log($err);
                    return false;
                    break;
            }
        }

    }

    cleanUpHeader($header){
        if(typeof $header === 'object'|| typeof $header === 'array'){
            var $hrow = $header.row;
            for(let i =0; i < $hrow.length; i++){
                var $coldata = $hrow[i];
                // trim to remove white spaces
                var $a = $coldata.trim();
                // change all to lowercase
                var $b = $a.toLowerCase();
                $hrow[i] = $b;
            }
            $header.row=$hrow;
            return $header;
        }
    }

    /**
     * Read through the file and insert into the services/procedures table
     *
     * @param Object $file
     */
    processFile($file){
        var $content = fs.readFileSync($file.path,'utf8');
        var $lines = $content.split('\n');
        var $counter = $file.header.line;
        var $map = $file.map;
        //evaluate file's column map

        while($counter < $lines.length){
            console.log($lines[$counter]);
            var $line=$lines[$counter];
            var $lobject = $line.match(/(?:[^,"]+|"[^"]*")+/g);
            //compile object to insert into table
            var $tblobj = {
                itemName:$lobject[$map.itemName],
                price:this.cleanUpPrice($lobject[$map.price]),
                description:$lobject[$map.hospitalID],
            };

            var $row = Services.create($tblobj);
            //{
                //itemName:$lobject[$map.itemName],
                //price:$lobject[$map.itemName],
                //description:$lobject[$map.itemName]
            //});
            console.log($row);
            $counter++;
        }

    }

    /**
     * Do column mapping for the file header passed
     *
     * @param $header
     * @returns {{itemName: Array, hospitalID: Array, price: Array, currency: Array}}
     * @TODO: Add regex mapping logic for more columns
     */
    colMapping($header){
        var $service = [];
        var $price = [];
        var $currency = [];
        var $hospital = [];
        
        if(typeof $header === 'object'|| typeof $header === 'array'){
            for(let i =0; i < $header.length; i++){
                //Get the Item Name column
                if(this.isItemName($header[i])){
                    $service.push(i);
                }
                // Get the Price column
                if(this.isPrice($header[i])){
                    $price.push(i);
                }
                // Get the Currency column
                if(this.isCurrency($header[i])){
                    $currency.push(i);
                }
                // Get the hospital name
                if(this.isHospitalID($header[i])){
                    $hospital.push(i);
                }
            }
            return $list={
                'itemName':$service,
                'price':$price,
                'currency':$currency,
                'hospitalID':$hospital,
            };
        }
    }

    /* Column Identity Checkers */
    isItemName($col){
        var $searchstring =new RegExp("/*service|description|desc|srv/");
        return $searchstring.test($col);
    }

    isPrice($col){
        var $searchstring =new RegExp("price|charge$|chg$|charges$|amount$|amnt$|^amt$|cost|payment/");
        return $searchstring.test($col);
    }

    isHospitalID($col){
        var $searchstring =new RegExp("name|hospital_name|hospitalname|hospital$");
        var $searchstring2 =new RegExp("facility");
        if($searchstring.test($col)){
            return true;
        }
        else{
            return $searchstring2.test($col);
        }
    }

    isCurrency($col){
        var $searchstring =new RegExp("/[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/");
        return $searchstring.test($col);
    }
    //Utility functions
    cleanUpPrice($price){
        //remove anything but digits
        var $a = $price.replace(/[^0-9]/gi, '');
        return $a;
    }

    /*
    @TODO Move Logic to an external general processor
    * */
    /* Check File Type by checking the folder its in */
    isCsvType($filename){}
    isXlsType($filename){}
    isPdfType($filename){}
    isXlsxType($filename){}
}
