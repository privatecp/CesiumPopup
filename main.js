$(document).ready(function(){ 
    
    // 创建弹窗对象的方法
    var Popup = function(info){
        this.constructor(info);
    }
    Popup.prototype.id=0;
    Popup.prototype.constructor = function(info){
        var _this = this;
        _this.viewer = info.viewer;//弹窗创建的viewer
        _this.geometry = info.geometry;//弹窗挂载的位置
        _this.id ="popup_" +_this.__proto__.id++ ;
        _this.ctn = $("<div class='bx-popup-ctn' id =  '"+_this.id+"'>");
        $(_this.viewer.container).append( _this.ctn);
        //测试弹窗内容
        var testConfig = {
            header:"测试数据",
            content:"<div>测试窗口</div>",
        }
        _this.ctn.append(_this.createHtml(testConfig.header,testConfig.content));
        
        _this.render(_this.geometry);
        _this.eventListener = _this.viewer.clock.onTick.addEventListener(function(clock) {
            _this.render(_this.geometry);
        })
    }
    // 实时刷新
    Popup.prototype.render = function(geometry){
        var _this = this;
        var position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(_this.viewer.scene,geometry)
        _this.ctn.css("left",position.x- _this.ctn.get(0).offsetWidth/2);
        _this.ctn.css("top",position.y- _this.ctn.get(0).offsetHeight - 10);
    }
    // 动态生成内容
    Popup.prototype.createHtml = function(header,content){
            var html = '<div class="bx-popup-header-ctn">'+
            header+
            '</div>'+
            '<div class="bx-popup-content-ctn" >'+
            '<div class="bx-popup-content" >'+    
            content+
            '</div>'+
            '</div>'+
            '<div class="bx-popup-tip-container" >'+
            '<div class="bx-popup-tip" >'+
            '</div>'+
        '</div>'+
        '<a class="leaflet-popup-close-button" >X</a>';
        return html;
    }
    // 关闭弹窗按钮
    Popup.prototype.close=function(){
        var _this = this;
        _this.ctn.remove();
        _this.viewer.clock.onTick.removeEventListener( _this.eventListener );
    }
    // 测试代码,点击地图后，在点击的位置创建弹窗
    var viewer = new Cesium.Viewer('cesiumContainer');
    var handler3D = new Cesium.ScreenSpaceEventHandler(
    viewer.scene.canvas);
    handler3D.setInputAction(function(click){
        console.log("click")
        var pick= new Cesium.Cartesian2(click.position.x,click.position.y);
        if(pick){
            // 获取点击位置坐标
            var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);
            if(cartesian){
                // 调用弹窗方法
                var popup = new Popup({
                    viewer:viewer,
                    geometry:cartesian
                })
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK )

}); 