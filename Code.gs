/**
 * @OnlyCurrentDoc
 *
 * The above comment directs Apps Script to limit the scope of file
 * access for this add-on. It specifies that this add-on will only
 * attempt to read or modify the files in which the add-on is used,
 * and not all of the user's files. The authorization request message
 * presented to users will reflect this limited scope.
 */
 
/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) { 
  DocumentApp.getUi().createAddonMenu()
      .addItem('Start', 'showSidebar')
      .addToUi();
}

/**
 * Runs when the add-on is installed.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 */
function showSidebar() {
  var ui = HtmlService.createTemplateFromFile('Sidebar')
      .evaluate()
      .setTitle('Sidebar Video Chat');
  DocumentApp.getUi().showSidebar(ui);
}

function getXData(){
  var nick = Session.getActiveUser().getEmail();
  nick = nick.substring(0, nick.indexOf("@"));
  
  var signalToken = request_('https://es.xirsys.com/_token/SidebarVideoChat/', 'PUT');
  
  var signalUrl = request_('https://es.xirsys.com/_host?type=signal', 'GET');
  
  var peerConnectionConfig = request_('https://global.xirsys.net/_turn/SidebarVideoChat/', 'PUT');
  
  if (peerConnectionConfig.v !=null && signalUrl.v !=null){
    var x_data = {
               peerConnectionConfig: peerConnectionConfig.v,
               url: signalUrl.v,
               signalToken: signalToken.v,
               room: DocumentApp.getActiveDocument().getId(),
               nick: nick
    };
    return x_data;
  } else {
    return false;
  }
}

/**
* Handle API request to Twitter.
*
* @param {string} url api endpoint 
* @param {string} method. 
* @param {Object}  additional api parameters.
* @return {Object} response.
*/
function request_(url, method, optParam){
  var param = optParam || [];
  var urlFetchOptions = {
    "method" : method,
    "payload" : param.requestBody,
    "headers" : {"Authorization": "Basic " + Utilities.base64Encode("mhawksey:a96470d6-67c8-11e7-9089-eb8da253ad29")},
  };
  
  try {
    var f = UrlFetchApp.fetch(url, urlFetchOptions);
    return JSON.parse(f.getContentText());
  } catch(e) {
    return e;
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}