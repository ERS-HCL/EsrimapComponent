 /**
 * @customElement
 * @polymer
 */
class EsrimapComp extends Polymer.Element {
    static get is() { return 'esrimap-comp'; }

    constructor() {
        super();
        this.errorStatus = "";
        this.errorStatusText = "";
        this.errorMessage = "";
        
    }

    /**
     *  Make the api calls to Get the data 
     */
    connectedCallback() {
        super.connectedCallback();
        this.innerHTML = `<style>
                                html, body, #map {padding:0; margin:0; height:100%;}
                                #BasemapToggle { position: absolute; bottom: 30px; right: 10px; z-index: 10; }
                                .loader { position: relative; border: 12px solid #f3f3f3;border-radius: 50%; border-top: 12px solid #666666;
                width: 30px;height: 30px;-webkit-animation: spin 2s linear infinite; animation: spin 2s linear infinite;
                margin: 0 auto;display: inline-flex; align-self:center;}

            /* Safari */
            @-webkit-keyframes spin {
                0% { -webkit-transform: rotate(0deg); }
                100% { -webkit-transform: rotate(360deg); }
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .error-text {
                position: relative;margin: 0 auto;display: inline-flex; align-self:center;
            }
                            </style>
            <iron-ajax id="esrimapcomp" method="GET"  handle-as="json"   on-error="'`+this.handleError+`'"></iron-ajax><div id="esrimapDiv" style="height:100%;width:100%;display:flex;"></div><esrimap-view ></esrimap-view>`;
        this.children[1].url = "https://my-json-server.typicode.com/VelmuruganHCL/demo/posts";
        let self = this;
        let customElement = document.createElement('div');
        customElement.setAttribute('class','loader');
        self.children[2].appendChild(customElement);
        //Tracking the bad request network calls
        this.children[1].addEventListener('error', function(e) {
            self.handleError(e);
            //this.children[1].remove();
        });
        getData(this.children[1]).then((esrimapdata)=> {
            var mapData = esrimapdata, mapDataArray = [], layerInfoArray = [], layerInfoJsonArray = [];
            if(mapData.length>0) {
                var layerInfoJson = '';
                for(var i = 0; i<mapData.length; i++) {
                        // Construct esrimap data
                        var mapdataJson = { 
                            "name": mapData[i].name, 
                            "latitude": mapData[i].latitude, 
                            "longitude": mapData[i].longitude, 
                        };
                        mapDataArray.push(mapdataJson);
                        if(layerInfoArray.indexOf(mapData[i].name)<0) {
                            var color = (mapData[i].color)?mapData[i].color:'#F6F901';
                            layerInfoJson = mapData[i].name+':'+color;
                            layerInfoJsonArray.push(layerInfoJson);
                            layerInfoArray.push(mapData[i].name);
                        }
                }
                var layerInfoObj = {}; 
                for(var a=0; a<layerInfoJsonArray.length;a++) {
                    var layerInfoJsonSplit = layerInfoJsonArray[a].split(":");
                    layerInfoObj[layerInfoJsonSplit[0]] = layerInfoJsonSplit[1];
                }
            }
            this.children[2].removeChild(this.children[2].children[0]);
            this.children[2].setAttribute('style','height:0;width:100%');
        // Dispatch event to passing data into the esrimap component
        window.dispatchEvent(new CustomEvent('esrimapdata', {detail : {
                mapData:mapDataArray,
                layerInfo:layerInfoObj,
                esrimapmarkerurl:self.esrimapmarkerurl
            }, bubble: false, composed : true}));
            self.showLoader = true;
        });
        
    }

    ready() {
        super.ready();
    }

    /**
     * To handle the Error part in iron-ajax request
     */
    handleError(e) {
        const req = e.detail.request; // iron-request
        this.errorStatus = req.status;
        this.errorStatusText = req.statusText;
        this.errorMessage = (this.errorStatus==400)?this.errorStatusText:req.response.responseMessage;
        
        this.children[2].removeChild(this.children[2].children[0]);
        var customElement1 = document.createElement('div');
        customElement1.setAttribute('class','error-text');
        this.children[2].appendChild(customElement1);
        this.children[2].children[0].innerText= this.errorMessage;
    }

     /**
     * To separate the query params and return appropriate values for given query params name
     */
    _getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
}

window.customElements.define(EsrimapComp.is, EsrimapComp);