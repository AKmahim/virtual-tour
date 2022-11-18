(function(){
    var script = {
 "mouseWheelEnabled": true,
 "start": "this.init()",
 "mobileMipmappingEnabled": false,
 "children": [
  "this.MainViewer"
 ],
 "id": "rootPlayer",
 "scrollBarVisible": "rollOver",
 "vrPolyfillScale": 0.5,
 "width": "100%",
 "scrollBarMargin": 2,
 "backgroundPreloadEnabled": true,
 "borderSize": 0,
 "horizontalAlign": "left",
 "defaultVRPointer": "laser",
 "desktopMipmappingEnabled": false,
 "scripts": {
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "getKey": function(key){  return window[key]; },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "registerKey": function(key, value){  window[key] = value; },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "existsKey": function(key){  return key in window; },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "unregisterKey": function(key){  delete window[key]; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } }
 },
 "paddingRight": 0,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "downloadEnabled": false,
 "minHeight": 20,
 "paddingLeft": 0,
 "contentOpaque": false,
 "height": "100%",
 "class": "Player",
 "minWidth": 20,
 "paddingBottom": 0,
 "layout": "absolute",
 "borderRadius": 0,
 "paddingTop": 0,
 "scrollBarColor": "#000000",
 "definitions": [{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -96,
  "pitch": -1.7
 },
 "id": "panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 172.94,
  "pitch": 0
 },
 "id": "camera_9B13B039_8A94_D5DC_41DA_A6B0BD79647D",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -90.15,
  "pitch": 0
 },
 "id": "camera_9B850FAF_8A94_EAF3_41D2_88A6215F6F42",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -7.79,
  "pitch": 0
 },
 "id": "camera_999EFEB1_8A94_EAEC_41D3_56D9DE915042",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -87.55,
  "pitch": 0
 },
 "id": "camera_989FED98_8A94_EEDD_41DA_B87DCB1676F6",
 "automaticZoomSpeed": 10
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_9BDC5D17_8A94_EFD3_41D2_4F74C57A61B2, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_9BDC5D17_8A94_EFD3_41D2_4F74C57A61B2, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "media": "this.video_84DE611E_8A93_B7D5_41D6_0F9EA054E4DA",
   "player": "this.MainViewerVideoPlayer"
  }
 ],
 "id": "playList_9BDC5D17_8A94_EFD3_41D2_4F74C57A61B2"
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -62.62,
  "pitch": 0
 },
 "id": "camera_98DA9DC3_8A94_EEB3_41D2_B9549B4E13E1",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 171.17,
  "pitch": 0
 },
 "id": "camera_9B5F806D_8A94_D674_41C5_BAD4566920D8",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -89.11,
  "pitch": 0
 },
 "id": "camera_9B9CDFBA_8A94_EADC_41DB_DFF250399973",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -106.69,
  "pitch": 0
 },
 "id": "camera_98068E13_8A94_EDAC_41CE_6D310910C9ED",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 42.05,
  "pitch": 0
 },
 "id": "camera_98C180BE_8A94_D6D4_41B8_49D947712512",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 86.93,
  "pitch": 0
 },
 "id": "camera_986C8E8E_8A94_EAB4_41D0_86E7D485C171",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -87.48,
  "pitch": -2.84
 },
 "id": "panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 169.6,
  "pitch": 0
 },
 "id": "camera_9A629F66_8A94_EA74_41D1_3A667F259483",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -92.2,
  "pitch": 0
 },
 "id": "camera_9B09B024_8A94_D5F4_41DF_414BE4E84162",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "27",
 "id": "panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 140.53,
   "panorama": "this.panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD",
   "distance": 1,
   "backwardYaw": -26.96
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -90.67,
   "panorama": "this.panorama_5393F731_7057_EECF_41D8_2193DE21467A",
   "distance": 1,
   "backwardYaw": 89.85
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_55216846_73B1_2352_41D9_8918340A55B5",
  "this.overlay_54C28BCD_73B1_6556_41A6_8F993E5584B2"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -88.62,
  "pitch": 0
 },
 "id": "panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 147.74,
  "pitch": 0
 },
 "id": "camera_99C8DED0_8A94_EAAC_41BF_418354511F3D",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -80.28,
  "pitch": 0
 },
 "id": "camera_98D350C9_8A94_D6BC_41E1_1E22F1F6E49F",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -11.64,
  "pitch": -0.85
 },
 "id": "panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "id": "panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "media": "this.panorama_7AC944C0_704F_1096_41CC_FB746688AAE7",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "media": "this.panorama_7A27CE69_704F_1069_41D2_E246D309FFA4",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "media": "this.panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "media": "this.panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "media": "this.panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A239570_704F_7076_4188_69F7B87F5323_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "media": "this.panorama_7A239570_704F_7076_4188_69F7B87F5323",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "media": "this.panorama_7A23BED3_704F_70BA_419E_85F35EC070E2",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "media": "this.panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "media": "this.panorama_7A22A229_704F_3396_41C6_DE07CAD419EC",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "media": "this.panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A221504_704F_119F_41B4_7CF7828D13F0_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "media": "this.panorama_7A221504_704F_119F_41B4_7CF7828D13F0",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "media": "this.panorama_7A211E56_704F_13BA_419D_7F32F8B0E231",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "media": "this.panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "media": "this.panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "media": "this.panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "media": "this.panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 17)",
   "media": "this.panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 17, 18)",
   "media": "this.panorama_7A3ED87F_7051_106A_41BB_70BC10171E67",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3F6210_7051_73B6_41CD_00695B402868_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 18, 19)",
   "media": "this.panorama_7A3F6210_7051_73B6_41CD_00695B402868",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 19, 20)",
   "media": "this.panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 20, 21)",
   "media": "this.panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 21, 22)",
   "media": "this.panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 22, 23)",
   "media": "this.panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 23, 24)",
   "media": "this.panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 24, 25)",
   "media": "this.panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 25, 26)",
   "media": "this.panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 26, 27)",
   "media": "this.panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 27, 28)",
   "media": "this.panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 28, 29)",
   "media": "this.panorama_7A3EA27B_7051_306A_41DA_E9C19520171A",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_5393F731_7057_EECF_41D8_2193DE21467A_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 29, 30)",
   "media": "this.panorama_5393F731_7057_EECF_41D8_2193DE21467A",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "end": "this.trigger('tourEnded')",
   "camera": "this.panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 30, 0)",
   "media": "this.panorama_504301D3_7057_2572_41D1_5AFEA5CD4210",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "mainPlayList"
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "id": "panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "28",
 "id": "panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 135.68,
   "panorama": "this.panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1",
   "distance": 1,
   "backwardYaw": -32.34
  },
  {
   "panorama": "this.panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD",
   "class": "AdjacentPanorama"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -98.52,
   "panorama": "this.panorama_504301D3_7057_2572_41D1_5AFEA5CD4210",
   "distance": 1,
   "backwardYaw": 54.41
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_51FECC21_73B3_62CE_41DB_BD1153422F5C",
  "this.overlay_568F146C_73B7_2355_41D9_D1E345A8BA2F",
  "this.overlay_5FE3D4C6_704F_2352_41C8_091EF31D5FDC"
 ]
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "18",
 "id": "panorama_7A3ED87F_7051_106A_41BB_70BC10171E67",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 169.03,
   "panorama": "this.panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084",
   "distance": 1,
   "backwardYaw": -8.83
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -3.37,
   "panorama": "this.panorama_7A3F6210_7051_73B6_41CD_00695B402868",
   "distance": 1,
   "backwardYaw": 167.85
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_6CF5B0C9_707F_235E_41C5_874A965C226C",
  "this.overlay_6C2BED36_7071_1D32_41D9_6A3102BFA77A"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 72.41,
  "pitch": 0
 },
 "id": "camera_9BA9CFC4_8A94_EAB5_41CC_535FF86B136F",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "3",
 "id": "panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 40.49,
   "panorama": "this.panorama_7A27CE69_704F_1069_41D2_E246D309FFA4",
   "distance": 1,
   "backwardYaw": -143.32
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -90.97,
   "panorama": "this.panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655",
   "distance": 1,
   "backwardYaw": 96.28
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -48.63,
   "panorama": "this.panorama_7A239570_704F_7076_4188_69F7B87F5323",
   "distance": 1,
   "backwardYaw": 141.82
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_7F12E43F_7071_6333_41D7_503276F2C26A",
  "this.overlay_7FFA0C9B_7071_63F2_41BA_09805CD662E1",
  "this.overlay_7FBB3162_704F_254D_41D7_D0B35469CDE1",
  "this.overlay_84ACEEBF_8A9C_AAD3_41D3_61404B7C0ED9"
 ]
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "23",
 "id": "panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 166.03,
   "panorama": "this.panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB",
   "distance": 1,
   "backwardYaw": -7.06
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -85.03,
   "panorama": "this.panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F",
   "distance": 1,
   "backwardYaw": 88.55
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_51EF9F88_7053_3DDD_41C9_08E0045A5A20",
  "this.overlay_50EFD635_7051_2F36_41CB_D1CC6234E72E"
 ]
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "9",
 "id": "panorama_7A22A229_704F_3396_41C6_DE07CAD419EC",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -85.37,
   "panorama": "this.panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39",
   "distance": 1,
   "backwardYaw": 90.89
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 73.31,
   "panorama": "this.panorama_7A23BED3_704F_70BA_419E_85F35EC070E2",
   "distance": 1,
   "backwardYaw": -107.59
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_66B6F5E7_70B3_2D53_41C2_53AD66C02AC9",
  "this.overlay_66703718_70B1_6EFE_41B3_ED8FA90D2717"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 96.28,
  "pitch": 1.7
 },
 "id": "panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": 5.08,
    "easing": "cubic_in_out",
    "path": "shortest",
    "yawSpeed": 33.25,
    "targetYaw": -91.67,
    "pitchSpeed": 17.05
   }
  ]
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -86.5,
  "pitch": 0
 },
 "id": "camera_9895E0A0_8A94_D6EC_41D0_72EC1F852982",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -92.02,
  "pitch": -1.99
 },
 "id": "panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "15",
 "id": "panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135",
   "class": "AdjacentPanorama"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -10.4,
   "panorama": "this.panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084",
   "distance": 1,
   "backwardYaw": 172.21
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 45.37,
   "panorama": "this.panorama_7A3EA27B_7051_306A_41DA_E9C19520171A",
   "distance": 1,
   "backwardYaw": -142.58
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 168.86,
   "panorama": "this.panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C",
   "distance": 1,
   "backwardYaw": 1.44
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 122.98,
   "panorama": "this.panorama_5393F731_7057_EECF_41D8_2193DE21467A",
   "distance": 1,
   "backwardYaw": -32.26
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_6DD92F6B_71D1_7D52_41DA_73D7D905CAA2",
  "this.overlay_6DB1EB3F_71D3_E532_41D1_195D505B6085",
  "this.overlay_5CCC1A8B_7050_E7D3_41DA_63DDCFA86185",
  "this.overlay_4350FA15_7051_26F6_41D4_22AE3150941C",
  "this.overlay_42C53962_7050_E552_41C9_5617F3FB1432"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -92.71,
  "pitch": 0
 },
 "id": "camera_98101E29_8A94_EDFC_4190_8C1328BF0776",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -44.32,
  "pitch": 0
 },
 "id": "camera_98BA3DAE_8A94_EEF5_41A5_BF3747F3991C",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "2",
 "id": "panorama_7A27CE69_704F_1069_41D2_E246D309FFA4",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 88.24,
   "panorama": "this.panorama_7AC944C0_704F_1096_41CC_FB746688AAE7",
   "distance": 1,
   "backwardYaw": -87.62
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -97.56,
   "panorama": "this.panorama_7A239570_704F_7076_4188_69F7B87F5323",
   "distance": 1,
   "backwardYaw": 83.5
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -143.32,
   "panorama": "this.panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66",
   "distance": 1,
   "backwardYaw": 40.49
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_7FAC3DA2_704F_7DCD_41B7_B99F79FFFC8E",
  "this.overlay_7FD76870_7070_E34D_417C_8819381E8652",
  "this.overlay_7FB3F4A2_7071_63D2_41CD_F89AF5EA0205",
  "this.overlay_84268B62_8A9F_AA6D_41D9_1F6C27F0B332"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -91.45,
  "pitch": 0
 },
 "id": "camera_9B293044_8A94_D5B4_41DA_3BD11F5CFD2B",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -88.95,
  "pitch": 0
 },
 "id": "camera_98D44DD7_8A94_EE53_41D5_7A69F483CD5E",
 "automaticZoomSpeed": 10
},
{
 "class": "VideoPlayer",
 "id": "MainViewerVideoPlayer",
 "viewerArea": "this.MainViewer",
 "displayPlaybackBar": true
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -109.31,
  "pitch": 0
 },
 "id": "camera_9BB41FE4_8A94_EA75_41D8_85D49C538258",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "14",
 "id": "panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135",
   "class": "AdjacentPanorama"
  },
  {
   "panorama": "this.panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD",
   "class": "AdjacentPanorama"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 164.38,
   "panorama": "this.panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152",
   "distance": 1,
   "backwardYaw": -1.53
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 65.41,
   "panorama": "this.panorama_5393F731_7057_EECF_41D8_2193DE21467A",
   "distance": 1,
   "backwardYaw": -145.45
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 1.44,
   "panorama": "this.panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837",
   "distance": 1,
   "backwardYaw": 168.86
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_6866C0FF_71B1_2333_41D9_3CB28C2F8AA9",
  "this.overlay_6BBB6625_71B3_6ED2_41D8_159277BE4D32",
  "this.overlay_5C257871_7051_E332_41C6_5BD6EFEF21A2",
  "this.overlay_5C221AF3_7053_2732_41C1_464B3C2D2342",
  "this.overlay_5D0A0E8E_7053_1FD2_41C4_25AB9B7D3DE7"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 104.43,
  "pitch": 0
 },
 "id": "camera_9B0D3D32_8A94_EFEC_41AE_1B7DFF57886E",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "1",
 "id": "panorama_7AC944C0_704F_1096_41CC_FB746688AAE7",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -87.62,
   "panorama": "this.panorama_7A27CE69_704F_1069_41D2_E246D309FFA4",
   "distance": 1,
   "backwardYaw": 88.24
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_7DDD6484_7051_23D6_41D9_A51A1A0AE696"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 34.55,
  "pitch": 0
 },
 "id": "camera_9B316059_8A94_D65C_41DC_0495940FAC0C",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -92.31,
  "pitch": 0.28
 },
 "id": "panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -5.68,
  "pitch": 0.57
 },
 "id": "panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -87.84,
  "pitch": 0
 },
 "id": "camera_98312E53_8A94_EDAC_41D7_FBA6A2A20193",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 92.02,
  "pitch": 0.28
 },
 "id": "panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -103.67,
  "pitch": -12.5
 },
 "id": "panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "24",
 "id": "panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_7A239570_704F_7076_4188_69F7B87F5323",
   "class": "AdjacentPanorama"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -7.06,
   "panorama": "this.panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA",
   "distance": 1,
   "backwardYaw": 166.03
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_500E08EA_7057_635D_41D8_AFC29F51AF9D",
  "this.overlay_530A3838_7051_633E_41CD_6E7E1235C5EF"
 ]
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "4",
 "id": "panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1",
   "class": "AdjacentPanorama"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -91.87,
   "panorama": "this.panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142",
   "distance": 1,
   "backwardYaw": 92.16
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 2.11,
   "panorama": "this.panorama_7A239570_704F_7076_4188_69F7B87F5323",
   "distance": 1,
   "backwardYaw": 175.34
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 96.28,
   "panorama": "this.panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66",
   "distance": 1,
   "backwardYaw": -90.97
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_615ABE75_7051_1F36_41DA_1449191E69A2",
  "this.overlay_6279A60F_7053_6ED3_41B9_34347F14C935",
  "this.overlay_61B52815_7051_62F6_41C2_27460228023F",
  "this.overlay_42CCC360_7051_654D_41D9_751D21869B6F",
  "this.overlay_9ABF8BE0_8A9D_EA6C_41DB_4DFB62FE3E2A"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -96.5,
  "pitch": 0
 },
 "id": "camera_9B75708C_8A94_D6B4_41B7_4C0CE57C6C09",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "7",
 "id": "panorama_7A23BED3_704F_70BA_419E_85F35EC070E2",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 99.72,
   "panorama": "this.panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142",
   "distance": 1,
   "backwardYaw": -86.27
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -107.59,
   "panorama": "this.panorama_7A22A229_704F_3396_41C6_DE07CAD419EC",
   "distance": 1,
   "backwardYaw": 73.31
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_669A0C5E_7053_2375_418B_6748416C246C",
  "this.overlay_64E7C9DC_7051_2576_41D9_5360DEA0362A"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 93.73,
  "pitch": 0
 },
 "id": "camera_98F64DFD_8A94_EE54_41D9_AE57A2730FD7",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 81.48,
  "pitch": 0
 },
 "id": "camera_9BA04FCF_8A94_EAB4_41D8_CF008ADE80EA",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -145.79,
  "pitch": 0
 },
 "id": "camera_9A739F85_8A94_EAB7_419C_086E82B7E024",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -88.33,
  "pitch": -0.85
 },
 "id": "panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 178.47,
  "pitch": 0
 },
 "id": "camera_9B25204E_8A94_D5B4_41AD_6FE7A0CF525A",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 82.44,
  "pitch": 0
 },
 "id": "camera_9A661F71_8A94_EA6C_41D7_C4FFEB0B1468",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 6.82,
  "pitch": 2.56
 },
 "id": "panorama_7A3F6210_7051_73B6_41CD_00695B402868_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -49.7,
  "pitch": -1.7
 },
 "id": "panorama_7A239570_704F_7076_4188_69F7B87F5323_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -139.51,
  "pitch": 0
 },
 "id": "camera_9885B096_8A94_D6D4_41E0_190C25F5ECEA",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -9.37,
  "pitch": 0.85
 },
 "id": "panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "29",
 "id": "panorama_7A3EA27B_7051_306A_41DA_E9C19520171A",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280",
   "class": "AdjacentPanorama"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -107.51,
   "panorama": "this.panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084",
   "distance": 1,
   "backwardYaw": 91.05
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -142.58,
   "panorama": "this.panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837",
   "distance": 1,
   "backwardYaw": 45.37
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_595F47D5_7071_2D76_41C8_F345085684D3",
  "this.overlay_5EB34232_7073_26CD_41CA_9A28BD41A04B",
  "this.overlay_5EB42946_7070_E555_41D6_BCACB41F7745"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 88.13,
  "pitch": 0
 },
 "id": "camera_98B100B4_8A94_D6D4_41B2_A80436394B3D",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "20",
 "id": "panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 87.8,
   "panorama": "this.panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280",
   "distance": 1,
   "backwardYaw": -81.98
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -93.07,
   "panorama": "this.panorama_7A3F6210_7051_73B6_41CD_00695B402868",
   "distance": 1,
   "backwardYaw": 54.85
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_6FDEF9EF_7073_6553_41BA_5EB605778EE7",
  "this.overlay_6E54248A_7073_23D2_41D2_2CBC7D6C1852"
 ]
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "13",
 "id": "panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 135.69,
   "panorama": "this.panorama_7A211E56_704F_13BA_419D_7F32F8B0E231",
   "distance": 1,
   "backwardYaw": -23.11
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -1.53,
   "panorama": "this.panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C",
   "distance": 1,
   "backwardYaw": 164.38
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_68A14AF5_7051_2737_41C4_64A1CC63969D",
  "this.overlay_6AF9E9DC_7050_E575_41C1_E95F00D57ACD"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 72.49,
  "pitch": 0
 },
 "id": "camera_99272F19_8A94_EBDC_41D7_A568170487E7",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -84.64,
  "pitch": 0.85
 },
 "id": "panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 153.04,
  "pitch": 0
 },
 "id": "camera_9B826FA5_8A94_EAF4_419B_3613D8F1D2ED",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 37.42,
  "pitch": 0
 },
 "id": "camera_99AEDEBC_8A94_EAD4_41D1_992D599014D6",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 109.14,
  "pitch": 0
 },
 "id": "camera_9B277D51_8A94_EFAF_41B3_119FC5A48467",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "30",
 "id": "panorama_5393F731_7057_EECF_41D8_2193DE21467A",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -32.26,
   "panorama": "this.panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837",
   "distance": 1,
   "backwardYaw": 122.98
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -145.45,
   "panorama": "this.panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C",
   "distance": 1,
   "backwardYaw": 65.41
  },
  {
   "panorama": "this.panorama_7A3EA27B_7051_306A_41DA_E9C19520171A",
   "class": "AdjacentPanorama"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 107.02,
   "panorama": "this.panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD",
   "distance": 1,
   "backwardYaw": -70.86
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 89.85,
   "panorama": "this.panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135",
   "distance": 1,
   "backwardYaw": -90.67
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_5A63EA0E_73B1_E6D2_41D2_22314376BD7F",
  "this.overlay_5ADA32D0_73B3_274D_41D2_63C68BFCD21E",
  "this.overlay_5863719F_7070_E5F3_41BF_BE4971A26474",
  "this.overlay_58133318_7077_26FD_41D3_099E06D34A59",
  "this.overlay_59F43E52_7077_7F72_41D1_CA910F0C4B0E"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -72.98,
  "pitch": 0
 },
 "id": "camera_9BDF5FF9_8A94_EA5F_41D8_120ACEDC6992",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -4.26,
  "pitch": 0.28
 },
 "id": "panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 147.66,
  "pitch": 0
 },
 "id": "camera_9BE7C00E_8A94_D5B5_41A6_446BA99C7ADB",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "25",
 "id": "panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -32.34,
   "panorama": "this.panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06",
   "distance": 1,
   "backwardYaw": 135.68
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 122.09,
   "panorama": "this.panorama_7A239570_704F_7076_4188_69F7B87F5323",
   "distance": 1,
   "backwardYaw": -55.9
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -70.69,
   "panorama": "this.panorama_504301D3_7057_2572_41D1_5AFEA5CD4210",
   "distance": 1,
   "backwardYaw": 117.38
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_5321FE63_7051_FF53_41D4_7A620930E32A",
  "this.overlay_521070F8_704F_233D_41D6_4F7162DC7EC0",
  "this.overlay_560CD5C3_73B1_6D52_41CC_BAE1433D3F64"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -83.72,
  "pitch": 0
 },
 "id": "camera_99EAFEE5_8A94_EA74_4198_751AB74DA37C",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -38.18,
  "pitch": 0
 },
 "id": "camera_99FB3EEF_8A94_EA74_41C6_8E0939E760CF",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "31",
 "id": "panorama_504301D3_7057_2572_41D1_5AFEA5CD4210",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 54.41,
   "panorama": "this.panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06",
   "distance": 1,
   "backwardYaw": -98.52
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 117.38,
   "panorama": "this.panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1",
   "distance": 1,
   "backwardYaw": -70.69
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -126.03,
   "panorama": "this.panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD",
   "distance": 1,
   "backwardYaw": 70.69
  },
  {
   "panorama": "this.panorama_5393F731_7057_EECF_41D8_2193DE21467A",
   "class": "AdjacentPanorama"
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_5516A9A8_73BF_E5DD_41DB_D12D35E134FF",
  "this.overlay_58894958_73BF_257D_41AB_97C9D4520C96",
  "this.overlay_5851C76A_7071_2D52_41D0_2B6FAAC07C53",
  "this.overlay_582B95FF_7073_2D32_41B4_178603025F17"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 98.02,
  "pitch": 0
 },
 "id": "camera_9B7DED84_8A94_EEB4_41DD_6224D8E6DE68",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -12.15,
  "pitch": 0
 },
 "id": "camera_9B6A3077_8A94_D654_41C9_B4F28C64E140",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -91.67,
  "pitch": 5.08
 },
 "id": "panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "TargetPanoramaCameraMovement",
    "targetPitch": 5.08,
    "easing": "cubic_in_out",
    "path": "shortest",
    "yawSpeed": 33.25,
    "targetYaw": -91.67,
    "pitchSpeed": 17.05
   }
  ]
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 156.89,
  "pitch": 0
 },
 "id": "camera_9B41CD66_8A94_EE74_41DF_8A1C8ACA9227",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -125.15,
  "pitch": 0
 },
 "id": "camera_988DDD8E_8A94_EEB4_41B1_90E8BD8F8FB3",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "22",
 "id": "panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -85.82,
   "panorama": "this.panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280",
   "distance": 1,
   "backwardYaw": 87.29
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 88.55,
   "panorama": "this.panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA",
   "distance": 1,
   "backwardYaw": -85.03
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_51EDDF72_7051_3D32_41D8_03B1EDFF19CF",
  "this.overlay_500C4C12_7050_E2CD_41D9_70EFA5BFE0FC"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -39.47,
  "pitch": 0
 },
 "id": "camera_9BC13FEE_8A94_EA75_41B9_8D00D6689579",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 94.97,
  "pitch": 0
 },
 "id": "camera_98208E3E_8A94_EDD4_41C3_3E1B8D304ACC",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "id": "panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "id": "panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -57.91,
  "pitch": 0
 },
 "id": "camera_9A75AF90_8A94_EAAC_4195_D9A5415DBD0E",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -15.62,
  "pitch": 0
 },
 "id": "camera_9B63DD7A_8A94_EE5C_41C0_F00EEE04D5DF",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "16",
 "id": "panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 91.05,
   "panorama": "this.panorama_7A3EA27B_7051_306A_41DA_E9C19520171A",
   "distance": 1,
   "backwardYaw": -107.51
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -8.83,
   "panorama": "this.panorama_7A3ED87F_7051_106A_41BB_70BC10171E67",
   "distance": 1,
   "backwardYaw": 169.03
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 172.21,
   "panorama": "this.panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837",
   "distance": 1,
   "backwardYaw": -10.4
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_6A56D3A1_71D1_65CE_41BE_F826FF2950DA",
  "this.overlay_6AC00109_71DF_22DF_41D4_B32E62083798",
  "this.overlay_5F7DCDB5_7053_3D36_41DB_6151F5F48546"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "id": "panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -10.97,
  "pitch": 0
 },
 "id": "camera_9930FF23_8A94_EBEC_41D6_08F22E38E79D",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "19",
 "id": "panorama_7A3F6210_7051_73B6_41CD_00695B402868",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 54.85,
   "panorama": "this.panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603",
   "distance": 1,
   "backwardYaw": -93.07
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 167.85,
   "panorama": "this.panorama_7A3ED87F_7051_106A_41BB_70BC10171E67",
   "distance": 1,
   "backwardYaw": -3.37
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_6F65B12E_7073_22D5_41D4_B1777557C4AC",
  "this.overlay_6F89820B_7071_E6D3_41DA_8DE529B46CB3"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -4.66,
  "pitch": 0
 },
 "id": "camera_9842FE64_8A94_EA74_41C9_B98AED12E421",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "5",
 "id": "panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 92.16,
   "panorama": "this.panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655",
   "distance": 1,
   "backwardYaw": -91.87
  },
  {
   "panorama": "this.panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1",
   "class": "AdjacentPanorama"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 34.21,
   "panorama": "this.panorama_7A239570_704F_7076_4188_69F7B87F5323",
   "distance": 1,
   "backwardYaw": -137.95
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -86.27,
   "panorama": "this.panorama_7A23BED3_704F_70BA_419E_85F35EC070E2",
   "distance": 1,
   "backwardYaw": 99.72
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_635E28D6_705F_2375_41D9_5BB6E9C3FD28",
  "this.overlay_637C5B37_7051_2532_41A2_D29D91CEEDFC",
  "this.overlay_64D603FD_7050_E537_41C3_17ACA3239AD2",
  "this.overlay_42B1E473_705F_6333_41C9_7C6DAB291F69"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -11.14,
  "pitch": 0
 },
 "id": "camera_9B4DA063_8A94_D66C_41D4_F7335ACCD7C6",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -178.56,
  "pitch": 0
 },
 "id": "camera_99B8AEC6_8A94_EAB4_41C1_886CC6C6C125",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "10",
 "id": "panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -75.57,
   "panorama": "this.panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC",
   "distance": 1,
   "backwardYaw": 92.45
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 90.89,
   "panorama": "this.panorama_7A22A229_704F_3396_41C6_DE07CAD419EC",
   "distance": 1,
   "backwardYaw": -85.37
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_6A82A6AB_70B7_6FD2_41DA_D9F7E063E352",
  "this.overlay_67DDAF78_70B1_3D3E_41D6_7029B0B0B811"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 95.43,
  "pitch": 2.56
 },
 "id": "panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -13.97,
  "pitch": 0
 },
 "id": "camera_998E8EA7_8A94_EAF4_41D3_DD2B44266070",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -90.89,
  "pitch": 3.41
 },
 "id": "panorama_5393F731_7057_EECF_41D8_2193DE21467A_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "6",
 "id": "panorama_7A239570_704F_7076_4188_69F7B87F5323",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 83.5,
   "panorama": "this.panorama_7A27CE69_704F_1069_41D2_E246D309FFA4",
   "distance": 1,
   "backwardYaw": -97.56
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 175.34,
   "panorama": "this.panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655",
   "distance": 1,
   "backwardYaw": 2.11
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -137.95,
   "panorama": "this.panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142",
   "distance": 1,
   "backwardYaw": 34.21
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -55.9,
   "panorama": "this.panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1",
   "distance": 1,
   "backwardYaw": 122.09
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 141.82,
   "panorama": "this.panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66",
   "distance": 1,
   "backwardYaw": -48.63
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_6430C093_7050_E3F3_41D6_07156CE92789",
  "this.overlay_63A85FEA_7051_3D5D_4185_7547E4C44906",
  "this.overlay_647E6CB2_7050_E332_4177_3AA11F3DCCB8",
  "this.overlay_643BC4D7_7057_E373_41C0_42415776191E",
  "this.overlay_551CB018_7053_E2FE_41D1_F6A1DFA3FE4F",
  "this.overlay_9A0676ED_8A9C_BA74_41DB_E92225730298"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -88.9,
  "pitch": -1.99
 },
 "id": "panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "12",
 "id": "panorama_7A211E56_704F_13BA_419D_7F32F8B0E231",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -23.11,
   "panorama": "this.panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152",
   "distance": 1,
   "backwardYaw": 135.69
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 93.5,
   "panorama": "this.panorama_7A221504_704F_119F_41B4_7CF7828D13F0",
   "distance": 1,
   "backwardYaw": -83.45
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_6761B49D_7057_23F7_4185_9E7720B6D909",
  "this.overlay_68453992_7053_25F2_41CA_AE66FAAB64D4"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 142.86,
  "pitch": -2.84
 },
 "id": "panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "21",
 "id": "panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -81.98,
   "panorama": "this.panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603",
   "distance": 1,
   "backwardYaw": 87.8
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 87.29,
   "panorama": "this.panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F",
   "distance": 1,
   "backwardYaw": -85.82
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_6EB1017D_7070_E536_41C0_BAE820711A53",
  "this.overlay_50CCF53F_704F_ED33_41CB_69D32B2C2961"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "id": "panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "11",
 "id": "panorama_7A221504_704F_119F_41B4_7CF7828D13F0",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -83.45,
   "panorama": "this.panorama_7A211E56_704F_13BA_419D_7F32F8B0E231",
   "distance": 1,
   "backwardYaw": 93.5
  },
  {
   "panorama": "this.panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39",
   "class": "AdjacentPanorama"
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_67A84884_70D0_E3D6_41CE_FD05E86B25A3",
  "this.overlay_676555D5_70D0_ED77_41CE_D6D89E0C9B03"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 124.1,
  "pitch": 0
 },
 "id": "camera_98CA0DB9_8A94_EEDC_41DA_CA7E6C01CB30",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 131.37,
  "pitch": 0
 },
 "id": "camera_9B88EF9A_8A94_EADD_41A6_6318BC5DBBF3",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "id": "panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 89.33,
  "pitch": 0
 },
 "id": "camera_9B314D5C_8A94_EE54_41D2_AE3CC6AB3AFF",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "26",
 "id": "panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -26.96,
   "panorama": "this.panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135",
   "distance": 1,
   "backwardYaw": 140.53
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -70.86,
   "panorama": "this.panorama_5393F731_7057_EECF_41D8_2193DE21467A",
   "distance": 1,
   "backwardYaw": 107.02
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 70.69,
   "panorama": "this.panorama_504301D3_7057_2572_41D1_5AFEA5CD4210",
   "distance": 1,
   "backwardYaw": -126.03
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_565C5B38_73B1_E53E_41AC_F6D5BDDE6000",
  "this.overlay_55F1A55C_73B3_2D76_41D4_1138AB0190E3",
  "this.overlay_54B97E9C_73B3_FFF6_41C0_D8DAD09EEEDB"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -134.63,
  "pitch": 0
 },
 "id": "camera_98E4FDEC_8A94_EE75_41DD_763CC5B82C8A",
 "automaticZoomSpeed": 10
},
{
 "class": "PanoramaPlayer",
 "mouseControlMode": "drag_acceleration",
 "viewerArea": "this.MainViewer",
 "displayPlaybackBar": true,
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "touchControlMode": "drag_rotation"
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 94.63,
  "pitch": 0
 },
 "id": "camera_98A83DA4_8A94_EEF4_41AF_56C07493604A",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -84.07,
  "pitch": 1.14
 },
 "id": "panorama_7A221504_704F_119F_41B4_7CF7828D13F0_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 91.17,
  "pitch": -0.28
 },
 "id": "panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 176.63,
  "pitch": 0
 },
 "id": "camera_987CCE9C_8A94_EAD4_41C9_DBD382840E1A",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -177.89,
  "pitch": 0
 },
 "id": "camera_9A78AF7B_8A94_EA5C_41A2_2EFF1C2678F7",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfovMin": "135%",
 "partial": false,
 "hfov": 360,
 "vfov": 180,
 "label": "17",
 "id": "panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 92.38,
  "pitch": 0
 },
 "id": "camera_9B7AC081_8A94_D6AC_41E0_0EF8A4704F9F",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 89.03,
  "pitch": 0
 },
 "id": "camera_98532E79_8A94_EA5C_41D6_11F2E652627D",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -114.59,
  "pitch": 0
 },
 "id": "camera_9B15ED47_8A94_EFB4_41E0_40CF95D70725",
 "automaticZoomSpeed": 10
},
{
 "label": "color2_1",
 "scaleMode": "fit_inside",
 "width": 1400,
 "class": "Video",
 "loop": false,
 "thumbnailUrl": "media/video_84DE611E_8A93_B7D5_41D6_0F9EA054E4DA_t.jpg",
 "id": "video_84DE611E_8A93_B7D5_41D6_0F9EA054E4DA",
 "height": 3500,
 "video": {
  "width": 608,
  "class": "VideoResource",
  "height": 1520,
  "mp4Url": "media/video_84DE611E_8A93_B7D5_41D6_0F9EA054E4DA.mp4"
 }
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -91.76,
  "pitch": 0
 },
 "id": "camera_99F4EEFA_8A94_EA5C_41D8_71C71BD911CB",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -57.02,
  "pitch": 0
 },
 "id": "camera_9B188D3C_8A94_EFD5_41D4_E61B720403CE",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -88.62,
  "pitch": -1.7
 },
 "id": "panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 36.68,
  "pitch": 0
 },
 "id": "camera_99DAAEDB_8A94_EA5C_41DE_63CBE155200F",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 109.31,
  "pitch": 0
 },
 "id": "camera_9BBDAFD9_8A94_EA5F_41BF_CB2F22F75E3A",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "label": "8",
 "id": "panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_t.jpg",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/u/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/b/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/d/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "colCount": 4,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/l/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 180,
 "hfovMin": "135%",
 "adjacentPanoramas": [
  {
   "panorama": "this.panorama_7A211E56_704F_13BA_419D_7F32F8B0E231",
   "class": "AdjacentPanorama"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 92.45,
   "panorama": "this.panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39",
   "distance": 1,
   "backwardYaw": -75.57
  }
 ],
 "partial": false,
 "overlays": [
  "this.overlay_686C7E12_71B1_1EF2_419E_1ECD43B4A914",
  "this.overlay_6B8D1B92_71BF_25F2_4194_6F575E19A1D2"
 ]
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -44.31,
  "pitch": 0
 },
 "id": "camera_99053F04_8A94_EBB4_41D9_76E3584BE02D",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 53.97,
  "pitch": 0
 },
 "id": "camera_9BEBB004_8A94_D5B4_41D0_B75F295780D3",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 96.55,
  "pitch": 0
 },
 "id": "camera_9916DF0E_8A94_EBB4_41C3_6474A8176E0D",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -125.59,
  "pitch": 0
 },
 "id": "camera_9BFD7019_8A94_D5DF_41BD_AD188042DF17",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear",
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "yawDelta": 18.5
   }
  ],
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 94.18,
  "pitch": 0
 },
 "id": "camera_9B07202E_8A94_D5F5_41D6_913B3A25FF00",
 "automaticZoomSpeed": 10
},
{
 "playbackBarBottom": 5,
 "toolTipShadowSpread": 0,
 "progressBorderColor": "#000000",
 "id": "MainViewer",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipBorderColor": "#767676",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "width": "100%",
 "toolTipOpacity": 1,
 "toolTipFontSize": "1.11vmin",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "playbackBarRight": 0,
 "toolTipTextShadowBlurRadius": 3,
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderSize": 0,
 "toolTipPaddingBottom": 4,
 "progressBarBorderRadius": 0,
 "minHeight": 50,
 "paddingLeft": 0,
 "toolTipShadowColor": "#333333",
 "progressBarBorderSize": 0,
 "playbackBarBorderRadius": 0,
 "playbackBarProgressBorderRadius": 0,
 "class": "ViewerArea",
 "height": "100%",
 "minWidth": 100,
 "playbackBarHeadBorderRadius": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowOpacity": 1,
 "toolTipFontStyle": "normal",
 "progressLeft": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "playbackBarBorderSize": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "shadow": false,
 "transitionDuration": 500,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "toolTipShadowHorizontalLength": 0,
 "vrPointerSelectionTime": 2000,
 "progressBarBackgroundColorDirection": "vertical",
 "borderSize": 0,
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadShadow": true,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "progressBottom": 0,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "playbackBarHeadShadowVerticalLength": 0,
 "paddingRight": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "displayTooltipInTouchScreens": true,
 "transitionMode": "blending",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "toolTipPaddingRight": 6,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "borderRadius": 0,
 "paddingBottom": 0,
 "toolTipBorderRadius": 3,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "playbackBarHeadShadowBlurRadius": 3,
 "paddingTop": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorDirection": "vertical",
 "progressBarBorderColor": "#000000",
 "playbackBarHeadOpacity": 1,
 "data": {
  "name": "Main Viewer"
 }
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 140.53,
   "hfov": 18.02,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -22.68
  }
 ],
 "id": "overlay_55216846_73B1_2352_41D9_8918340A55B5",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD, this.camera_9B826FA5_8A94_EAF4_419B_3613D8F1D2ED); this.mainPlayList.set('selectedIndex', 25)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.02,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 140.53,
   "image": "this.AnimatedImageResource_5A9060D8_73B1_237E_41D9_6283474ECE6D",
   "pitch": -22.68,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -90.67,
   "hfov": 18.88,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -14.84
  }
 ],
 "id": "overlay_54C28BCD_73B1_6556_41A6_8F993E5584B2",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_5393F731_7057_EECF_41D8_2193DE21467A, this.camera_9B850FAF_8A94_EAF3_41D2_88A6215F6F42); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.88,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -90.67,
   "image": "this.AnimatedImageResource_5A9090D8_73B1_237E_41CE_109C014F8F37",
   "pitch": -14.84,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -98.52,
   "hfov": 17.49,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -26.41
  }
 ],
 "id": "overlay_51FECC21_73B3_62CE_41DB_BD1153422F5C",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_504301D3_7057_2572_41D1_5AFEA5CD4210, this.camera_9BFD7019_8A94_D5DF_41BD_AD188042DF17); this.mainPlayList.set('selectedIndex', 30)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 17.49,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -98.52,
   "image": "this.AnimatedImageResource_5A9130D9_73B1_237F_41DB_D56C2C52641C",
   "pitch": -26.41,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -110.6,
   "hfov": 19.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -10.94
  }
 ],
 "id": "overlay_568F146C_73B7_2355_41D9_D1E345A8BA2F",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 25)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 19.17,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -110.6,
   "image": "this.AnimatedImageResource_5A9150D9_73B1_237F_41A3_F64C749A5DA1",
   "pitch": -10.94,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 135.68,
   "hfov": 18.35,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -19.98
  }
 ],
 "id": "overlay_5FE3D4C6_704F_2352_41C8_091EF31D5FDC",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1, this.camera_9BE7C00E_8A94_D5B5_41A6_446BA99C7ADB); this.mainPlayList.set('selectedIndex', 24)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.35,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 135.68,
   "image": "this.AnimatedImageResource_4A1E2F56_7053_3D75_41A9_9005FCEFE3CE",
   "pitch": -19.98,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -3.37,
   "hfov": 16.76,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -30.85
  }
 ],
 "id": "overlay_6CF5B0C9_707F_235E_41C5_874A965C226C",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3F6210_7051_73B6_41CD_00695B402868, this.camera_9B6A3077_8A94_D654_41C9_B4F28C64E140); this.mainPlayList.set('selectedIndex', 18)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 16.76,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -3.37,
   "image": "this.AnimatedImageResource_595B73CE_70B7_2552_41D6_47CC65B7AEC6",
   "pitch": -30.85,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 169.03,
   "hfov": 8.36,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -34.18
  }
 ],
 "id": "overlay_6C2BED36_7071_1D32_41D9_6A3102BFA77A",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084, this.camera_9B5F806D_8A94_D674_41C5_BAD4566920D8); this.mainPlayList.set('selectedIndex', 15)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 8.36,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 169.03,
   "image": "this.AnimatedImageResource_595B93D4_70B7_2575_41C4_0ED4A1A55E5F",
   "pitch": -34.18,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -90.97,
   "hfov": 16.74,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -30.96
  }
 ],
 "id": "overlay_7F12E43F_7071_6333_41D7_503276F2C26A",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655, this.camera_99EAFEE5_8A94_EA74_4198_751AB74DA37C); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 16.74,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -90.97,
   "image": "this.AnimatedImageResource_61E02A71_7051_274E_41CA_2B78766F648B",
   "pitch": -30.96,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -48.63,
   "hfov": 9.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -19.9
  }
 ],
 "id": "overlay_7FFA0C9B_7071_63F2_41BA_09805CD662E1",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A239570_704F_7076_4188_69F7B87F5323, this.camera_99FB3EEF_8A94_EA74_41C6_8E0939E760CF); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.23,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -48.63,
   "image": "this.AnimatedImageResource_61E07A71_7051_274E_41D7_D28FD4F20BB9",
   "pitch": -19.9,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 40.49,
   "hfov": 9.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -20.47
  }
 ],
 "id": "overlay_7FBB3162_704F_254D_41D7_D0B35469CDE1",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A27CE69_704F_1069_41D2_E246D309FFA4, this.camera_99DAAEDB_8A94_EA5C_41DE_63CBE155200F); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.2,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 40.49,
   "image": "this.AnimatedImageResource_61E1AA71_7051_274E_41D6_313EFF3E8256",
   "pitch": -20.47,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "hfov": 7.35,
 "autoplay": true,
 "id": "overlay_84ACEEBF_8A9C_AAD3_41D3_61404B7C0ED9",
 "blending": 0,
 "class": "VideoPanoramaOverlay",
 "loop": true,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_84ACEEBF_8A9C_AAD3_41D3_61404B7C0ED9_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1400,
    "height": 3500
   }
  ]
 },
 "useHandCursor": true,
 "roll": 0.49,
 "enabledInCardboard": true,
 "yaw": -1.45,
 "vfov": 14.71,
 "pitch": 1.39,
 "rotationY": -0.17,
 "rotationX": -4.69,
 "data": {
  "label": "Video"
 },
 "videoVisibleOnStop": false,
 "distance": 50,
 "video": {
  "width": 608,
  "class": "VideoResource",
  "height": 1520,
  "mp4Url": "media/video_84DE611E_8A93_B7D5_41D6_0F9EA054E4DA.mp4"
 }
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -85.03,
   "hfov": 18.45,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -19.16
  }
 ],
 "id": "overlay_51EF9F88_7053_3DDD_41C9_08E0045A5A20",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F, this.camera_9B293044_8A94_D5B4_41DA_3BD11F5CFD2B); this.mainPlayList.set('selectedIndex', 21)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.45,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -85.03,
   "image": "this.AnimatedImageResource_595FB3D6_70B7_2575_41D5_28E49E9B94D4",
   "pitch": -19.16,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 166.03,
   "hfov": 12.84,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -13.59
  }
 ],
 "id": "overlay_50EFD635_7051_2F36_41CB_D1CC6234E72E",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB, this.camera_9B13B039_8A94_D5DC_41DA_A6B0BD79647D); this.mainPlayList.set('selectedIndex', 23)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.84,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 166.03,
   "image": "this.AnimatedImageResource_595FC3D6_70B7_2575_41D7_52EAA4DCFB80",
   "pitch": -13.59,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -85.37,
   "hfov": 17.54,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -26.05
  }
 ],
 "id": "overlay_66B6F5E7_70B3_2D53_41C2_53AD66C02AC9",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39, this.camera_9B9CDFBA_8A94_EADC_41DB_DFF250399973); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 17.54,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -85.37,
   "image": "this.AnimatedImageResource_6A0E4874_70B1_2335_417B_55A387CE5054",
   "pitch": -26.05,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 73.31,
   "hfov": 17.73,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -24.79
  }
 ],
 "id": "overlay_66703718_70B1_6EFE_41B3_ED8FA90D2717",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A23BED3_704F_70BA_419E_85F35EC070E2, this.camera_9BA9CFC4_8A94_EAB5_41CC_535FF86B136F); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 17.73,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 73.31,
   "image": "this.AnimatedImageResource_6A0FF874_70B1_2335_41D3_4F2ADBF91103",
   "pitch": -24.79,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 168.86,
   "hfov": 10.79,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -23.74
  }
 ],
 "id": "overlay_6DD92F6B_71D1_7D52_41DA_73D7D905CAA2",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C, this.camera_99B8AEC6_8A94_EAB4_41C1_886CC6C6C125); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 10.79,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 168.86,
   "image": "this.AnimatedImageResource_6C031B27_71D3_26D3_4189_4BFF8A126DC8",
   "pitch": -23.74,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -10.4,
   "hfov": 18.65,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -17.27
  }
 ],
 "id": "overlay_6DB1EB3F_71D3_E532_41D1_195D505B6085",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084, this.camera_999EFEB1_8A94_EAEC_41D3_56D9DE915042); this.mainPlayList.set('selectedIndex', 15)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.65,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -10.4,
   "image": "this.AnimatedImageResource_6C03AB27_71D3_26D3_41DA_5BC8BB197395",
   "pitch": -17.27,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 45.37,
   "hfov": 19.15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -11.28
  }
 ],
 "id": "overlay_5CCC1A8B_7050_E7D3_41DA_63DDCFA86185",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3EA27B_7051_306A_41DA_E9C19520171A, this.camera_99AEDEBC_8A94_EAD4_41D1_992D599014D6); this.mainPlayList.set('selectedIndex', 28)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 19.15,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 45.37,
   "image": "this.AnimatedImageResource_4A240F4B_7053_3D53_41BE_4B9D65CA50E9",
   "pitch": -11.28,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 122.98,
   "hfov": 18.35,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -19.99
  }
 ],
 "id": "overlay_4350FA15_7051_26F6_41D4_22AE3150941C",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_5393F731_7057_EECF_41D8_2193DE21467A, this.camera_99C8DED0_8A94_EAAC_41BF_418354511F3D); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.35,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 122.98,
   "image": "this.AnimatedImageResource_4A24AF4B_7053_3D53_41DC_9FD379D42CFF",
   "pitch": -19.99,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 109.29,
   "hfov": 16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0_HS_4_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -10.67
  }
 ],
 "id": "overlay_42C53962_7050_E552_41C9_5617F3FB1432",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 16,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 109.29,
   "image": "this.AnimatedImageResource_4A272F4C_7053_3D55_41DB_E9C9C463F327",
   "pitch": -10.67,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -143.32,
   "hfov": 18.09,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -22.14
  }
 ],
 "id": "overlay_7FAC3DA2_704F_7DCD_41B7_B99F79FFFC8E",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66, this.camera_9885B096_8A94_D6D4_41E0_190C25F5ECEA); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.09,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -143.32,
   "image": "this.AnimatedImageResource_61E71A70_7051_274E_4190_788BE4A0588E",
   "pitch": -22.14,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -97.56,
   "hfov": 10.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -19.09
  }
 ],
 "id": "overlay_7FD76870_7070_E34D_417C_8819381E8652",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A239570_704F_7076_4188_69F7B87F5323, this.camera_9B75708C_8A94_D6B4_41B7_4C0CE57C6C09); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 10.75,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -97.56,
   "image": "this.AnimatedImageResource_61E75A71_7051_274F_41CD_8727ED2F9DB2",
   "pitch": -19.09,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 88.24,
   "hfov": 18.28,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -20.6
  }
 ],
 "id": "overlay_7FB3F4A2_7071_63D2_41CD_F89AF5EA0205",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7AC944C0_704F_1096_41CC_FB746688AAE7, this.camera_9B7AC081_8A94_D6AC_41E0_0EF8A4704F9F); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.28,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 88.24,
   "image": "this.AnimatedImageResource_61E0EA71_7051_274F_41BE_45017D34FD16",
   "pitch": -20.6,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "hfov": 8.8,
 "autoplay": true,
 "id": "overlay_84268B62_8A9F_AA6D_41D9_1F6C27F0B332",
 "blending": 0,
 "class": "VideoPanoramaOverlay",
 "loop": true,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_84268B62_8A9F_AA6D_41D9_1F6C27F0B332_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1400,
    "height": 3500
   }
  ]
 },
 "useHandCursor": true,
 "roll": 1.5,
 "enabledInCardboard": true,
 "yaw": -13.05,
 "vfov": 18.6,
 "pitch": 1.6,
 "rotationY": -14.53,
 "rotationX": -1.59,
 "data": {
  "label": "Video"
 },
 "videoVisibleOnStop": false,
 "distance": 50,
 "video": {
  "width": 608,
  "class": "VideoResource",
  "height": 1520,
  "mp4Url": "media/video_84DE611E_8A93_B7D5_41D6_0F9EA054E4DA.mp4"
 }
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 164.38,
   "hfov": 13.72,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -32.82
  }
 ],
 "id": "overlay_6866C0FF_71B1_2333_41D9_3CB28C2F8AA9",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152, this.camera_9B25204E_8A94_D5B4_41AD_6FE7A0CF525A); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 13.72,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 164.38,
   "image": "this.AnimatedImageResource_6CA84D1B_71B3_62F2_41C0_77EC95CF63D6",
   "pitch": -32.82,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 1.44,
   "hfov": 18.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -15.48
  }
 ],
 "id": "overlay_6BBB6625_71B3_6ED2_41D8_159277BE4D32",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837, this.camera_9B4DA063_8A94_D66C_41D4_F7335ACCD7C6); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.82,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 1.44,
   "image": "this.AnimatedImageResource_6CA82D1B_71B3_62F2_41D8_AEF5EE040DD9",
   "pitch": -15.48,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 65.41,
   "hfov": 18.79,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -15.76
  }
 ],
 "id": "overlay_5C257871_7051_E332_41C6_5BD6EFEF21A2",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_5393F731_7057_EECF_41D8_2193DE21467A, this.camera_9B316059_8A94_D65C_41DC_0495940FAC0C); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.79,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 65.41,
   "image": "this.AnimatedImageResource_4A221F44_7053_3D56_41BC_C2B6994FBAAB",
   "pitch": -15.76,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 80.91,
   "hfov": 13.1,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -10.08
  }
 ],
 "id": "overlay_5C221AF3_7053_2732_41C1_464B3C2D2342",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 13.1,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 80.91,
   "image": "this.AnimatedImageResource_4A228F45_7053_3D57_41D3_FAC151BFA4B2",
   "pitch": -10.08,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 97.16,
   "hfov": 6.37,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0_HS_4_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -8.78
  }
 ],
 "id": "overlay_5D0A0E8E_7053_1FD2_41C4_25AB9B7D3DE7",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 25)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 6.37,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 97.16,
   "image": "this.AnimatedImageResource_4A250F45_7053_3D57_41D7_2213D864DC0B",
   "pitch": -8.78,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -87.62,
   "hfov": 17.72,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -20.15
  }
 ],
 "id": "overlay_7DDD6484_7051_23D6_41D9_A51A1A0AE696",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A27CE69_704F_1069_41D2_E246D309FFA4, this.camera_99F4EEFA_8A94_EA5C_41D8_71C71BD911CB); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 17.72,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -87.62,
   "image": "this.AnimatedImageResource_61E6DA6F_7051_2753_41B1_19B765801506",
   "pitch": -20.15,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -7.06,
   "hfov": 19.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -12.37
  }
 ],
 "id": "overlay_500E08EA_7057_635D_41D8_AFC29F51AF9D",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA, this.camera_998E8EA7_8A94_EAF4_41D3_DD2B44266070); this.mainPlayList.set('selectedIndex', 22)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 19.07,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -7.06,
   "image": "this.AnimatedImageResource_595E73D6_70B7_2572_41AF_C67CE480E87F",
   "pitch": -12.37,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 139.96,
   "hfov": 19.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -11.05
  }
 ],
 "id": "overlay_530A3838_7051_633E_41CD_6E7E1235C5EF",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 19.16,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 139.96,
   "image": "this.AnimatedImageResource_595E83D6_70B7_2572_41D1_783E0909D43E",
   "pitch": -11.05,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 96.28,
   "hfov": 16.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -33.82
  }
 ],
 "id": "overlay_615ABE75_7051_1F36_41DA_1449191E69A2",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66, this.camera_98532E79_8A94_EA5C_41D6_11F2E652627D); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 16.22,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 96.28,
   "image": "this.AnimatedImageResource_61E1CA71_7051_274E_41D5_AF2707C5D66C",
   "pitch": -33.82,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 2.11,
   "hfov": 17.84,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -24
  }
 ],
 "id": "overlay_6279A60F_7053_6ED3_41B9_34347F14C935",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A239570_704F_7076_4188_69F7B87F5323, this.camera_9842FE64_8A94_EA74_41C9_B98AED12E421); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 17.84,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 2.11,
   "image": "this.AnimatedImageResource_4A2AAF3B_7053_3D32_41DB_07E1C0C2F78E",
   "pitch": -24,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -91.87,
   "hfov": 17.33,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -27.46
  }
 ],
 "id": "overlay_61B52815_7051_62F6_41C2_27460228023F",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142, this.camera_98312E53_8A94_EDAC_41D7_FBA6A2A20193); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 17.33,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -91.87,
   "image": "this.AnimatedImageResource_61E15A72_7051_274D_41C5_095FD7F491E1",
   "pitch": -27.46,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -35.95,
   "hfov": 14.65,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -9.54
  }
 ],
 "id": "overlay_42CCC360_7051_654D_41D9_751D21869B6F",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 24)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 14.65,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -35.95,
   "image": "this.AnimatedImageResource_4A2D3F3C_7053_3D35_41A5_B787675163AF",
   "pitch": -9.54,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "hfov": 6.49,
 "autoplay": true,
 "id": "overlay_9ABF8BE0_8A9D_EA6C_41DB_4DFB62FE3E2A",
 "blending": 0,
 "class": "VideoPanoramaOverlay",
 "loop": true,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_9ABF8BE0_8A9D_EA6C_41DB_4DFB62FE3E2A_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1400,
    "height": 3500
   }
  ]
 },
 "useHandCursor": true,
 "roll": 0.5,
 "enabledInCardboard": true,
 "yaw": 7.29,
 "vfov": 14.58,
 "pitch": 1.29,
 "rotationY": 3.84,
 "rotationX": 6.19,
 "data": {
  "label": "Video"
 },
 "videoVisibleOnStop": false,
 "distance": 50,
 "video": {
  "width": 608,
  "class": "VideoResource",
  "height": 1520,
  "mp4Url": "media/video_84DE611E_8A93_B7D5_41D6_0F9EA054E4DA.mp4"
 }
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 99.72,
   "hfov": 18.72,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -16.51
  }
 ],
 "id": "overlay_669A0C5E_7053_2375_418B_6748416C246C",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142, this.camera_98F64DFD_8A94_EE54_41D9_AE57A2730FD7); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.72,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 99.72,
   "image": "this.AnimatedImageResource_66795284_704F_67D6_41CD_1F05E0A504AA",
   "pitch": -16.51,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -107.59,
   "hfov": 17.61,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -25.63
  }
 ],
 "id": "overlay_64E7C9DC_7051_2576_41D9_5360DEA0362A",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A22A229_704F_3396_41C6_DE07CAD419EC, this.camera_98068E13_8A94_EDAC_41CE_6D310910C9ED); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 17.61,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -107.59,
   "image": "this.AnimatedImageResource_66791285_704F_67D7_41C5_68E73A0D72DE",
   "pitch": -25.63,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 40.73,
   "hfov": 19.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -12.56
  }
 ],
 "id": "overlay_595F47D5_7071_2D76_41C8_F345085684D3",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 20)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 19.06,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 40.73,
   "image": "this.AnimatedImageResource_4A1EAF56_7053_3D75_41BA_E3593D55DFB4",
   "pitch": -12.56,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -107.51,
   "hfov": 19.07,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -12.41
  }
 ],
 "id": "overlay_5EB34232_7073_26CD_41CA_9A28BD41A04B",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084, this.camera_98D44DD7_8A94_EE53_41D5_7A69F483CD5E); this.mainPlayList.set('selectedIndex', 15)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 19.07,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -107.51,
   "image": "this.AnimatedImageResource_4A115F56_7053_3D75_41D2_F67A452B4036",
   "pitch": -12.41,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -142.58,
   "hfov": 15.81,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -8.69
  }
 ],
 "id": "overlay_5EB42946_7070_E555_41D6_BCACB41F7745",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837, this.camera_98E4FDEC_8A94_EE75_41DD_763CC5B82C8A); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 15.81,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -142.58,
   "image": "this.AnimatedImageResource_4A11FF56_7053_3D75_41D3_2D81ED10341E",
   "pitch": -8.69,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -93.07,
   "hfov": 18.48,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -18.82
  }
 ],
 "id": "overlay_6FDEF9EF_7073_6553_41BA_5EB605778EE7",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3F6210_7051_73B6_41CD_00695B402868, this.camera_988DDD8E_8A94_EEB4_41B1_90E8BD8F8FB3); this.mainPlayList.set('selectedIndex', 18)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.48,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -93.07,
   "image": "this.AnimatedImageResource_595AE3D4_70B7_2576_41D1_B2E16FF6876F",
   "pitch": -18.82,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 87.8,
   "hfov": 19.1,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -12.04
  }
 ],
 "id": "overlay_6E54248A_7073_23D2_41D2_2CBC7D6C1852",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280, this.camera_9B7DED84_8A94_EEB4_41DD_6224D8E6DE68); this.mainPlayList.set('selectedIndex', 20)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 19.1,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 87.8,
   "image": "this.AnimatedImageResource_595963D5_70B7_2577_41D5_474C1B8507AC",
   "pitch": -12.04,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -1.53,
   "hfov": 18.26,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -20.77
  }
 ],
 "id": "overlay_68A14AF5_7051_2737_41C4_64A1CC63969D",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C, this.camera_9B63DD7A_8A94_EE5C_41C0_F00EEE04D5DF); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.26,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -1.53,
   "image": "this.AnimatedImageResource_6CDE1AD7_704F_6773_419E_C63AA0757C0B",
   "pitch": -20.77,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 135.69,
   "hfov": 18.35,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -19.99
  }
 ],
 "id": "overlay_6AF9E9DC_7050_E575_41C1_E95F00D57ACD",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A211E56_704F_13BA_419D_7F32F8B0E231, this.camera_9B41CD66_8A94_EE74_41DF_8A1C8ACA9227); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.35,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 135.69,
   "image": "this.AnimatedImageResource_6CDDEADC_704F_6775_41D2_E4DDB94201CB",
   "pitch": -19.99,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 17.43,
   "hfov": 19.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -10.42
  }
 ],
 "id": "overlay_5A63EA0E_73B1_E6D2_41D2_22314376BD7F",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 28)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 19.2,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 17.43,
   "image": "this.AnimatedImageResource_5A91F0D9_73B1_237E_41D1_CB445EADA8DC",
   "pitch": -10.42,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 107.02,
   "hfov": 11.52,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -9.45
  }
 ],
 "id": "overlay_5ADA32D0_73B3_274D_41D2_63C68BFCD21E",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD, this.camera_9B277D51_8A94_EFAF_41B3_119FC5A48467); this.mainPlayList.set('selectedIndex', 25)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.52,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 107.02,
   "image": "this.AnimatedImageResource_5A9610D9_73B1_237E_41D7_D52D8E203EFB",
   "pitch": -9.45,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 89.85,
   "hfov": 18.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -21.45
  }
 ],
 "id": "overlay_5863719F_7070_E5F3_41BF_BE4971A26474",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135, this.camera_9B314D5C_8A94_EE54_41D2_AE3CC6AB3AFF); this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.17,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 89.85,
   "image": "this.AnimatedImageResource_4A10DF57_7053_3D73_41CC_501DBBF715C8",
   "pitch": -21.45,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -145.45,
   "hfov": 18.65,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -17.22
  }
 ],
 "id": "overlay_58133318_7077_26FD_41D3_099E06D34A59",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C, this.camera_9B15ED47_8A94_EFB4_41E0_40CF95D70725); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.65,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -145.45,
   "image": "this.AnimatedImageResource_4A134F57_7053_3D73_41D2_9E26838442E9",
   "pitch": -17.22,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -32.26,
   "hfov": 16.68,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0_HS_4_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -15.16
  }
 ],
 "id": "overlay_59F43E52_7077_7F72_41D1_CA910F0C4B0E",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837, this.camera_9B188D3C_8A94_EFD5_41D4_E61B720403CE); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 16.68,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -32.26,
   "image": "this.AnimatedImageResource_4A13FF57_7053_3D73_41C1_8CABC8ED4DA9",
   "pitch": -15.16,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 122.09,
   "hfov": 18.96,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -13.88
  }
 ],
 "id": "overlay_5321FE63_7051_FF53_41D4_7A620930E32A",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A239570_704F_7076_4188_69F7B87F5323, this.camera_98CA0DB9_8A94_EEDC_41DA_CA7E6C01CB30); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.96,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 122.09,
   "image": "this.AnimatedImageResource_5A9220D7_73B1_2373_41D9_1D5DC0474646",
   "pitch": -13.88,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -32.34,
   "hfov": 18.32,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -20.28
  }
 ],
 "id": "overlay_521070F8_704F_233D_41D6_4F7162DC7EC0",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06, this.camera_98BA3DAE_8A94_EEF5_41A5_BF3747F3991C); this.mainPlayList.set('selectedIndex', 27)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.32,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -32.34,
   "image": "this.AnimatedImageResource_5A9240D7_73B1_2372_41D1_06DDCD9649E0",
   "pitch": -20.28,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -70.69,
   "hfov": 18.78,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -15.89
  }
 ],
 "id": "overlay_560CD5C3_73B1_6D52_41CC_BAE1433D3F64",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_504301D3_7057_2572_41D1_5AFEA5CD4210, this.camera_98DA9DC3_8A94_EEB3_41D2_B9549B4E13E1); this.mainPlayList.set('selectedIndex', 30)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.78,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -70.69,
   "image": "this.AnimatedImageResource_5A9290D7_73B1_2372_41C4_54623F18FD67",
   "pitch": -15.89,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -126.03,
   "hfov": 18.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -17.15
  }
 ],
 "id": "overlay_5516A9A8_73BF_E5DD_41DB_D12D35E134FF",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD, this.camera_9BB41FE4_8A94_EA75_41D8_85D49C538258); this.mainPlayList.set('selectedIndex', 25)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.66,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -126.03,
   "image": "this.AnimatedImageResource_5A9680D9_73B1_237E_41D3_0BC2886FFA55",
   "pitch": -17.15,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 117.38,
   "hfov": 18.95,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -14.01
  }
 ],
 "id": "overlay_58894958_73BF_257D_41AB_97C9D4520C96",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1, this.camera_9BBDAFD9_8A94_EA5F_41BF_CB2F22F75E3A); this.mainPlayList.set('selectedIndex', 24)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.95,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 117.38,
   "image": "this.AnimatedImageResource_5A96D0DA_73B1_237D_41B8_9E635B944C45",
   "pitch": -14.01,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 54.41,
   "hfov": 17.98,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -22.96
  }
 ],
 "id": "overlay_5851C76A_7071_2D52_41D0_2B6FAAC07C53",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06, this.camera_9BA04FCF_8A94_EAB4_41D8_CF008ADE80EA); this.mainPlayList.set('selectedIndex', 27)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 17.98,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 54.41,
   "image": "this.AnimatedImageResource_4A12FF58_7053_3D7D_41C3_7092B6821A46",
   "pitch": -22.96,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -89.62,
   "hfov": 13.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -8.55
  }
 ],
 "id": "overlay_582B95FF_7073_2D32_41B4_178603025F17",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 13.75,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -89.62,
   "image": "this.AnimatedImageResource_4A129F58_7053_3D7D_41DA_796A173FAF60",
   "pitch": -8.55,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -85.82,
   "hfov": 19.15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -11.28
  }
 ],
 "id": "overlay_51EDDF72_7051_3D32_41D8_03B1EDFF19CF",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280, this.camera_98101E29_8A94_EDFC_4190_8C1328BF0776); this.mainPlayList.set('selectedIndex', 20)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 19.15,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -85.82,
   "image": "this.AnimatedImageResource_5958A3D5_70B7_2576_41C5_476033F12AB8",
   "pitch": -11.28,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 88.55,
   "hfov": 18.43,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -19.26
  }
 ],
 "id": "overlay_500C4C12_7050_E2CD_41D9_70EFA5BFE0FC",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA, this.camera_98208E3E_8A94_EDD4_41C3_3E1B8D304ACC); this.mainPlayList.set('selectedIndex', 22)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.43,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 88.55,
   "image": "this.AnimatedImageResource_5958D3D6_70B7_2575_41C6_17BC9DC7F358",
   "pitch": -19.26,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 172.21,
   "hfov": 7.83,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -14.78
  }
 ],
 "id": "overlay_6A56D3A1_71D1_65CE_41BE_F826FF2950DA",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837, this.camera_9A629F66_8A94_EA74_41D1_3A667F259483); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 7.83,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 172.21,
   "image": "this.AnimatedImageResource_6C03CB27_71D3_26D2_41BD_89EFCDFB63D8",
   "pitch": -14.78,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -8.83,
   "hfov": 18.87,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -14.95
  }
 ],
 "id": "overlay_6AC00109_71DF_22DF_41D4_B32E62083798",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3ED87F_7051_106A_41BB_70BC10171E67, this.camera_9930FF23_8A94_EBEC_41D6_08F22E38E79D); this.mainPlayList.set('selectedIndex', 17)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.87,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -8.83,
   "image": "this.AnimatedImageResource_6C027B27_71D3_26D2_41B9_6701A222C760",
   "pitch": -14.95,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 91.05,
   "hfov": 18.65,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -17.24
  }
 ],
 "id": "overlay_5F7DCDB5_7053_3D36_41DB_6151F5F48546",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3EA27B_7051_306A_41DA_E9C19520171A, this.camera_99272F19_8A94_EBDC_41D7_A568170487E7); this.mainPlayList.set('selectedIndex', 28)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.65,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 91.05,
   "image": "this.AnimatedImageResource_4A262F4C_7053_3D55_418B_B5B3D1438E46",
   "pitch": -17.24,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 54.85,
   "hfov": 18.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -19.54
  }
 ],
 "id": "overlay_6F65B12E_7073_22D5_41D4_B1777557C4AC",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603, this.camera_986C8E8E_8A94_EAB4_41D0_86E7D485C171); this.mainPlayList.set('selectedIndex', 19)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.4,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 54.85,
   "image": "this.AnimatedImageResource_595A33D4_70B7_2575_41C9_C54DCAEF48EB",
   "pitch": -19.54,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 167.85,
   "hfov": 13.32,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -32.03
  }
 ],
 "id": "overlay_6F89820B_7071_E6D3_41DA_8DE529B46CB3",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3ED87F_7051_106A_41BB_70BC10171E67, this.camera_987CCE9C_8A94_EAD4_41C9_DBD382840E1A); this.mainPlayList.set('selectedIndex', 17)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 13.32,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 167.85,
   "image": "this.AnimatedImageResource_595A43D4_70B7_2576_41A4_401276E53931",
   "pitch": -32.03,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 92.16,
   "hfov": 16.97,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -29.67
  }
 ],
 "id": "overlay_635E28D6_705F_2375_41D9_5BB6E9C3FD28",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655, this.camera_98B100B4_8A94_D6D4_41B2_A80436394B3D); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 16.97,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 92.16,
   "image": "this.AnimatedImageResource_667CB284_704F_67D5_41D5_BC42FBE3E1B8",
   "pitch": -29.67,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 34.21,
   "hfov": 17.57,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -25.88
  }
 ],
 "id": "overlay_637C5B37_7051_2532_41A2_D29D91CEEDFC",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A239570_704F_7076_4188_69F7B87F5323, this.camera_98C180BE_8A94_D6D4_41B8_49D947712512); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 17.57,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 34.21,
   "image": "this.AnimatedImageResource_4A2D9F3C_7053_3D36_41D9_4F5F9ADFDCE6",
   "pitch": -25.88,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -86.27,
   "hfov": 18.96,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -13.84
  }
 ],
 "id": "overlay_64D603FD_7050_E537_41C3_17ACA3239AD2",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A23BED3_704F_70BA_419E_85F35EC070E2, this.camera_98D350C9_8A94_D6BC_41E1_1E22F1F6E49F); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.96,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -86.27,
   "image": "this.AnimatedImageResource_667BD284_704F_67D5_41C8_ABD1828E6593",
   "pitch": -13.84,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -16.17,
   "hfov": 15.01,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -15.74
  }
 ],
 "id": "overlay_42B1E473_705F_6333_41C9_7C6DAB291F69",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 24)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 15.01,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -16.17,
   "image": "this.AnimatedImageResource_4A2CEF3C_7053_3D36_41C5_F4D5FA707834",
   "pitch": -15.74,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 90.89,
   "hfov": 17.47,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -26.54
  }
 ],
 "id": "overlay_6A82A6AB_70B7_6FD2_41DA_D9F7E063E352",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A22A229_704F_3396_41C6_DE07CAD419EC, this.camera_98A83DA4_8A94_EEF4_41AF_56C07493604A); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 17.47,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 90.89,
   "image": "this.AnimatedImageResource_6A0F9874_70B1_2336_41CE_9CB5D7CFE835",
   "pitch": -26.54,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -75.57,
   "hfov": 18.11,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -21.98
  }
 ],
 "id": "overlay_67DDAF78_70B1_3D3E_41D6_7029B0B0B811",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC, this.camera_989FED98_8A94_EEDD_41DA_B87DCB1676F6); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.11,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -75.57,
   "image": "this.AnimatedImageResource_6A0F3874_70B1_2336_41DA_88FFD0B0AD07",
   "pitch": -21.98,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 83.5,
   "hfov": 18.76,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -16.14
  }
 ],
 "id": "overlay_6430C093_7050_E3F3_41D6_07156CE92789",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A27CE69_704F_1069_41D2_E246D309FFA4, this.camera_9A661F71_8A94_EA6C_41D7_C4FFEB0B1468); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.76,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 83.5,
   "image": "this.AnimatedImageResource_667B9284_704F_67D6_41D1_C2324448D2A9",
   "pitch": -16.14,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 141.82,
   "hfov": 18.04,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -22.47
  }
 ],
 "id": "overlay_63A85FEA_7051_3D5D_4185_7547E4C44906",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66, this.camera_9B88EF9A_8A94_EADD_41A6_6318BC5DBBF3); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.04,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 141.82,
   "image": "this.AnimatedImageResource_667A0284_704F_67D6_41D2_AE2C1143A518",
   "pitch": -22.47,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 175.34,
   "hfov": 12.99,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -28.54
  }
 ],
 "id": "overlay_647E6CB2_7050_E332_4177_3AA11F3DCCB8",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655, this.camera_9A78AF7B_8A94_EA5C_41A2_2EFF1C2678F7); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.99,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 175.34,
   "image": "this.AnimatedImageResource_667AC284_704F_67D6_41A8_25D873A79B6C",
   "pitch": -28.54,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -137.95,
   "hfov": 18.14,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -21.69
  }
 ],
 "id": "overlay_643BC4D7_7057_E373_41C0_42415776191E",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142, this.camera_9A739F85_8A94_EAB7_419C_086E82B7E024); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.14,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -137.95,
   "image": "this.AnimatedImageResource_667A8284_704F_67D6_41DA_21C5EC8ADDAB",
   "pitch": -21.69,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -55.9,
   "hfov": 18.9,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0_HS_4_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -14.6
  }
 ],
 "id": "overlay_551CB018_7053_E2FE_41D1_F6A1DFA3FE4F",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1, this.camera_9A75AF90_8A94_EAAC_4195_D9A5415DBD0E); this.mainPlayList.set('selectedIndex', 24)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.9,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -55.9,
   "image": "this.AnimatedImageResource_5A8530D1_73B1_234F_41D6_F2FC4BC6DE85",
   "pitch": -14.6,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "hfov": 8.33,
 "autoplay": true,
 "id": "overlay_9A0676ED_8A9C_BA74_41DB_E92225730298",
 "blending": 0,
 "class": "VideoPanoramaOverlay",
 "loop": true,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_9A0676ED_8A9C_BA74_41DB_E92225730298_t.jpg",
    "class": "ImageResourceLevel",
    "width": 1400,
    "height": 3500
   }
  ]
 },
 "useHandCursor": true,
 "roll": -0.36,
 "enabledInCardboard": true,
 "yaw": 10.37,
 "vfov": 18.08,
 "pitch": 1.73,
 "rotationY": 11.82,
 "rotationX": -2.84,
 "data": {
  "label": "Video"
 },
 "videoVisibleOnStop": false,
 "distance": 50,
 "video": {
  "width": 608,
  "class": "VideoResource",
  "height": 1520,
  "mp4Url": "media/video_84DE611E_8A93_B7D5_41D6_0F9EA054E4DA.mp4"
 }
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 93.5,
   "hfov": 19.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -10.2
  }
 ],
 "id": "overlay_6761B49D_7057_23F7_4185_9E7720B6D909",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A221504_704F_119F_41B4_7CF7828D13F0, this.camera_9916DF0E_8A94_EBB4_41C3_6474A8176E0D); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 19.22,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 93.5,
   "image": "this.AnimatedImageResource_6CDEDAD6_704F_6772_41C1_4FE40E7340BA",
   "pitch": -10.2,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -23.11,
   "hfov": 17.59,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -25.74
  }
 ],
 "id": "overlay_68453992_7053_25F2_41CA_AE66FAAB64D4",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152, this.camera_99053F04_8A94_EBB4_41D9_76E3584BE02D); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 17.59,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -23.11,
   "image": "this.AnimatedImageResource_6CDE4AD6_704F_6772_41D5_4FDB8C56C5E7",
   "pitch": -25.74,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 87.29,
   "hfov": 19.15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -11.25
  }
 ],
 "id": "overlay_6EB1017D_7070_E536_41C0_BAE820711A53",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F, this.camera_9B07202E_8A94_D5F5_41D6_913B3A25FF00); this.mainPlayList.set('selectedIndex', 21)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 19.15,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 87.29,
   "image": "this.AnimatedImageResource_5959A3D5_70B7_2577_41D2_71F2B6BBE0CF",
   "pitch": -11.25,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -81.98,
   "hfov": 19.1,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -11.99
  }
 ],
 "id": "overlay_50CCF53F_704F_ED33_41CB_69D32B2C2961",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603, this.camera_9B09B024_8A94_D5F4_41DF_414BE4E84162); this.mainPlayList.set('selectedIndex', 19)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 19.1,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -81.98,
   "image": "this.AnimatedImageResource_595823D5_70B7_2576_41D5_550F6943F75E",
   "pitch": -11.99,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 84.75,
   "hfov": 18.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -17.29
  }
 ],
 "id": "overlay_67A84884_70D0_E3D6_41CE_FD05E86B25A3",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.64,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 84.75,
   "image": "this.AnimatedImageResource_6CDF9AD6_704F_6775_41BC_76E729C50C5B",
   "pitch": -17.29,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -83.45,
   "hfov": 18.91,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -14.42
  }
 ],
 "id": "overlay_676555D5_70D0_ED77_41CE_D6D89E0C9B03",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A211E56_704F_13BA_419D_7F32F8B0E231, this.camera_9895E0A0_8A94_D6EC_41D0_72EC1F852982); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.91,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -83.45,
   "image": "this.AnimatedImageResource_6CDF6AD6_704F_6772_419F_4EE2B3EC64B6",
   "pitch": -14.42,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -26.96,
   "hfov": 17.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -25.42
  }
 ],
 "id": "overlay_565C5B38_73B1_E53E_41AC_F6D5BDDE6000",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135, this.camera_9BC13FEE_8A94_EA75_41B9_8D00D6689579); this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 17.64,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -26.96,
   "image": "this.AnimatedImageResource_5A9300D8_73B1_237D_41D5_475B234C0551",
   "pitch": -25.42,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -70.86,
   "hfov": 19.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -12.54
  }
 ],
 "id": "overlay_55F1A55C_73B3_2D76_41D4_1138AB0190E3",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_5393F731_7057_EECF_41D8_2193DE21467A, this.camera_9BDF5FF9_8A94_EA5F_41D8_120ACEDC6992); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 19.06,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -70.86,
   "image": "this.AnimatedImageResource_5A93B0D8_73B1_237D_41D3_984D25E7B92A",
   "pitch": -12.54,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 70.69,
   "hfov": 18.74,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -16.37
  }
 ],
 "id": "overlay_54B97E9C_73B3_FFF6_41C0_D8DAD09EEEDB",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_504301D3_7057_2572_41D1_5AFEA5CD4210, this.camera_9BEBB004_8A94_D5B4_41D0_B75F295780D3); this.mainPlayList.set('selectedIndex', 30)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.74,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 70.69,
   "image": "this.AnimatedImageResource_5A93D0D8_73B1_237D_41DC_03926AAFBDC5",
   "pitch": -16.37,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 92.45,
   "hfov": 18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -22.84
  }
 ],
 "id": "overlay_686C7E12_71B1_1EF2_419E_1ECD43B4A914",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.startPanoramaWithCamera(this.panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39, this.camera_9B0D3D32_8A94_EFEC_41AE_1B7DFF57886E); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": 92.45,
   "image": "this.AnimatedImageResource_6F384822_71B1_22CD_41D2_E3D95171FCFF",
   "pitch": -22.84,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "HotspotPanoramaOverlay",
 "maps": [
  {
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -94.22,
   "hfov": 18.98,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -13.58
  }
 ],
 "id": "overlay_6B8D1B92_71BF_25F2_4194_6F575E19A1D2",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "click": "this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.98,
   "class": "HotspotPanoramaOverlayImage",
   "yaw": -94.22,
   "image": "this.AnimatedImageResource_6F38D822_71B1_22CD_41BF_CA14D521E62A",
   "pitch": -13.58,
   "distance": 100
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "enabledInCardboard": true
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5A9060D8_73B1_237E_41D9_6283474ECE6D",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5A9090D8_73B1_237E_41CE_109C014F8F37",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5A9130D9_73B1_237F_41DB_D56C2C52641C",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5A9150D9_73B1_237F_41A3_F64C749A5DA1",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A1E2F56_7053_3D75_41A9_9005FCEFE3CE",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_595B73CE_70B7_2552_41D6_47CC65B7AEC6",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_595B93D4_70B7_2575_41C4_0ED4A1A55E5F",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_61E02A71_7051_274E_41CA_2B78766F648B",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_61E07A71_7051_274E_41D7_D28FD4F20BB9",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_61E1AA71_7051_274E_41D6_313EFF3E8256",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_595FB3D6_70B7_2575_41D5_28E49E9B94D4",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_595FC3D6_70B7_2575_41D7_52EAA4DCFB80",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6A0E4874_70B1_2335_417B_55A387CE5054",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6A0FF874_70B1_2335_41D3_4F2ADBF91103",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6C031B27_71D3_26D3_4189_4BFF8A126DC8",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6C03AB27_71D3_26D3_41DA_5BC8BB197395",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A240F4B_7053_3D53_41BE_4B9D65CA50E9",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A24AF4B_7053_3D53_41DC_9FD379D42CFF",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0_HS_4_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A272F4C_7053_3D55_41DB_E9C9C463F327",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_61E71A70_7051_274E_4190_788BE4A0588E",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_61E75A71_7051_274F_41CD_8727ED2F9DB2",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_61E0EA71_7051_274F_41BE_45017D34FD16",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6CA84D1B_71B3_62F2_41C0_77EC95CF63D6",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6CA82D1B_71B3_62F2_41D8_AEF5EE040DD9",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A221F44_7053_3D56_41BC_C2B6994FBAAB",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A228F45_7053_3D57_41D3_FAC151BFA4B2",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0_HS_4_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A250F45_7053_3D57_41D7_2213D864DC0B",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_61E6DA6F_7051_2753_41B1_19B765801506",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_595E73D6_70B7_2572_41AF_C67CE480E87F",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_595E83D6_70B7_2572_41D1_783E0909D43E",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_61E1CA71_7051_274E_41D5_AF2707C5D66C",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A2AAF3B_7053_3D32_41DB_07E1C0C2F78E",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_61E15A72_7051_274D_41C5_095FD7F491E1",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A2D3F3C_7053_3D35_41A5_B787675163AF",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_66795284_704F_67D6_41CD_1F05E0A504AA",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_66791285_704F_67D7_41C5_68E73A0D72DE",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A1EAF56_7053_3D75_41BA_E3593D55DFB4",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A115F56_7053_3D75_41D2_F67A452B4036",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A11FF56_7053_3D75_41D3_2D81ED10341E",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_595AE3D4_70B7_2576_41D1_B2E16FF6876F",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_595963D5_70B7_2577_41D5_474C1B8507AC",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6CDE1AD7_704F_6773_419E_C63AA0757C0B",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6CDDEADC_704F_6775_41D2_E4DDB94201CB",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5A91F0D9_73B1_237E_41D1_CB445EADA8DC",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5A9610D9_73B1_237E_41D7_D52D8E203EFB",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A10DF57_7053_3D73_41CC_501DBBF715C8",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A134F57_7053_3D73_41D2_9E26838442E9",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0_HS_4_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A13FF57_7053_3D73_41C1_8CABC8ED4DA9",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5A9220D7_73B1_2373_41D9_1D5DC0474646",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5A9240D7_73B1_2372_41D1_06DDCD9649E0",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5A9290D7_73B1_2372_41C4_54623F18FD67",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5A9680D9_73B1_237E_41D3_0BC2886FFA55",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5A96D0DA_73B1_237D_41B8_9E635B944C45",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A12FF58_7053_3D7D_41C3_7092B6821A46",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A129F58_7053_3D7D_41DA_796A173FAF60",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5958A3D5_70B7_2576_41C5_476033F12AB8",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5958D3D6_70B7_2575_41C6_17BC9DC7F358",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6C03CB27_71D3_26D2_41BD_89EFCDFB63D8",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6C027B27_71D3_26D2_41B9_6701A222C760",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A262F4C_7053_3D55_418B_B5B3D1438E46",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_595A33D4_70B7_2575_41C9_C54DCAEF48EB",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_595A43D4_70B7_2576_41A4_401276E53931",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_667CB284_704F_67D5_41D5_BC42FBE3E1B8",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A2D9F3C_7053_3D36_41D9_4F5F9ADFDCE6",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_667BD284_704F_67D5_41C8_ABD1828E6593",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_4A2CEF3C_7053_3D36_41C5_F4D5FA707834",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6A0F9874_70B1_2336_41CE_9CB5D7CFE835",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6A0F3874_70B1_2336_41DA_88FFD0B0AD07",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_667B9284_704F_67D6_41D1_C2324448D2A9",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_667A0284_704F_67D6_41D2_AE2C1143A518",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_667AC284_704F_67D6_41A8_25D873A79B6C",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_667A8284_704F_67D6_41DA_21C5EC8ADDAB",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0_HS_4_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5A8530D1_73B1_234F_41D6_F2FC4BC6DE85",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6CDEDAD6_704F_6772_41C1_4FE40E7340BA",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6CDE4AD6_704F_6772_41D5_4FDB8C56C5E7",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5959A3D5_70B7_2577_41D2_71F2B6BBE0CF",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_595823D5_70B7_2576_41D5_550F6943F75E",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6CDF9AD6_704F_6775_41BC_76E729C50C5B",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6CDF6AD6_704F_6772_419F_4EE2B3EC64B6",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5A9300D8_73B1_237D_41D5_475B234C0551",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5A93B0D8_73B1_237D_41D3_984D25E7B92A",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_5A93D0D8_73B1_237D_41DC_03926AAFBDC5",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6F384822_71B1_22CD_41D2_E3D95171FCFF",
 "colCount": 3
},
{
 "class": "AnimatedImageResource",
 "frameDuration": 62,
 "levels": [
  {
   "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 330,
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameCount": 9,
 "id": "AnimatedImageResource_6F38D822_71B1_22CD_41BF_CA14D521E62A",
 "colCount": 3
}],
 "overflow": "visible",
 "scrollBarOpacity": 0.5,
 "gap": 10,
 "propagateClick": false,
 "data": {
  "name": "Player435"
 },
 "shadow": false
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
