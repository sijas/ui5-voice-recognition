sap.ui.define(["sap/ui/base/Object","sap/m/BusyDialog","sap/base/Log","sap/ui/model/json/JSONModel"],function(t,e,n,i){return t.extend("SpeechRecognizer",{TIMEOUT_MILLISECONDS:5e3,registeredCommand:{},registeredButtons:[],oComponent:null,busyDialog:new e({text:"Listening to Sound",title:"Detecting Voice"}),constructor:function(t,e){if(t instanceof sap.ui.core.UIComponent){this.oComponent=t;this.bTurnOnAssistant=e;this.oComponent.setModel(new i({bTurnOnAssistant:e}),"assistant");if("webkitSpeechRecognition"in window){this.Commander=new window.webkitSpeechRecognition;this.Commander.continuous=true;this.Commander.interimResults=true;this.Commander.lang="en-IN";var s="";this.Commander.onstart=function(){s=""}.bind(this);this.Commander.onend=function(){s=""}.bind(this);this.Commander.onresult=function(t){var e="";for(var n=t.resultIndex;n<t.results.length;n++){var i=t.results[n][0].transcript;i.replace("\n","<br>");if(t.results[n].isFinal){s+=i}else{e+=i}if(s.toUpperCase().search("HELLO ASSISTANT")>=0||e.toUpperCase().search("HELLO ASSISTANT")>=0){s="";e="";this.callListener()}}}.bind(this)}if(e){this.Commander.start()}}else{n.error("Speech Recognizer: Component Instance not found in SpeechRecognizer Constructor")}},setBusyDialogTexts:function(t,e){this.busyDialog.setTitle(t);this.busyDialog.setText(e)},whenSpeechRecognized:function(){return new Promise(function(t){if("webkitSpeechRecognition"in window){var e=new window.webkitSpeechRecognition;e.continuous=false;e.interimResults=true;e.lang="en-IN";var n="";e.onstart=function(){if(this.Commander&&this.bTurnOnAssistant){this.Commander.stop()}this.busyDialog.setText("Listening to Sound");this.busyDialog.open()}.bind(this);e.onend=function(){if(this.Commander&&this.bTurnOnAssistant){this.Commander.start()}this.busyDialog.close();this.busyDialog.setText(n);t(n)}.bind(this);e.onresult=function(t){var e="";for(var i=t.resultIndex;i<t.results.length;i++){var s=t.results[i][0].transcript;s.replace("\n","<br>");if(t.results[i].isFinal){n+=s}else{e+=s}this.busyDialog.setText(e)}}.bind(this);e.start()}}.bind(this))},registerCallButton:function(t){this.addListener(t,false,null);t.attachPress(this.callListener.bind(this))},registerCommandWithParam:function(t,e){var n=t.toUpperCase();this.registeredCommand[n]={withArgs:true,fnCallback:e}},registerCommandWithOutParam:function(t,e){var n=t.toUpperCase();this.registeredCommand[n]={withArgs:false,fnCallback:e}},callCommands:function(t){var e=Object.keys(this.registeredCommand);e.forEach(function(e){if(t.toUpperCase().search(e)===0){var n=this.registeredCommand[e],i=e.length,s=t.substring(i+1,t.length);if(n.withArgs){n.fnCallback(s)}else{n.fnCallback()}}}.bind(this))},addListener:function(t,e,n){var i={oButton:t,bWithArg:e,fnCallback:n};this.registeredButtons.push(i)},callListener:function(t){var e=t&&t.getSource(),n=this.callCommands.bind(this);this.registeredButtons.forEach(function(t){if(t===e&&t.fnCallback){n=t.fnCallback}});this.whenSpeechRecognized().then(n)}})});