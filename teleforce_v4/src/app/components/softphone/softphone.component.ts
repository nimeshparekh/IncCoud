import { Component, OnInit } from '@angular/core';
import {UA,Socket,WebSocketInterface} from 'jssip'
import Janus  from './janus'
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";

@Component({
  selector: 'app-softphone',
  templateUrl: './softphone.component.html',
  styleUrls: ['./softphone.component.css']
})
export class SoftphoneComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
  ) { }
  janus = ''
  sipcall = null;
  siphandel = null;
  registered = false;
  isincomingcall = false
  dialerform: FormGroup;
  
  ngOnInit(): void {
    var that = this
    this.dialerform = this.formBuilder.group({
      number: ['', Validators.required],
    });
    Janus.init({debug: "all", callback: function() {
      console.log('==init success==')
      if(!Janus.isWebrtcSupported()) {
        alert('This browser not support webrtc')
      }else{
        console.log('==WebrtcSupport success==')
        // Create session
        var opaqueId = "sip-"+Janus.randomString(12);
        var janus = new Janus(
        {
          server: 'https://webrtc.cloudX.in:8089/janus',
          success: function() {
            // Attach to SIP plugin
            console.log('Janus success')
            janus.attach(
            {
                plugin: "janus.plugin.sip",
                opaqueId: opaqueId,
                success: (pluginHandle) => {
                  this.sipcall = pluginHandle;
                  Janus.log(`[SIP] Plugin attached! (${this.sipcall.getPlugin()}, id=${this.sipcall.getId()})`);
                  console.log('Janus attach plugin success')
                  var username = 'sip:developer@192.168.35.164'
                  var authuser = 'developer'
                  var register = {
                    request: "register",
                    username: username,
                    authuser : authuser,
                    display_name:authuser,
                    secret:'garudavoip@dv',
                    proxy:'sip:192.168.35.164:5060'
                  };
                  this.sipcall.send({ message: register });
                  that.siphandel = this.sipcall
                  //that.actuallyDoCall(this.sipcall,'sip:09033524218@192.168.35.164')
                },
                error: (error) => {
                  Janus.error('[SIP] -- Error attaching plugin...', error);
                },
                consentDialog: (on) => {
                  Janus.debug(`[SIP] Consent dialog should be ${on ? 'on' : 'off'} now`);
                  if (on) {
                    // Darken screen and show hin
                  } else {
                    // Restore screen
                  }
                },
                mediaState: (medium, on) => {
                  Janus.log(`[SIP] Janus ${on ? 'started' : 'stopped'} receiving our ${medium}`);
                },
                webrtcState: (on) => {
                  Janus.log(`[SIP] Janus says our WebRTC PeerConnection is ${on ? 'up' : 'down'} now`);
                },
                onmessage: (msg, jsep) => {
                  Janus.debug('[SIP] ::: Got a message :::');
                  Janus.log('[SIP] ::: Got a message :::');
                  Janus.debug(msg);
                  Janus.log(msg);
                  //
                  var error = msg["error"];
									if(error) {
										if(!this.registered) {

										} else {
											// Reset status
											this.sipcall.hangup();
										}
										alert(error);
										return;
									}
                  var callId = msg["call_id"];
									var result = msg["result"];
                  if(result && result["event"]) {
										var event = result["event"];
                    if(event === 'registration_failed') {

                    }
                    if(event === 'registered') {
                      Janus.log("Successfully registered as " + result["username"] + "!");

                    } else if(event === 'calling') {
											Janus.log("Waiting for the peer to answer...");

                    } else if(event === 'incomingcall') {
                      that.isincomingcall = true
											Janus.log("Incoming call from " + result["username"] + "!");
                      this.sipcall.callId = callId;
											var doAudio = true, doVideo = true;
											var offerlessInvite = false;
											if(jsep) {
												// What has been negotiated?
												doAudio = (jsep.sdp.indexOf("m=audio ") > -1);
												doVideo = (jsep.sdp.indexOf("m=video ") > -1);
												Janus.debug("Audio " + (doAudio ? "has" : "has NOT") + " been negotiated");
												Janus.debug("Video " + (doVideo ? "has" : "has NOT") + " been negotiated");
											} else {
												Janus.log("This call doesn't contain an offer... we'll need to provide one ourselves");
												offerlessInvite = true;
												// In case you want to offer video when reacting to an offerless call, set this to true
												doVideo = false;
											}
                      // Is this the result of a transfer?
											var transfer = "";
											var referredBy = result["referred_by"];
											if(referredBy) {
												transfer = " (referred by " + referredBy + ")";
												transfer = transfer.replace(new RegExp('<', 'g'), '&lt');
												transfer = transfer.replace(new RegExp('>', 'g'), '&gt');
											}
											// Any security offered? A missing "srtp" attribute means plain RTP
											var rtpType = "";
											var srtp = result["srtp"];
											if(srtp === "sdes_optional")
												rtpType = " (SDES-SRTP offered)";
											else if(srtp === "sdes_mandatory")
												rtpType = " (SDES-SRTP mandatory)";
                        var extra = "";
                      if(offerlessInvite)
                        extra = " (no SDP offer provided)"  

                      
                      
                    }else if(event === 'accepting') {
											// Response to an offerless INVITE, let's wait for an 'accepted'
										} else if(event === 'progress') {
											Janus.log("There's early media from " + result["username"] + ", wairing for the call!", jsep);

                    } else if(event === 'accepted') {
											Janus.log(result["username"] + " accepted the call!", jsep);
                    }else if(event === 'updatingcall') {
											// We got a re-INVITE: while we may prompt the user (e.g.,
											// to notify about media changes), to keep things simple
											// we just accept the update and send an answer right away
											Janus.log("Got re-INVITE");
                    }else if(event === 'message') {
											// We got a MESSAGE
											var sender = result["displayname"] ? result["displayname"] : result["sender"];
											var content = result["content"];
											content = content.replace(new RegExp('<', 'g'), '&lt');
											content = content.replace(new RegExp('>', 'g'), '&gt');
											console.log(content, "Message from " + sender);
										} else if(event === 'info') {
											// We got an INFO
											var sender = result["displayname"] ? result["displayname"] : result["sender"];
											var content = result["content"];
											content = content.replace(new RegExp('<', 'g'), '&lt');
											content = content.replace(new RegExp('>', 'g'), '&gt');
											console.log(content, "Info from " + sender);
										} else if(event === 'notify') {
											// We got a NOTIFY
											var notify = result["notify"];
											var content = result["content"];
											console.log(content, "Notify (" + notify + ")");
										} else if(event === 'transfer') {

                    }else if(event === 'hangup') {
                      that.isincomingcall = false
											Janus.log("Call hung up (" + result["code"] + " " + result["reason"] + ")!");
											// Reset status
											//sipcall.hangup();
										} else if(event === 'messagedelivery') {
											// message delivery status
											let reason = result["reason"];
											let code = result["code"];
											let callid = msg['call_id'];
										}
                  }
                },
                onlocalstream(stream) {
                  Janus.debug('[SIP] ::: Got a local stream :::');
                  Janus.log('[SIP] ::: Got a local stream :::');
                  Janus.debug(stream);
                },
                onremotestream: (stream) => {
                  Janus.debug('[SIP] ::: Got a remote stream :::');
                  Janus.log('[SIP] ::: Got a remote stream :::');
                  Janus.debug(stream);
                },
                oncleanup() {
                  Janus.log('[SIP] ::: Got a cleanup notification :::');
                }
            });
          },
          error: function(error) {
            console.log('Janus error',error)
          },
          destroyed: function() {
            window.location.reload();
          }
        });
      }
    }});
  }

  actuallyDoCall(handle, uri) {
    handle.createOffer(
      {
        media: {
          audioSend: true, audioRecv: true,		// We DO want audio
          videoSend: false, videoRecv: false	// We MAY want video
        },
        success: function(jsep) {
          Janus.debug("Got SDP!", jsep);
          // By default, you only pass the SIP URI to call as an
          // argument to a "call" request. Should you want the
          // SIP stack to add some custom headers to the INVITE,
          // you can do so by adding an additional "headers" object,
          // containing each of the headers as key-value, e.g.:
          //		var body = { request: "call", uri: $('#peer').val(),
          //			headers: {
          //				"My-Header": "value",
          //				"AnotherHeader": "another string"
          //			}
          //		};
          var body = { request: "call", uri: uri };
          // Note: you can also ask the plugin to negotiate SDES-SRTP, instead of the
          // default plain RTP, by adding a "srtp" attribute to the request. Valid
          // values are "sdes_optional" and "sdes_mandatory", e.g.:
          //		var body = { request: "call", uri: $('#peer').val(), srtp: "sdes_optional" };
          // "sdes_optional" will negotiate RTP/AVP and add a crypto line,
          // "sdes_mandatory" will set the protocol to RTP/SAVP instead.
          // Just beware that some endpoints will NOT accept an INVITE
          // with a crypto line in it if the protocol is not RTP/SAVP,
          // so if you want SDES use "sdes_optional" with care.
          // Note 2: by default, the SIP plugin auto-answers incoming
          // re-INVITEs, without involving the browser/client: this is
          // for backwards compatibility with older Janus clients that
          // may not be able to handle them. If you want to receive
          // re-INVITES to handle them yourself, specify it here, e.g.:
          //		body["autoaccept_reinvites"] = false;
          // if(referId) {
          //   // In case we're originating this call because of a call
          //   // transfer, we need to provide the internal reference ID
          //   body["refer_id"] = referId;
          // }
          handle.send({ message: body, jsep: jsep });
        },
        error: function(error) {
          Janus.error("WebRTC error...", error);
        }
      });
  }

  doHangup() {
    var hangup = { request: "hangup" };
		this.siphandel.send({ message: hangup });
		this.siphandel.hangup();
  }
  callanswer(){
    var that = this
    this.siphandel.createAnswer(
      {
        media: {
          audioSend: true, audioRecv: true,		// We DO want audio
          videoSend: false, videoRecv: false	// We MAY want video
        },
        success: function(jsep) {
          Janus.log("Got SDP!", jsep);
          // By default, you only pass the SIP URI to call as an
          // argument to a "call" request. Should you want the
          // SIP stack to add some custom headers to the INVITE,
          // you can do so by adding an additional "headers" object,
          // containing each of the headers as key-value, e.g.:
          //		var body = { request: "call", uri: $('#peer').val(),
          //			headers: {
          //				"My-Header": "value",
          //				"AnotherHeader": "another string"
          //			}
          //		};
          var body = { request: "accept" };
          // Note: as with "call", you can add a "srtp" attribute to
          // negotiate/mandate SDES support for this incoming call.
          // The default behaviour is to automatically use it if
          // the caller negotiated it, but you may choose to require
          // SDES support by setting "srtp" to "sdes_mandatory", e.g.:
          //		var body = { request: "accept", srtp: "sdes_mandatory" };
          // This way you'll tell the plugin to accept the call, but ONLY
          // if SDES is available, and you don't want plain RTP. If it
          // is not available, you'll get an error (452) back. You can
          // also specify the SRTP profile to negotiate by setting the
          // "srtp_profile" property accordingly (the default if not
          // set in the request is "AES_CM_128_HMAC_SHA1_80")
          // Note 2: by default, the SIP plugin auto-answers incoming
          // re-INVITEs, without involving the browser/client: this is
          // for backwards compatibility with older Janus clients that
          // may not be able to handle them. If you want to receive
          // re-INVITES to handle them yourself, specify it here, e.g.:
          //		body["autoaccept_reinvites"] = false;
          that.siphandel.send({ message: body, jsep: jsep });
          //that.doHangup()
        },
        error: function(error) {
          console.log('janus webrtc error')
          Janus.error("WebRTC error...", error);
        }
    });
  }

  callhangup(){
    this.isincomingcall = false
    var body = { request: "decline" };
    this.siphandel.send({ message: body });
  }

  clicktocall() {
    this.actuallyDoCall(this.siphandel,'sip:09033524218@192.168.35.164')
  }
  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
  public loadStyle(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('link');
    script.innerHTML = '';
    script.href = url;
    script.type = 'text/css';
    body.appendChild(script);
  }
}
