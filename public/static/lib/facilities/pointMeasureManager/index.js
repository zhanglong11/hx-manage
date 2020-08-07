import*as Indicators from"./indicators";let{PointMeasurementIndicator:PointMeasurementIndicator,AngleMeasurementIndicator:AngleMeasurementIndicator,DistanceMeasurementIndicator:DistanceMeasurementIndicator,INDICATOR_LINE_OVERLAY:INDICATOR_LINE_OVERLAY,create3dLine:create3dLine}=Indicators;const MeasureCommon=Bimfish.Viewing.MeasureCommon,{Measurement:Measurement,MeasurementTypes:MeasurementTypes,SnapType:SnapType,computeResult:computeResult,getSnapResultPosition:getSnapResultPosition}=MeasureCommon,{MEASUREMENT_DISTANCE:MEASUREMENT_DISTANCE,MEASUREMENT_ANGLE:MEASUREMENT_ANGLE}=MeasurementTypes,MEASUREMENT_POINT=998,{SNAP_VERTEX:SNAP_VERTEX,SNAP_MIDPOINT:SNAP_MIDPOINT,SNAP_CIRCLE_CENTER:SNAP_CIRCLE_CENTER,SNAP_EDGE:SNAP_EDGE,SNAP_CIRCULARARC:SNAP_CIRCULARARC,SNAP_CURVEDEDGE:SNAP_CURVEDEDGE,SNAP_CURVEDFACE:SNAP_CURVEDFACE,RASTER_PIXEL:RASTER_PIXEL,SNAP_INTERSECTION:SNAP_INTERSECTION}=SnapType;class PointMeasurement{constructor(e,t){this._id=t,this._type=e,this.pick=null,this.measurementType=998}getMeasureResult(e){return this.pick.z}setPick(e){this.pick=e}getPick(){return this.pick}countPicks(){return null==this.pick?0:1}getMaxNumberOfPicks(){return 1}}export class MeasurementWrapper{constructor(e,t){this._measurement=e,this._type=e.measurementType,this._id=t,this._editing=!0,this.indicator=null}getMeasurementResult(e){switch(this._type){case MEASUREMENT_ANGLE:case MEASUREMENT_DISTANCE:return computeResult(this._measurement.picks,this._type,e);case 998:return{height:this._measurement.pick.z,type:998}}}setPick(e,t){switch(this._type){case MEASUREMENT_DISTANCE:case MEASUREMENT_ANGLE:this._measurement.setPick(e,t);break;case 998:this._measurement.setPick(t.intersectPoint);break;default:throw"setPick: Unknown measurement type."}}getPick(e){switch(this._type){case MEASUREMENT_DISTANCE:case MEASUREMENT_ANGLE:return this._measurement.getPick(e);case 998:return this._measurement.getPick();default:throw"getPick: Unknown measurement type."}}editingDone(){this._editing=!1}isFulfilled(){return this._measurement.countPicks()===this._measurement.getMaxNumberOfPicks()}getMaxNumberOfPicks(){return this._measurement.getMaxNumberOfPicks()}countPicks(){return this._measurement.countPicks()}getId(){return this._id}getType(){return this._type}getData(){let e;switch(this._type){case MEASUREMENT_DISTANCE:e=[getSnapResultPosition(this._measurement.picks[1]),getSnapResultPosition(this._measurement.picks[2])];break;case MEASUREMENT_ANGLE:e=[getSnapResultPosition(this._measurement.picks[1]),getSnapResultPosition(this._measurement.picks[2]),getSnapResultPosition(this._measurement.picks[3])];break;case 998:e=this._measurement.pick;break;default:throw"getData: unknown measurement type"}return{type:this._type,points:e}}}class MeasurementIndicatorManager{constructor(e){this.viewer=e,this._indicators={},e.addEventListener(Bimfish.Viewing.CAMERA_CHANGE_EVENT,this._handleCameraChange)}add(e,t){console.log(e);let i=new PointMeasurementIndicator(t);this._indicators[e]=i,this._indicators[e]._appendTo(this.viewer.container),setTimeout(()=>{i.updatePosition(MeasureCommon.project(i.getMeasurementPosition(),this.viewer))})}remove(e){this._indicators[e].destory(),delete this._indicators[e]}_handleCameraChange=e=>{for(let e in this._indicators){let t=this._indicators[e];const i=MeasureCommon.project(t.getMeasurementPosition(),this.viewer);t.updatePosition(i)}}}function getCanvasCoord(e,t){let{left:i,top:s}=e.getBoundingClientRect(),{x:n,y:r}=t;return{x:n-i,y:r-s}}export class MeasureManager{constructor(e){this.viewer=e,this._measurements=[],this._indicators=[],this.snapper=null,this._adding=!1,this._indicatorManager=new MeasurementIndicatorManager(e),this._curEditingPointIndex=0,this._editing=!0,this._mouseDownCanvasPos=null,this._mouseDownTime=0,this._curPos=null,this._curMeasurement=null,this._measurementType=MEASUREMENT_ANGLE,this._selectedMeasurement=null,this.supplyUnits=["mm","cm","m","ft"],this.currentUnit="mm",e.addEventListener(Bimfish.Viewing.CAMERA_CHANGE_EVENT,this._handleCameraChange),Indicators.overlayCreated.created||(e.impl.createOverlayScene(INDICATOR_LINE_OVERLAY),Indicators.overlayCreated.created=!0),this._lastPoint=null,this._robberObj=null,this._robberBind=null}getSupplyUnits(){return[...this.supplyUnits]}setUnit(e){if(-1==this.supplyUnits.indexOf(e))throw"Unsupply unit";this.currentUnit=e,this._updateLabelValues()}_updateLabelValues(){this._curIndicator&&this._curIndicator.updateLabelsValue(this.currentUnit),this._indicators.forEach(e=>e.updateLabelsValue(this.currentUnit))}_handleCameraChange=()=>{this._curIndicator&&(this._curIndicator.updateAxisLabelsPos(),this._curIndicator.updateMainLabelPos()),this._indicators.forEach(e=>{e.updateMainLabelPos()})};_getNewMeasurement(e){let t,i=this._measurements.length;switch(e){case MEASUREMENT_DISTANCE:case MEASUREMENT_ANGLE:t=new Measurement(e,i);break;case 998:t=new PointMeasurement(e,i);break;default:throw"Unknown measure type"}return new MeasurementWrapper(t,i)}setMeasureType(e){if(998!=e||e!=MEASUREMENT_DISTANCE||e!=MEASUREMENT_ANGLE)throw new TypeError("measure type must be one of [MEASUREMENT_POINT, MEASUREMENT_DISTANCE, MEASUREMENT_ANGLE]");this._measurementType=e,this._adding&&this.abortAdding()}startAdding(){this.snapper||(this.snapper=this.viewer.toolController.getTool("snapper")),this._adding=!0,this._curMeasurement=this._getNewMeasurement(this._measurementType),this.viewer.toolController.activateTool("snapper"),this.viewer.impl.pauseHighlight(!0),this._registListeners()}_dropCurrentMeasurment(){this._curIndicator&&this._curIndicator.hideSublineAndAxisLabel(),this._curMeasurement&&(this._curMeasurement=null)}_beginNewMeasurement(){this._dropCurrentMeasurment(),this._curMeasurement=this._getNewMeasurement(this._measurementType)}_registListeners(){this.viewer.impl.canvas.addEventListener("mousemove",this._handleMousemove),this.viewer.impl.canvas.addEventListener("mousewheel",this._handleMousewheel),this.viewer.impl.canvas.addEventListener("mousedown",this._handleMousedown),this.viewer.impl.canvas.addEventListener("mouseup",this._handleMouseUp),this.viewer.impl.canvas.addEventListener("click",this._handleClick)}endAdding(){return!!this._adding&&(this._adding=!1,this._curMeasurement=null,this._clearListeners(),!0)}abortAdding(){return!!this._adding&&(this._adding=!1,this._curMeasurement=null,this._curIndicator&&this._curIndicator.hideSublineAndAxisLabel(),this._clearListeners(),!0)}_clearListeners(){this.viewer.toolController.deactivateTool("snapper"),this.viewer.impl.pauseHighlight(!1),this.viewer.impl.canvas.removeEventListener("mousemove",this._handleMousemove),this.viewer.impl.canvas.removeEventListener("mousewheel",this._handleMousewheel),this.viewer.impl.canvas.removeEventListener("mousedown",this._handleMousedown),this.viewer.impl.canvas.removeEventListener("mouseup",this._handleMouseUp),this.viewer.impl.canvas.removeEventListener("click",this._handleClick),this._adding=!1,this._curPos=null}_correctResult(e){if(this._curPos&&!e.getGeometry()&&!e.geomType){const t=MeasureCommon.inverseProject(this._curPos,this.viewer);e.geomType=SNAP_VERTEX,e.geomVertex=t,e.intersectPoint=t}return e}_handleMousemove=e=>{let{x:t,y:i}=getCanvasCoord(e.target,{x:e.clientX,y:e.clientY});if(this._curPos={x:t,y:i},this.snapper.onMouseMove(new THREE.Vector2(t,i)),this.snapper.isSnapped()&&this._robberObj){let e=this._correctResult(this.snapper.getSnapResult().clone()).intersectPoint;this._robberBind?(this._robberBind.geometry.vertices[1].set(e.x,e.y,e.z),this._robberBind.geometry.verticesNeedUpdate=!0):(console.log("create robber bind"),this._robberBind=create3dLine(this._lastPoint,e,"#009bfc",60),console.log(this._robberBind),this._robberObj.add(this._robberBind),this._robberObj.needsUpdate=!0)}this.snapper.indicator.render()};_handleMousewheel=()=>{this.snapper.indicator.render()};_addPoint(e){if(this._curMeasurement.isFulfilled()){this._curIndicator.hideSublineAndAxisLabel&&this._curIndicator.hideSublineAndAxisLabel(),this._indicators.push(this._curIndicator),this._curIndicator=null,this._curMeasurement=this._getNewMeasurement(this._measurementType),this._curMeasurement.setPick(1,e);let t=e.intersectPoint;this._robberObj=new THREE.Object3D,this.viewer.impl.addOverlay(INDICATOR_LINE_OVERLAY,this._robberObj),this._lastPoint=t}else if(this._curMeasurement.setPick(this._curMeasurement.countPicks()+1,e),this._curMeasurement.isFulfilled())this._settleMeasurement();else{let t=e.intersectPoint;this._lastPoint?(console.log("add line to robberObj"),console.log(this._lastPoint,t),this._robberObj.add(create3dLine(this._lastPoint.clone(),t,"#009bfc",60)),this.viewer.impl.invalidate(!1,!0,!0),console.log(this._robberObj),this._lastPoint=t,this._robberBind&&(this._robberBind.geometry.vertices[0].set(t.x,t.y,t.z),this._robberBind.geometry.verticesNeedUpdate=!0)):(this._robberObj=new THREE.Object3D,this.viewer.impl.addOverlay(INDICATOR_LINE_OVERLAY,this._robberObj),this._lastPoint=t)}}_editingMousemoveHandler=e=>{let{x:t,y:i}=getCanvasCoord(e.target,{x:e.clientX,y:e.clientY});if(this._curPos={x:t,y:i},this.snapper.onMouseMove(new THREE.Vector2(t,i)),this.snapper.isSnapped()){let e=this._correctResult(this.snapper.getSnapResult().clone());console.log(e),this._curIndicator.measurement.setPick(this._curEditingPointIndex,e),this._curIndicator.fetchMeasurementState(),this._curIndicator.updateLabelsValue(this.currentUnit),this._curIndicator.updateMainLabelPos(),this._curIndicator.updateMainline()}};_editingMouseupHandler=e=>{console.log("mouseup"),this._editing=!1,this._curIndicator.showMainlineAndAxisLabel(this.currentUnit),this._curIndicator.showSublineAndAxisLabel(this.currentUnit),this.viewer.container.removeEventListener("mousemove",this._editingMousemoveHandler),this.viewer.container.removeEventListener("mouseup",this._editingMouseupHandler)};_settleDistanceMeasurement(){this._curIndicator=new DistanceMeasurementIndicator(this.viewer,this._curMeasurement),this._curIndicator.showMainlineAndAxisLabel(this.currentUnit),this._curIndicator.showSublineAndAxisLabel(this.currentUnit),this._curIndicator.updateLabelsValue(this.currentUnit)}_settleAngleMeasurement(){this._curIndicator=new AngleMeasurementIndicator(this.viewer,this._curMeasurement),this._curIndicator.showMainlineAndAxisLabel(this.currentUnit),this._curIndicator.showSublineAndAxisLabel(this.currentUnit),this._curIndicator.updateLabelsValue(this.currentUnit),this._curIndicator.updateMainLabelPos()}_selectCallback=e=>{this._curIndicator!=e&&(this._curIndicator&&this._curIndicator.hideSublineAndAxisLabel(),this._curIndicator=e,this._curIndicator.showMainlineAndAxisLabel(this.currentUnit),this._curIndicator.showSublineAndAxisLabel(this.currentUnit),this._curIndicator.updateLabelsValue(this.currentUnit))};_settleMeasurement(){this._curIndicator&&this._curIndicator.hideSublineAndAxisLabel(),this._measurementType===MEASUREMENT_DISTANCE?this._settleDistanceMeasurement():this._measurementType===MEASUREMENT_ANGLE&&this._settleAngleMeasurement(),this._measurements.push(this._curMeasurement),this._indicators.push(this._curIndicator),this._curIndicator.bindSelectCallback(this._selectCallback),this._curIndicator.bindMoveEndPointCallback(this._handleEndPointShowerMousedown),this.viewer.impl.removeOverlay(INDICATOR_LINE_OVERLAY,this._robberObj),this._lastPoint=null,this._robberObj=null,this._robberBind=null,console.log("clear robberobj")}_handleMousedown=e=>{this._mouseDownCanvasPos=getCanvasCoord(e.target,{x:e.clientX,y:e.clientY}),this._mouseDownTime=Date.now()};_handleMouseUp=e=>{let{x:t,y:i}=getCanvasCoord(e.target,{x:e.clientX,y:e.clientY}),s=Date.now();if(this.viewer.clearSelection(),this.snapper.isSnapped()&&s-this._mouseDownTime&&t==this._mouseDownCanvasPos.x&&i==this._mouseDownCanvasPos.y){let e=this._correctResult(this.snapper.getSnapResult().clone());console.log(this._curMeasurement.countPicks()),this._addPoint(e)}};_handleClick=e=>{this.viewer.clearSelection()};_handleEndPointShowerMousedown=(e,t)=>{if(e!=this._curIndicator)throw"Unknown condition with unmatched indicator";this._curIndicator.hideSublineAndAxisLabel(),this._curEditingPointIndex=t,this.viewer.container.addEventListener("mousemove",this._editingMousemoveHandler),this.viewer.container.addEventListener("mouseup",this._editingMouseupHandler)};getMeasurementData(){return this._measurements.reduce((e,t)=>t?[...e,t.getData()]:e,[])}loadMeasurementData(e){e.forEach(e=>{let t,i=this._measurements.length;switch(e.type){case MEASUREMENT_DISTANCE:case MEASUREMENT_ANGLE:t=new Measurement(e.type,i),e.points.forEach((e,i)=>{let s=MeasureCommon.project(new THREE.Vector3(e.x,e.y,e.z),this.viewer);this.snapper.onMouseMove(s);let n=this._correctResult(this.snapper.getSnapResult().clone());t.setPick(i+1,n)});break;case 998:t=new PointMeasurement(e.type,i),t.setPick(e.points);default:throw"loadMeasurementData: Unknown measurement type"}let s=new MeasurementWrapper(t,i),n=new DistanceMeasurementIndicator(this.viewer,s);n.showMainlineAndAxisLabel(this.currentUnit),n.bindSelectCallback(this._selectCallback),this._indicators.push(n),this._measurements.push(s)})}hideAll(){this._curIndicator&&this._curIndicator.hideSublineAndAxisLabel(),this._curIndicator=null,this._indicators.forEach(e=>e.destory())}showAll(){this._indicators.forEach(e=>{e.showMainlineAndAxisLabel(this.currentUnit),e.bindSelectCallback(this._selectCallback)})}}