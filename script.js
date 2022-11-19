(function(){
    var script = {
 "mouseWheelEnabled": true,
 "start": "this.init()",
 "propagateClick": false,
 "mobileMipmappingEnabled": false,
 "children": [
  "this.MainViewer"
 ],
 "id": "rootPlayer",
 "scrollBarVisible": "rollOver",
 "vrPolyfillScale": 0.5,
 "horizontalAlign": "left",
 "scrollBarMargin": 2,
 "backgroundPreloadEnabled": true,
 "borderSize": 0,
 "width": "100%",
 "defaultVRPointer": "laser",
 "desktopMipmappingEnabled": false,
 "scripts": {
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "getKey": function(key){  return window[key]; },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "existsKey": function(key){  return key in window; },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "registerKey": function(key, value){  window[key] = value; },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "unregisterKey": function(key){  delete window[key]; },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); }
 },
 "paddingRight": 0,
 "scrollBarWidth": 10,
 "downloadEnabled": false,
 "minHeight": 20,
 "paddingLeft": 0,
 "verticalAlign": "top",
 "contentOpaque": false,
 "height": "100%",
 "minWidth": 20,
 "class": "Player",
 "layout": "absolute",
 "borderRadius": 0,
 "paddingTop": 0,
 "scrollBarColor": "#000000",
 "definitions": [{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -57.91,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A823A8D_8BE0_C361_41CB_11F412D75739",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 92.38,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_99407B7B_8BE0_C1A0_41DB_EC986E91ACB5",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 131.37,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9AB42A97_8BE0_C360_41A6_7E90C2CDF8E6",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A23BED3_704F_70BA_419E_85F35EC070E2",
 "label": "7",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_669A0C5E_7053_2375_418B_6748416C246C",
  "this.overlay_64E7C9DC_7051_2576_41D9_5360DEA0362A"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -11.14,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_99AAEB5C_8BE0_C1E7_41B2_0570A23136AC",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06",
 "label": "28",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
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
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1",
 "label": "25",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_5321FE63_7051_FF53_41D4_7A620930E32A",
  "this.overlay_521070F8_704F_233D_41D6_4F7162DC7EC0",
  "this.overlay_560CD5C3_73B1_6D52_41CC_BAE1433D3F64"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 34.55,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_99BB0B51_8BE0_C1E0_41B9_954C56034438",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 37.42,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B6A29EE_8BE0_C0A0_41B3_72B446C5735D",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC",
 "label": "8",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_686C7E12_71B1_1EF2_419E_1ECD43B4A914",
  "this.overlay_6B8D1B92_71BF_25F2_4194_6F575E19A1D2"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 6.82,
  "pitch": 2.56
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3F6210_7051_73B6_41CD_00695B402868_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -80.28,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_98D83BE5_8BE0_C0A0_41D7_DAA06E56046B",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -87.84,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9BB209A6_8BE0_C0A0_41C6_D0EAB196B389",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -109.31,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A157AE0_8BE0_C0DF_41AD_9D771C613DA9",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -57.02,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_994F58A0_8BE0_CF5F_41E0_DC5F5E2E2B4B",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 92.02,
  "pitch": 0.28
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -5.68,
  "pitch": 0.57
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_camera",
 "automaticZoomSpeed": 10
},
{
 "class": "PlayList",
 "id": "mainPlayList",
 "items": [
  {
   "media": "this.panorama_7AC944C0_704F_1096_41CC_FB746688AAE7",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A27CE69_704F_1069_41D2_E246D309FFA4",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A239570_704F_7076_4188_69F7B87F5323",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A239570_704F_7076_4188_69F7B87F5323_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A23BED3_704F_70BA_419E_85F35EC070E2",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A22A229_704F_3396_41C6_DE07CAD419EC",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A221504_704F_119F_41B4_7CF7828D13F0",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A221504_704F_119F_41B4_7CF7828D13F0_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A211E56_704F_13BA_419D_7F32F8B0E231",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 17)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3ED87F_7051_106A_41BB_70BC10171E67",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 17, 18)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3F6210_7051_73B6_41CD_00695B402868",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3F6210_7051_73B6_41CD_00695B402868_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 18, 19)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 19, 20)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 20, 21)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 21, 22)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 22, 23)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 23, 24)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 24, 25)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 25, 26)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 26, 27)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 27, 28)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_7A3EA27B_7051_306A_41DA_E9C19520171A",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 28, 29)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_5393F731_7057_EECF_41D8_2193DE21467A",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_5393F731_7057_EECF_41D8_2193DE21467A_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 29, 30)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_504301D3_7057_2572_41D1_5AFEA5CD4210",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 30, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "end": "this.trigger('tourEnded')"
  }
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -7.79,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B7499E4_8BE0_C0A0_41DE_1CE0678B901A",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -49.7,
  "pitch": -1.7
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A239570_704F_7076_4188_69F7B87F5323_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 96.28,
  "pitch": 1.7
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 169.6,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9AF81A64_8BE0_C3A7_41D3_0FB1A16850ED",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 86.93,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B5529C5_8BE0_C0E0_41DD_5446258959EB",
 "automaticZoomSpeed": 10
},
{
 "class": "PlayList",
 "id": "playList_9983187C_8BE0_CFA7_41C2_9CB98FF7B633",
 "items": [
  {
   "media": "this.video_8561312B_8BE0_41A0_41D2_9D0890BA870F",
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_9983187C_8BE0_CFA7_41C2_9CB98FF7B633, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_9983187C_8BE0_CFA7_41C2_9CB98FF7B633, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "player": "this.MainViewerVideoPlayer"
  }
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -177.89,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A9C0A79_8BE0_C3A0_41DB_C793A2A18171",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD",
 "label": "26",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_565C5B38_73B1_E53E_41AC_F6D5BDDE6000",
  "this.overlay_55F1A55C_73B3_2D76_41D4_1138AB0190E3",
  "this.overlay_54B97E9C_73B3_FFF6_41C0_D8DAD09EEEDB"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 94.18,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_99F22B27_8BE0_C1A0_41E0_EC4CB2B8F72B",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655",
 "label": "4",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_615ABE75_7051_1F36_41DA_1449191E69A2",
  "this.overlay_6279A60F_7053_6ED3_41B9_34347F14C935",
  "this.overlay_61B52815_7051_62F6_41C2_27460228023F",
  "this.overlay_42CCC360_7051_654D_41D9_751D21869B6F",
  "this.overlay_9ABF8BE0_8A9D_EA6C_41DB_4DFB62FE3E2A",
  "this.overlay_9BAE1175_8BE1_C1A1_41BE_AE6540D67293"
 ]
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152",
 "label": "13",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_68A14AF5_7051_2737_41C4_64A1CC63969D",
  "this.overlay_6AF9E9DC_7050_E575_41C1_E95F00D57ACD"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -125.15,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9BC78930_8BE0_C1A0_41E0_191B0BA7FBBC",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 171.17,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_995DBB66_8BE0_C1A0_41DC_A69FD08FF46B",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA",
 "label": "23",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_51EF9F88_7053_3DDD_41C9_08E0045A5A20",
  "this.overlay_50EFD635_7051_2F36_41CB_D1CC6234E72E"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 96.55,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9ADB0A46_8BE0_C3E3_41CC_35E2C2A64FD6",
 "automaticZoomSpeed": 10
},
{
 "class": "PlayList",
 "id": "playList_9983D87B_8BE0_CFA0_41D7_6ACDA7C28B4E",
 "items": [
  {
   "media": "this.video_84DE611E_8A93_B7D5_41D6_0F9EA054E4DA",
   "class": "VideoPlayListItem",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_9983D87B_8BE0_CFA0_41D7_6ACDA7C28B4E, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_9983D87B_8BE0_CFA0_41D7_6ACDA7C28B4E, 0)",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "player": "this.MainViewerVideoPlayer"
  }
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -139.51,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_99655B90_8BE0_C160_41D9_E28DAEFE1846",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -91.45,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_99963B3D_8BE0_C1A0_41CF_389D47D8D4D8",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142",
 "label": "5",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_635E28D6_705F_2375_41D9_5BB6E9C3FD28",
  "this.overlay_637C5B37_7051_2532_41A2_D29D91CEEDFC",
  "this.overlay_64D603FD_7050_E537_41C3_17ACA3239AD2",
  "this.overlay_42B1E473_705F_6333_41C9_7C6DAB291F69",
  "this.overlay_9B4EC891_8BE0_4F61_41CE_092A68A8DB16"
 ]
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A221504_704F_119F_41B4_7CF7828D13F0",
 "label": "11",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_67A84884_70D0_E3D6_41CE_FD05E86B25A3",
  "this.overlay_676555D5_70D0_ED77_41CE_D6D89E0C9B03"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -15.62,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_991118DC_8BE0_C0E0_412A_52AB089D9210",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A22A229_704F_3396_41C6_DE07CAD419EC",
 "label": "9",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_66B6F5E7_70B3_2D53_41C2_53AD66C02AC9",
  "this.overlay_66703718_70B1_6EFE_41B3_ED8FA90D2717"
 ]
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39",
 "label": "10",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_6A82A6AB_70B7_6FD2_41DA_D9F7E063E352",
  "this.overlay_67DDAF78_70B1_3D3E_41D6_7029B0B0B811"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -4.26,
  "pitch": 0.28
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 91.17,
  "pitch": -0.28
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 176.63,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B4B69D0_8BE0_C0E0_41D3_A81502D1995C",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 81.48,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A6ECACC_8BE0_C0E7_417D_170A6E0396C0",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -91.76,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B2FBA32_8BE0_C3A3_4192_170A782299E3",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 95.43,
  "pitch": 2.56
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_camera",
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
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -13.97,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B7EA9DA_8BE0_C0E0_41DF_2B76AAD5DB67",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 147.66,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_99DCDB08_8BE0_C16F_41CD_B4F5F84DD2DB",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -92.71,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B895992_8BE0_C160_41A2_D9149F25EB2F",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -178.56,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B6069F9_8BE0_C0A0_41B2_026680760EE3",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 153.04,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9AA62AA3_8BE0_C0A1_41E1_2E75B8582161",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -38.18,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B380A27_8BE0_C3A1_41D9_F7C2354DB794",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -4.66,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9BA819B1_8BE0_C0A0_41CC_4AEE89D0A19F",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280",
 "label": "21",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_6EB1017D_7070_E536_41C0_BAE820711A53",
  "this.overlay_50CCF53F_704F_ED33_41CB_69D32B2C2961"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_camera",
 "automaticZoomSpeed": 10
},
{
 "label": "Fashion Banner",
 "scaleMode": "fit_inside",
 "width": 1778,
 "class": "Video",
 "thumbnailUrl": "media/video_8561312B_8BE0_41A0_41D2_9D0890BA870F_t.jpg",
 "loop": false,
 "id": "video_8561312B_8BE0_41A0_41D2_9D0890BA870F",
 "height": 2826,
 "video": {
  "width": 762,
  "class": "VideoResource",
  "height": 1212,
  "mp4Url": "media/video_8561312B_8BE0_41A0_41D2_9D0890BA870F.mp4"
 }
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -10.97,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9AC52A5A_8BE0_C3E3_41E0_4841F864A3C0",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 88.13,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9937EBC5_8BE0_C0E0_41DA_42DEF93C5A2A",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837",
 "label": "15",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
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
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -125.59,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_99CE0B12_8BE0_C163_41D7_94ED70D6F657",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7AC944C0_704F_1096_41CC_FB746688AAE7",
 "label": "1",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_t.jpg",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -87.62,
   "panorama": "this.panorama_7A27CE69_704F_1069_41D2_E246D309FFA4",
   "distance": 1,
   "backwardYaw": 88.24
  }
 ],
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_7DDD6484_7051_23D6_41D9_A51A1A0AE696"
 ]
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A239570_704F_7076_4188_69F7B87F5323",
 "label": "6",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_6430C093_7050_E3F3_41D6_07156CE92789",
  "this.overlay_63A85FEA_7051_3D5D_4185_7547E4C44906",
  "this.overlay_647E6CB2_7050_E332_4177_3AA11F3DCCB8",
  "this.overlay_643BC4D7_7057_E373_41C0_42415776191E",
  "this.overlay_551CB018_7053_E2FE_41D1_F6A1DFA3FE4F",
  "this.overlay_9A0676ED_8A9C_BA74_41DB_E92225730298",
  "this.overlay_9B84B65A_8BE1_C3E0_41DA_DF913CE46F2A"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 142.86,
  "pitch": -2.84
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A211E56_704F_13BA_419D_7F32F8B0E231",
 "label": "12",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_6761B49D_7057_23F7_4185_9E7720B6D909",
  "this.overlay_68453992_7053_25F2_41CA_AE66FAAB64D4"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -9.37,
  "pitch": 0.85
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -84.64,
  "pitch": 0.85
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 104.43,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9956B896_8BE0_CF63_41CF_F0B33FC4B8FE",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 109.31,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A609AD6_8BE0_C0E3_41C7_7D8D866F160D",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 72.41,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A7CEAC2_8BE0_C0E3_41E0_DD9FD44D8577",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 72.49,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9ACE0A50_8BE0_C3FF_41D2_16A37B8E3381",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -88.62,
  "pitch": -1.7
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -72.98,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A394AF4_8BE0_C0A7_41DB_5FA0277BBDFA",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_504301D3_7057_2572_41D1_5AFEA5CD4210",
 "label": "31",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_5516A9A8_73BF_E5DD_41DB_D12D35E134FF",
  "this.overlay_58894958_73BF_257D_41AB_97C9D4520C96",
  "this.overlay_5851C76A_7071_2D52_41D0_2B6FAAC07C53",
  "this.overlay_582B95FF_7073_2D32_41B4_178603025F17"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 178.47,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_99899B48_8BE0_C1EF_41C6_ACB0985A5423",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -89.11,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A4AFAB8_8BE0_C0AF_41C0_50E645DCB8EC",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_5393F731_7057_EECF_41D8_2193DE21467A",
 "label": "30",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
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
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -96.5,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9973FB86_8BE0_C160_41D6_D57852832C1A",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66",
 "label": "3",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_7F12E43F_7071_6333_41D7_503276F2C26A",
  "this.overlay_7FFA0C9B_7071_63F2_41BA_09805CD662E1",
  "this.overlay_7FBB3162_704F_254D_41D7_D0B35469CDE1",
  "this.overlay_84ACEEBF_8A9C_AAD3_41D3_61404B7C0ED9",
  "this.overlay_859CCF87_8BE3_C160_41CA_F78799350727"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -88.9,
  "pitch": -1.99
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -83.72,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B02CA1C_8BE0_C360_41E1_5F45C4DF0908",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "partial": false,
 "hfov": 360,
 "vfov": 180,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13",
 "label": "17",
 "class": "Panorama",
 "hfovMin": "135%",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3DCE87_7051_3099_41D0_6359CDE28C13_t.jpg"
},
{
 "label": "color2_1",
 "scaleMode": "fit_inside",
 "width": 1400,
 "class": "Video",
 "thumbnailUrl": "media/video_84DE611E_8A93_B7D5_41D6_0F9EA054E4DA_t.jpg",
 "loop": false,
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
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 94.63,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9BFC0943_8BE0_C1E0_41C2_5D1DEF868C9A",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -134.63,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9BE1A974_8BE0_C1A0_41E0_3634E71E6FA8",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3F6210_7051_73B6_41CD_00695B402868",
 "label": "19",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_6F65B12E_7073_22D5_41D4_B1777557C4AC",
  "this.overlay_6F89820B_7071_E6D3_41DA_8DE529B46CB3"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -114.59,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_994508AA_8BE0_C0A0_41CC_D8B9B9F315E2",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -12.15,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_994F3B71_8BE0_C1A0_41D9_20065B3F3C5C",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 36.68,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B0F4A12_8BE0_C363_41CF_2CC7E95F2BD2",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -84.07,
  "pitch": 1.14
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A221504_704F_119F_41B4_7CF7828D13F0_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -90.89,
  "pitch": 3.41
 },
 "class": "PanoramaCamera",
 "id": "panorama_5393F731_7057_EECF_41D8_2193DE21467A_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -39.47,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A04AAEA_8BE0_C0A3_41C4_9305D58A188E",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C",
 "label": "14",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
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
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 82.44,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9AEA0A6F_8BE0_C3A1_4195_FF68962F8131",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084",
 "label": "16",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_6A56D3A1_71D1_65CE_41BE_F826FF2950DA",
  "this.overlay_6AC00109_71DF_22DF_41D4_B32E62083798",
  "this.overlay_5F7DCDB5_7053_3D36_41DB_6151F5F48546"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -92.2,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_99C00B1D_8BE0_C161_41D7_902E2B030475",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -62.62,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9BEDD960_8BE0_C1A0_41DC_E39FBF9886B8",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A27CE69_704F_1069_41D2_E246D309FFA4",
 "label": "2",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_7FAC3DA2_704F_7DCD_41B7_B99F79FFFC8E",
  "this.overlay_7FD76870_7070_E34D_417C_8819381E8652",
  "this.overlay_7FB3F4A2_7071_63D2_41CD_F89AF5EA0205",
  "this.overlay_84268B62_8A9F_AA6D_41D9_1F6C27F0B332"
 ]
},
{
 "class": "VideoPlayer",
 "id": "MainViewerVideoPlayer",
 "viewerArea": "this.MainViewer",
 "displayPlaybackBar": true
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -106.69,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B931988_8BE0_C160_41C7_A768D8CE4B17",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 89.03,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B5E49BB_8BE0_C0A0_41C8_6C90BB04CCF2",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 124.1,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9BF32957_8BE0_C1E0_41AE_E593682D6EC1",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -44.32,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9BF6A94D_8BE0_C1E0_418C_10C7E0991D06",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 172.94,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_99E4DB32_8BE0_C1A3_41C7_60B428A0FFFB",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -145.79,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A904A83_8BE0_C361_41E0_40D3162EFD3C",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3ED87F_7051_106A_41BB_70BC10171E67",
 "label": "18",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_6CF5B0C9_707F_235E_41C5_874A965C226C",
  "this.overlay_6C2BED36_7071_1D32_41D9_6A3102BFA77A"
 ]
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135",
 "label": "27",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_55216846_73B1_2352_41D9_8918340A55B5",
  "this.overlay_54C28BCD_73B1_6556_41A6_8F993E5584B2",
  "this.overlay_9ADAE0C2_8BE0_40E0_41D0_DF52DA273272"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 89.33,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_997168BE_8BE0_C0A0_41BC_B8C60431984D",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -103.67,
  "pitch": -12.5
 },
 "class": "PanoramaCamera",
 "id": "panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603",
 "label": "20",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_6FDEF9EF_7073_6553_41BA_5EB605778EE7",
  "this.overlay_6E54248A_7073_23D2_41D2_2CBC7D6C1852"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -96,
  "pitch": -1.7
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -90.15,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A583AAD_8BE0_C0A0_41DD_FA96CEA0DE10",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 147.74,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B192A04_8BE0_C360_41E0_288A669C02AA",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 93.73,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B9B997E_8BE0_C1A0_41CB_70BA9FBB19B7",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 109.14,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_997B18B4_8BE0_C0A0_41DA_4A4263B5D476",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 98.02,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9BCB6925_8BE0_C1A0_41CE_9DED1C827C5D",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 33.25,
    "class": "TargetPanoramaCameraMovement",
    "targetYaw": -91.67,
    "targetPitch": 5.08,
    "easing": "cubic_in_out",
    "path": "shortest",
    "pitchSpeed": 17.05
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -86.5,
  "pitch": 0
 },
 "id": "camera_99155BA5_8BE0_C0A0_41C8_5185FA981B67",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 94.97,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9BBCE99C_8BE0_C160_41D6_5FD5D13B4F59",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -87.48,
  "pitch": -2.84
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB",
 "label": "24",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_500E08EA_7057_635D_41D8_AFC29F51AF9D",
  "this.overlay_530A3838_7051_633E_41CD_6E7E1235C5EF",
  "this.overlay_9B8656DB_8BE0_40E0_41C9_A9B2ED97005D"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 53.97,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9A2ADAFE_8BE0_C0A0_41E1_44A5BAC44A31",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -44.31,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9B25BA3C_8BE0_C3A7_41DF_CC9FFAE3C954",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -92.31,
  "pitch": 0.28
 },
 "class": "PanoramaCamera",
 "id": "panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_camera",
 "automaticZoomSpeed": 10
},
{
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 33.25,
    "class": "TargetPanoramaCameraMovement",
    "targetYaw": -91.67,
    "targetPitch": 5.08,
    "easing": "cubic_in_out",
    "path": "shortest",
    "pitchSpeed": 17.05
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "class": "PanoramaCamera",
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 156.89,
  "pitch": 0
 },
 "id": "camera_996578C9_8BE0_C0E1_41DD_23BDE3B199E0",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -92.02,
  "pitch": -1.99
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F",
 "label": "22",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_51EDDF72_7051_3D32_41D8_03B1EDFF19CF",
  "this.overlay_500C4C12_7050_E2CD_41D9_70EFA5BFE0FC"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 42.05,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_99294BD5_8BE0_C0E0_41C5_6578F13FD245",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -11.64,
  "pitch": -0.85
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_camera",
 "automaticZoomSpeed": 10
},
{
 "hfovMax": 130,
 "hfov": 360,
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/f/0/{row}_{column}.jpg",
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
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
      "colCount": 4,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 2048,
      "rowCount": 4,
      "height": 2048
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "tags": "ondemand",
      "width": 1024,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "tags": [
       "ondemand",
       "preload"
      ],
      "width": 512,
      "rowCount": 1,
      "height": 512
     }
    ]
   }
  }
 ],
 "id": "panorama_7A3EA27B_7051_306A_41DA_E9C19520171A",
 "label": "29",
 "class": "Panorama",
 "pitch": 0,
 "thumbnailUrl": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_t.jpg",
 "vfov": 180,
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
 "hfovMin": "135%",
 "partial": false,
 "overlays": [
  "this.overlay_595F47D5_7071_2D76_41C8_F345085684D3",
  "this.overlay_5EB34232_7073_26CD_41CA_9A28BD41A04B",
  "this.overlay_5EB42946_7070_E555_41D6_BCACB41F7745"
 ]
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -88.95,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9BE7896A_8BE0_C1A0_41DD_5D7A94FAB4B4",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -87.55,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "camera_9BC3993A_8BE0_C1A0_41CD_38BE5BA4DB42",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -88.62,
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_camera",
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
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -88.33,
  "pitch": -0.85
 },
 "class": "PanoramaCamera",
 "id": "panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_camera",
 "automaticZoomSpeed": 10
},
{
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarBottom": 5,
 "toolTipShadowSpread": 0,
 "progressBorderColor": "#000000",
 "id": "MainViewer",
 "paddingBottom": 0,
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
 "minWidth": 100,
 "class": "ViewerArea",
 "height": "100%",
 "playbackBarHeadBorderRadius": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowOpacity": 1,
 "playbackBarHeadShadowHorizontalLength": 0,
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
 "paddingRight": 0,
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
 "playbackBarHeadShadowBlurRadius": 3,
 "toolTipBorderRadius": 3,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
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
 "items": [
  {
   "hfov": 18.72,
   "image": "this.AnimatedImageResource_66795284_704F_67D6_41CD_1F05E0A504AA",
   "yaw": 99.72,
   "pitch": -16.51,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -16.51
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_669A0C5E_7053_2375_418B_6748416C246C",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142, this.camera_9B9B997E_8BE0_C1A0_41CB_70BA9FBB19B7); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 17.61,
   "image": "this.AnimatedImageResource_66791285_704F_67D7_41C5_68E73A0D72DE",
   "yaw": -107.59,
   "pitch": -25.63,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -25.63
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_64E7C9DC_7051_2576_41D9_5360DEA0362A",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A22A229_704F_3396_41C6_DE07CAD419EC, this.camera_9B931988_8BE0_C160_41C7_A768D8CE4B17); this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 17.49,
   "image": "this.AnimatedImageResource_5A9130D9_73B1_237F_41DB_D56C2C52641C",
   "yaw": -98.52,
   "pitch": -26.41,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -26.41
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_51FECC21_73B3_62CE_41DB_BD1153422F5C",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_504301D3_7057_2572_41D1_5AFEA5CD4210, this.camera_99CE0B12_8BE0_C163_41D7_94ED70D6F657); this.mainPlayList.set('selectedIndex', 30)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 19.17,
   "image": "this.AnimatedImageResource_5A9150D9_73B1_237F_41A3_F64C749A5DA1",
   "yaw": -110.6,
   "pitch": -10.94,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -10.94
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_568F146C_73B7_2355_41D9_D1E345A8BA2F",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 25)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.35,
   "image": "this.AnimatedImageResource_4A1E2F56_7053_3D75_41A9_9005FCEFE3CE",
   "yaw": 135.68,
   "pitch": -19.98,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -19.98
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5FE3D4C6_704F_2352_41C8_091EF31D5FDC",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1, this.camera_99DCDB08_8BE0_C16F_41CD_B4F5F84DD2DB); this.mainPlayList.set('selectedIndex', 24)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.96,
   "image": "this.AnimatedImageResource_5A9220D7_73B1_2373_41D9_1D5DC0474646",
   "yaw": 122.09,
   "pitch": -13.88,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -13.88
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5321FE63_7051_FF53_41D4_7A620930E32A",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A239570_704F_7076_4188_69F7B87F5323, this.camera_9BF32957_8BE0_C1E0_41AE_E593682D6EC1); this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.32,
   "image": "this.AnimatedImageResource_5A9240D7_73B1_2372_41D1_06DDCD9649E0",
   "yaw": -32.34,
   "pitch": -20.28,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -20.28
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_521070F8_704F_233D_41D6_4F7162DC7EC0",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06, this.camera_9BF6A94D_8BE0_C1E0_418C_10C7E0991D06); this.mainPlayList.set('selectedIndex', 27)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.78,
   "image": "this.AnimatedImageResource_5A9290D7_73B1_2372_41C4_54623F18FD67",
   "yaw": -70.69,
   "pitch": -15.89,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -15.89
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_560CD5C3_73B1_6D52_41CC_BAE1433D3F64",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_504301D3_7057_2572_41D1_5AFEA5CD4210, this.camera_9BEDD960_8BE0_C1A0_41DC_E39FBF9886B8); this.mainPlayList.set('selectedIndex', 30)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18,
   "image": "this.AnimatedImageResource_6F384822_71B1_22CD_41D2_E3D95171FCFF",
   "yaw": 92.45,
   "pitch": -22.84,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -22.84
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_686C7E12_71B1_1EF2_419E_1ECD43B4A914",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39, this.camera_9956B896_8BE0_CF63_41CF_F0B33FC4B8FE); this.mainPlayList.set('selectedIndex', 9)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.98,
   "image": "this.AnimatedImageResource_6F38D822_71B1_22CD_41BF_CA14D521E62A",
   "yaw": -94.22,
   "pitch": -13.58,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -13.58
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6B8D1B92_71BF_25F2_4194_6F575E19A1D2",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 11)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 17.64,
   "image": "this.AnimatedImageResource_5A9300D8_73B1_237D_41D5_475B234C0551",
   "yaw": -26.96,
   "pitch": -25.42,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -25.42
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_565C5B38_73B1_E53E_41AC_F6D5BDDE6000",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135, this.camera_9A04AAEA_8BE0_C0A3_41C4_9305D58A188E); this.mainPlayList.set('selectedIndex', 26)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 19.06,
   "image": "this.AnimatedImageResource_5A93B0D8_73B1_237D_41D3_984D25E7B92A",
   "yaw": -70.86,
   "pitch": -12.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -12.54
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_55F1A55C_73B3_2D76_41D4_1138AB0190E3",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_5393F731_7057_EECF_41D8_2193DE21467A, this.camera_9A394AF4_8BE0_C0A7_41DB_5FA0277BBDFA); this.mainPlayList.set('selectedIndex', 29)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.74,
   "image": "this.AnimatedImageResource_5A93D0D8_73B1_237D_41DC_03926AAFBDC5",
   "yaw": 70.69,
   "pitch": -16.37,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -16.37
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_54B97E9C_73B3_FFF6_41C0_D8DAD09EEEDB",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_504301D3_7057_2572_41D1_5AFEA5CD4210, this.camera_9A2ADAFE_8BE0_C0A0_41E1_44A5BAC44A31); this.mainPlayList.set('selectedIndex', 30)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 16.22,
   "image": "this.AnimatedImageResource_61E1CA71_7051_274E_41D5_AF2707C5D66C",
   "yaw": 96.28,
   "pitch": -33.82,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -33.82
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_615ABE75_7051_1F36_41DA_1449191E69A2",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66, this.camera_9B5E49BB_8BE0_C0A0_41C8_6C90BB04CCF2); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 17.84,
   "image": "this.AnimatedImageResource_4A2AAF3B_7053_3D32_41DB_07E1C0C2F78E",
   "yaw": 2.11,
   "pitch": -24,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -24
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6279A60F_7053_6ED3_41B9_34347F14C935",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A239570_704F_7076_4188_69F7B87F5323, this.camera_9BA819B1_8BE0_C0A0_41CC_4AEE89D0A19F); this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 17.33,
   "image": "this.AnimatedImageResource_61E15A72_7051_274D_41C5_095FD7F491E1",
   "yaw": -91.87,
   "pitch": -27.46,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -27.46
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_61B52815_7051_62F6_41C2_27460228023F",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142, this.camera_9BB209A6_8BE0_C0A0_41C6_D0EAB196B389); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 14.65,
   "image": "this.AnimatedImageResource_4A2D3F3C_7053_3D35_41A5_B787675163AF",
   "yaw": -35.95,
   "pitch": -9.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -9.54
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_42CCC360_7051_654D_41D9_751D21869B6F",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 24)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "hfov": 6.14,
 "autoplay": true,
 "id": "overlay_9ABF8BE0_8A9D_EA6C_41DB_4DFB62FE3E2A",
 "blending": 0,
 "roll": -0.28,
 "enabledInCardboard": true,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_9ABF8BE0_8A9D_EA6C_41DB_4DFB62FE3E2A_t.jpg",
    "width": 1400,
    "class": "ImageResourceLevel",
    "height": 3500
   }
  ]
 },
 "useHandCursor": true,
 "class": "VideoPanoramaOverlay",
 "yaw": 7.25,
 "vfov": 11.61,
 "pitch": 1.5,
 "rotationY": -5.35,
 "loop": true,
 "rotationX": 7.59,
 "videoVisibleOnStop": false,
 "distance": 50,
 "data": {
  "label": "Video"
 },
 "video": {
  "width": 608,
  "class": "VideoResource",
  "height": 1520,
  "mp4Url": "media/video_84DE611E_8A93_B7D5_41D6_0F9EA054E4DA.mp4"
 }
},
{
 "hfov": 11.57,
 "autoplay": true,
 "id": "overlay_9BAE1175_8BE1_C1A1_41BE_AE6540D67293",
 "blending": 0,
 "roll": 6.65,
 "enabledInCardboard": true,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_9BAE1175_8BE1_C1A1_41BE_AE6540D67293_t.jpg",
    "width": 1778,
    "class": "ImageResourceLevel",
    "height": 2826
   }
  ]
 },
 "useHandCursor": true,
 "class": "VideoPanoramaOverlay",
 "yaw": 18.3,
 "vfov": 13.52,
 "pitch": 2.25,
 "rotationY": -72.09,
 "loop": true,
 "rotationX": -7.23,
 "videoVisibleOnStop": false,
 "distance": 50,
 "data": {
  "label": "Video"
 },
 "video": {
  "width": 762,
  "class": "VideoResource",
  "height": 1212,
  "mp4Url": "media/video_8561312B_8BE0_41A0_41D2_9D0890BA870F.mp4"
 }
},
{
 "items": [
  {
   "hfov": 18.26,
   "image": "this.AnimatedImageResource_6CDE1AD7_704F_6773_419E_C63AA0757C0B",
   "yaw": -1.53,
   "pitch": -20.77,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -20.77
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_68A14AF5_7051_2737_41C4_64A1CC63969D",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C, this.camera_991118DC_8BE0_C0E0_412A_52AB089D9210); this.mainPlayList.set('selectedIndex', 13)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.35,
   "image": "this.AnimatedImageResource_6CDDEADC_704F_6775_41D2_E4DDB94201CB",
   "yaw": 135.69,
   "pitch": -19.99,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -19.99
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6AF9E9DC_7050_E575_41C1_E95F00D57ACD",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A211E56_704F_13BA_419D_7F32F8B0E231, this.camera_996578C9_8BE0_C0E1_41DD_23BDE3B199E0); this.mainPlayList.set('selectedIndex', 11)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.45,
   "image": "this.AnimatedImageResource_595FB3D6_70B7_2575_41D5_28E49E9B94D4",
   "yaw": -85.03,
   "pitch": -19.16,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -19.16
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_51EF9F88_7053_3DDD_41C9_08E0045A5A20",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F, this.camera_99963B3D_8BE0_C1A0_41CF_389D47D8D4D8); this.mainPlayList.set('selectedIndex', 21)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 12.84,
   "image": "this.AnimatedImageResource_595FC3D6_70B7_2575_41D7_52EAA4DCFB80",
   "yaw": 166.03,
   "pitch": -13.59,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -13.59
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_50EFD635_7051_2F36_41CB_D1CC6234E72E",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB, this.camera_99E4DB32_8BE0_C1A3_41C7_60B428A0FFFB); this.mainPlayList.set('selectedIndex', 23)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 16.97,
   "image": "this.AnimatedImageResource_667CB284_704F_67D5_41D5_BC42FBE3E1B8",
   "yaw": 92.16,
   "pitch": -29.67,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -29.67
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_635E28D6_705F_2375_41D9_5BB6E9C3FD28",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655, this.camera_9937EBC5_8BE0_C0E0_41DA_42DEF93C5A2A); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 17.57,
   "image": "this.AnimatedImageResource_4A2D9F3C_7053_3D36_41D9_4F5F9ADFDCE6",
   "yaw": 34.21,
   "pitch": -25.88,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -25.88
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_637C5B37_7051_2532_41A2_D29D91CEEDFC",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A239570_704F_7076_4188_69F7B87F5323, this.camera_99294BD5_8BE0_C0E0_41C5_6578F13FD245); this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.96,
   "image": "this.AnimatedImageResource_667BD284_704F_67D5_41C8_ABD1828E6593",
   "yaw": -86.27,
   "pitch": -13.84,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -13.84
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_64D603FD_7050_E537_41C3_17ACA3239AD2",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A23BED3_704F_70BA_419E_85F35EC070E2, this.camera_98D83BE5_8BE0_C0A0_41D7_DAA06E56046B); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 15.01,
   "image": "this.AnimatedImageResource_4A2CEF3C_7053_3D36_41C5_F4D5FA707834",
   "yaw": -16.17,
   "pitch": -15.74,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -15.74
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_42B1E473_705F_6333_41C9_7C6DAB291F69",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 24)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "hfov": 10.59,
 "autoplay": true,
 "id": "overlay_9B4EC891_8BE0_4F61_41CE_092A68A8DB16",
 "blending": 0,
 "roll": 2.6,
 "enabledInCardboard": true,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_9B4EC891_8BE0_4F61_41CE_092A68A8DB16_t.jpg",
    "width": 1778,
    "class": "ImageResourceLevel",
    "height": 2826
   }
  ]
 },
 "useHandCursor": true,
 "class": "VideoPanoramaOverlay",
 "yaw": 28.88,
 "vfov": 11.31,
 "pitch": 2.17,
 "rotationY": -65.12,
 "loop": true,
 "rotationX": -2.91,
 "videoVisibleOnStop": false,
 "distance": 50,
 "data": {
  "label": "Video"
 },
 "video": {
  "width": 762,
  "class": "VideoResource",
  "height": 1212,
  "mp4Url": "media/video_8561312B_8BE0_41A0_41D2_9D0890BA870F.mp4"
 }
},
{
 "items": [
  {
   "hfov": 18.64,
   "image": "this.AnimatedImageResource_6CDF9AD6_704F_6775_41BC_76E729C50C5B",
   "yaw": 84.75,
   "pitch": -17.29,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -17.29
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_67A84884_70D0_E3D6_41CE_FD05E86B25A3",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 9)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.91,
   "image": "this.AnimatedImageResource_6CDF6AD6_704F_6772_419F_4EE2B3EC64B6",
   "yaw": -83.45,
   "pitch": -14.42,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -14.42
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_676555D5_70D0_ED77_41CE_D6D89E0C9B03",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A211E56_704F_13BA_419D_7F32F8B0E231, this.camera_99155BA5_8BE0_C0A0_41C8_5185FA981B67); this.mainPlayList.set('selectedIndex', 11)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 17.54,
   "image": "this.AnimatedImageResource_6A0E4874_70B1_2335_417B_55A387CE5054",
   "yaw": -85.37,
   "pitch": -26.05,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -26.05
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_66B6F5E7_70B3_2D53_41C2_53AD66C02AC9",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39, this.camera_9A4AFAB8_8BE0_C0AF_41C0_50E645DCB8EC); this.mainPlayList.set('selectedIndex', 9)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 17.73,
   "image": "this.AnimatedImageResource_6A0FF874_70B1_2335_41D3_4F2ADBF91103",
   "yaw": 73.31,
   "pitch": -24.79,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -24.79
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_66703718_70B1_6EFE_41B3_ED8FA90D2717",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A23BED3_704F_70BA_419E_85F35EC070E2, this.camera_9A7CEAC2_8BE0_C0E3_41E0_DD9FD44D8577); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 17.47,
   "image": "this.AnimatedImageResource_6A0F9874_70B1_2336_41CE_9CB5D7CFE835",
   "yaw": 90.89,
   "pitch": -26.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -26.54
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6A82A6AB_70B7_6FD2_41DA_D9F7E063E352",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A22A229_704F_3396_41C6_DE07CAD419EC, this.camera_9BFC0943_8BE0_C1E0_41C2_5D1DEF868C9A); this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.11,
   "image": "this.AnimatedImageResource_6A0F3874_70B1_2336_41DA_88FFD0B0AD07",
   "yaw": -75.57,
   "pitch": -21.98,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -21.98
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_67DDAF78_70B1_3D3E_41D6_7029B0B0B811",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC, this.camera_9BC3993A_8BE0_C1A0_41CD_38BE5BA4DB42); this.mainPlayList.set('selectedIndex', 7)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 19.15,
   "image": "this.AnimatedImageResource_5959A3D5_70B7_2577_41D2_71F2B6BBE0CF",
   "yaw": 87.29,
   "pitch": -11.25,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -11.25
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6EB1017D_7070_E536_41C0_BAE820711A53",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F, this.camera_99F22B27_8BE0_C1A0_41E0_EC4CB2B8F72B); this.mainPlayList.set('selectedIndex', 21)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 19.1,
   "image": "this.AnimatedImageResource_595823D5_70B7_2576_41D5_550F6943F75E",
   "yaw": -81.98,
   "pitch": -11.99,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -11.99
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_50CCF53F_704F_ED33_41CB_69D32B2C2961",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603, this.camera_99C00B1D_8BE0_C161_41D7_902E2B030475); this.mainPlayList.set('selectedIndex', 19)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 10.79,
   "image": "this.AnimatedImageResource_6C031B27_71D3_26D3_4189_4BFF8A126DC8",
   "yaw": 168.86,
   "pitch": -23.74,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -23.74
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6DD92F6B_71D1_7D52_41DA_73D7D905CAA2",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C, this.camera_9B6069F9_8BE0_C0A0_41B2_026680760EE3); this.mainPlayList.set('selectedIndex', 13)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.65,
   "image": "this.AnimatedImageResource_6C03AB27_71D3_26D3_41DA_5BC8BB197395",
   "yaw": -10.4,
   "pitch": -17.27,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -17.27
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6DB1EB3F_71D3_E532_41D1_195D505B6085",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084, this.camera_9B7499E4_8BE0_C0A0_41DE_1CE0678B901A); this.mainPlayList.set('selectedIndex', 15)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 19.15,
   "image": "this.AnimatedImageResource_4A240F4B_7053_3D53_41BE_4B9D65CA50E9",
   "yaw": 45.37,
   "pitch": -11.28,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -11.28
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5CCC1A8B_7050_E7D3_41DA_63DDCFA86185",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3EA27B_7051_306A_41DA_E9C19520171A, this.camera_9B6A29EE_8BE0_C0A0_41B3_72B446C5735D); this.mainPlayList.set('selectedIndex', 28)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.35,
   "image": "this.AnimatedImageResource_4A24AF4B_7053_3D53_41DC_9FD379D42CFF",
   "yaw": 122.98,
   "pitch": -19.99,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -19.99
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_4350FA15_7051_26F6_41D4_22AE3150941C",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_5393F731_7057_EECF_41D8_2193DE21467A, this.camera_9B192A04_8BE0_C360_41E0_288A669C02AA); this.mainPlayList.set('selectedIndex', 29)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 16,
   "image": "this.AnimatedImageResource_4A272F4C_7053_3D55_41DB_E9C9C463F327",
   "yaw": 109.29,
   "pitch": -10.67,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -10.67
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_42C53962_7050_E552_41C9_5617F3FB1432",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 26)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 17.72,
   "image": "this.AnimatedImageResource_61E6DA6F_7051_2753_41B1_19B765801506",
   "yaw": -87.62,
   "pitch": -20.15,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -20.15
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7DDD6484_7051_23D6_41D9_A51A1A0AE696",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A27CE69_704F_1069_41D2_E246D309FFA4, this.camera_9B2FBA32_8BE0_C3A3_4192_170A782299E3); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.76,
   "image": "this.AnimatedImageResource_667B9284_704F_67D6_41D1_C2324448D2A9",
   "yaw": 83.5,
   "pitch": -16.14,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -16.14
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6430C093_7050_E3F3_41D6_07156CE92789",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A27CE69_704F_1069_41D2_E246D309FFA4, this.camera_9AEA0A6F_8BE0_C3A1_4195_FF68962F8131); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.04,
   "image": "this.AnimatedImageResource_667A0284_704F_67D6_41D2_AE2C1143A518",
   "yaw": 141.82,
   "pitch": -22.47,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -22.47
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_63A85FEA_7051_3D5D_4185_7547E4C44906",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66, this.camera_9AB42A97_8BE0_C360_41A6_7E90C2CDF8E6); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 12.99,
   "image": "this.AnimatedImageResource_667AC284_704F_67D6_41A8_25D873A79B6C",
   "yaw": 175.34,
   "pitch": -28.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -28.54
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_647E6CB2_7050_E332_4177_3AA11F3DCCB8",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655, this.camera_9A9C0A79_8BE0_C3A0_41DB_C793A2A18171); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.14,
   "image": "this.AnimatedImageResource_667A8284_704F_67D6_41DA_21C5EC8ADDAB",
   "yaw": -137.95,
   "pitch": -21.69,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -21.69
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_643BC4D7_7057_E373_41C0_42415776191E",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142, this.camera_9A904A83_8BE0_C361_41E0_40D3162EFD3C); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.9,
   "image": "this.AnimatedImageResource_5A8530D1_73B1_234F_41D6_F2FC4BC6DE85",
   "yaw": -55.9,
   "pitch": -14.6,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -14.6
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_551CB018_7053_E2FE_41D1_F6A1DFA3FE4F",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1, this.camera_9A823A8D_8BE0_C361_41CB_11F412D75739); this.mainPlayList.set('selectedIndex', 24)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "hfov": 8.32,
 "autoplay": true,
 "id": "overlay_9A0676ED_8A9C_BA74_41DB_E92225730298",
 "blending": 0,
 "roll": -0.98,
 "enabledInCardboard": true,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_9A0676ED_8A9C_BA74_41DB_E92225730298_t.jpg",
    "width": 1400,
    "class": "ImageResourceLevel",
    "height": 3500
   }
  ]
 },
 "useHandCursor": true,
 "class": "VideoPanoramaOverlay",
 "yaw": 10.46,
 "vfov": 14.31,
 "pitch": 1.92,
 "rotationY": 10.73,
 "loop": true,
 "rotationX": -3.56,
 "videoVisibleOnStop": false,
 "distance": 50,
 "data": {
  "label": "Video"
 },
 "video": {
  "width": 608,
  "class": "VideoResource",
  "height": 1520,
  "mp4Url": "media/video_84DE611E_8A93_B7D5_41D6_0F9EA054E4DA.mp4"
 }
},
{
 "hfov": 14.26,
 "autoplay": false,
 "id": "overlay_9B84B65A_8BE1_C3E0_41DA_DF913CE46F2A",
 "blending": 0,
 "roll": 3.31,
 "enabledInCardboard": true,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_9B84B65A_8BE1_C3E0_41DA_DF913CE46F2A_t.jpg",
    "width": 1778,
    "class": "ImageResourceLevel",
    "height": 2826
   }
  ]
 },
 "pitch": 2.68,
 "useHandCursor": true,
 "class": "VideoPanoramaOverlay",
 "yaw": 24.71,
 "vfov": 15.49,
 "rotationY": -68.12,
 "loop": false,
 "rotationX": -3.49,
 "click": "this.overlay_9B84B65A_8BE1_C3E0_41DA_DF913CE46F2A.play()",
 "videoVisibleOnStop": false,
 "distance": 50,
 "data": {
  "label": "Video"
 },
 "video": {
  "width": 762,
  "class": "VideoResource",
  "height": 1212,
  "mp4Url": "media/video_8561312B_8BE0_41A0_41D2_9D0890BA870F.mp4"
 }
},
{
 "items": [
  {
   "hfov": 19.22,
   "image": "this.AnimatedImageResource_6CDEDAD6_704F_6772_41C1_4FE40E7340BA",
   "yaw": 93.5,
   "pitch": -10.2,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -10.2
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6761B49D_7057_23F7_4185_9E7720B6D909",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A221504_704F_119F_41B4_7CF7828D13F0, this.camera_9ADB0A46_8BE0_C3E3_41CC_35E2C2A64FD6); this.mainPlayList.set('selectedIndex', 10)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 17.59,
   "image": "this.AnimatedImageResource_6CDE4AD6_704F_6772_41D5_4FDB8C56C5E7",
   "yaw": -23.11,
   "pitch": -25.74,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -25.74
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_68453992_7053_25F2_41CA_AE66FAAB64D4",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152, this.camera_9B25BA3C_8BE0_C3A7_41DF_CC9FFAE3C954); this.mainPlayList.set('selectedIndex', 12)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.66,
   "image": "this.AnimatedImageResource_5A9680D9_73B1_237E_41D3_0BC2886FFA55",
   "yaw": -126.03,
   "pitch": -17.15,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -17.15
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5516A9A8_73BF_E5DD_41DB_D12D35E134FF",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD, this.camera_9A157AE0_8BE0_C0DF_41AD_9D771C613DA9); this.mainPlayList.set('selectedIndex', 25)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.95,
   "image": "this.AnimatedImageResource_5A96D0DA_73B1_237D_41B8_9E635B944C45",
   "yaw": 117.38,
   "pitch": -14.01,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -14.01
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_58894958_73BF_257D_41AB_97C9D4520C96",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1, this.camera_9A609AD6_8BE0_C0E3_41C7_7D8D866F160D); this.mainPlayList.set('selectedIndex', 24)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 17.98,
   "image": "this.AnimatedImageResource_4A12FF58_7053_3D7D_41C3_7092B6821A46",
   "yaw": 54.41,
   "pitch": -22.96,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -22.96
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5851C76A_7071_2D52_41D0_2B6FAAC07C53",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06, this.camera_9A6ECACC_8BE0_C0E7_417D_170A6E0396C0); this.mainPlayList.set('selectedIndex', 27)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 13.75,
   "image": "this.AnimatedImageResource_4A129F58_7053_3D7D_41DA_796A173FAF60",
   "yaw": -89.62,
   "pitch": -8.55,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -8.55
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_582B95FF_7073_2D32_41B4_178603025F17",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 29)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 19.2,
   "image": "this.AnimatedImageResource_5A91F0D9_73B1_237E_41D1_CB445EADA8DC",
   "yaw": 17.43,
   "pitch": -10.42,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -10.42
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5A63EA0E_73B1_E6D2_41D2_22314376BD7F",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 28)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 11.52,
   "image": "this.AnimatedImageResource_5A9610D9_73B1_237E_41D7_D52D8E203EFB",
   "yaw": 107.02,
   "pitch": -9.45,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -9.45
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5ADA32D0_73B3_274D_41D2_63C68BFCD21E",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD, this.camera_997B18B4_8BE0_C0A0_41DA_4A4263B5D476); this.mainPlayList.set('selectedIndex', 25)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.17,
   "image": "this.AnimatedImageResource_4A10DF57_7053_3D73_41CC_501DBBF715C8",
   "yaw": 89.85,
   "pitch": -21.45,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -21.45
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5863719F_7070_E5F3_41BF_BE4971A26474",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135, this.camera_997168BE_8BE0_C0A0_41BC_B8C60431984D); this.mainPlayList.set('selectedIndex', 26)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.65,
   "image": "this.AnimatedImageResource_4A134F57_7053_3D73_41D2_9E26838442E9",
   "yaw": -145.45,
   "pitch": -17.22,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -17.22
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_58133318_7077_26FD_41D3_099E06D34A59",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C, this.camera_994508AA_8BE0_C0A0_41CC_D8B9B9F315E2); this.mainPlayList.set('selectedIndex', 13)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 16.68,
   "image": "this.AnimatedImageResource_4A13FF57_7053_3D73_41C1_8CABC8ED4DA9",
   "yaw": -32.26,
   "pitch": -15.16,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -15.16
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_59F43E52_7077_7F72_41D1_CA910F0C4B0E",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837, this.camera_994F58A0_8BE0_CF5F_41E0_DC5F5E2E2B4B); this.mainPlayList.set('selectedIndex', 14)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 16.74,
   "image": "this.AnimatedImageResource_61E02A71_7051_274E_41CA_2B78766F648B",
   "yaw": -90.97,
   "pitch": -30.96,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -30.96
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7F12E43F_7071_6333_41D7_503276F2C26A",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655, this.camera_9B02CA1C_8BE0_C360_41E1_5F45C4DF0908); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 9.23,
   "image": "this.AnimatedImageResource_61E07A71_7051_274E_41D7_D28FD4F20BB9",
   "yaw": -48.63,
   "pitch": -19.9,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -19.9
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7FFA0C9B_7071_63F2_41BA_09805CD662E1",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A239570_704F_7076_4188_69F7B87F5323, this.camera_9B380A27_8BE0_C3A1_41D9_F7C2354DB794); this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 9.2,
   "image": "this.AnimatedImageResource_61E1AA71_7051_274E_41D6_313EFF3E8256",
   "yaw": 40.49,
   "pitch": -20.47,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -20.47
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7FBB3162_704F_254D_41D7_D0B35469CDE1",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A27CE69_704F_1069_41D2_E246D309FFA4, this.camera_9B0F4A12_8BE0_C363_41CF_2CC7E95F2BD2); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "hfov": 7.29,
 "autoplay": true,
 "id": "overlay_84ACEEBF_8A9C_AAD3_41D3_61404B7C0ED9",
 "blending": 0,
 "roll": -0.11,
 "enabledInCardboard": true,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_84ACEEBF_8A9C_AAD3_41D3_61404B7C0ED9_t.jpg",
    "width": 1400,
    "class": "ImageResourceLevel",
    "height": 3500
   }
  ]
 },
 "useHandCursor": true,
 "class": "VideoPanoramaOverlay",
 "yaw": -1.4,
 "vfov": 11.75,
 "pitch": 1.52,
 "rotationY": 1.05,
 "loop": true,
 "rotationX": -3.58,
 "videoVisibleOnStop": false,
 "distance": 50,
 "data": {
  "label": "Video"
 },
 "video": {
  "width": 608,
  "class": "VideoResource",
  "height": 1520,
  "mp4Url": "media/video_84DE611E_8A93_B7D5_41D6_0F9EA054E4DA.mp4"
 }
},
{
 "hfov": 13.45,
 "autoplay": true,
 "id": "overlay_859CCF87_8BE3_C160_41CA_F78799350727",
 "blending": 0,
 "roll": 9.56,
 "enabledInCardboard": true,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_859CCF87_8BE3_C160_41CA_F78799350727_t.jpg",
    "width": 1778,
    "class": "ImageResourceLevel",
    "height": 2826
   }
  ]
 },
 "useHandCursor": true,
 "class": "VideoPanoramaOverlay",
 "yaw": 8.12,
 "vfov": 13.43,
 "pitch": 1.75,
 "rotationY": -82.76,
 "loop": true,
 "rotationX": -8.66,
 "videoVisibleOnStop": false,
 "distance": 50,
 "data": {
  "label": "Video"
 },
 "video": {
  "width": 762,
  "class": "VideoResource",
  "height": 1212,
  "mp4Url": "media/video_8561312B_8BE0_41A0_41D2_9D0890BA870F.mp4"
 }
},
{
 "items": [
  {
   "hfov": 18.4,
   "image": "this.AnimatedImageResource_595A33D4_70B7_2575_41C9_C54DCAEF48EB",
   "yaw": 54.85,
   "pitch": -19.54,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -19.54
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6F65B12E_7073_22D5_41D4_B1777557C4AC",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603, this.camera_9B5529C5_8BE0_C0E0_41DD_5446258959EB); this.mainPlayList.set('selectedIndex', 19)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 13.32,
   "image": "this.AnimatedImageResource_595A43D4_70B7_2576_41A4_401276E53931",
   "yaw": 167.85,
   "pitch": -32.03,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -32.03
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6F89820B_7071_E6D3_41DA_8DE529B46CB3",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3ED87F_7051_106A_41BB_70BC10171E67, this.camera_9B4B69D0_8BE0_C0E0_41D3_A81502D1995C); this.mainPlayList.set('selectedIndex', 17)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 13.72,
   "image": "this.AnimatedImageResource_6CA84D1B_71B3_62F2_41C0_77EC95CF63D6",
   "yaw": 164.38,
   "pitch": -32.82,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -32.82
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6866C0FF_71B1_2333_41D9_3CB28C2F8AA9",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152, this.camera_99899B48_8BE0_C1EF_41C6_ACB0985A5423); this.mainPlayList.set('selectedIndex', 12)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.82,
   "image": "this.AnimatedImageResource_6CA82D1B_71B3_62F2_41D8_AEF5EE040DD9",
   "yaw": 1.44,
   "pitch": -15.48,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -15.48
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6BBB6625_71B3_6ED2_41D8_159277BE4D32",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837, this.camera_99AAEB5C_8BE0_C1E7_41B2_0570A23136AC); this.mainPlayList.set('selectedIndex', 14)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.79,
   "image": "this.AnimatedImageResource_4A221F44_7053_3D56_41BC_C2B6994FBAAB",
   "yaw": 65.41,
   "pitch": -15.76,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -15.76
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5C257871_7051_E332_41C6_5BD6EFEF21A2",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_5393F731_7057_EECF_41D8_2193DE21467A, this.camera_99BB0B51_8BE0_C1E0_41B9_954C56034438); this.mainPlayList.set('selectedIndex', 29)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 13.1,
   "image": "this.AnimatedImageResource_4A228F45_7053_3D57_41D3_FAC151BFA4B2",
   "yaw": 80.91,
   "pitch": -10.08,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -10.08
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5C221AF3_7053_2732_41C1_464B3C2D2342",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 26)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 6.37,
   "image": "this.AnimatedImageResource_4A250F45_7053_3D57_41D7_2213D864DC0B",
   "yaw": 97.16,
   "pitch": -8.78,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -8.78
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5D0A0E8E_7053_1FD2_41C4_25AB9B7D3DE7",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 25)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 7.83,
   "image": "this.AnimatedImageResource_6C03CB27_71D3_26D2_41BD_89EFCDFB63D8",
   "yaw": 172.21,
   "pitch": -14.78,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -14.78
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6A56D3A1_71D1_65CE_41BE_F826FF2950DA",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837, this.camera_9AF81A64_8BE0_C3A7_41D3_0FB1A16850ED); this.mainPlayList.set('selectedIndex', 14)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.87,
   "image": "this.AnimatedImageResource_6C027B27_71D3_26D2_41B9_6701A222C760",
   "yaw": -8.83,
   "pitch": -14.95,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -14.95
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6AC00109_71DF_22DF_41D4_B32E62083798",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3ED87F_7051_106A_41BB_70BC10171E67, this.camera_9AC52A5A_8BE0_C3E3_41E0_4841F864A3C0); this.mainPlayList.set('selectedIndex', 17)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.65,
   "image": "this.AnimatedImageResource_4A262F4C_7053_3D55_418B_B5B3D1438E46",
   "yaw": 91.05,
   "pitch": -17.24,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -17.24
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5F7DCDB5_7053_3D36_41DB_6151F5F48546",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3EA27B_7051_306A_41DA_E9C19520171A, this.camera_9ACE0A50_8BE0_C3FF_41D2_16A37B8E3381); this.mainPlayList.set('selectedIndex', 28)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.09,
   "image": "this.AnimatedImageResource_61E71A70_7051_274E_4190_788BE4A0588E",
   "yaw": -143.32,
   "pitch": -22.14,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -22.14
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7FAC3DA2_704F_7DCD_41B7_B99F79FFFC8E",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66, this.camera_99655B90_8BE0_C160_41D9_E28DAEFE1846); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 10.75,
   "image": "this.AnimatedImageResource_61E75A71_7051_274F_41CD_8727ED2F9DB2",
   "yaw": -97.56,
   "pitch": -19.09,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -19.09
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7FD76870_7070_E34D_417C_8819381E8652",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A239570_704F_7076_4188_69F7B87F5323, this.camera_9973FB86_8BE0_C160_41D6_D57852832C1A); this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.28,
   "image": "this.AnimatedImageResource_61E0EA71_7051_274F_41BE_45017D34FD16",
   "yaw": 88.24,
   "pitch": -20.6,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -20.6
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_7FB3F4A2_7071_63D2_41CD_F89AF5EA0205",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7AC944C0_704F_1096_41CC_FB746688AAE7, this.camera_99407B7B_8BE0_C1A0_41DB_EC986E91ACB5); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "hfov": 8.69,
 "autoplay": true,
 "id": "overlay_84268B62_8A9F_AA6D_41D9_1F6C27F0B332",
 "blending": 0,
 "roll": 0.21,
 "enabledInCardboard": true,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_84268B62_8A9F_AA6D_41D9_1F6C27F0B332_t.jpg",
    "width": 1400,
    "class": "ImageResourceLevel",
    "height": 3500
   }
  ]
 },
 "useHandCursor": true,
 "class": "VideoPanoramaOverlay",
 "yaw": -13.37,
 "vfov": 15.48,
 "pitch": 2.08,
 "rotationY": -14.06,
 "loop": true,
 "rotationX": -4.82,
 "videoVisibleOnStop": false,
 "distance": 50,
 "data": {
  "label": "Video"
 },
 "video": {
  "width": 608,
  "class": "VideoResource",
  "height": 1520,
  "mp4Url": "media/video_84DE611E_8A93_B7D5_41D6_0F9EA054E4DA.mp4"
 }
},
{
 "items": [
  {
   "hfov": 16.76,
   "image": "this.AnimatedImageResource_595B73CE_70B7_2552_41D6_47CC65B7AEC6",
   "yaw": -3.37,
   "pitch": -30.85,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -30.85
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6CF5B0C9_707F_235E_41C5_874A965C226C",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3F6210_7051_73B6_41CD_00695B402868, this.camera_994F3B71_8BE0_C1A0_41D9_20065B3F3C5C); this.mainPlayList.set('selectedIndex', 18)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 8.36,
   "image": "this.AnimatedImageResource_595B93D4_70B7_2575_41C4_0ED4A1A55E5F",
   "yaw": 169.03,
   "pitch": -34.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -34.18
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6C2BED36_7071_1D32_41D9_6A3102BFA77A",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084, this.camera_995DBB66_8BE0_C1A0_41DC_A69FD08FF46B); this.mainPlayList.set('selectedIndex', 15)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.02,
   "image": "this.AnimatedImageResource_5A9060D8_73B1_237E_41D9_6283474ECE6D",
   "yaw": 140.53,
   "pitch": -22.68,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -22.68
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_55216846_73B1_2352_41D9_8918340A55B5",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD, this.camera_9AA62AA3_8BE0_C0A1_41E1_2E75B8582161); this.mainPlayList.set('selectedIndex', 25)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.88,
   "image": "this.AnimatedImageResource_5A9090D8_73B1_237E_41CE_109C014F8F37",
   "yaw": -90.67,
   "pitch": -14.84,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -14.84
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_54C28BCD_73B1_6556_41A6_8F993E5584B2",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_5393F731_7057_EECF_41D8_2193DE21467A, this.camera_9A583AAD_8BE0_C0A0_41DD_FA96CEA0DE10); this.mainPlayList.set('selectedIndex', 29)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "hfov": 5.78,
 "autoplay": true,
 "id": "overlay_9ADAE0C2_8BE0_40E0_41D0_DF52DA273272",
 "blending": 0,
 "roll": -4.43,
 "enabledInCardboard": true,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_9ADAE0C2_8BE0_40E0_41D0_DF52DA273272_t.jpg",
    "width": 1400,
    "class": "ImageResourceLevel",
    "height": 3500
   }
  ]
 },
 "useHandCursor": true,
 "class": "VideoPanoramaOverlay",
 "yaw": 72.77,
 "vfov": 7.34,
 "pitch": 1.24,
 "rotationY": 74.36,
 "loop": true,
 "rotationX": -5.16,
 "videoVisibleOnStop": false,
 "distance": 50,
 "data": {
  "label": "Video"
 },
 "video": {
  "width": 608,
  "class": "VideoResource",
  "height": 1520,
  "mp4Url": "media/video_84DE611E_8A93_B7D5_41D6_0F9EA054E4DA.mp4"
 }
},
{
 "items": [
  {
   "hfov": 18.48,
   "image": "this.AnimatedImageResource_595AE3D4_70B7_2576_41D1_B2E16FF6876F",
   "yaw": -93.07,
   "pitch": -18.82,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -18.82
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6FDEF9EF_7073_6553_41BA_5EB605778EE7",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3F6210_7051_73B6_41CD_00695B402868, this.camera_9BC78930_8BE0_C1A0_41E0_191B0BA7FBBC); this.mainPlayList.set('selectedIndex', 18)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 19.1,
   "image": "this.AnimatedImageResource_595963D5_70B7_2577_41D5_474C1B8507AC",
   "yaw": 87.8,
   "pitch": -12.04,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -12.04
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_6E54248A_7073_23D2_41D2_2CBC7D6C1852",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280, this.camera_9BCB6925_8BE0_C1A0_41CE_9DED1C827C5D); this.mainPlayList.set('selectedIndex', 20)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 19.07,
   "image": "this.AnimatedImageResource_595E73D6_70B7_2572_41AF_C67CE480E87F",
   "yaw": -7.06,
   "pitch": -12.37,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -12.37
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_500E08EA_7057_635D_41D8_AFC29F51AF9D",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA, this.camera_9B7EA9DA_8BE0_C0E0_41DF_2B76AAD5DB67); this.mainPlayList.set('selectedIndex', 22)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 19.16,
   "image": "this.AnimatedImageResource_595E83D6_70B7_2572_41D1_783E0909D43E",
   "yaw": 139.96,
   "pitch": -11.05,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -11.05
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_530A3838_7051_633E_41CD_6E7E1235C5EF",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "hfov": 11.2,
 "autoplay": false,
 "id": "overlay_9B8656DB_8BE0_40E0_41C9_A9B2ED97005D",
 "blending": 0,
 "roll": -2.09,
 "enabledInCardboard": true,
 "image": {
  "class": "ImageResource",
  "levels": [
   {
    "url": "media/overlay_9B8656DB_8BE0_40E0_41C9_A9B2ED97005D_t.jpg",
    "width": 1778,
    "class": "ImageResourceLevel",
    "height": 2826
   }
  ]
 },
 "pitch": 3.64,
 "useHandCursor": true,
 "class": "VideoPanoramaOverlay",
 "yaw": 120.28,
 "vfov": 20.11,
 "rotationY": 29.28,
 "loop": false,
 "rotationX": -6.55,
 "click": "this.overlay_9B8656DB_8BE0_40E0_41C9_A9B2ED97005D.play()",
 "videoVisibleOnStop": false,
 "distance": 50,
 "data": {
  "label": "Video"
 },
 "video": {
  "width": 762,
  "class": "VideoResource",
  "height": 1212,
  "mp4Url": "media/video_8561312B_8BE0_41A0_41D2_9D0890BA870F.mp4"
 }
},
{
 "items": [
  {
   "hfov": 19.15,
   "image": "this.AnimatedImageResource_5958A3D5_70B7_2576_41C5_476033F12AB8",
   "yaw": -85.82,
   "pitch": -11.28,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -11.28
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_51EDDF72_7051_3D32_41D8_03B1EDFF19CF",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280, this.camera_9B895992_8BE0_C160_41A2_D9149F25EB2F); this.mainPlayList.set('selectedIndex', 20)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 18.43,
   "image": "this.AnimatedImageResource_5958D3D6_70B7_2575_41C6_17BC9DC7F358",
   "yaw": 88.55,
   "pitch": -19.26,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -19.26
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_500C4C12_7050_E2CD_41D9_70EFA5BFE0FC",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA, this.camera_9BBCE99C_8BE0_C160_41D6_5FD5D13B4F59); this.mainPlayList.set('selectedIndex', 22)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 19.06,
   "image": "this.AnimatedImageResource_4A1EAF56_7053_3D75_41BA_E3593D55DFB4",
   "yaw": 40.73,
   "pitch": -12.56,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -12.56
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_595F47D5_7071_2D76_41C8_F345085684D3",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 20)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 19.07,
   "image": "this.AnimatedImageResource_4A115F56_7053_3D75_41D2_F67A452B4036",
   "yaw": -107.51,
   "pitch": -12.41,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -12.41
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5EB34232_7073_26CD_41CA_9A28BD41A04B",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084, this.camera_9BE7896A_8BE0_C1A0_41DD_5D7A94FAB4B4); this.mainPlayList.set('selectedIndex', 15)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "items": [
  {
   "hfov": 15.81,
   "image": "this.AnimatedImageResource_4A11FF56_7053_3D75_41D3_2D81ED10341E",
   "yaw": -142.58,
   "pitch": -8.69,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "enabledInCardboard": true,
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
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -8.69
  }
 ],
 "useHandCursor": true,
 "rollOverDisplay": false,
 "id": "overlay_5EB42946_7070_E555_41D6_BCACB41F7745",
 "data": {
  "label": "Arrow 01c"
 },
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837, this.camera_9BE1A974_8BE0_C1A0_41E0_3634E71E6FA8); this.mainPlayList.set('selectedIndex', 14)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ]
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_66795284_704F_67D6_41CD_1F05E0A504AA"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A23BED3_704F_70BA_419E_85F35EC070E2_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_66791285_704F_67D7_41C5_68E73A0D72DE"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5A9130D9_73B1_237F_41DB_D56C2C52641C"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5A9150D9_73B1_237F_41A3_F64C749A5DA1"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D5913_7051_11BA_41D1_7233A73FBE06_0_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A1E2F56_7053_3D75_41A9_9005FCEFE3CE"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5A9220D7_73B1_2373_41D9_1D5DC0474646"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5A9240D7_73B1_2372_41D1_06DDCD9649E0"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3F5C46_7051_179A_41D7_1265F7AF3AD1_0_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5A9290D7_73B1_2372_41C4_54623F18FD67"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6F384822_71B1_22CD_41D2_E3D95171FCFF"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A22390C_704F_11AE_41D1_1BC5FFD7ACBC_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6F38D822_71B1_22CD_41BF_CA14D521E62A"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5A9300D8_73B1_237D_41D5_475B234C0551"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5A93B0D8_73B1_237D_41D3_984D25E7B92A"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3E45EB_7051_F06A_41D2_E8DFC9EF36FD_0_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5A93D0D8_73B1_237D_41DC_03926AAFBDC5"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_1_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_61E1CA71_7051_274E_41D5_AF2707C5D66C"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A2AAF3B_7053_3D32_41DB_07E1C0C2F78E"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_1_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_61E15A72_7051_274D_41C5_095FD7F491E1"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A23C1B3_704F_10FA_41DB_B54DF2976655_0_HS_3_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A2D3F3C_7053_3D35_41A5_B787675163AF"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6CDE1AD7_704F_6773_419E_C63AA0757C0B"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3CF8E1_7050_F096_41DA_15F83FF6D152_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6CDDEADC_704F_6775_41D2_E4DDB94201CB"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_595FB3D6_70B7_2575_41D5_28E49E9B94D4"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3E38ED_7051_306E_41C5_64DE3CB21ECA_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_595FC3D6_70B7_2575_41D7_52EAA4DCFB80"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_667CB284_704F_67D5_41D5_BC42FBE3E1B8"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A2D9F3C_7053_3D36_41D9_4F5F9ADFDCE6"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_667BD284_704F_67D5_41C8_ABD1828E6593"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A23CBEF_704F_106A_41D3_24FFDA15F142_0_HS_3_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A2CEF3C_7053_3D36_41C5_F4D5FA707834"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6CDF9AD6_704F_6775_41BC_76E729C50C5B"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A221504_704F_119F_41B4_7CF7828D13F0_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6CDF6AD6_704F_6772_419F_4EE2B3EC64B6"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6A0E4874_70B1_2335_417B_55A387CE5054"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A22A229_704F_3396_41C6_DE07CAD419EC_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6A0FF874_70B1_2335_41D3_4F2ADBF91103"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6A0F9874_70B1_2336_41CE_9CB5D7CFE835"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A221B95_704F_30BE_41D6_9CA6B5E5FE39_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6A0F3874_70B1_2336_41DA_88FFD0B0AD07"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5959A3D5_70B7_2577_41D2_71F2B6BBE0CF"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3E258A_7051_10AA_41D5_B94DB4B14280_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_595823D5_70B7_2576_41D5_550F6943F75E"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6C031B27_71D3_26D3_4189_4BFF8A126DC8"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6C03AB27_71D3_26D3_41DA_5BC8BB197395"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A240F4B_7053_3D53_41BE_4B9D65CA50E9"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0_HS_3_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A24AF4B_7053_3D53_41DC_9FD379D42CFF"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D6B93_7051_10BA_41D2_C6FC40D7E837_0_HS_4_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A272F4C_7053_3D55_41DB_E9C9C463F327"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7AC944C0_704F_1096_41CC_FB746688AAE7_1_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_61E6DA6F_7051_2753_41B1_19B765801506"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_667B9284_704F_67D6_41D1_C2324448D2A9"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_667A0284_704F_67D6_41D2_AE2C1143A518"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_667AC284_704F_67D6_41A8_25D873A79B6C"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0_HS_3_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_667A8284_704F_67D6_41DA_21C5EC8ADDAB"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A239570_704F_7076_4188_69F7B87F5323_0_HS_4_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5A8530D1_73B1_234F_41D6_F2FC4BC6DE85"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6CDEDAD6_704F_6772_41C1_4FE40E7340BA"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A211E56_704F_13BA_419D_7F32F8B0E231_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6CDE4AD6_704F_6772_41D5_4FDB8C56C5E7"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_1_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5A9680D9_73B1_237E_41D3_0BC2886FFA55"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_1_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5A96D0DA_73B1_237D_41B8_9E635B944C45"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A12FF58_7053_3D7D_41C3_7092B6821A46"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_504301D3_7057_2572_41D1_5AFEA5CD4210_0_HS_3_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A129F58_7053_3D7D_41DA_796A173FAF60"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_1_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5A91F0D9_73B1_237E_41D1_CB445EADA8DC"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_1_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5A9610D9_73B1_237E_41D7_D52D8E203EFB"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A10DF57_7053_3D73_41CC_501DBBF715C8"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0_HS_3_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A134F57_7053_3D73_41D2_9E26838442E9"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_5393F731_7057_EECF_41D8_2193DE21467A_0_HS_4_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A13FF57_7053_3D73_41C1_8CABC8ED4DA9"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_1_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_61E02A71_7051_274E_41CA_2B78766F648B"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_1_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_61E07A71_7051_274E_41D7_D28FD4F20BB9"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A22884D_704F_3FAE_41C4_F43CE1B65B66_1_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_61E1AA71_7051_274E_41D6_313EFF3E8256"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_595A33D4_70B7_2575_41C9_C54DCAEF48EB"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3F6210_7051_73B6_41CD_00695B402868_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_595A43D4_70B7_2576_41A4_401276E53931"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6CA84D1B_71B3_62F2_41C0_77EC95CF63D6"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6CA82D1B_71B3_62F2_41D8_AEF5EE040DD9"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A221F44_7053_3D56_41BC_C2B6994FBAAB"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0_HS_3_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A228F45_7053_3D57_41D3_FAC151BFA4B2"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D8276_7051_107B_41D5_71DC728E7E5C_0_HS_4_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A250F45_7053_3D57_41D7_2213D864DC0B"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6C03CB27_71D3_26D2_41BD_89EFCDFB63D8"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_6C027B27_71D3_26D2_41B9_6701A222C760"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D6506_7051_319A_41A3_A8F63BCE3084_0_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A262F4C_7053_3D55_418B_B5B3D1438E46"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_1_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_61E71A70_7051_274E_4190_788BE4A0588E"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_1_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_61E75A71_7051_274F_41CD_8727ED2F9DB2"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A27CE69_704F_1069_41D2_E246D309FFA4_1_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_61E0EA71_7051_274F_41BE_45017D34FD16"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_595B73CE_70B7_2552_41D6_47CC65B7AEC6"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3ED87F_7051_106A_41BB_70BC10171E67_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_595B93D4_70B7_2575_41C4_0ED4A1A55E5F"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5A9060D8_73B1_237E_41D9_6283474ECE6D"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3D3FA6_7051_F09B_41B8_65CE33CB8135_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5A9090D8_73B1_237E_41CE_109C014F8F37"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_595AE3D4_70B7_2576_41D1_B2E16FF6876F"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3E2BD9_7051_70B6_41C8_DCEE2A70A603_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_595963D5_70B7_2577_41D5_474C1B8507AC"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_595E73D6_70B7_2572_41AF_C67CE480E87F"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3E02D5_7051_10BE_41D4_FA460490EEFB_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_595E83D6_70B7_2572_41D1_783E0909D43E"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5958A3D5_70B7_2576_41C5_476033F12AB8"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3DCF9B_7051_10AA_41D8_3FB797F5223F_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_5958D3D6_70B7_2575_41C6_17BC9DC7F358"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0_HS_0_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A1EAF56_7053_3D75_41BA_E3593D55DFB4"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0_HS_1_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A115F56_7053_3D75_41D2_F67A452B4036"
},
{
 "colCount": 3,
 "class": "AnimatedImageResource",
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_7A3EA27B_7051_306A_41DA_E9C19520171A_0_HS_2_0.png",
   "width": 330,
   "class": "ImageResourceLevel",
   "height": 180
  }
 ],
 "rowCount": 3,
 "frameDuration": 62,
 "id": "AnimatedImageResource_4A11FF56_7053_3D75_41D3_2D81ED10341E"
}],
 "overflow": "visible",
 "scrollBarOpacity": 0.5,
 "gap": 10,
 "paddingBottom": 0,
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
